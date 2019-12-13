import {
  Button,
  Card,
  ControlGroup,
  InputGroup,
  FormGroup,
  Elevation
} from "@blueprintjs/core";
import * as React from "react";
import { Mutation } from "react-apollo";

const mCreateStaticInput = require("src/graphql/mutations/createStaticInput.graphql");

interface IProps {
  attribute: {
    id: string;
    name: string;
  };
}

const StaticColumnPicker = ({ attribute }: IProps) => {
  const [staticValue, setStaticValue] = React.useState("");

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
          <Mutation mutation={mCreateStaticInput}>
            {(createStaticInput: any, { data, loading }: any) => {
              return (
                <Button
                  disabled={!attribute.id || staticValue.length == 0}
                  icon={"add"}
                  loading={loading}
                  onClick={() =>
                    createStaticInput({
                      variables: {
                        attributeId: attribute.id,
                        staticValue: staticValue
                      }
                    })
                  }
                />
              );
            }}
          </Mutation>
        </ControlGroup>
      </FormGroup>
    </Card>
  );
};

export default StaticColumnPicker;
