import React from 'react';
import { Tag } from '@blueprintjs/core';
import { useMutation } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import { onError } from 'services/apollo';
import { loader } from 'graphql.macro';

import ScriptSelect from 'components/selects/scriptSelect';
import InputColumn from '../InputColumn';

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
        data: {
          mergingScript: script
        }
      }
    });
  };

  const onClearMergingScript = (): any => {
    updateInputGroup({
      variables: {
        inputGroupId: inputGroup.id,
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
  );
};

export default InputGroup;
