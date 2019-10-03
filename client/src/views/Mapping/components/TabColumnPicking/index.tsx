import {
  Button,
  Card,
  ControlGroup,
  Elevation,
  FormGroup,
  InputGroup
} from "@blueprintjs/core";
import axios from "axios";
import * as React from "react";
import { Mutation } from "react-apollo";
import { useSelector } from "react-redux";

import { ISelectedSource, IReduxStore } from "../../../../types";

import ColumnPicker from "../ColumnPicker";
import TableViewer from "../TableViewer";
import StaticColumnPicker from "./components/StaticColumnPicker";

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

const TabColumnPicking = ({ attribute, schema, source }: IProps) => {
  const [owner, setOwner] = React.useState(null);
  const [table, setTable] = React.useState(null);
  const [column, setColumn] = React.useState(null);
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const [rows, setRows] = React.useState([]);
  const [fields, setFields] = React.useState([]);

  React.useEffect(() => {
    if (selectedNode.source && selectedNode.source.id) {
      axios
        .get(
          `${process.env.HTTP_BACKEND_URL}/tableview/${
            selectedNode.source.id
          }/patients`
        )
        .then((res: any) => {
          console.log("RES", res);
          setRows(res.data.rows);
          setFields(res.data.fields.map((field: any) => field.name));
        })
        .catch((err: any) => {
          console.log("ERR", err);
        });
    }
  }, [selectedNode]);

  return (
    <div id={"column-picker"} style={{ maxWidth: "100%" }}>
      <StaticColumnPicker attribute={attribute} />
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
      <TableViewer fields={fields} rows={rows} />
    </div>
  );
};

export default TabColumnPicking;
