import { Breadcrumbs, IBreadcrumbProps, Tag } from "@blueprintjs/core";
import * as React from "react";

import { ISelectedSource } from "../../../../types";

interface IProps {
  column: any;
  source: ISelectedSource;
}

function buildReadOnlyBreadcrumbTag(label: string, value: string) {
  return (
    <div className="stacked-tags">
      <Tag minimal={true}>{label.toUpperCase()}</Tag>
      <Tag intent={"success"} large={true}>
        {value}
      </Tag>
    </div>
  );
}

const InputColumnBreadcrumbs = ({ source, column }: IProps) => {
  const breadcrumbTags = [];
  if (source.hasOwner) {
    breadcrumbTags.push({
      text: buildReadOnlyBreadcrumbTag("owner", column.owner)
    });
  }
  breadcrumbTags.push(
    { text: buildReadOnlyBreadcrumbTag("table", column.table) },
    { text: buildReadOnlyBreadcrumbTag("column", column.column) }
  );
  return (
    <Breadcrumbs
      breadcrumbRenderer={(item: IBreadcrumbProps) => {
        return <div>{item.text}</div>;
      }}
      items={breadcrumbTags}
    />
  );
};

export default InputColumnBreadcrumbs;
