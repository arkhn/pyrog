import { Button, ButtonGroup, InputGroup } from '@blueprintjs/core';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import axios from 'axios';
import { FHIR_API_URL } from '../../../constants';

import { IReduxStore } from 'types';

import { validator } from 'components/uploads/validate';
import fhirSchema from 'components/uploads/uploadCodeSystem/CodeSystem.schema.json';

import './style.scss';

const validateCodeSystem = validator(fhirSchema);

const UploadCodeSystem = (): React.ReactElement => {
  const toaster = useSelector((state: IReduxStore) => state.toaster);

  const [newCodeSystem, setNewCodeSystem] = useState(undefined as any);
  const [uploading, setUploading] = useState(false);
  const [invalidFile, setInvalidFile] = useState(false);

  const reader = new FileReader();
  reader.onerror = () => {
    toaster.show({
      message: 'Could not read CodeSystem',
      intent: 'danger',
      icon: 'warning-sign',
      timeout: 5000
    });
  };
  reader.onload = () => {
    const codeSystem = JSON.parse(reader.result as string);
    if (validateCodeSystem(codeSystem)) {
      setNewCodeSystem(codeSystem);
      setInvalidFile(false);
    } else {
      setNewCodeSystem(undefined);
      setInvalidFile(true);
    }
  };

  const uploadCodeSystem = async () => {
    setUploading(true);
    try {
      await axios.post(`${FHIR_API_URL}/CodeSystem`, newCodeSystem);
    } catch (err) {
      toaster.show({
        message: `Could not upload CodeSystem: ${
          err.response ? err.response.data : err.message
        }`,
        intent: 'danger',
        icon: 'warning-sign',
        timeout: 5000
      });
    }
    setUploading(false);
  };

  const readCodeSystemFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) {
      return;
    }
    const codeSystemFile = e.target.files[0];
    reader.readAsText(codeSystemFile);
  };

  return (
    <div id="upload-code-system">
      <ButtonGroup vertical={true}>
        <div>
          <input type="file" onChange={readCodeSystemFile} />
          {invalidFile && <b className="invalid-alert">Invalid file</b>}
        </div>
        <Button
          className="button"
          intent="primary"
          text={'Upload code system'}
          onClick={uploadCodeSystem}
          disabled={uploading || !newCodeSystem}
        />
      </ButtonGroup>
    </div>
  );
};

export default UploadCodeSystem;
