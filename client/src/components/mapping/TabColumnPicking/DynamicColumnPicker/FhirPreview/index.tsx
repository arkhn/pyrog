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
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await axios.get(
          `${FHIRPIPE_URL}/preview/${resource.id}/${rowId}`
        );
        setFhirObject(res.data);
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
  });

  if (loading) return <Spinner />;

  return <pre>{JSON.stringify(fhirObject)}</pre>;
};

export default FhirPreview;
