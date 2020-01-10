import {
  Button,
  Card,
  ControlGroup,
  InputGroup,
  FormGroup,
  Elevation
} from '@blueprintjs/core';
import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';

// GRAPHQL
const qInputsForAttribute = loader(
  'src/graphql/queries/inputsForAttribute.graphql'
);
const mCreateStaticInput = loader(
  'src/graphql/mutations/createStaticInput.graphql'
);

interface IProps {
  attribute: {
    id: string;
    name: string;
  };
}

const StaticValueForm = ({ attribute }: IProps) => {
  const [staticValue, setStaticValue] = React.useState('');

  const addInputToCache = (cache: any, { data: { createInput } }: any) => {
    try {
      const { attribute: dataAttribute } = cache.readQuery({
        query: qInputsForAttribute,
        variables: {
          attributeId: attribute.id
        }
      });
      cache.writeQuery({
        query: qInputsForAttribute,
        variables: {
          attributeId: attribute.id
        },
        data: {
          attribute: {
            ...dataAttribute,
            inputs: dataAttribute.inputs.concat([createInput])
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [
    createStaticInput,
    { loading: creatingStaticInput }
  ] = useMutation(mCreateStaticInput, { update: addInputToCache });

  return (
    <Card elevation={Elevation.ONE}>
      <div className="card-tag">Static</div>
      <FormGroup labelFor="text-input" inline={true}>
        <ControlGroup>
          <InputGroup
            id="static-value-input"
            onChange={(event: React.FormEvent<HTMLElement>) => {
              const target = event.target as HTMLInputElement;
              setStaticValue(target.value);
            }}
            placeholder="Column static value"
            value={staticValue}
          />
          <Button
            disabled={!attribute.id || staticValue.length === 0}
            icon={'add'}
            loading={creatingStaticInput}
            onClick={() =>
              createStaticInput({
                variables: {
                  attributeId: attribute.id,
                  staticValue: staticValue
                }
              })
            }
          />
        </ControlGroup>
      </FormGroup>
    </Card>
  );
};

export default StaticValueForm;
