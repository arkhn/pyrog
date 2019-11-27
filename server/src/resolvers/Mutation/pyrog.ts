import { forwardTo } from 'prisma-binding';
const crypto = require('crypto');

import { checkAuth, Context, getUserId } from '../../utils';

export const pyrogMutation = {
  async createSource(parent, { sourceName, hasOwner }, context: Context) {
    getUserId(context);

    return await context.client.createSource({
      name: sourceName,
      hasOwner
    });
  },
  // createInputColumnViaAttribute et deleteInputColumnViaAttribute
  // sont construite de sorte à créer ou supprimer une inputColumn
  // à travers son attribut parent directement.
  // Cela permet que ce genre d'évènement (création, suppression)
  // soit pris en compte lors d'une subscription à l'attribut parent.
  // Une issue parle de ça ici : https://github.com/prisma/prisma/issues/146
  async createInputColumnAndUpdateAttribute(
    parent,
    { attributeId, data },
    context: Context
  ) {
    getUserId(context);

    // Création de la nouvelle inputColumn
    const inputColumn = await context.client.createInputColumn({
      ...data,
      attribute: {
        connect: {
          id: attributeId
        }
      }
    });

    // On update manuellement l'Attribut, sans rien modifier
    // ce qui permet de déclencher un évènement
    // pour les souscripteurs.
    await context.client.updateAttribute({
      data: {},
      where: { id: attributeId }
    });

    return inputColumn;
  },

  async deleteInputColumnAndUpdateAttribute(
    parent,
    { attributeId, inputColumnId },
    context: Context
  ) {
    getUserId(context);

    // Suppression d'une inputColumn
    const inputColumn = await context.client.deleteInputColumn({
      id: inputColumnId
    });

    await context.client.updateAttribute({
      data: {},
      where: { id: attributeId }
    });

    return inputColumn;
  },
  async createJoinAndUpdateInputColumn(
    parent,
    { inputColumnId, data },
    context: Context
  ) {
    getUserId(context);

    const join = await context.client.createJoin({
      ...data,
      inputColumn: {
        connect: {
          id: inputColumnId
        }
      }
    });

    await context.client.updateInputColumn({
      data: {},
      where: { id: inputColumnId }
    });

    return join;
  },

  async deleteJoinAndUpdateInputColumn(
    parent,
    { inputColumnId, joinId },
    context: Context
  ) {
    getUserId(context);

    // Suppression d'une inputColumn
    const join = await context.client.deleteJoin({
      id: joinId
    });

    await context.client.updateInputColumn({
      data: {},
      where: { id: inputColumnId }
    });

    return join;
  },

  updateResource: checkAuth(forwardTo('binding')),

  updateAttribute: checkAuth(forwardTo('binding')),

  async updateInputColumn(parent, { id, data }, context: Context) {
    getUserId(context);

    return await context.client.updateInputColumn({
      data,
      where: { id }
    });
  },

  async updateJoin(parent, { id, data }, context: Context) {
    getUserId(context);

    return await context.client.updateJoin({
      data,
      where: { id }
    });
  },

  async createResourceTreeInSource(
    parent,
    { sourceId, sourceName, resourceName },
    context: Context
  ) {
    getUserId(context);

    // Count similar fhir resources for the given source
    let otherFhirResourceIntances = 0;
    otherFhirResourceIntances = (await context.client.resources({
      where: {
        fhirType: resourceName,
        source: sourceName ? { name: sourceName } : { id: sourceId }
      }
    })).length;

    return fetch(
      `http://localhost:${
        process.env.SERVER_PORT
      }/resource/${resourceName}.json`
    )
      .then((response: any) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(
            `${response.status} ${response.url} ${response.statusText}`
          );
        }
      })
      .then((response: any) => {
        let newResource = {
          fhirType: resourceName,
          attributes: response['attributes'],
          source: sourceName
            ? { connect: { name: sourceName } }
            : { connect: { id: sourceId } }
        };

        // When similar fhir resources already exist
        // for the given source, we give this new instance
        // a default label.
        if (otherFhirResourceIntances) {
          newResource['label'] = `${resourceName}_${otherFhirResourceIntances}`;
        }

        return context.client.createResource(newResource);
      });
  },

  async deleteResource(parent, { resourceId }, context: Context) {
    getUserId(context);
    return context.client.deleteResource({ id: resourceId });
  },

  createAttributeProfileInAttribute(
    parent,
    { parentAttributeId, attributeName, attributeType },
    context: Context
  ) {
    getUserId(context);

    try {
      fetch(
        `http://localhost:${
          process.env.SERVER_PORT
        }/resource/${attributeType}.json`
      )
        .then((response: any) => {
          return response.json();
        })
        .then((response: any) => {
          return context.client.createAttribute({
            attribute: {
              connect: {
                id: parentAttributeId
              }
            },
            isProfile: true,
            name: attributeName,
            type: attributeType,
            attributes: response['attributes']
          });
        })
        .catch((error: any) => {
          console.log(error);
          throw new Error(error);
        });
    } catch (error) {
      // TODO: return something consistent
      console.log(error);
      throw new Error(error);
    }
  },
  async deleteAttribute(parent, { id }, context: Context) {
    const userId = getUserId(context);
    await context.client.user({ id: userId });

    // TODO: check role
    // if (user.role == "ADMIN") {
    //     return context.client.deleteAttribute({ id: id })
    // } else {
    //     throw new PermissionError()
    // }
    return context.client.deleteAttribute({ id });
  },
  async upsertCredential(
    parent,
    { login, password, host, port, type, database, sourceId },
    context: Context
  ) {
    getUserId(context);

    const cipher = crypto.createCipher('aes256', process.env.APP_SECRET);
    const encryptedPassword =
      cipher.update(password, 'utf8', 'hex') + cipher.final('hex');

    const credential = await context.client
      .source({ id: sourceId })
      .credential();

    if (credential) {
      return context.client.updateCredential({
        where: { id: credential.id },
        data: {
          host,
          port,
          type,
          database,
          password: encryptedPassword,
          login
        }
      });
    } else {
      return context.client.createCredential({
        source: { connect: { id: sourceId } },
        login,
        password: encryptedPassword,
        host,
        port,
        type,
        database
      });
    }
  }
};
