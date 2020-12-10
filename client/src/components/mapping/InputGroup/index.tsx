import React from 'react';
import { Tag } from '@blueprintjs/core';
import { useMutation } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import { onError } from 'services/apollo';
import { loader } from 'graphql.macro';

import ScriptSelect from 'components/selects/scriptSelect';
import InputColumn from '../InputColumn';
import InputCondition from '../InputCondition';

import { IReduxStore } from 'types';

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

  return (
    <React.Fragment>
      <div className="input-cards">
        <div id="input-column-rows">
          {inputGroup.inputs.map(
            (input: any, index: number) =>
              input && <InputColumn key={index} input={input} />
          )}
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
          </div>
        ) : null}
      </div>
      <div className="input-cards">
        <div id="input-column-rows">
          {inputGroup.conditions.map(
            (condition: any, index: number) =>
              condition && <InputCondition key={index} condition={condition} />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default InputGroup;
