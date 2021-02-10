import {
  Table,
  Column,
  Cell,
  TableLoadingOption,
  RowHeaderCell,
  SelectionModes,
  IRegion
} from '@blueprintjs/table';
import React from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

import './style.scss';
import { Icon } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxStore, Owner } from 'types';
import { RIVER_URL } from '../../../constants';
import FhirPreview from './FhirPreview';
import StringSelect from 'components/selects/stringSelect';
import exploreTable from 'services/exploredTable/actions';
import getExploredTable from 'services/exploredTable/selectors';

const TableViewer = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { resource } = useSelector((state: IReduxStore) => state.selectedNode);
  const { fields, rows, ...exploredTable } = useSelector(getExploredTable);
  const availableOwners = useSelector(
    (state: IReduxStore): Owner[] => state.selectedNode.source.credential.owners
  );
  const resourcePkOwner = useSelector(
    (state: IReduxStore) => state.selectedNode.resource?.primaryKeyOwner
  );

  const [owner, setOwner] = React.useState(resourcePkOwner);
  const [table, setTable] = React.useState(resource?.primaryKeyTable);
  const [compatiblePreview, setCompatiblePreview] = React.useState(false);

  const [previewData, setPreviewData] = React.useState<any>(undefined);
  const [loadingPreview, setLoadingPreview] = React.useState(false);

  const fetchPreview = React.useCallback(
    async selectedRows => {
      setLoadingPreview(true);
      setPreviewData(undefined);
      try {
        const res = await axios.post(
          `${RIVER_URL}/api/preview/`,
          {
            resource_id: resource.id,
            primary_key_values: [
              rows[selectedRows][fields.indexOf(resource.primaryKeyColumn)]
            ]
          },
          { headers: { 'Content-Type': 'application/json' } }
        );
        setPreviewData(res.data);
      } catch (err) {
        enqueueSnackbar(err.response ? err.response.data.error : err.message, {
          variant: 'warning',
          autoHideDuration: 6000
        });
      }
      setLoadingPreview(false);
    },
    [fields, rows, resource, enqueueSnackbar]
  );

  const onSelection = (regions: IRegion[]) => {
    if (!compatiblePreview) return;
    if (regions.length === 0) return;

    const [{ rows: selectedRows }] = regions;
    if (!selectedRows) return;

    const [rowIndex] = selectedRows;
    fetchPreview(rowIndex);
  };

  const renderRowHeader = () => (
    <RowHeaderCell
      className="previewButton"
      nameRenderer={() => <Icon icon="flame" />}
    />
  );

  React.useEffect(() => {
    setCompatiblePreview(resource && table === resource?.primaryKeyTable);
  }, [table, resource]);

  React.useEffect(() => {
    setOwner(resourcePkOwner);
    setTable(resource?.primaryKeyTable);
  }, [resource, resourcePkOwner]);

  React.useEffect(() => {
    if (
      resource &&
      owner &&
      table
    ) {
      dispatch(exploreTable(resource.id, owner.name, table));
    }
  }, [resource, owner, table, dispatch]);

  return (
    <div id="tableViewer">
      <StringSelect
        icon={'th'}
        inputItem={owner?.name || ''}
        items={availableOwners.map(o => o.name)}
        maxItems={100}
        onChange={(name: string) => {
          setOwner(availableOwners.find(o => o.name === name)!);
          setTable('');
        }}
      />
      <StringSelect
        icon={'th'}
        inputItem={table}
        disabled={!owner}
        items={owner?.schema ? Object.keys(owner.schema) : []}
        maxItems={100}
        onChange={(t: string) => {
          setTable(t);
        }}
      />
      {rows.length > 0 && (
        <Table
          numRows={rows.length}
          enableColumnReordering={false}
          enableRowResizing={false}
          rowHeaderCellRenderer={
            compatiblePreview ? renderRowHeader : undefined
          }
          enableMultipleSelection={false}
          onSelection={onSelection}
          selectionModes={SelectionModes.ROWS_ONLY}
          loadingOptions={
            exploredTable.loading
              ? [
                  TableLoadingOption.CELLS,
                  TableLoadingOption.COLUMN_HEADERS,
                  TableLoadingOption.ROW_HEADERS
                ]
              : []
          }
        >
          {fields.map((field: string, index: number) => (
            <Column
              key={index}
              name={field}
              cellRenderer={(i: number) => <Cell>{rows[i][index]}</Cell>}
            />
          ))}
        </Table>
      )}
      <FhirPreview previewData={previewData} loading={loadingPreview} />
    </div>
  );
};

export default TableViewer;
