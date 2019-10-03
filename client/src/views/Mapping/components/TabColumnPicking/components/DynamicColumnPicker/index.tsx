import axios from "axios";
import {
  Card,
  Elevation,
  FormGroup,
  ControlGroup,
  Button
} from "@blueprintjs/core";
import * as React from "react";
import { Mutation } from "react-apollo";
import { useSelector } from "react-redux";

import ColumnPicker from "../../../ColumnPicker";
import TableViewer from "../TableViewer";

import { IReduxStore } from "../../../../../../types";

const createInputColumnAndUpdateAttribute = require("../../../../../../graphql/mutations/createInputColumnAndUpdateAttribute.graphql");

interface IProps {
  attribute: {
    id: string;
    name: string;
  };
  schema: any;
  source: any;
}

const DynamicColumnPicker = ({ attribute, schema, source }: IProps) => {
  const [owner, setOwner] = React.useState(null);
  const [table, setTable] = React.useState(null);
  const [column, setColumn] = React.useState(null);
  const [rows, setRows] = React.useState([]);
  const [fields, setFields] = React.useState([]);

  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);

  React.useEffect(() => {
    if (selectedNode.source && selectedNode.source.id) {
      axios
        .get(
          `${process.env.HTTP_BACKEND_URL}/tableview/${
            selectedNode.source.id
          }/patients`
        )
        .then((res: any) => {
          setRows(res.data.rows);
          setFields(res.data.fields.map((field: any) => field.name));
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, [selectedNode]);

  return (
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
      <TableViewer fields={fields} rows={rows} />
    </Card>
  );
};

export default DynamicColumnPicker;
