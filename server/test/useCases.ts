// Use cases which need to be tested for authentication.
export const queries = [
  // QUERIES
  ["inputColumns", { where: { id: "test" } }],
  ["resource", { where: { id: "test" } }],
  ["resources", { where: { name: "test" } }],
  ["sourceInfo", { sourceId: "test" }],
  ["resourceInfo", { resourceId: "test" }],
  ["allSources", null],
  ["availableResources", { sourceName: "test" }],
  ["recAvailableAttributes", { resourceId: "test" }],
  ["me", null],
  ["computeSourceMappingProgress", { sourceId: "test" }, ""]
] as any;

export const mutations = [
  ["createSource", { sourceName: "test", hasOwner: true }],
  [
    "createInputColumnAndUpdateAttribute",
    { attributeId: "test", data: { id: "test" } }
  ],
  [
    "deleteInputColumnAndUpdateAttribute",
    { attributeId: "test", inputColumnId: "test" }
  ],
  [
    "createJoinAndUpdateInputColumn",
    { inputColumnId: "test", data: { id: "test" } }
  ],
  ["deleteJoinAndUpdateInputColumn", { inputColumnId: "test", joinId: "test" }],
  ["updateAttribute", { id: "test", data: { name: "test" } }],
  ["updateInputColumn", { id: "test", data: { owner: "test" } }],
  ["updateJoin", { id: "test", data: { sourceOwner: "test" } }],
  ["createResourceTreeInSource", { sourceId: "test", resourceName: "test" }],
  [
    "createAttributeProfileInAttribute",
    { parentAttributeId: "test", attributeName: "test", attributeType: "test" }
  ],
  ["deleteAttribute", { id: "test" }]
  // SUBSCRIPTIONS
] as any;

export const subscriptions = [
  [
    "attribute",
    { where: { node: { id: "cjtyglzz300bi0766tjms54pu" } } },
    "{node {id}}"
  ],
  ["inputColumn", { where: { node: { id: "test" } } }, "{node {id}}"],
  ["join", { where: { node: { id: "test" } } }, "{node {id}}"]
] as any;
