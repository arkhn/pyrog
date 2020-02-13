import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog } from '@blueprintjs/core';

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
  const onDrop = useCallback(acceptedFiles => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  return (
    <Dialog
      isOpen={isOpen}
      title={resource ? `Create a new profile for ${resource.name}` : ''}
      onClose={onClose}
    >
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    </Dialog>
  );
};

export default UploadProfile;
