// import axios from "axios";
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
// import TableViewer from "../TableViewer";

import { IReduxStore } from "src/types";

const mCreateSQLInput = require("src/graphql/mutations/createSQLInput.graphql");

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
  // const [tableIsLoading, setTableIsLoading] = React.useState(false);
  // const [rows, setRows] = React.useState([]);
  // const [fields, setFields] = React.useState([]);

  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);

  // React.useEffect(() => {
  //   if (selectedNode.source && selectedNode.source.id) {
  //     setTableIsLoading(true);
  //     axios
  //       .get(
  //         `${process.env.HTTP_BACKEND_URL}/tableview/${
  //           selectedNode.source.id
  //         }/${table}`
  //       )
  //       .then((res: any) => {
  //         setTableIsLoading(false);
  //         setRows(res.data.rows);
  //         setFields(res.data.fields.map((field: any) => field.name));
  //       })
  //       .catch((err: any) => {
  //         setTableIsLoading(false);
  //         console.log(err);
  //       });
  //   }
  // }, [table]);

  return (
    <Card elevation={Elevation.ONE}>
      <div className="card-tag">Dynamic</div>
      <FormGroup labelFor="text-input" inline={true}>
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
          <Mutation mutation={mCreateSQLInput}>
            {(
              createSQLInput: any,
              { data, loading }: any
            ) => {
              return (
                <Button
                  disabled={!attribute.id || !column}
                  icon={"add"}
                  loading={loading}
                  onClick={() =>
                    createSQLInput({
                      variables: {
                        attributeId: attribute.id,
                        columnInput: {
                          owner: owner || "",  // TODO remove "". I'm only testing because owner of inputColumn non-nullable
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
      {/* <TableViewer fields={fields} rows={rows} isLoading={tableIsLoading} /> */}
    </Card>
  );
};

export default DynamicColumnPicker;
