import { Icon } from '@blueprintjs/core';
import React from 'react';
import Select, { components } from 'react-select';

import { Terminology } from 'types';

interface Props {
  codeSystems: Terminology[];
  valueSets: Terminology[];
  selectedSystem: Terminology;
  onChange: Function;
  isLoading: boolean;
  allowCreate?: boolean;
  isOptionDisabled?: (item: Terminology) => boolean;
  callbackCreatingNewSystem?: Function;
}

const TerminologySelect = ({
  codeSystems,
  valueSets,
  selectedSystem,
  onChange,
  isLoading,
  allowCreate,
  isOptionDisabled,
  callbackCreatingNewSystem
}: Props): React.ReactElement => {
  const groupedOptions = [
    {
      label: 'New set',
      options: [{ custom: true }]
    },
    {
      label: 'Code systems',
      options: codeSystems
    },
    {
      label: 'Value sets',
      options: valueSets
    }
  ];

  const CustomOption = (props: any) => {
    return props.data.custom ? (
      <components.Option {...props}>
        <div
          onClick={(): void =>
            callbackCreatingNewSystem ? callbackCreatingNewSystem() : null
          }
        >
          <Icon icon="plus" />
          Create new code system
        </div>
      </components.Option>
    ) : (
      <components.Option {...props} />
    );
  };

  const filterOptions = (candidate: any, input: string): boolean => {
    if (input) {
      return (
        candidate.data.custom ||
        candidate.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    }
    return true;
  };

  const selectStyles = {
    menu: (base: any) => ({
      ...base,
      zIndex: 100
    })
  };

  return (
    <Select
      options={
        allowCreate ? groupedOptions : (groupedOptions.slice(1) as any[])
      }
      getOptionLabel={system => system.title}
      components={{ Option: CustomOption }}
      defaultInputValue={selectedSystem ? selectedSystem.title : undefined}
      onChange={(s: any) => onChange(s)}
      isLoading={isLoading}
      isClearable={true}
      isOptionDisabled={isOptionDisabled}
      filterOption={filterOptions}
      styles={selectStyles}
    />
  );
};

export default TerminologySelect;
