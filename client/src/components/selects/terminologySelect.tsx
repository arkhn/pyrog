import { Icon } from '@blueprintjs/core';
import React from 'react';
import Select, { components } from 'react-select';

interface Terminology {
  title: string;
  valueSetUrl: string;
  codes: Code[];
}

interface Code {
  value: string;
  system?: string;
}

interface Props {
  codeSystems: Terminology[];
  valueSets: Terminology[];
  selectedSystem: Terminology;
  onChange: Function;
  allowCreate?: boolean;
  isOptionDisabled?: (item: Terminology) => boolean;
  callbackCreatingNewSystem?: Function;
}

const TerminologySelect = ({
  codeSystems,
  valueSets,
  selectedSystem,
  onChange,
  isOptionDisabled,
  callbackCreatingNewSystem,
  allowCreate
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
      components={{ Option: CustomOption }}
      isClearable={true}
      defaultInputValue={selectedSystem ? selectedSystem.title : undefined}
      styles={selectStyles}
      onChange={(s: any) => onChange(s)}
      isOptionDisabled={isOptionDisabled}
      options={
        allowCreate ? groupedOptions : (groupedOptions.slice(1) as any[])
      }
      filterOption={filterOptions}
      getOptionLabel={system => system.title}
    />
  );
};

export default TerminologySelect;
