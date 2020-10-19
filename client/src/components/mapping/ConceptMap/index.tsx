import { Button, ButtonGroup, Dialog, InputGroup } from '@blueprintjs/core';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import axios from 'axios';
import { FHIR_API_URL } from '../../../constants';

import TerminologySelect from 'components/selects/terminologySelect';
import CodeSelect from 'components/selects/codeSelect';
import StringSelect from 'components/selects/stringSelect';
import {
  Code,
  CodeSystem,
  ConceptMap,
  Group,
  IReduxStore,
  Terminology
} from 'types';

import UploadCodeSystem from 'components/uploads/uploadCodeSystem';

import './style.scss';

interface MapRow {
  source?: Code;
  equivalence?: string;
  target?: Code;
}

interface Props {
  isOpen: boolean;
  onClose: (
    event?: React.SyntheticEvent<HTMLElement, Event> | undefined
  ) => void;
  updateInputCallback: (conceptMap: string) => void;
  currentConceptMap: undefined | ConceptMap;
}

const ConceptMapDialog = ({
  isOpen,
  onClose,
  updateInputCallback,
  currentConceptMap
}: Props): React.ReactElement => {
  const toaster = useSelector((state: IReduxStore) => state.toaster);

  const [existingCodeSystems, setExistingCodeSystems] = useState(
    [] as Terminology[]
  );
  const [existingValueSets, setExistingValueSets] = useState(
    [] as Terminology[]
  );
  const [existingConceptMaps, setExistingConceptMaps] = useState(
    [] as ConceptMap[]
  );
  const [conceptMap, setConceptMap] = useState([] as MapRow[]);
  const [existingConceptMapId, setExistingConceptMapId] = useState(
    undefined as string | undefined
  );
  const [sourceTerminology, setSourceTerminology] = useState(
    undefined as Terminology | undefined
  );
  const [targetTerminology, setTargetTerminology] = useState(
    undefined as Terminology | undefined
  );
  const [newTerminologyName, setNewTerminologyName] = useState('');
  const [conceptMapTitle, setConceptMapTitle] = useState('');
  const [conceptMapDescription, setConceptMapDescription] = useState('');
  const [creatingNewTerminology, setCreatingNewSet] = useState(false);
  const [modifyAnyway, setModifyAnyway] = useState(false);
  const [isLoadingCodeSystems, setIsLoadingCodeSystems] = useState(false);
  const [isLoadingValueSets, setIsLoadingValueSets] = useState(false);

  const hasSelectedSource = !!sourceTerminology || !!newTerminologyName;
  const newTerminologyValueSetUrl = `http://terminology.arkhn.org/ValueSet/${newTerminologyName}`;
  const newTerminologyCodeSystemUrl = `http://terminology.arkhn.org/CodeSystem/${newTerminologyName}`;

  const fetchCodeSystems = async (): Promise<void> => {
    // Fetch code systems and turns them to custom Terminology interface
    setIsLoadingCodeSystems(true);
    try {
      const codeSystems = await axios.get(
        `${FHIR_API_URL}/CodeSystem?_count=1000`
      );
      setExistingCodeSystems(
        codeSystems.data.entry.map(({ resource }: any) => ({
          title: resource.title,
          valueSetUrl: resource.valueSet,
          type: 'CodeSystem',
          codes: resource.concept
            ? resource.concept.map((concept: any) => ({
                value: concept.code,
                system: resource.url
              }))
            : []
        }))
      );
    } catch (err) {
      console.error(
        `Could not fetch code systems: ${
          err.response ? err.response.data : err.message
        }`
      );
    }
    setIsLoadingCodeSystems(false);
  };

  const fetchValueSets = async (): Promise<void> => {
    // Fetch value sets and turns them to custom Terminology interface
    setIsLoadingValueSets(true);
    try {
      const valueSets = await axios.get(`${FHIR_API_URL}/ValueSet?_count=1000`);

      const getConceptCodes = (element: any) =>
        element.concept
          ? element.concept.map((c: any) => ({
              value: c.code,
              system: element.system
            }))
          : [];

      const reducer = (acc: string[], element: any) => [
        ...acc,
        ...getConceptCodes(element)
      ];

      const composeCodes = (resource: any) =>
        resource.compose ? resource.compose.include.reduce(reducer, []) : [];

      const expansionCodes = (resource: any) =>
        resource.expansion
          ? resource.expansion.contains.map((el: any) => ({
              value: el.code,
              system: el.system
            }))
          : [];

      setExistingValueSets(
        valueSets.data.entry.map(({ resource }: any) => ({
          title: resource.title || resource.name,
          url: resource.url,
          valueSetUrl: resource.url,
          type: 'ValueSet',
          codes: [...composeCodes(resource), ...expansionCodes(resource)]
        }))
      );
    } catch (err) {
      console.error(
        `Could not fetch value sets: ${
          err.response ? err.response.data : err.message
        }`
      );
    }
    setIsLoadingValueSets(false);
  };

  const fetchConceptMaps = async (): Promise<void> => {
    // Fetch concept maps
    try {
      const response = await axios.get(`${FHIR_API_URL}/ConceptMap`);
      const conceptMaps = response.data?.entry.map(
        ({ resource }: any) => resource
      );
      if (conceptMaps) setExistingConceptMaps(conceptMaps);
    } catch (err) {
      console.error(
        `Could not fetch concept maps: ${
          err.response ? err.response.data : err.message
        }`
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCodeSystems();
      fetchValueSets();
      fetchConceptMaps();
    }
  }, [isOpen]);

  // TODO these are actually codes from a code system. Fetch them instead of hard coding them
  const choiceEquivalences = [
    'relatedto',
    'equivalent',
    'equal',
    'wider',
    'subsumes',
    'narrower',
    'specializes',
    'inexact',
    'unmatched',
    'disjoint'
  ];

  const areFieldsEmpty = conceptMap.some(
    row => !row.source || !row.equivalence || !row.target
  );

  const resetMap = (): void => {
    setConceptMap([]);
    setConceptMapTitle('');
    setConceptMapDescription('');
    setModifyAnyway(false);
    setExistingConceptMapId(undefined);
  };

  const selectSourceCodeSystem = (
    <TerminologySelect
      codeSystems={existingCodeSystems}
      valueSets={existingValueSets}
      selectedSystem={sourceTerminology as any}
      disabledOptions={[targetTerminology]}
      isLoading={isLoadingCodeSystems || isLoadingValueSets}
      onChange={(option: any): void => {
        if (option && !option.custom) setSourceTerminology(option);
        resetMap();
      }}
      allowCreate={true}
      callbackCreatingNewSystem={(): void => {
        resetMap();
        setSourceTerminology(undefined);
        setNewTerminologyName('');
        setCreatingNewSet(true);
      }}
    />
  );

  const selectTargetCodeSystem = (
    <TerminologySelect
      codeSystems={existingCodeSystems}
      valueSets={existingValueSets}
      selectedSystem={targetTerminology as any}
      disabledOptions={[sourceTerminology]}
      isLoading={isLoadingCodeSystems || isLoadingValueSets}
      onChange={(terminology: Terminology): void => {
        setTargetTerminology(terminology);
        resetMap();
      }}
    />
  );

  const enterNewCodeSystemName = (
    <div className="enter-code-name">
      <input
        className="text-input"
        placeholder="Enter name..."
        value={newTerminologyName}
        type="text"
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
          setNewTerminologyName(e.target.value)
        }
      />
      <Button
        icon="cross"
        minimal={true}
        onClick={(): void => {
          setCreatingNewSet(false);
          setNewTerminologyName('');
        }}
      />
    </div>
  );

  const deleteRowButton = (index: number): React.ReactElement => (
    <Button
      icon="trash"
      minimal={true}
      onClick={(): void => {
        setConceptMap(prev => {
          prev.splice(index, 1);
          return [...prev];
        });
      }}
    />
  );

  const chooseEquivalence = (index: number): React.ReactElement => (
    <StringSelect
      key={index}
      inputItem={conceptMap[index]['equivalence'] || 'Select equivalence'}
      items={choiceEquivalences}
      onChange={(code: string): void =>
        setConceptMap(prev => {
          prev[index]['equivalence'] = code;
          return [...prev];
        })
      }
    />
  );

  const chooseCode = (
    index: number,
    column: 'source' | 'target'
  ): React.ReactElement => (
    <CodeSelect
      key={index}
      selectedCode={conceptMap[index][column]}
      terminology={
        column === 'source' ? sourceTerminology! : targetTerminology!
      }
      allowCreate={
        column === 'source'
          ? sourceTerminology?.type === 'ValueSet'
          : targetTerminology?.type === 'ValueSet'
      }
      onChange={(code: Code): void =>
        setConceptMap(prev => {
          prev[index][column] = { ...prev[index][column], ...code };
          return [...prev];
        })
      }
      onClear={(): void =>
        setConceptMap(prev => {
          prev[index][column] = undefined;
          return [...prev];
        })
      }
    />
  );

  const createCode = (
    index: number,
    column: 'source' | 'target'
  ): React.ReactElement => (
    <input
      className="text-input"
      key={index}
      value={conceptMap[index][column]?.value}
      type="text"
      placeholder="source code..."
      onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
        setConceptMap(prev => {
          prev[index][column] = {
            value: e.target.value,
            system: newTerminologyCodeSystemUrl
          };
          return [...prev];
        })
      }
    />
  );

  const insertCode = (
    index: number,
    column: 'source' | 'target',
    mode: 'choose' | 'create'
  ): React.ReactElement =>
    mode === 'choose' ? chooseCode(index, column) : createCode(index, column);

  const displayConceptMap = (): React.ReactElement[] =>
    conceptMap.map((row, index) => (
      <tr key={index}>
        <td />
        <td>{row.source?.value}</td>
        <td>{row.equivalence}</td>
        <td>{row.target?.value}</td>
      </tr>
    ));

  const renderRows = (_row: MapRow, index: number): React.ReactElement => (
    <tr key={index}>
      <td>{deleteRowButton(index)}</td>
      <td>
        {insertCode(
          index,
          'source',
          creatingNewTerminology ? 'create' : 'choose'
        )}
      </td>
      <td>{chooseEquivalence(index)}</td>
      <td>{chooseCode(index, 'target')}</td>
    </tr>
  );

  const createCodeSystem = (): CodeSystem => {
    // TODO complete fhir code system (there are missing fields we could fill)
    const concepts = conceptMap.reduce((acc: any[], row: MapRow) => {
      return [...acc, { code: row.source!.value }];
    }, []);

    return {
      name: newTerminologyName,
      title: newTerminologyName,
      status: 'active',
      url: newTerminologyCodeSystemUrl,
      valueSet: newTerminologyValueSetUrl,
      concept: concepts
    };
  };

  const createConceptMap = (): ConceptMap => {
    let groups: any[] = [];
    for (const row of conceptMap) {
      const newElement = {
        code: row.source?.value,
        target: [{ code: row.target?.value, equivalence: row.equivalence }]
      };
      const ind = groups.findIndex(
        el =>
          el.source === row.source?.system && el.target === row.target?.system
      );
      if (ind === -1) {
        groups = [
          ...groups,
          {
            source: row.source?.system,
            target: row.target?.system,
            element: [newElement]
          }
        ];
      } else {
        groups[ind].element = [...groups[ind].element, newElement];
      }
    }

    return {
      resourceType: 'ConceptMap',
      name: conceptMapTitle,
      title: conceptMapTitle,
      status: 'active',
      ...(conceptMapDescription && { description: conceptMapDescription }),
      sourceUri: sourceTerminology
        ? sourceTerminology.valueSetUrl
        : newTerminologyValueSetUrl,
      targetUri: targetTerminology!.valueSetUrl,
      group: groups
    };
  };

  const metaData = (): React.ReactElement => (
    <div className="meta-information">
      <div className="row">
        <h2 className="left">Title</h2>
        {!existingConceptMapId || modifyAnyway ? (
          <InputGroup
            className="right"
            onChange={(e: React.FormEvent<HTMLElement>): void => {
              const target = e.target as HTMLInputElement;
              if (/^\S*$/.test(target.value)) {
                setConceptMapTitle(target.value);
              }
            }}
            placeholder="Concept map title..."
            value={conceptMapTitle}
            small={true}
          />
        ) : (
          conceptMapTitle
        )}
      </div>
      <div className="row">
        <h2 className="left">Description</h2>
        {!existingConceptMapId || modifyAnyway ? (
          <InputGroup
            className="right"
            onChange={(e: React.FormEvent<HTMLElement>): void => {
              const target = e.target as HTMLInputElement;
              setConceptMapDescription(target.value);
            }}
            placeholder="Concept map description..."
            value={conceptMapDescription}
            small={true}
          />
        ) : (
          conceptMapDescription
        )}
      </div>
    </div>
  );

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (creatingNewTerminology) {
      const codeSystem = createCodeSystem();
      try {
        await axios.post(`${FHIR_API_URL}/CodeSystem`, codeSystem);
      } catch (err) {
        toaster.show({
          message: `Could not create CodeSystem: ${
            err.response ? err.response.data : err.message
          }`,
          intent: 'danger',
          icon: 'warning-sign',
          timeout: 5000
        });
      }
    }
    let createdConceptMapId = '';
    if (!existingConceptMapId) {
      const conceptMap = createConceptMap();
      try {
        const created = await axios.post(
          `${FHIR_API_URL}/ConceptMap`,
          conceptMap
        );
        createdConceptMapId = created.data.id;
      } catch (err) {
        toaster.show({
          message: `Could not create ConceptMap: ${
            err.response ? err.response.data : err.message
          }`,
          intent: 'danger',
          icon: 'warning-sign',
          timeout: 5000
        });
      }
    } else if (modifyAnyway) {
      const conceptMap = createConceptMap();
      try {
        await axios.put(
          `${FHIR_API_URL}/ConceptMap/${existingConceptMapId}`,
          conceptMap
        );
      } catch (err) {
        toaster.show({
          message: `Could not update ConceptMap: ${
            err.response ? err.response.data : err.message
          }`,
          intent: 'danger',
          icon: 'warning-sign',
          timeout: 5000
        });
      }
    }
    updateInputCallback(existingConceptMapId || createdConceptMapId);
  };

  useEffect(() => {
    // Set default concept map title
    if (hasSelectedSource && !!targetTerminology)
      setConceptMapTitle(
        `${sourceTerminology ? sourceTerminology.title : newTerminologyName}>${
          targetTerminology.title
        }`.replace(/\s/g, '')
      );
    if (currentConceptMap) setConceptMapTitle(currentConceptMap.title);
    // Use existing concept map if there is one
    const existingConceptMap =
      currentConceptMap ||
      existingConceptMaps.find(
        map =>
          map.sourceUri === sourceTerminology?.valueSetUrl &&
          map.targetUri === targetTerminology?.valueSetUrl
      );
    if (existingConceptMap) {
      setExistingConceptMapId(existingConceptMap.id);
      // TODO we currently only support one target because we don't understand
      // the multi target case.
      const reducer = (acc: MapRow[], group: Group): MapRow[] => [
        ...acc,
        ...group.element.map(el => ({
          source: { value: el.code, system: group.source },
          equivalence: el.target[0].equivalence,
          target: {
            value: el.target[0].code,
            system: group.target
          }
        }))
      ];
      console.log(existingConceptMap);
      setConceptMap(existingConceptMap.group.reduce(reducer, []));
      setConceptMapTitle(existingConceptMap.title);
      setConceptMapDescription(existingConceptMap.description || '');
    }
  }, [
    hasSelectedSource,
    sourceTerminology,
    newTerminologyName,
    targetTerminology,
    existingConceptMaps,
    currentConceptMap
  ]);

  useEffect(() => {
    if (
      currentConceptMap &&
      existingCodeSystems.length > 0 &&
      existingValueSets.length > 0
    ) {
      const source =
        existingCodeSystems.find(
          codeSystem => currentConceptMap.sourceUri === codeSystem.valueSetUrl
        ) ||
        existingValueSets.find(
          valueSet => currentConceptMap.sourceUri === valueSet.valueSetUrl
        );
      const target =
        existingCodeSystems.find(
          codeSystem => currentConceptMap.targetUri === codeSystem.valueSetUrl
        ) ||
        existingValueSets.find(
          valueSet => currentConceptMap.targetUri === valueSet.valueSetUrl
        );
      if (source) setSourceTerminology(source);
      if (target) setTargetTerminology(target);
    }
  }, [existingCodeSystems, existingValueSets, currentConceptMap]);

  return (
    <React.Fragment>
      <Dialog isOpen={isOpen} onClose={onClose}>
        <div className="main-div">
          <form onSubmit={onSubmit}>
            <div className="center-text">
              <h1>CONCEPT MAP</h1>
            </div>
            {hasSelectedSource && !!targetTerminology && metaData()}
            <table className="bp3-html-table">
              <thead>
                <tr>
                  <th className="head-col" />
                  <th className="source-col">
                    {'Source'}
                    {creatingNewTerminology
                      ? enterNewCodeSystemName
                      : selectSourceCodeSystem}
                  </th>
                  <th className="equivalence-col">Equivalence</th>
                  <th className="target-col">
                    {'Target'}
                    {selectTargetCodeSystem}
                  </th>
                </tr>
              </thead>
              <tbody>
                {!!existingConceptMapId && !modifyAnyway
                  ? displayConceptMap()
                  : conceptMap.map(renderRows)}
              </tbody>
            </table>
            <div className="center-text">
              {hasSelectedSource &&
              !!targetTerminology &&
              (!existingConceptMapId || modifyAnyway) ? (
                <Button
                  className="add-element-button"
                  fill={true}
                  text="add element"
                  onClick={(): void =>
                    setConceptMap(prev => [...prev, {} as MapRow])
                  }
                />
              ) : null}
            </div>
            <div className="align-right">
              <ButtonGroup vertical={true}>
                {/* TODO display only if user is admin
              TODO better place for this */}
                {existingConceptMapId && (
                  <Button
                    intent="danger"
                    text={'Modify concept map'}
                    onClick={(): void => setModifyAnyway(true)}
                    disabled={modifyAnyway}
                  />
                )}
                <Button
                  intent="primary"
                  type="submit"
                  text={
                    existingConceptMapId
                      ? 'Choose concept map'
                      : 'Create concept map'
                  }
                  disabled={
                    !existingConceptMapId &&
                    (!hasSelectedSource ||
                      !targetTerminology ||
                      areFieldsEmpty ||
                      conceptMap.length < 1)
                  }
                />
              </ButtonGroup>
            </div>
          </form>
          {/* TODO Better place for this button */}
          <h3>Upload new code system</h3>
          <UploadCodeSystem />
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default ConceptMapDialog;
