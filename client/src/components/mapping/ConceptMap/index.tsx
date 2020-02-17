import { Button, ButtonGroup, Dialog, InputGroup } from '@blueprintjs/core';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import CodeSystemSelect from 'components/selects/codeSystemSelect';
import StringSelect from 'components/selects/stringSelect';
import { FHIR_API_URL } from '../../../constants';

import './style.scss';

interface Props {
  isOpen: boolean;
  onClose: (
    event?: React.SyntheticEvent<HTMLElement, Event> | undefined
  ) => void;
  updateInputCallback: (conceptMap: string) => void;
}

interface CodeSystem {
  title: string;
  name: string;
  concept: Concept[];
}

interface Concept {
  code: string;
}

interface ConceptMap {
  title: string;
  name: string;
  description: string;
  id: string;
  group: Group[];
}

interface Group {
  source: string;
  target: string;
  element: Element[];
}

interface Element {
  code: string;
  target: Target[];
}

interface Target {
  code: string;
  equivalence: string;
}

interface MapRow {
  source: string;
  equivalence: string;
  target: string;
}

const ConceptMap = ({ isOpen, onClose, updateInputCallback }: Props) => {
  const [existingCodeSystems, setExistingCodeSystems] = useState(
    [] as CodeSystem[]
  );
  const [existingConceptMaps, setExistingConceptMaps] = useState(
    [] as ConceptMap[]
  );
  const [conceptMap, setConceptMap] = useState([] as MapRow[]);
  const [existingConceptMapId, setExistingConceptMapId] = useState(
    undefined as string | undefined
  );
  const [sourceSystemName, setSourceSystemName] = useState('');
  const [selectedTargetSystem, setSelectedTargetSystem] = useState('');
  const [conceptMapTitle, setConceptMapTitle] = useState('');
  const [conceptMapName, setConceptMapName] = useState('');
  const [conceptMapDescription, setConceptMapDescription] = useState('');
  const [creatingNewCodeSystem, setCreatingNewCodeSystem] = useState(false);
  const [modifyAnyway, setModifyAnyway] = useState(false);

  useEffect(() => {
    // fetch code systems
    try {
      axios.get(`${FHIR_API_URL}/CodeSystem`).then(response => {
        setExistingCodeSystems(response.data.items);
      });
    } catch (err) {
      console.error(
        `Could not fecth code systems: ${
          err.response ? err.response.data : err.message
        }`
      );
    }
    // fetch concept maps
    try {
      axios.get(`${FHIR_API_URL}/ConceptMap`).then(response => {
        setExistingConceptMaps(response.data.items);
      });
    } catch (err) {
      console.error(
        `Could not fecth concept maps: ${
          err.response ? err.response.data : err.message
        }`
      );
    }
  }, []);

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

  const displayCode = (code: string): string => (code ? code : 'Select code');

  const isSourceSystemDisabled = (system: CodeSystem): boolean =>
    system.title === selectedTargetSystem;

  const isTargetSystemDisabled = (system: CodeSystem): boolean =>
    system.title === sourceSystemName;

  const emptyFields = conceptMap.some(
    row => !row.source || !row.equivalence || !row.target
  );

  const resetMap = (): void => {
    setConceptMap([]);
    setConceptMapName('');
    setConceptMapTitle('');
    setConceptMapDescription('');
    setModifyAnyway(false);
    setExistingConceptMapId(undefined);
  };

  const fetchCodesForCodeSystem = (systemName: string): string[] =>
    existingCodeSystems
      .find(s => s.title === systemName)
      ?.concept.map(c => c.code) || [];

  const selectSourceCodeSystem = (
    <CodeSystemSelect
      systems={existingCodeSystems}
      selectedSystem={sourceSystemName}
      itemDisabled={isSourceSystemDisabled}
      onChange={(s: string): void => {
        if (s !== sourceSystemName) {
          setSourceSystemName(s);
          resetMap();
        }
      }}
      onClear={(): void => {
        setSourceSystemName('');
        setCreatingNewCodeSystem(false);
        resetMap();
      }}
      allowCreate={true}
      callbackCreatingNewSystem={(): void => {
        resetMap();
        setSourceSystemName('');
        setCreatingNewCodeSystem(true);
      }}
    />
  );

  const enterNewCodeSystemName = (
    <div className="enter-code-name">
      <input
        className="text-input"
        placeholder="Enter name..."
        value={sourceSystemName}
        type="text"
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
          setSourceSystemName(e.target.value)
        }
      />
      <Button
        icon="cross"
        minimal={true}
        onClick={(): void => {
          setCreatingNewCodeSystem(false);
          setSourceSystemName('');
        }}
      />
    </div>
  );

  const selectTargetCodeSystem = (
    <CodeSystemSelect
      systems={existingCodeSystems}
      selectedSystem={selectedTargetSystem}
      itemDisabled={isTargetSystemDisabled}
      onChange={(s: string): void => {
        if (s !== selectedTargetSystem) {
          setSelectedTargetSystem(s);
          resetMap();
        }
      }}
      onClear={(): void => {
        setSelectedTargetSystem('');
        resetMap();
      }}
    />
  );

  const createSourceCode = (index: number) => (
    <input
      className="text-input"
      key={index}
      value={conceptMap[index].source}
      type="text"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setConceptMap(prev => {
          prev[index].source = e.target.value;
          return [...prev];
        })
      }
    />
  );

  const deleteRowButton = (index: number) => (
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

  const chooseSourceCode = (index: number) => (
    <StringSelect
      inputItem={conceptMap[index].source}
      items={fetchCodesForCodeSystem(sourceSystemName)}
      displayItem={displayCode}
      onChange={(code: string): void =>
        setConceptMap(prev => {
          prev[index].source = code;
          return [...prev];
        })
      }
    />
  );

  const chooseTargetCode = (index: number) => (
    <StringSelect
      key={index}
      inputItem={conceptMap[index].target}
      items={fetchCodesForCodeSystem(selectedTargetSystem)}
      displayItem={displayCode}
      onChange={(code: string): void =>
        setConceptMap(prev => {
          prev[index].target = code;
          return [...prev];
        })
      }
    />
  );

  const chooseEquivalence = (index: number) => (
    <StringSelect
      key={index}
      inputItem={conceptMap[index].equivalence}
      items={choiceEquivalences}
      displayItem={displayCode}
      onChange={(code: string): void =>
        setConceptMap(prev => {
          prev[index].equivalence = code;
          return [...prev];
        })
      }
    />
  );

  const displayConceptMap = () =>
    conceptMap.map((row, index) => (
      <tr key={index}>
        <td></td>
        <td>{row.source}</td>
        <td>{row.equivalence}</td>
        <td>{row.target}</td>
      </tr>
    ));

  const renderRows = (_row: MapRow, index: number) => (
    <tr key={index}>
      <td>{deleteRowButton(index)}</td>
      <td>
        {creatingNewCodeSystem
          ? createSourceCode(index)
          : chooseSourceCode(index)}
      </td>
      <td>{chooseEquivalence(index)}</td>
      <td>{chooseTargetCode(index)}</td>
    </tr>
  );

  const createCodeSystem = () => {
    // TODO complete fhir code system (there are missing fields we could fill)
    const concepts = conceptMap.reduce((acc: any[], row: MapRow) => {
      return [...acc, { code: row.source }];
    }, []);

    return {
      name: sourceSystemName, // for computer
      title: sourceSystemName, // for human
      concept: concepts
    };
  };

  const createConceptMap = () => {
    // TODO complete fhir concept map (there are missing fields we could fill)
    const elements = conceptMap.reduce(
      (acc: any[], row: MapRow) => [
        ...acc,
        {
          code: row.source,
          target: [{ code: row.target, equivalence: row.equivalence }]
        }
      ],
      []
    );

    return {
      name: conceptMapName, // for computer
      title: conceptMapTitle, // for human
      description: conceptMapDescription,
      sourceUri: '', // value set uri
      targetUri: '', // value set uri
      group: [
        {
          source: sourceSystemName, // TODO make uri from that
          target: selectedTargetSystem, // TODO make uri from that
          element: elements
        }
      ]
    };
  };

  const metaData = () => (
    <div className="meta-information">
      <div className="row">
        <h2 className="left">Title</h2>
        {!existingConceptMapId || modifyAnyway ? (
          <InputGroup
            className="right"
            onChange={(e: React.FormEvent<HTMLElement>): void => {
              const target = e.target as HTMLInputElement;
              setConceptMapTitle(target.value);
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
        <h2 className="left">Name</h2>
        {!existingConceptMapId || modifyAnyway ? (
          <InputGroup
            className="right"
            onChange={(e: React.FormEvent<HTMLElement>): void => {
              const target = e.target as HTMLInputElement;
              setConceptMapName(target.value);
            }}
            placeholder="Concept map name..."
            value={conceptMapName}
            small={true}
          />
        ) : (
          conceptMapName
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
    if (creatingNewCodeSystem) {
      const codeSystem = createCodeSystem();
      try {
        await axios.post(`${FHIR_API_URL}/CodeSystem`, codeSystem);
        console.log('created code system', codeSystem);
      } catch (err) {
        console.error(
          `Could not create CodeSystem: ${
            err.response ? err.response.data : err.message
          }`
        );
      }
    }
    if (!existingConceptMapId) {
      const conceptMap = createConceptMap();
      try {
        await axios.post(`${FHIR_API_URL}/ConceptMap`, conceptMap);
        console.log('created concept map', conceptMap);
      } catch (err) {
        console.error(
          `Could not create ConceptMap: ${
            err.response ? err.response.data : err.message
          }`
        );
      }
    } else if (modifyAnyway) {
      const conceptMap = createConceptMap();
      // TODO doesn't work
      try {
        await axios.put(
          `${FHIR_API_URL}/ConceptMap/${existingConceptMapId}`,
          conceptMap
        );
        console.log('updated concept map', conceptMap);
      } catch (err) {
        console.error(
          `Could not update ConceptMap: ${
            err.response ? err.response.data : err.message
          }`
        );
      }
    }
    updateInputCallback(conceptMapName);
  };

  useEffect(() => {
    let existingConceptMapGroup: Group | undefined = undefined;
    let existingConceptMap: ConceptMap | undefined = undefined;
    for (const map of existingConceptMaps) {
      for (const group of map.group) {
        if (
          group.source === sourceSystemName &&
          group.target === selectedTargetSystem
        ) {
          existingConceptMapGroup = group;
          break;
        }
      }
      if (existingConceptMapGroup) {
        existingConceptMap = map;
        break;
      }
    }
    if (existingConceptMap && existingConceptMapGroup) {
      setExistingConceptMapId(existingConceptMap.id);
      // TODO we currently only support one target because we don't understand
      // the multi target case.
      setConceptMap(
        existingConceptMapGroup.element.map(el => ({
          source: el.code,
          equivalence: el.target[0].equivalence,
          target: el.target[0].code
        }))
      );
      setConceptMapTitle(existingConceptMap.title);
      setConceptMapName(existingConceptMap.name);
      setConceptMapDescription(existingConceptMap.description);
    }
    console.log(existingConceptMaps);
    console.log(existingConceptMap);
  }, [sourceSystemName, selectedTargetSystem]);

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="main-div">
        <form onSubmit={onSubmit}>
          <div className="center-text">
            <h1>CONCEPT MAP</h1>
            <p> Explanation about concept maps. </p>
          </div>
          {selectedTargetSystem !== '' && sourceSystemName !== '' && metaData()}
          <table className="bp3-html-table">
            <thead>
              <tr>
                <th className="head-col"></th>
                <th className="source-col">
                  Source{':  '}
                  {creatingNewCodeSystem
                    ? enterNewCodeSystemName
                    : selectSourceCodeSystem}
                </th>
                <th className="equivalence-col">Equivalence</th>
                <th className="target-col">
                  Target{':  '}
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
            {selectedTargetSystem !== '' &&
            sourceSystemName !== '' &&
            (!existingConceptMapId || modifyAnyway) ? (
              <Button
                className="add-element-button"
                fill={true}
                text="add element"
                onClick={() => setConceptMap(prev => [...prev, {} as MapRow])}
              />
            ) : null}
          </div>
          <div className="align-right">
            <ButtonGroup vertical={true}>
              {/* TODO display only if user is admin
              TODO better place for this */}
              {existingConceptMapId ? (
                <Button
                  intent="danger"
                  text={'Modify concept map'}
                  onClick={(): void => setModifyAnyway(true)}
                  disabled={modifyAnyway}
                />
              ) : null}
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
                  (sourceSystemName === '' ||
                    selectedTargetSystem === '' ||
                    emptyFields ||
                    conceptMap.length < 1)
                }
              />
            </ButtonGroup>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default ConceptMap;
