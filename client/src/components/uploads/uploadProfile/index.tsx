import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, Button } from '@blueprintjs/core';
import { ErrorObject } from 'ajv';
import axios from 'axios';

import { FHIR_API_URL } from '../../../constants';
import fhirSchema from './StructureDefinition.schema.json';
import { validator } from '../validate';

import './style.scss';

interface Resource {
  id: string;
  name: string;
  type: string;
}

interface Props {
  isOpen: boolean;
  resource?: Resource;
  onClose: () => void;
  onUpload: (r: Resource) => void;
}

const overviewAttributes = [
  'id',
  'name',
  'description',
  'fhirVersion',
  'type',
  'publisher'
];
const findMissingAttributes = (profile: any) =>
  overviewAttributes.filter(a => !Object.keys(profile).includes(a));

const formatErrors = (errors: ErrorObject[]): string[] =>
  errors.map(err => `${err.message}: ${Object.values(err.params).join(',')}`);

const validate = validator(fhirSchema);

const UploadProfile = ({ isOpen, resource, onClose, onUpload }: Props) => {
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
  const [profileDefinition, setProfileDefinition] = React.useState(
    undefined as any
  );
  const [invalidProfileErrors, setinvalidProfileErrors] = React.useState(
    [] as string[]
  );
  const [uploadingProfile, setUploadingProfile] = React.useState(false);

  const validateProfile = (profile: any): boolean => {
    if (!validate(profile)) {
      const formattedErrors = formatErrors(validate.errors!);
      setinvalidProfileErrors(formattedErrors);
      return false;
    }

    const missingAttributes = findMissingAttributes(profile);
    if (missingAttributes.length > 0) {
      setinvalidProfileErrors(
        missingAttributes.map(a => `Missing required attribute ${a}`)
      );
      return false;
    }
    if (profile.type !== resource!.type) {
      setinvalidProfileErrors([
        `Cannot create profile of type "${profile.type}" on resource ${
          resource!.type
        }`
      ]);
      return false;
    }

    return true;
  };

  const uploadProfile = async () => {
    setUploadingProfile(true);
    try {
      await axios.post(
        `${FHIR_API_URL}/StructureDefinition`,
        profileDefinition
      );

      onUpload(profileDefinition);
      onClose();
    } catch (err) {
      setinvalidProfileErrors([err.response ? err.response.data : err.message]);
    }
    setUploadingProfile(false);
  };

  React.useEffect(() => {
    if (!acceptedFiles.length) return;

    const [profileFile] = acceptedFiles;
    const reader = new FileReader();

    reader.onerror = () =>
      setinvalidProfileErrors(['could not read selected file']);
    reader.onload = () => {
      const profile = JSON.parse(reader.result as string);
      if (validateProfile(profile)) {
        setProfileDefinition(profile);
        setinvalidProfileErrors([]);
      }
    };
    reader.readAsText(profileFile);
  }, [acceptedFiles]);

  const renderError = (
    <div className="profileError">
      <h4>Invalid Profile</h4>
      <ul>
        {invalidProfileErrors!.map((err, i) => (
          <li key={i}>{err} </li>
        ))}
      </ul>
    </div>
  );

  const renderProfileOverview = () => {
    if (rejectedFiles.length)
      return <div className="profileOverview">Only JSON files are allowed</div>;

    if (!profileDefinition)
      return <div className="profileOverview">No profile selected</div>;

    return (
      <div className="profileOverview">
        <h4>Profile overview</h4>
        <div>
          {overviewAttributes.map(attribute => (
            <div key={attribute} className="profileAttributeRow">
              <strong>{attribute}: </strong>
              <span className="profileAttributeValue">
                {profileDefinition![attribute]}
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
      title={resource ? `Create a new profile for ${resource.name}` : ''}
      onClose={() => {
        setProfileDefinition(undefined);
        setinvalidProfileErrors([]);
        onClose();
      }}
    >
      <div className="container">
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Pick a profile</p>
          )}
        </div>
        {invalidProfileErrors.length > 0
          ? renderError
          : renderProfileOverview()}
      </div>
      <Button
        className="uploadButton"
        loading={uploadingProfile}
        disabled={!profileDefinition || invalidProfileErrors.length > 0}
        onClick={uploadProfile}
      >
        Create profile
      </Button>
    </Dialog>
  );
};

export default UploadProfile;
