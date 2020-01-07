import * as React from "react";

import { ISelectedSource } from "../../../types";

import StaticValueForm from "./StaticValueForm";
import DynamicColumnPicker from "./DynamicColumnPicker";

interface IProps {
  attribute: {
    id: string;
    name: string;
  };
  schema: any;
  source: ISelectedSource;
}

import "./style.less";

const TabColumnPicking = ({ attribute, schema, source }: IProps) => {
  return (
    <div id={"column-picker"}>
      <StaticValueForm attribute={attribute} />
      <DynamicColumnPicker
        attribute={attribute}
        schema={schema}
        source={source}
      />
    </div>
  );
};

export default TabColumnPicking;
