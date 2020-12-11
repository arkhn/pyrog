import { Breadcrumbs, IBreadcrumbProps, Tag } from '@blueprintjs/core';
import React from 'react';

interface Props {
  joinData: any;
  intent?: 'success' | 'none' | 'primary' | 'warning' | 'danger';
}

const Join = ({ joinData, intent }: Props) => {
  return (
    <div className={'join'}>
      <div className="join-columns">
        <div className="stacked-tags">
          <Tag minimal={true}>LEFT JOIN</Tag>
          <Breadcrumbs
            breadcrumbRenderer={(item: IBreadcrumbProps) => (
              <div>{item.text}</div>
            )}
            items={[
              {
                text: (
                  <Tag intent={intent || 'success'} large={true}>
                    {joinData?.tables && joinData.tables[0]?.table}
                  </Tag>
                )
              },
              {
                text: (
                  <Tag intent={intent || 'success'} large={true}>
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
                  <Tag intent={intent || 'success'} large={true}>
                    {joinData?.tables && joinData.tables[1]?.table}
                  </Tag>
                )
              },
              {
                text: (
                  <Tag intent={intent || 'success'} large={true}>
                    {joinData?.tables && joinData.tables[1]?.table}
                  </Tag>
                )
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Join;
