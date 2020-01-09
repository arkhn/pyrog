import axios from "axios";
import {
  Card,
  Elevation,
  FormGroup,
  ControlGroup,
  Button
} from "@blueprintjs/core";
import * as React from "react";
import { useMutation } from "@apollo/react-hooks";
import { useSelector } from "react-redux";

import ColumnPicker from "../../ColumnPicker";
import TableViewer from "../TableViewer";

import { IReduxStore } from "src/types";
import { loader } from "graphql.macro";
import { HTTP_BACKEND_URL } from "src/constants";

// GRAPHQL
const qInputsForAttribute = loader(
  "src/graphql/queries/inputsForAttribute.graphql"
);
const mCreateSQLInput = loader("src/graphql/mutations/createSQLInput.graphql");

interface IProps {
  attribute: {
    id: string;
    name: string;
  };
  schema: any;
  source: any;
}

const DynamicColumnPicker = ({ attribute, schema, source }: IProps) => {
  const [owner, setOwner] = React.useState("");
  const [table, setTable] = React.useState("");
  const [column, setColumn] = React.useState("");
  const [tableIsLoading, setTableIsLoading] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [fields, setFields] = React.useState([]);

  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const createInput = async () => {
    await createSQLInput({
      variables: {
        attributeId: attribute.id,
        columnInput: {
          owner: owner || "",
          table: table,
          column: column
        }
      }
    });
  };

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

  const [createSQLInput, { loading: creatingSQLInput }] = useMutation(
    mCreateSQLInput,
    { update: addInputToCache }
  );

  React.useEffect(() => {
    if (selectedNode.source && selectedNode.source.id && table) {
      setTableIsLoading(true);
      axios
        .get(
          `${HTTP_BACKEND_URL}/tableview/${selectedNode.source.id}/${
            owner ? owner + "." : ""
          }${table}`
        )
        .then((res: any) => {
          setTableIsLoading(false);
          setRows(res.data.rows);
          setFields(res.data.fields.map((field: any) => field.name));
        })
        .catch((err: any) => {
          setTableIsLoading(false);
          console.log(err);
        });
    }
  }, [table]);

  return (
    <Card elevation={Elevation.ONE}>
      <div className="card-tag">Dynamic</div>
      <FormGroup labelFor="text-input" inline={true}>
        <ControlGroup>
          <ColumnPicker
            hasOwner={source.hasOwner}
            ownerChangeCallback={(e: string) => {
              setOwner(e);
              setTable("");
              setColumn("");
            }}
            tableChangeCallback={(e: string) => {
              setTable(e);
              setColumn("");
            }}
            columnChangeCallback={(e: string) => {
              setColumn(e);
            }}
            sourceSchema={schema}
          />
          <Button
            disabled={!attribute.id || !column}
            icon={"add"}
            loading={creatingSQLInput}
            onClick={() => createInput()}
          />
        </ControlGroup>
      </FormGroup>
      <TableViewer fields={fields} rows={rows} isLoading={tableIsLoading} />
    </Card>
  );
};

export default DynamicColumnPicker;
