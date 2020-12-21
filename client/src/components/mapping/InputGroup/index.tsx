import React from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  Divider,
  Elevation,
  Tag
} from '@blueprintjs/core';
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
const mCreateSqlInput = loader('src/graphql/mutations/createSQLInput.graphql');
const mCreateStaticInput = loader(
  'src/graphql/mutations/createStaticInput.graphql'
);
const mCreateCondition = loader(
  'src/graphql/mutations/addConditionToInputGroup.graphql'
);
interface Props {
  inputGroup: IInputGroup;
  key: number;
}

const InputGroup = ({ inputGroup, key }: Props) => {
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
    <Card key={key} elevation={Elevation.ONE}>
      <div className="delete-input-group">
        <Button
          icon="trash"
          intent="danger"
          minimal={true}
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
      </div>
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
      </div>
      <div className="add-input-buttons">
        <ButtonGroup>
          <Button
            icon={'add'}
            text={'SQL input'}
            onClick={() => {
              createSqlInput({
                variables: {
                  inputGroupId: inputGroup.id
                }
              });
            }}
          />
          <Button
            icon={'add'}
            text={'Static input'}
            onClick={() => {
              createStaticInput({
                variables: {
                  inputGroupId: inputGroup.id
                }
              });
            }}
          />
        </ButtonGroup>
      </div>
      {inputGroup.inputs.length > 1 && (
        <div>
          <div className="divider-conditions">
            <div className="divider-conditions-before">
              <Divider />
            </div>
            <div className="divider-conditions-tag">MERGING SCRIPT</div>
            <div className="divider-conditions-after">
              <Divider />
            </div>
          </div>
          <div id="input-group-merging-script">
            <div className="stacked-tags">
              {inputGroup.mergingScript ? (
                <Tag>MERGING SCRIPT</Tag>
              ) : (
                <Tag intent="danger">CHOOSE A MERGING SCRIPT</Tag>
              )}
              <ScriptSelect
                loading={loadingMutation}
                selectedScript={inputGroup.mergingScript}
                onChange={onChangeMergingScript}
                onClear={onClearMergingScript}
              />
            </div>
          </div>
        </div>
      )}
      <div className="divider-conditions">
        <div className="divider-conditions-before">
          <Divider />
        </div>
        <div className="divider-conditions-tag">CONDITIONS</div>
        <div className="divider-conditions-after">
          <Divider />
        </div>
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
          text={'Condition'}
          onClick={() => {
            createCondition({
              variables: {
                inputGroupId: inputGroup.id
              }
            });
          }}
        />
      </div>
    </Card>
  );
};

export default InputGroup;
