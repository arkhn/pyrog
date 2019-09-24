const stringifyObject = require("stringify-object");
const ws = require("ws");
const waitForExpect = require("wait-for-expect");

import { Prisma as PrismaClient } from "../src/generated/prisma-client";
import { Prisma as PrismaBinding } from "../src/generated/prisma-binding";

import { queries, mutations, subscriptions } from "./useCases";

const prismaServerEndpoint =
  process.env.NODE_ENV === "docker"
    ? "http://prisma:4466"
    : process.env.PRISMA_ENDPOINT;

const wsEndpoint =
  process.env.NODE_ENV === "docker" ? "ws://pyrog:4000" : "ws://localhost:4000";

const debug = false;

describe("Prisma binding", () => {
  const prismaBindingInstance = () => {
    return new PrismaBinding({
      endpoint: prismaServerEndpoint,
      debug
    });
  };

  test("Send direct request", async () => {
    expect(
      await prismaBindingInstance().request(`query { sources { name } }`, {})
    ).toEqual({
      data: {
        sources: expect.arrayContaining([
          expect.objectContaining({ name: "Mimic" })
        ])
      }
    });
  });

  test("Use `query` method", async () => {
    expect(await prismaBindingInstance().query.sources({}, `{name}`)).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "Mimic" })])
    );
  });
});

describe("Prisma client", () => {
  const prismaClientInstance = new PrismaClient({
    endpoint: prismaServerEndpoint,
    debug
  });

  describe("Queries", () => {
    test("source", async () => {
      expect(await prismaClientInstance.source({ name: "Mimic" })).toEqual(
        expect.objectContaining({ name: "Mimic" })
      );
    });

    test("sources", async () => {
      expect(await prismaClientInstance.sources()).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: "Mimic" })])
      );
    });
  });
});

const sendPostRequest = (
  query,
  variables,
  token = null,
  ws = false,
  socket = null
) => {
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(
    `http://${process.env.NODE_ENV === "docker" ? "pyrog" : "0.0.0.0"}:${
      process.env.SERVER_PORT
    }`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables
      })
    }
  ).then(response => {
    return response.json();
  });
};

const sendWS = (query, variables, socket) => {
  const request = {
    type: "start",
    id: new Date(),
    payload: {
      query: query
    }
  };

  return socket.send(JSON.stringify(request));
};

describe("Graphql server", () => {
  let token;
  let socket;
  let wsResponse;

  beforeAll(async () => {
    // Get authentication token
    token = await sendPostRequest(
      `mutation { login(email: "user@arkhn.org", password: "user") { token }}`,
      {}
    ).then(res => res.data.login.token);

    // Instantiate WebSocket
    socket = new ws(wsEndpoint, "graphql-ws");

    socket.addEventListener("message", event => {
      let data = JSON.parse(event.data);
      // Different types of messages arrive from
      // the websocket server: some are data,
      // some indicate that the transaction is completed.
      // We filter for the first ones.
      if (data.type == "data") {
        wsResponse = data.payload;
      }
    });
  });

  describe.each([
    ["Queries", "query", queries, false],
    ["Mutations", "mutation", mutations, false],
    ["Subscriptions", "subscription", subscriptions, true]
  ])(
    "All end points should ask for authentication",
    (operationType, operator, endpoints, shouldWs) => {
      describe.each(endpoints)(
        operationType,
        (queryName, queryAttr, querySelection) => {
          test(queryName, async () => {
            // Build GraphQL query
            const queryAttributes = stringifyObject(queryAttr, {
              singleQuotes: false
            });
            const query = `${operator} { ${queryName} ${
              queryAttr
                ? `(${queryAttributes.slice(1, queryAttributes.length - 1)})`
                : ""
            } ${querySelection !== undefined ? querySelection : "{ id }"}}`;

            // If request should be send to a WebSocket...
            if (shouldWs) {
              // Send the request
              socket.send(
                JSON.stringify({
                  type: "start",
                  id: new Date(),
                  payload: {
                    query: query
                  }
                })
              );

              // ... and wait until value is received.
              await waitForExpect(() => {
                expect(wsResponse).toEqual(
                  expect.objectContaining({
                    errors: expect.arrayContaining([
                      expect.objectContaining({ message: "Not authenticated" })
                    ])
                  })
                );

                // Reinitializw wsResponse value after test evaluation
                // so that consecutive ws messages with the same outcome
                // will be evaluated independently.
                wsResponse = null;
              });
              // or over HTTP.
            } else {
              expect(await sendPostRequest(query, {})).toEqual(
                expect.objectContaining({
                  errors: expect.arrayContaining([
                    expect.objectContaining({ message: "Not authenticated" })
                  ])
                })
              );
            }
          });
        }
      );
    }
  );

  describe("Try Queries", () => {
    test("allSources", async () => {
      expect(
        await sendPostRequest(`query { allSources { id name }}`, {}, token)
      ).toEqual({
        data: {
          allSources: expect.arrayContaining([
            expect.objectContaining({ name: "Mimic" })
          ])
        }
      });
    });

    test("sourceInfo", async () => {
      expect(
        await sendPostRequest(
          `query { sourceInfo(sourceName: "Mimic") { id name }}`,
          {},
          token
        )
      ).toEqual({
        data: {
          sourceInfo: expect.objectContaining({ name: "Mimic" })
        }
      });
    });
  });

  describe("Try Mutations", () => {
    test("createResourceTreeInSource should generate a label if fhirType already exists", async () => {
      const fhirType = await sendPostRequest(
        `query { availableResources(sourceName:"Mimic") { id label fhirType }}`,
        {},
        token
      ).then(res => res.data.availableResources[0].fhirType);

      expect(
        await sendPostRequest(
          `mutation { createResourceTreeInSource(sourceName: "Mimic", resourceName: "${fhirType}") { id label fhirType }}`,
          {},
          token
        )
      ).toEqual({
        data: {
          createResourceTreeInSource: expect.objectContaining({
            label: expect.stringContaining(fhirType)
          })
        }
      });
    });

    test("deleteResourceTreeInSource should fail if trying to delete an already deleted resource", async () => {
      let sourceId, resourceId;
      await sendPostRequest(
        `query {
          sourceInfo(sourceName:"Mimic") { id }
          availableResources(sourceName:"Mimic") { id label fhirType }
        }`,
        {},
        token
      ).then(res => {
        sourceId = res.data.sourceInfo.id;
        resourceId = res.data.availableResources[0].id;
      });

      expect(
        await sendPostRequest(
          `mutation { deleteResourceTreeInSource(sourceId: "${sourceId}", resourceId: "${resourceId}") { id }}`,
          {},
          token
        )
      ).toEqual({
        data: {
          deleteResourceTreeInSource: { id: resourceId }
        }
      });
      expect(
        await sendPostRequest(
          `mutation { deleteResourceTreeInSource(sourceId: "${sourceId}", resourceId: "${resourceId}") { id }}`,
          {},
          token
        )
      ).toHaveProperty("errors");
    });
  });

  afterAll(() => {
    socket.close();
  });
});
