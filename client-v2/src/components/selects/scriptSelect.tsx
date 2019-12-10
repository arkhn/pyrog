import {
  ItemListPredicate,
  ItemPredicate,
  ItemRenderer
} from "@blueprintjs/select";
import { MenuItem, Button, ButtonGroup } from "@blueprintjs/core";
import * as React from "react";

import TSelect from "./TSelect";
import { useQuery } from "react-apollo";

const cleaningScripts = require("~/graphql/queries/cleaningScripts.graphql");

interface IOnChange {
  (script: String): any;
}

interface IScript {
  code: string;
  description?: string;
}

interface IProps {
  selectedScript: string;
  loading?: boolean;
  onChange: IOnChange;
  onClear: Function;
}

const filterByCode: ItemPredicate<IScript> = (query, item) => {
  return `${item.code.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
};

const sortItems: ItemListPredicate<IScript> = (query, resources: IScript[]) => {
  resources.sort((s1, s2) => {
    const name1 = s1.code.toLowerCase();
    const name2 = s2.code.toLowerCase();
    if (name1 < name2) return -1;
    if (name1 > name2) return 1;
    return 0;
  });
  return resources;
};

const renderItem: ItemRenderer<IScript> = (
  item,
  { handleClick, modifiers, query }
) => {
  return (
    <MenuItem
      key={item.code}
      onClick={handleClick}
      label={item.code}
      text={item.description}
    />
  );
};

const ScriptSelect = ({
  selectedScript,
  loading,
  onChange,
  onClear
}: IProps) => {
  const { loading: queryLoading, error, data } = useQuery(cleaningScripts);
  let items: IScript[] = [];
  if (data && data.cleaningScripts) {
    items = data.cleaningScripts.scripts;
  }
  return (
    <ButtonGroup>
      <TSelect<IScript>
        disabled={false}
        displayItem={({ code }: IScript) => {
          return code || "None";
        }}
        sortItems={sortItems}
        filterItems={filterByCode}
        loading={loading || queryLoading}
        inputItem={{ code: selectedScript }}
        items={items}
        onChange={(script: IScript) => onChange(script.code)}
        renderItem={renderItem}
      />
      <Button
        disabled={!selectedScript}
        loading={loading || queryLoading}
        icon={"cross"}
        minimal={true}
        onClick={() => onClear()}
      />
    </ButtonGroup>
  );
};

export default ScriptSelect;
