import React from 'react';
import { Spinner } from '@blueprintjs/core';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { IReduxStore } from 'types';

import { FHIRPIPE_URL } from '../../../../../constants';

interface Props {
  rowId: number;
}

const FhirPreview = ({ rowId }: Props) => {
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const { resource } = useSelector((state: IReduxStore) => state.selectedNode);
  const [fhirObject, setFhirObject] = React.useState(undefined as any);
  const [validationErrors, setValidationErrors] = React.useState(
    [] as string[]
  );
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${FHIRPIPE_URL}/preview/${resource.id}/${rowId}`
        );
        setFhirObject(res.data.preview);
        setValidationErrors(res.data.errors);
        setLoading(false);
      } catch (err) {
        toaster.show({
          message: err.response.data || err.message,
          intent: 'danger',
          icon: 'warning-sign',
          timeout: 6000
        });
      }
    };
    fetchPreview();
  }, [rowId, resource.id, toaster]);

  if (loading) return <Spinner />;

  const renderValidationErrors = () => (
    <React.Fragment>
      <h3> Validation errors </h3>
      {validationErrors.map((error, ind) => (
        <pre key={ind}>{error}</pre>
      ))}
    </React.Fragment>
  );

  return (
    <div>
      {validationErrors.length > 0 && renderValidationErrors()}
      <h3> Fhir instance preview </h3>
      <pre>{JSON.stringify(fhirObject, null, 4)}</pre>
    </div>
  );
};

export default FhirPreview;
