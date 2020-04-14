import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, Button } from '@blueprintjs/core';
import { ErrorObject } from 'ajv';
import axios from 'axios';

import { FHIR_API_URL } from '../../../constants';
import fhirSchema from './StructureDefinition.schema.json';
import { validator } from '../validate';

import './style.scss';
import { useMutation } from 'react-apollo';
import { loader } from 'graphql.macro';

interface Resource {
  id: string;
  name: string;
  type: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (r: Resource) => void;
}

const mRefreshDefinition = loader(
  'src/graphql/mutations/refreshDefinition.graphql'
);

const overviewAttributes = [
  'id',
  'name',
  'description',
  'fhirVersion',
  'type',
  'publisher'
];
const findMissingAttributes = (extension: any) =>
  overviewAttributes.filter(a => !Object.keys(extension).includes(a));

const formatErrors = (errors: ErrorObject[]): string[] =>
  errors.map(err => `${err.message}: ${Object.values(err.params).join(',')}`);

const validate = validator(fhirSchema);

const UploadExtension = ({ isOpen, onClose, onUpload }: Props) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    rejectedFiles
  } = useDropzone({
    multiple: false,
    accept: 'application/json'
  });

  const [extensionDefinition, setExtensionDefinition] = React.useState(
    undefined as any
  );
  const [invalidExtensionErrors, setinvalidExtensionErrors] = React.useState(
    [] as string[]
  );
  const [uploadingExtension, setUploadingExtension] = React.useState(false);
  const [refreshDefinition] = useMutation(mRefreshDefinition);

  const validateExtension = (extension: any): boolean => {
    if (!validate(extension)) {
      const formattedErrors = formatErrors(validate.errors!);
      setinvalidExtensionErrors(formattedErrors);
      return false;
    }

    const missingAttributes = findMissingAttributes(extension);
    if (missingAttributes.length > 0) {
      setinvalidExtensionErrors(
        missingAttributes.map(a => `Missing required attribute ${a}`)
      );
      return false;
    }

    return true;
  };

  const uploadExtension = async () => {
    setUploadingExtension(true);
    try {
      await axios.post(
        `${FHIR_API_URL}/StructureDefinition`,
        extensionDefinition
      );
      const { data } = await refreshDefinition({
        variables: { definitionId: extensionDefinition.id }
      });
      onUpload(data.refreshDefinition);
      onClose();
    } catch (err) {
      setinvalidExtensionErrors([
        err.response ? err.response.data : err.message
      ]);
    }
    setUploadingExtension(false);
  };

  React.useEffect(() => {
    if (!acceptedFiles.length) return;

    const [extensionFile] = acceptedFiles;
    const reader = new FileReader();

    reader.onerror = () =>
      setinvalidExtensionErrors(['could not read selected file']);
    reader.onload = () => {
      const extension = JSON.parse(reader.result as string);
      if (validateExtension(extension)) {
        setExtensionDefinition(extension);
        setinvalidExtensionErrors([]);
      }
    };
    reader.readAsText(extensionFile);
  }, [acceptedFiles]);

  const renderError = (
    <div className="extensionError">
      <h4>Invalid Extension</h4>
      <ul>
        {invalidExtensionErrors!.map((err, i) => (
          <li key={i}>{err} </li>
        ))}
      </ul>
    </div>
  );

  const renderExtensionOverview = () => {
    if (rejectedFiles.length)
      return (
        <div className="extensionOverview">Only JSON files are allowed</div>
      );

    if (!extensionDefinition)
      return <div className="extensionOverview">No extension selected</div>;

    return (
      <div className="extensionOverview">
        <h4>Extension overview</h4>
        <div>
          {overviewAttributes.map(attribute => (
            <div key={attribute} className="extensionAttributeRow">
              <strong>{attribute}: </strong>
              <span className="extensionAttributeValue">
                {extensionDefinition![attribute]}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog
      className="dialog"
      isOpen={isOpen}
      title="Create a new extension"
      onClose={() => {
        setExtensionDefinition(undefined);
        setinvalidExtensionErrors([]);
        onClose();
      }}
    >
      <div className="container">
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Pick a extension</p>
          )}
        </div>
        {invalidExtensionErrors.length > 0
          ? renderError
          : renderExtensionOverview()}
      </div>
      <Button
        className="uploadButton"
        loading={uploadingExtension}
        disabled={!extensionDefinition || invalidExtensionErrors.length > 0}
        onClick={uploadExtension}
      >
        Create extension
      </Button>
    </Dialog>
  );
};

export default UploadExtension;
