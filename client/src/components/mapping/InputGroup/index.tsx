import React from 'react';
import { Button, Tag } from '@blueprintjs/core';
import { useMutation } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import { loader } from 'graphql.macro';

import { onError as onApolloError } from 'services/apollo';

import ScriptSelect from 'components/selects/scriptSelect';
import InputColumn from '../InputColumn';
import InputStatic from '../InputStatic';
import InputCondition from '../InputCondition';

import { IInputGroup, IReduxStore } from 'types';

const mUpdateInputGroup = loader(
  'src/graphql/mutations/updateInputGroup.graphql'
);
const mDeleteInputGroup = loader(
  'src/graphql/mutations/deleteInputGroup.graphql'
);
const mCreateSqlInput = loader('src/graphql/mutations/createSqlInput.graphql');
const mCreateStaticInput = loader(
  'src/graphql/mutations/createStaticInput.graphql'
);
const mCreateCondition = loader(
  'src/graphql/mutations/addConditionToInputGroup.graphql'
);
interface Props {
  inputGroup: IInputGroup;
}

const InputGroup = ({ inputGroup }: Props) => {
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const onError = onApolloError(toaster);

  const [
    updateInputGroup,
    { loading: loadingMutation }
  ] = useMutation(mUpdateInputGroup, { onError });
  const [
    deleteInputGroup,
    { loading: loadingDeleteInputGroup }
  ] = useMutation(mDeleteInputGroup, { onError });
  const [createCondition] = useMutation(mCreateCondition, {
    onError
  });
  const [createSqlInput] = useMutation(mCreateSqlInput, {
    onError
  });
  const [createStaticInput] = useMutation(mCreateStaticInput, {
    onError
  });

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
      <Button
        icon={'trash'}
        onClick={() => {
          deleteInputGroup({
            variables: {
              attributeId: inputGroup.attributeId,
              inputGroupId: inputGroup.id
            }
          });
        }}
        loading={loadingDeleteInputGroup}
      />
      <div className="attribute-inputs">
        <div className="input-cards">
          <div id="input-column-rows">
            {inputGroup.inputs
              .filter((input: any) => !!input.sqlValue)
              .map(
                (input: any, index: number) =>
                  input && <InputColumn key={index} input={input} />
              )}
          </div>
          <div id="input-column-rows">
            {inputGroup.inputs
              .filter((input: any) => !input.sqlValue)
              .map(
                (input: any, index: number) =>
                  input && <InputStatic key={index} input={input} />
              )}
          </div>
        </div>
        {inputGroup.inputs.length > 1 ? (
          <div id="input-column-merging-script">
            <div className="stacked-tags">
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
      <div>
        <Button
          icon={'add'}
          text={'Add sql input'}
          onClick={() => {
            createSqlInput({
              variables: {
                inputGroupId: inputGroup.id
              }
            });
          }}
        />
      </div>
      <div>
        <Button
          icon={'add'}
          text={'Add static input'}
          onClick={() => {
            createStaticInput({
              variables: {
                inputGroupId: inputGroup.id
              }
            });
          }}
        />
      </div>
      <div className="input-cards">
        <div id="input-column-rows">
          {inputGroup.conditions.map(
            (condition: any, index: number) =>
              condition && <InputCondition key={index} condition={condition} />
          )}
        </div>
      </div>
      <div>
        <Button
          icon={'add'}
          text={'Add condition'}
          onClick={() => {
            createCondition({
              variables: {
                inputGroupId: inputGroup.id
              }
            });
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default InputGroup;
