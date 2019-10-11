import { Button, Card, Elevation, Tag } from "@blueprintjs/core";
import * as React from "react";
import { Subscription } from "react-apollo";

import { ISelectedSource } from "../../../../types";

// COMPONENTS
import Join from "./join";
import InputColumnDeleteButton from "./deleteButton";
import InputColumnBreadcrumbs from "./breadcrumbs";
import InputColumnScriptTag from "./scriptTag";
import InputColumnAddJoin from "./addJoinButton";

interface IProps {
  attribute: {
    id: string;
    name: string;
  };
  column: any;
  schema: any;
  source: ISelectedSource;
}

const InputColumn = ({ attribute, column, schema, source }: IProps) => (
  <div className="input-column">
    <InputColumnDeleteButton attribute={attribute} column={column} />
    <Card elevation={Elevation.ONE} className="input-column-info">
      {column.staticValue ? (
        <div className="input-column-name">
          <Tag large={true}>Static</Tag>
          <Tag intent={"success"} large={true} minimal={true}>
            {column.value}
          </Tag>
        </div>
      ) : (
        <div>
          <div className="input-column-name">
            <InputColumnBreadcrumbs source={source} column={column} />
            <InputColumnScriptTag column={column} />
          </div>
          <div className="input-column-joins">
            <InputColumnAddJoin column={column} />
            {column.joins
              ? column.joins.map((join: any, index: number) => {
                  return (
                    <Join
                      column={column}
                      schema={schema}
                      source={source}
                      join={join}
                      joinIndex={index}
                    />
                  );
                })
              : null}
          </div>
        </div>
      )}
    </Card>
  </div>
);

export default InputColumn;
