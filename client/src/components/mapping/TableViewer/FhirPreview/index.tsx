import React from 'react';
import { Spinner } from '@blueprintjs/core';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { IReduxStore } from 'types';

import { RIVER_URL } from '../../../../constants';

interface Props {
  rowId: number;
  resourceId: string;
}

const FhirPreview = ({ rowId, resourceId }: Props) => {
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const [fhirObject, setFhirObject] = React.useState(undefined as any);
  const [validationErrors, setValidationErrors] = React.useState(
    [] as string[]
  );
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${RIVER_URL}/preview`,
          {
            resource_id: resourceId,
            primary_key_values: [rowId]
          },
          { headers: { 'Content-Type': 'application/json' } }
        );
        setFhirObject(res.data.instances);
        setValidationErrors(res.data.errors);
      } catch (err) {
        toaster.show({
          message: err.response ? err.response.data : err.message,
          intent: 'danger',
          icon: 'warning-sign',
          timeout: 6000
        });
      }
      setLoading(false);
    };
    fetchPreview();
  }, [rowId, resourceId, toaster]);

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
