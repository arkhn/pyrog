import * as React from "react";

import { ISelectedSource } from "../../../../types";

import StaticColumnPicker from "./components/StaticColumnPicker";
import DynamicColumnPicker from "./components/DynamicColumnPicker";

interface IProps {
  attribute: {
    id: string;
    name: string;
  };
  schema: any;
  source: ISelectedSource;
}

const TabColumnPicking = ({ attribute, schema, source }: IProps) => {
  return (
    <div id={"column-picker"}>
      <StaticColumnPicker attribute={attribute} />
      <DynamicColumnPicker
        attribute={attribute}
        schema={schema}
        source={source}
      />
    </div>
  );
};

export default TabColumnPicking;
