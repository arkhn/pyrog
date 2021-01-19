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
import { useDispatch, useSelector } from 'react-redux';
import { loader } from 'graphql.macro';

import { onError as onApolloError } from 'services/apollo';
import ScriptSelect from 'components/selects/scriptSelect';

import InputColumn from '../InputColumn';
import InputStatic from '../InputStatic';
import InputCondition from '../InputCondition';

import { setAttributeInMap } from 'services/resourceAttributes/actions';
import { IAttribute, IInputGroup, IReduxStore } from 'types';

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
  attribute: IAttribute;
  inputGroup: IInputGroup;
}

const InputGroup = ({ attribute, inputGroup }: Props) => {
  const dispatch = useDispatch();
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

  const onClearMergingScript = () => {
    updateInputGroup({
      variables: {
        inputGroupId: inputGroup.id,
        mergingScript: null
      }
    });
  };

  const onDeleteInputGroup = async () => {
    const { data } = await deleteInputGroup({
      variables: {
        attributeId: inputGroup.attributeId,
        inputGroupId: inputGroup.id
      }
    });

    dispatch(setAttributeInMap(attribute.path, data.deleteInputGroup));
  };

  const addInputToReduxState = (input: any) => {
    const updatedGroup = attribute.inputGroups.find(
      group => group.id === inputGroup.id
    );
    updatedGroup!.inputs = [...updatedGroup!.inputs, input];

    dispatch(setAttributeInMap(attribute.path, attribute));
  };

  return (
    <Card elevation={Elevation.ONE}>
      <div className="delete-input-group">
        <Button
          icon="trash"
          intent="danger"
          minimal={true}
          onClick={onDeleteInputGroup}
          loading={loadingDeleteInputGroup}
        />
      </div>
      <div className="attribute-inputs">
        <div className="input-cards">
          <div id="input-column-rows">
            {inputGroup.inputs
              .filter(input => !!input.sqlValue)
              .map(
                (input, index) =>
                  input && (
                    <InputColumn
                      key={index}
                      attribute={attribute}
                      input={input}
                    />
                  )
              )}
          </div>
          <div id="input-column-rows">
            {inputGroup.inputs
              .filter(input => !input.sqlValue)
              .map(
                (input, index) =>
                  input && (
                    <InputStatic
                      key={index}
                      attribute={attribute}
                      input={input}
                    />
                  )
              )}
          </div>
        </div>
      </div>
      <div className="add-input-buttons">
        <ButtonGroup>
          <Button
            icon={'add'}
            text={'SQL input'}
            onClick={async () => {
              const { data: dataInput } = await createSqlInput({
                variables: {
                  inputGroupId: inputGroup.id
                }
              });
              addInputToReduxState(dataInput.createSqlInput);
            }}
          />
          <Button
            icon={'add'}
            text={'Static input'}
            onClick={async () => {
              const { data: dataInput } = await createStaticInput({
                variables: {
                  inputGroupId: inputGroup.id
                }
              });
              addInputToReduxState(dataInput.createStaticInput);
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
            (condition, index) =>
              condition && <InputCondition key={index} condition={condition} />
          )}
        </div>
      </div>
      <div className="add-input-buttons">
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
