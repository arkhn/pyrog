import { Tag, Spinner } from '@blueprintjs/core';
import * as React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { ISelectedSource } from 'src/types';

// COMPONENTS
import ScriptSelect from 'src/components/selects/scriptSelect';
import InputColumn from './../InputColumn';
import { loader } from 'graphql.macro';

// GRAPHQL
const qInputsForAttribute = loader(
  'src/graphql/queries/inputsForAttribute.graphql'
);
const mUpdateAttribute = loader(
  'src/graphql/mutations/updateAttribute.graphql'
);

interface IProps {
  schema: any;
  selectedAttribute: {
    id: string;
    name: string;
  };
  source: ISelectedSource;
}

const InputColumns = ({ schema, selectedAttribute, source }: IProps) => {
  const { data, loading: loadingData } = useQuery(qInputsForAttribute, {
    variables: {
      attributeId: selectedAttribute.id
    },
    skip: !selectedAttribute.id
  });
  const [updateAttribute, { loading: loadingMutation }] = useMutation(
    mUpdateAttribute
  );

  if (loadingData) {
    return <Spinner />;
  }

  const attribute = data && data.attribute ? data.attribute : null;
  const inputs = attribute && attribute.inputs ? attribute.inputs : [];

  return (
    <div id="input-columns">
      <div id="input-column-rows">
        {inputs.map((input: any, index: number) => {
          return input ? (
            <InputColumn
              key={index}
              attribute={selectedAttribute}
              input={input}
              schema={schema}
              source={source}
            />
          ) : null;
        })}
      </div>
      {inputs.length > 1 ? (
        <div id="input-column-merging-script">
          <div className="stacked-tags">
            <Tag>SCRIPT</Tag>
            <ScriptSelect
              loading={loadingMutation}
              selectedScript={attribute.mergingScript}
              onChange={(script: string) => {
                updateAttribute({
                  variables: {
                    attributeId: attribute.id,
                    data: {
                      mergingScript: script
                    }
                  }
                });
              }}
              onClear={(): any => {
                updateAttribute({
                  variables: {
                    attributeId: attribute.id,
                    data: {
                      mergingScript: null
                    }
                  }
                });
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default InputColumns;
