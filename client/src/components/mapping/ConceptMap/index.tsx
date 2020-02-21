import {
  Button,
  ButtonGroup,
  Dialog,
  FileInput,
  InputGroup
} from '@blueprintjs/core';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import axios from 'axios';
import { FHIR_API_URL } from '../../../constants';

import CodeSystemSelect from 'components/selects/codeSystemSelect';
import StringSelect from 'components/selects/stringSelect';
import { IReduxStore } from 'types';

import UploadCodeSystem from 'components/uploads/uploadCodeSystem';
import { validator } from 'components/uploads/validate';
import fhirSchema from 'components/uploads/uploadCodeSystem/CodeSystem.schema.json';

import './style.scss';

export interface CodeSystem {
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

interface Props {
  isOpen: boolean;
  onClose: (
    event?: React.SyntheticEvent<HTMLElement, Event> | undefined
  ) => void;
  updateInputCallback: (conceptMap: string) => void;
}

interface MapRow {
  source: string;
  equivalence: string;
  target: string;
}

const ConceptMapDialog = ({
  isOpen,
  onClose,
  updateInputCallback
}: Props): React.ReactElement => {
  const toaster = useSelector((state: IReduxStore) => state.toaster);

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
  const [sourceSystemTitle, setSourceSystemTitle] = useState('');
  const [selectedTargetSystem, setSelectedTargetSystem] = useState('');
  const [conceptMapTitle, setConceptMapTitle] = useState('');
  const [conceptMapDescription, setConceptMapDescription] = useState('');
  const [creatingNewCodeSystem, setCreatingNewCodeSystem] = useState(false);
  const [modifyAnyway, setModifyAnyway] = useState(false);

  useEffect(() => {
    // fetch code systems
    const fetchCodeSystems = async (): Promise<void> => {
      try {
        const codeSystems = await axios.get(`${FHIR_API_URL}/CodeSystem`);
        setExistingCodeSystems(codeSystems.data.items);
      } catch (err) {
        console.error(
          `Could not fecth code systems: ${
            err.response ? err.response.data : err.message
          }`
        );
      }
    };
    fetchCodeSystems();
    // fetch concept maps
    const fetchConceptMaps = async (): Promise<void> => {
      try {
        const conceptMaps = await axios.get(`${FHIR_API_URL}/ConceptMap`);
        setExistingConceptMaps(conceptMaps.data.items);
      } catch (err) {
        console.error(
          `Could not fecth concept maps: ${
            err.response ? err.response.data : err.message
          }`
        );
      }
    };
    fetchConceptMaps();
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
    system.title === sourceSystemTitle;

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

  const getCodesForCodeSystem = (systemTitle: string): string[] =>
    existingCodeSystems
      .find(s => s.title === systemTitle)
      ?.concept.map(c => c.code) || [];

  const selectSourceCodeSystem = (
    <CodeSystemSelect
      systems={existingCodeSystems}
      selectedSystem={sourceSystemTitle}
      itemDisabled={isSourceSystemDisabled}
      onChange={(s: string): void => {
        if (s !== sourceSystemTitle) {
          setSourceSystemTitle(s);
          resetMap();
        }
      }}
      onClear={(): void => {
        setSourceSystemTitle('');
        setCreatingNewCodeSystem(false);
        resetMap();
      }}
      allowCreate={true}
      callbackCreatingNewSystem={(): void => {
        resetMap();
        setSourceSystemTitle('');
        setCreatingNewCodeSystem(true);
      }}
    />
  );

  const enterNewCodeSystemName = (
    <div className="enter-code-name">
      <input
        className="text-input"
        placeholder="Enter name..."
        value={sourceSystemTitle}
        type="text"
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
          setSourceSystemTitle(e.target.value)
        }
      />
      <Button
        icon="cross"
        minimal={true}
        onClick={(): void => {
          setCreatingNewCodeSystem(false);
          setSourceSystemTitle('');
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

  const chooseCode = (
    index: number,
    column: 'source' | 'target' | 'equivalence'
  ): React.ReactElement => (
    <StringSelect
      key={index}
      inputItem={conceptMap[index][column]}
      items={
        column === 'equivalence'
          ? choiceEquivalences
          : getCodesForCodeSystem(
              column === 'source' ? sourceSystemTitle : selectedTargetSystem
            )
      }
      displayItem={displayCode}
      onChange={(code: string): void =>
        setConceptMap(prev => {
          prev[index][column] = code;
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
          : chooseCode(index, 'source')}
      </td>
      <td>{chooseCode(index, 'equivalence')}</td>
      <td>{chooseCode(index, 'target')}</td>
    </tr>
  );

  const createCodeSystem = () => {
    // TODO complete fhir code system (there are missing fields we could fill)
    const concepts = conceptMap.reduce((acc: any[], row: MapRow) => {
      return [...acc, { code: row.source }];
    }, []);

    return {
      name: sourceSystemTitle, // for computer
      title: sourceSystemTitle, // for human
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
      name: conceptMapTitle, // for computer
      title: conceptMapTitle, // for human
      description: conceptMapDescription,
      sourceUri: '', // value set uri
      targetUri: '', // value set uri
      group: [
        {
          source: sourceSystemTitle, // TODO make uri from that
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
        console.log('created', created);
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
    if (!!sourceSystemTitle && !!selectedTargetSystem)
      setConceptMapTitle(`${sourceSystemTitle} > ${selectedTargetSystem}`);

    // Use existing concept map if there is one
    let existingConceptMapGroup: Group | undefined;
    let existingConceptMap: ConceptMap | undefined;
    for (const map of existingConceptMaps) {
      for (const group of map.group) {
        if (
          group.source === sourceSystemTitle &&
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
      setConceptMapDescription(existingConceptMap.description);
    }
  }, [sourceSystemTitle, selectedTargetSystem]);

  return (
    <React.Fragment>
      <Dialog isOpen={isOpen} onClose={onClose}>
        <div className="main-div">
          <form onSubmit={onSubmit}>
            <div className="center-text">
              <h1>CONCEPT MAP</h1>
            </div>
            {!!selectedTargetSystem && !!sourceSystemTitle && metaData()}
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
              {!!selectedTargetSystem &&
              !!sourceSystemTitle &&
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
                    (!sourceSystemTitle ||
                      !selectedTargetSystem ||
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
