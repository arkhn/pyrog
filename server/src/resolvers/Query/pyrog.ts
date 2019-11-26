import * as jwt from 'jsonwebtoken';
import { forwardTo } from 'prisma-binding';

import {
  checkAuth,
  checkIsAdmin,
  Context,
  getUserId,
  getRecAttribute
} from '../../utils';

export const pyrogQuery = {
  // BINDING QUERIES
  inputColumns: checkAuth(forwardTo('binding')),
  resource: checkAuth(forwardTo('binding')),
  resources: checkIsAdmin(forwardTo('binding')),

  // CLIENT QUERIES
  // Information queries
  sourceInfo(parent, { sourceId, sourceName }, context: Context) {
    getUserId(context);

    if (sourceName) {
      return context.client.source({ name: sourceName });
    }
    return context.client.source({ id: sourceId });
  },
  resourceInfo(parent, { resourceId }, context: Context) {
    getUserId(context);

    return context.client.resource({ id: resourceId });
  },
  attributeInfo(parent, { attributeId }, context: Context) {
    getUserId(context);

    return context.client.attribute({ id: attributeId });
  },
  allSources(parent, args, context: Context) {
    getUserId(context);

    return context.client.sources();
  },
  availableResources(parent, { sourceId, sourceName }, context: Context) {
    getUserId(context);

    if (sourceName) {
      return context.client.source({ name: sourceName }).resources();
    } else {
      return context.client.source({ id: sourceId }).resources();
    }
  },
  async recAvailableAttributes(parent, { resourceId }, context: Context) {
    getUserId(context);

    const directAttributes = await context.client
      .resource({ id: resourceId })
      .attributes();

    return directAttributes.map(async attribute => {
      return {
        ...attribute,
        attributes: await getRecAttribute(attribute, context)
      };
    });
  },
  me(parent, args, context: Context) {
    const id = getUserId(context);

    return context.client.user({ id });
  },
  isAuthenticated(parent, args, context: Context) {
    console.log('isAuthenticated');
    const Authorization = context.request
      ? context.request.get('Authorization')
      : context.connection.context.Authorization || null;

    if (Authorization) {
      const token = Authorization.replace('Bearer ', '');

      try {
        jwt.verify(token, process.env.APP_SECRET) as {
          userId: string;
        };
      } catch (e) {
        return false;
      }

      return true;
    }

    return false;
  },
  async computeSourceMappingProgress(parent, { sourceId }, context: Context) {
    getUserId(context);

    // need to catch all graph, has to be long enough
    const mysource = await context.binding.request(
      'query { source( where: {id: "' +
        sourceId +
        '"})  { id name resources{ id fhirType label attributes{ id name inputColumns{ id } attributes{ id name inputColumns{ id } attributes{ id name inputColumns{ id } attributes{ id name inputColumns{ id } attributes{ id name inputColumns{ id } attributes{ id name inputColumns{ id } attributes{ id name inputColumns{ id } attributes{ id name inputColumns{ id } attributes{ id name inputColumns{ id } attributes{ id name inputColumns{ id } attributes{ id name inputColumns{ id } attributes{ id name inputColumns{ id } attributes{ id name inputColumns{ id } attributes{ id name inputColumns{ id } attributes{ id name inputColumns{ id } attributes{ id name inputColumns{ id } attributes{ id name inputColumns{ id } } } } } } } } } } } } } } } } } } } } }'
    );

    const resources = mysource['data']['source']['resources'];

    const numberMappedRessources = resources.length;

    const recFunction = attribute => {
      const inputColumns = attribute['inputColumns'];

      if (inputColumns.length > 0) {
        return 1;
      } else {
        const attributes = attribute['attributes'];

        return attributes.reduce(
          (accumulator, attribute) => accumulator + recFunction(attribute),
          0
        );
      }
    };

    // loop over all ressources and all attributes within. Apply recFunction and sum all.
    const numberMappedAttributes = resources.reduce(
      (accumulator, resource) =>
        accumulator +
        resource['attributes'].reduce(
          (accumulator, attribute) => accumulator + recFunction(attribute),
          0
        ),
      0
    );

    return [numberMappedRessources, numberMappedAttributes];
  },
  async credential(parent, { sourceId }, context: Context) {
    getUserId(context);
    return context.client.source({ id: sourceId }).credential();
  }
};
