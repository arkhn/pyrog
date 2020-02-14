import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, Button } from '@blueprintjs/core';

import './style.scss';

interface Props {
  isOpen: boolean;
  resource?: Resource;
  onClose: () => void;
}

interface Resource {
  id: string;
  name: string;
  type: string;
}

const UploadProfile = ({ isOpen, resource, onClose }: Props) => {
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
  const [invalidProfile, setInvalidProfile] = React.useState(false);
  const [uploadingProfile, setUploadingProfile] = React.useState(false);

  const renderProfileOverview = () => {
    if (rejectedFiles.length)
      return <div className="profileOverview">Only JSON files are allowed</div>;

    if (!profileDefinition)
      return <div className="profileOverview">No profile selected</div>;

    console.log(profileDefinition);
    return (
      <div className="profileOverview">
        <title>Provile overview</title>
        {profileDefinition ? (
          <div>
            <pre>{profileDefinition!.resourceType}</pre>
            <pre>{profileDefinition!.name}</pre>
            <pre>{profileDefinition!.type}</pre>
            <pre>{profileDefinition!.publisher}</pre>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  };

  const uploadProfile = async () => {};

  React.useEffect(() => {
    if (!acceptedFiles.length) return;

    const [profileFile] = acceptedFiles;
    const reader = new FileReader();

    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = () => {
      const profileDefinition = JSON.parse(reader.result as string);
      setProfileDefinition(profileDefinition);
    };
    reader.readAsText(profileFile);
  }, [acceptedFiles]);

  return (
    <Dialog
      className="dialog"
      isOpen={isOpen}
      title={resource ? `Create a new profile for ${resource.name}` : ''}
      onClose={onClose}
    >
      <div className="container">
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop the profile, or click to select it</p>
          )}
        </div>
        {renderProfileOverview()}
      </div>
      <Button
        className="uploadButton"
        loading={uploadingProfile}
        disabled={!profileDefinition || invalidProfile}
        onClick={uploadProfile}
      >
        Create profile
      </Button>
    </Dialog>
  );
};

export default UploadProfile;
