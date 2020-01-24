import { Tag, Spinner } from '@blueprintjs/core';
import * as React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';

import { IReduxStore, ISelectedSource } from 'types';

// COMPONENTS
import ScriptSelect from 'components/selects/scriptSelect';
import InputColumn from '../InputColumn';
import { loader } from 'graphql.macro';

// GRAPHQL
const qInputsForAttribute = loader(
  'src/graphql/queries/inputsForAttribute.graphql'
);
const mUpdateAttribute = loader(
  'src/graphql/mutations/updateAttribute.graphql'
);

interface IProps {
  schema: any;
  selectedAttribute: {
    id: string;
    path: string[];
  };
  source: ISelectedSource;
}

const InputColumns = ({ schema, selectedAttribute, source }: IProps) => {
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const path = selectedNode.attribute.path.join('.');

  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );
  const attributeId = attributesForResource[path]
    ? attributesForResource[path].id
    : null;

  const { data, loading: loadingData } = useQuery(qInputsForAttribute, {
    variables: {
      attributeId: attributeId
    },
    skip: !attributeId
  });
  const [updateAttribute, { loading: loadingMutation }] = useMutation(
    mUpdateAttribute
  );

  if (loadingData) {
    return <Spinner />;
  }

  const attribute = data && data.attribute ? data.attribute : null;
  const inputs = attribute && attribute.inputs ? attribute.inputs : [];

  const onChangeCleaningScript = (script: string) => {
    updateAttribute({
      variables: {
        attributeId: attribute.id,
        data: {
          mergingScript: script
        }
      }
    });
  };

  const onClearCleaningScript = (): any => {
    updateAttribute({
      variables: {
        attributeId: attribute.id,
        data: {
          mergingScript: null
        }
      }
    });
  };

  return (
    <div id="input-columns">
      <div id="input-column-rows">
        {inputs.map((input: any, index: number) => {
          return input ? (
            <InputColumn
              key={index}
              attribute={selectedAttribute}
              input={input}
              schema={schema}
              source={source}
            />
          ) : null;
        })}
      </div>
      {inputs.length > 1 ? (
        <div id="input-column-merging-script">
          <div className="stacked-tags">
            <Tag>SCRIPT</Tag>
            <ScriptSelect
              loading={loadingMutation}
              selectedScript={attribute.mergingScript}
              onChange={onChangeCleaningScript}
              onClear={onClearCleaningScript}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default InputColumns;
