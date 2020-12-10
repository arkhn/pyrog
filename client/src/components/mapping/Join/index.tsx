import { Breadcrumbs, IBreadcrumbProps, Tag } from '@blueprintjs/core';
import React from 'react';

interface Props {
  joinData: any;
}

const Join = ({ joinData }: Props) => {
  return (
    <div className={'join'}>
      <div className="join-columns">
        <Breadcrumbs
          breadcrumbRenderer={(item: IBreadcrumbProps) => (
            <div>{item.text}</div>
          )}
          items={[
            {
              text: (
                <Tag intent={'success'} large={true}>
                  {joinData?.tables && joinData.tables[0]?.table}
                </Tag>
              )
            },
            {
              text: (
                <Tag intent={'success'} large={true}>
                  {joinData?.tables && joinData.tables[0]?.table}
                </Tag>
              )
            }
          ]}
        />
        <Breadcrumbs
          breadcrumbRenderer={(item: IBreadcrumbProps) => (
            <div>{item.text}</div>
          )}
          items={[
            {
              text: (
                <Tag intent={'success'} large={true}>
                  {joinData?.tables && joinData.tables[1]?.table}
                </Tag>
              )
            },
            {
              text: (
                <Tag intent={'success'} large={true}>
                  {joinData?.tables && joinData.tables[1]?.table}
                </Tag>
              )
            }
          ]}
        />
      </div>
    </div>
  );
};

export default Join;
