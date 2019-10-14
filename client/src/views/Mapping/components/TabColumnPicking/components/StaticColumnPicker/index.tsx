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

const createInputColumnAndUpdateAttribute = require("../../../../../../graphql/mutations/createInputColumnAndUpdateAttribute.graphql");

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
          <Mutation mutation={createInputColumnAndUpdateAttribute}>
            {(createInputColumn: any, { data, loading }: any) => {
              return (
                <Button
                  disabled={!attribute.id || staticValue.length == 0}
                  icon={"add"}
                  loading={loading}
                  onClick={() =>
                    createInputColumn({
                      variables: {
                        attributeId: attribute.id,
                        data: {
                          staticValue: staticValue
                        }
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
