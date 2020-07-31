import React from 'react';
import { Tag, Spinner } from '@blueprintjs/core';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import { onError } from 'services/apollo';
import { loader } from 'graphql.macro';

import ScriptSelect from 'components/selects/scriptSelect';
import InputColumn from '../InputColumn';

import { IReduxStore } from 'types';

// GRAPHQL
const qInputsForAttribute = loader(
  'src/graphql/queries/inputsForAttribute.graphql'
);
const mUpdateAttribute = loader(
  'src/graphql/mutations/updateAttribute.graphql'
);

interface Props {
  inputGroup: any;
}

const InputGroup = ({ inputGroup }: Props) => {
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const path = selectedNode.attribute.path;

  const toaster = useSelector((state: IReduxStore) => state.toaster);
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

  const [
    updateAttribute,
    { loading: loadingMutation }
  ] = useMutation(mUpdateAttribute, { onError: onError(toaster) });

  if (loadingData) {
    return <Spinner />;
  }

  const attribute = data && data.attribute ? data.attribute : null;

  const onChangeMergingScript = (script: string) => {
    updateAttribute({
      variables: {
        attributeId: attribute.id,
        data: {
          mergingScript: script
        }
      }
    });
  };

  const onClearMergingScript = (): any => {
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
        {inputGroup.inputs.map((input: any, index: number) => {
          return input ? <InputColumn key={index} input={input} /> : null;
        })}
      </div>
      {inputGroup.inputs.length > 1 ? (
        <div id="input-column-merging-script">
          <div className="stacked-tags">
            <Tag>SCRIPT</Tag>
            <ScriptSelect
              loading={loadingMutation}
              selectedScript={attribute.mergingScript}
              onChange={onChangeMergingScript}
              onClear={onClearMergingScript}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default InputGroup;
