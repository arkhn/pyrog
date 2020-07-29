import React from 'react';
import { Spinner } from '@blueprintjs/core';

interface Props {
  previewData: {
    instances: any;
    errors: string[];
  };
  loading: boolean;
}

const FhirPreview = ({ previewData, loading }: Props) => {
  if (loading) return <Spinner />;

  const renderValidationErrors = () => (
    <React.Fragment>
      <h3> Validation errors </h3>
      {previewData.errors.map((error, ind) => (
        <pre key={ind}>{error}</pre>
      ))}
    </React.Fragment>
  );

  return previewData ? (
    <div>
      {previewData.errors.length > 0 && renderValidationErrors()}
      {previewData.instances!! && (
        <>
          <h3> Fhir instance preview </h3>
          <pre>{JSON.stringify(previewData.instances, null, 4)}</pre>
        </>
      )}
    </div>
  ) : null;
};

export default FhirPreview;
