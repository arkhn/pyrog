import {
  Button,
  Checkbox,
  FileInput,
  FormGroup,
  InputGroup,
  IToastProps,
  ProgressBar
} from '@blueprintjs/core';
import axios, { AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import useReactRouter from 'use-react-router';

import Navbar from 'components/navbar';

import { FHIR_API_URL } from '../../constants';
import { ITemplate, IReduxStore } from 'types';

import './style.scss';
import { loader } from 'graphql.macro';
import { HTTP_BACKEND_URL } from '../../constants';

// GRAPHQL OPERATIONS
const qSourceAndTemplateNames = loader(
  'src/graphql/queries/sourceAndTemplateNames.graphql'
);
const mCreateTemplate = loader('src/graphql/mutations/createTemplate.graphql');
const mCreateSource = loader('src/graphql/mutations/createSource.graphql');

const NewSourceView = (): React.ReactElement => {
  const client = useApolloClient();
  const { history } = useReactRouter();

  const toaster = useSelector((state: IReduxStore) => state.toaster);

  const [hasOwner, setHasOwner] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateExists, setTemplateExists] = useState(false);
  const [sourceName, setSourceName] = useState('');
  const [schemaFile, setSchemaFile] = useState(undefined as File | undefined);
  const [mappingFile, setMappingFile] = useState(undefined as File | undefined);
  const [fhirBundleFile, setFhirBundleFile] = useState(
    undefined as File | undefined
  );

  const { data: dataNames } = useQuery(qSourceAndTemplateNames, {
    fetchPolicy: 'network-only'
  });

  // Build a map where keys are template names
  // and values are lists of source names for each template
  const mapTemplateToSourceNames = dataNames
    ? dataNames.templates.reduce(
        (map: Record<string, string[]>, template: ITemplate) => ({
          ...map,
          [template.name]: template.sources.map(s => s.name)
        }),
        {}
      )
    : {};

  const renderToastProps = ({
    action,
    uploadProgress,
    success,
    message
  }: any): IToastProps => {
    return {
      action,
      icon: 'cloud-upload',
      intent:
        typeof uploadProgress !== 'undefined'
          ? undefined
          : success
          ? 'success'
          : 'danger',
      message: uploadProgress ? (
        <ProgressBar
          intent={uploadProgress < 1 ? 'primary' : 'success'}
          value={uploadProgress}
        />
      ) : (
        message
      ),
      timeout: uploadProgress < 1 ? 0 : 2500
    };
  };

  const uploadSchema = async (toastID: string): Promise<AxiosResponse> => {
    if (!schemaFile) {
      throw new Error('Database schema is missing');
    }
    if (!templateName) {
      throw new Error('Template name is missing');
    }
    if (!sourceName) {
      throw new Error('Source name is missing');
    }

    const fileName = templateName.concat('_', sourceName);
    const formData = new FormData();
    formData.append('schema', schemaFile, fileName);

    const CancelToken = axios.CancelToken;
    let cancel: any;

    return axios.request({
      cancelToken: new CancelToken((c: any) => {
        cancel = c;
      }),
      data: formData,
      method: 'post',
      url: `${HTTP_BACKEND_URL}/upload`,
      onUploadProgress: p => {
        toaster.show(
          renderToastProps({
            action: {
              onClick: () => {
                cancel();
              },
              text: 'Interrompre'
            },
            uploadProgress: p.loaded / p.total
          }),
          toastID
        );
      }
    });
  };

  const createTemplate = () =>
    client.mutate({
      mutation: mCreateTemplate,
      variables: {
        name: templateName
      }
    });

  const createSource = async (): Promise<void> => {
    if (mappingFile) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(mappingFile);
        reader.onload = async (e: ProgressEvent<FileReader>): Promise<void> => {
          const mapping = e.target?.result;
          if (!mapping) {
            reject(e.target?.error);
          }
          try {
            JSON.parse(mapping as string);
          } catch (e) {
            reject(new Error(`could not parse ${mappingFile.name} as JSON`));
          }
          try {
            await client.mutate({
              mutation: mCreateSource,
              variables: {
                templateName,
                hasOwner,
                mapping,
                name: sourceName
              }
            });
          } catch (err) {
            reject(
              new Error(
                `error while creating resource: ${err.graphQLErrors[0].message}`
              )
            );
          }
          resolve();
        };
        reader.onerror = (e: ProgressEvent<FileReader>): void => reject(e);
      });
    } else {
      await client.mutate({
        mutation: mCreateSource,
        variables: {
          templateName,
          hasOwner,
          name: sourceName
        }
      });
    }
  };

  const uploadFhirBundle = async (): Promise<void> => {
    if (!fhirBundleFile) return;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(fhirBundleFile!);
      reader.onload = async (e: ProgressEvent<FileReader>): Promise<void> => {
        const bundle = e.target?.result;
        let bundleJson: any;
        if (!bundle) {
          reject(e.target?.error);
        }
        try {
          bundleJson = JSON.parse(bundle as string);
        } catch (e) {
          reject(new Error(`could not parse ${fhirBundleFile!.name} as JSON`));
        }
        // Check that we only have StructureDefinitions, ConceptMaps,
        // or CodeSystems in the bundle
        const authorizedTypes = [
          'StructureDefinition',
          'ConceptMap',
          'CodeSystem'
        ];
        const resourceTypes = bundleJson.entry.map(
          (entry: any) => entry.resource.resourceType
        );
        if (
          resourceTypes.some((type: string) => !authorizedTypes.includes(type))
        )
          reject(
            new Error(
              `Source created but failed while trying to upload a bundle with 
              resource which type is not
              StructureDefinition, ConceptMap, nor CodeSystem`
            )
          );
        // Upload the bundle
        await axios.post(`${FHIR_API_URL}/upload-bundle`, bundleJson);
        resolve();
      };
      reader.onerror = (e: ProgressEvent<FileReader>): void => reject(e);
    });
  };

  const onFormSubmit = async (e: any): Promise<void> => {
    e.preventDefault();

    const toastID = toaster.show(
      renderToastProps({
        action: {
          text: 'Interrompre'
        },
        uploadProgress: 0
      })
    );

    try {
      const uploadResponse = await uploadSchema(toastID);

      if (uploadResponse.data.success) {
        // Create new template in Graphql if it doesn't exist
        if (!templateExists) {
          await createTemplate();
        }
        // Create new source
        await createSource();
        // Upload bundle
        await uploadFhirBundle();
        // After source is created,
        // redirect to /sources page.
        toaster.show(
          renderToastProps({
            message: `Source ${sourceName} was created`,
            success: true
          }),
          toastID
        );
        history.push('/');
      } else {
        toaster.show(
          renderToastProps({
            message: uploadResponse.data.message,
            success: uploadResponse.data.success
          }),
          toastID
        );
      }
    } catch (e) {
      toaster.show(
        renderToastProps({
          message: e.message,
          success: false
        }),
        toastID
      );
    }
  };

  const schemaType = `
    [owner: string] : {
        [table: string]: string[]
    }`;

  const schemaExample = `
    {
        "$SYSTEM": {
            "PATIENT": [
                "ID",
                "PRENOM",
                "NOM"
            ]
        },
    }`;

  const sqlCommand = `
    SELECT OWNER, TABLE_NAME, COLUMN_NAME, DATA_TYPE FROM all_tab_columns;
    `;

  const sqlplusCommand = `
    set heading off;
    set underline off;
    set pagesize 0;
    set colsep ";";
    set trimspool on;
    set headsep off;
    set linesize 1000;
    set numw 64;
    spool schema_name.csv
    SELECT OWNER, TABLE_NAME, COLUMN_NAME, DATA_TYPE FROM all_tab_columns;
    `;

  return (
    <div>
      <Navbar />
      <div id="main-container-newsource">
        <form onSubmit={onFormSubmit}>
          <h1>Nom du template</h1>
          <InputGroup
            onChange={(event: React.FormEvent<HTMLElement>) => {
              const target = event.target as HTMLInputElement;
              setTemplateName(target.value);
              setTemplateExists(
                !!target.value && target.value in mapTemplateToSourceNames
              );
            }}
            name={'templateName'}
            placeholder="Nom du template..."
            value={templateName}
          />

          <h1>Nom de la source</h1>
          <FormGroup
            helperText={
              templateName &&
              templateName in mapTemplateToSourceNames &&
              mapTemplateToSourceNames[templateName].indexOf(sourceName) >=
                0 ? (
                <p className={'warning'}>
                  Ce nom existe déjà pour ce template et n'est pas disponible.
                </p>
              ) : null
            }
          >
            <InputGroup
              onChange={(event: React.FormEvent<HTMLElement>): void => {
                const target = event.target as HTMLInputElement;
                setSourceName(target.value);
              }}
              name={'sourceName'}
              placeholder="Nom de la source..."
              value={sourceName}
            />
          </FormGroup>

          <h1>Schéma de la base *</h1>
          <FileInput
            fill
            inputProps={{
              onChange: (event: React.FormEvent<HTMLInputElement>): void => {
                const target = event.target as any;
                setSchemaFile(target.files[0]);
              },
              name: 'schema'
            }}
            text={
              schemaFile ? (
                schemaFile.name
              ) : (
                <p className="disabled-text">Importer un schéma...</p>
              )
            }
          />
          <br />
          <Checkbox
            checked={hasOwner}
            label="Le schéma a un OWNER"
            onChange={(event: React.FormEvent<HTMLElement>): void =>
              setHasOwner(!hasOwner)
            }
          />
          <br />
          <h1>Importer un mapping existant (optionnel)</h1>
          <FileInput
            fill
            inputProps={{
              onChange: (event: React.FormEvent<HTMLInputElement>): void => {
                const target = event.target as any;
                setMappingFile(target.files[0]);
              },
              name: 'mapping'
            }}
            text={
              mappingFile ? (
                mappingFile.name
              ) : (
                <p className="disabled-text">Importer un mapping...</p>
              )
            }
          />
          <h1>Importer des ressources fhir (optionnel)</h1>
          <FileInput
            fill
            inputProps={{
              onChange: (event: React.FormEvent<HTMLInputElement>): void => {
                const target = event.target as any;
                setFhirBundleFile(target.files[0]);
              },
              name: 'bundle'
            }}
            text={
              fhirBundleFile ? (
                fhirBundleFile.name
              ) : (
                <p className="disabled-text">Importer un bundle fhir...</p>
              )
            }
          />
          <div className="align-right">
            <Button
              disabled={
                !templateName ||
                !sourceName ||
                (templateName in mapTemplateToSourceNames &&
                  mapTemplateToSourceNames[templateName].indexOf(sourceName) >=
                    0)
              }
              intent="primary"
              large
              type="submit"
            >
              Ajouter
            </Button>
          </div>

          <p>
            * Une source de données doit nécessairement être importée avec un
            schéma de données SQL. Ce schéma doit être importé au format JSON et
            organisé comme suit :
          </p>
          <pre>
            <code dangerouslySetInnerHTML={{ __html: schemaType }} />
          </pre>
          <p>
            Voici un exemple minimaliste de fichier représentant un schéma de
            base de données JSON tel qu'il est requis par notre application à
            l'heure actuelle :
          </p>
          <pre>
            <code dangerouslySetInnerHTML={{ __html: schemaExample }} />
          </pre>
          <p>
            Le schéma de données peut-être extrait en utilisant le logiciel Toad
            avec cette commande SQL :
          </p>
          <pre>
            <code dangerouslySetInnerHTML={{ __html: sqlCommand }} />
          </pre>
          <p>
            ou en ligne de commande avec <code>sqlplus</code> :
          </p>
          <pre>
            <code dangerouslySetInnerHTML={{ __html: sqlplusCommand }} />
          </pre>
        </form>
      </div>
    </div>
  );
};

export default NewSourceView;
