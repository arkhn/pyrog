import React from 'react';
import { Tag } from '@blueprintjs/core';
import { useMutation } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import { onError } from 'services/apollo';
import { loader } from 'graphql.macro';

import ScriptSelect from 'components/selects/scriptSelect';
import AddConditionSelect from 'components/selects/addConditionSelect';
import InputColumn from '../InputColumn';

import { IReduxStore, Condition } from 'types';

// GRAPHQL
const mUpdateInputGroup = loader(
  'src/graphql/mutations/updateInputGroup.graphql'
);

interface Props {
  inputGroup: any;
}

const InputGroup = ({ inputGroup }: Props) => {
  const toaster = useSelector((state: IReduxStore) => state.toaster);

  const [
    updateInputGroup,
    { loading: loadingMutation }
  ] = useMutation(mUpdateInputGroup, { onError: onError(toaster) });

  const onChangeMergingScript = (script: string) => {
    updateInputGroup({
      variables: {
        inputGroupId: inputGroup.id,
        mergingScript: script
      }
    });
  };

  const onClearMergingScript = (): any => {
    updateInputGroup({
      variables: {
        inputGroupId: inputGroup.id,
        mergingScript: null
      }
    });
  };

  const onChangeCondition = (condition: Condition) => {
    updateInputGroup({
      variables: {
        inputGroupId: inputGroup.id,
        conditionId: condition.id
      }
    });
  };

  const onClearCondition = (): any => {
    updateInputGroup({
      variables: {
        inputGroupId: inputGroup.id,
        conditionId: null
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
          <div className="stacked-tags" onClick={e => e.stopPropagation()}>
            <Tag>SCRIPT</Tag>
            <ScriptSelect
              loading={loadingMutation}
              selectedScript={inputGroup.mergingScript}
              onChange={onChangeMergingScript}
              onClear={onClearMergingScript}
            />
          </div>
          <div className="stacked-tags" onClick={e => e.stopPropagation()}>
            <Tag>Condition</Tag>
            <AddConditionSelect
              loading={false}
              disabled={false}
              onChange={onChangeCondition}
              onClear={onClearCondition}
              inputItem={inputGroup.condition}
              items={[
                {
                  id: 'aaaaa',
                  action: 'aaaaa',
                  table: 'aaaaa',
                  column: 'aaaaa',
                  value: 'aaaaa'
                },
                {
                  id: 'bbb',
                  action: 'aaaaa',
                  table: 'aaaaa',
                  column: 'aaaaa',
                  value: 'aaaaa'
                }
              ]}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default InputGroup;
