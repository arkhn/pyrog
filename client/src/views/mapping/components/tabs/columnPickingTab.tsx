import {
  Button,
  Card,
  ControlGroup,
  Elevation,
  FormGroup,
  InputGroup
} from "@blueprintjs/core";
import * as React from "react";
import { Mutation, Query, Subscription } from "react-apollo";

import { ISelectedSource } from "../../../../types";

// COMPONENTS
import ColumnPicker from "../../../../components/columnPicker";

// GRAPHQL
const createInputColumnAndUpdateAttribute = require("../../../../graphql/mutations/createInputColumnAndUpdateAttribute.graphql");

interface IProps {
  attribute: {
    id: string;
    name: string;
  };
  schema: any;
  source: ISelectedSource;
}

const ColumnSuggestionTab = ({ attribute, schema, source }: IProps) => {
  const [owner, setOwner] = React.useState(null);
  const [table, setTable] = React.useState(null);
  const [column, setColumn] = React.useState(null);
  const [staticValue, setStaticValue] = React.useState("");

  return (
    <div id={"column-picker"}>
      <Card elevation={Elevation.ONE}>
        <FormGroup
          label={<h3>Column Picker</h3>}
          labelFor="text-input"
          inline={true}
        >
          <ControlGroup>
            <ColumnPicker
              hasOwner={source.hasOwner}
              ownerChangeCallback={(e: string) => {
                setOwner(e);
                setTable(null);
                setColumn(null);
              }}
              tableChangeCallback={(e: string) => {
                setTable(e);
                setColumn(null);
              }}
              columnChangeCallback={(e: string) => {
                setColumn(e);
              }}
              sourceSchema={schema}
            />
            <Mutation mutation={createInputColumnAndUpdateAttribute}>
              {(
                createInputColumnAndUpdateAttribute: any,
                { data, loading }: any
              ) => {
                return (
                  <Button
                    disabled={!attribute.id || !column}
                    icon={"add"}
                    loading={loading}
                    onClick={() =>
                      createInputColumnAndUpdateAttribute({
                        variables: {
                          attributeId: attribute.id,
                          data: {
                            owner: owner,
                            table: table,
                            column: column
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
      <Card elevation={Elevation.ONE}>
        <FormGroup
          label={<h3>Column With Static Value</h3>}
          labelFor="text-input"
          inline={true}
        >
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
    </div>
  );
};

export default ColumnSuggestionTab;
