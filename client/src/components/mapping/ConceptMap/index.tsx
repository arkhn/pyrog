import {
  Button,
  ButtonGroup,
  Classes,
  Dialog,
  MenuItem,
  Overlay
} from '@blueprintjs/core';
import { ItemPredicate, MultiSelect, Select } from '@blueprintjs/select';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import axios from 'axios';

import { loader } from 'graphql.macro';

import Navbar from 'components/navbar';
import { IReduxStore } from 'types';

import CodeSystemSelect from 'components/selects/codeSystemSelect';
import StringSelect from 'components/selects/stringSelect';
import { FHIR_API_URL } from '../../../constants';

import './style.scss';

interface Props {
  isOpen: boolean;
  onClose: (
    event?: React.SyntheticEvent<HTMLElement, Event> | undefined
  ) => void;
}

interface ConceptMap {
  source: string;
  target: string;
  equivalences: string[][];
}

const ConceptMap = ({ isOpen, onClose }: Props) => {
  const [selectedSourceSystem, setSelectedSourceSystem] = useState('');
  const [selectedTargetSystem, setSelectedTargetSystem] = useState('');
  const [nbRowInMap, setNbRowInMap] = useState(0);
  const [sourceCodes, setSourceCodes] = useState([] as string[]);
  const [targetCodes, setTargetCodes] = useState([] as string[]);

  // TODO queries instead of these mock data
  const conceptMaps: ConceptMap[] = [
    {
      source: 'system1',
      target: 'system2',
      equivalences: [
        ['0', 'male'],
        ['1', 'female'],
        ['null', 'unknown']
      ]
    }
  ];
  const codeSystems = [{ name: 'system1' }, { name: 'system2' }];

  const creatingNewCodeSystem = codeSystems
    .map(s => s.name)
    .includes(selectedSourceSystem);

  const conceptMapExists = conceptMaps.some(
    m => m.source === selectedSourceSystem && m.target === selectedTargetSystem
  );

  const codesForSystem = ['code1', 'code2', 'code3'];

  const displayCode = (code: string) => (code ? code : 'Select code');

  const chooseSourceFields = () => {
    return [...Array(nbRowInMap).keys()].map(index => (
      <StringSelect
        key={index}
        inputItem={sourceCodes[index]}
        items={codesForSystem}
        displayItem={displayCode}
        onChange={(code: string): void =>
          setSourceCodes(prev => {
            prev[index] = code;
            return [...prev];
          })
        }
      />
    ));
  };
  const chooseTargetFields = () => {
    return [...Array(nbRowInMap).keys()].map(index => (
      <StringSelect
        key={index}
        inputItem={targetCodes[index]}
        items={codesForSystem}
        displayItem={displayCode}
        onChange={(code: string): void =>
          setTargetCodes(prev => {
            prev[index] = code;
            return [...prev];
          })
        }
      />
    ));
  };
  const createSourceFields = () => {
    return [...Array(nbRowInMap).keys()].map(index => (
      <input className="text-input" key={index} type="text" />
    ));
  };
  const displayConceptMap = (side: 'source' | 'target') => {
    const conceptMap = conceptMaps.find(
      m =>
        m.source === selectedSourceSystem && m.target === selectedTargetSystem
    );
    if (side === 'source') {
      return conceptMap?.equivalences.map((eq, index) => (
        <input className="text-input" key={index} value={eq[0]} />
      ));
    } else if (side === 'target') {
      return conceptMap?.equivalences.map((eq, index) => (
        <input className="text-input" key={index} value={eq[1]} />
      ));
    }
  };

  const resetSourceCodes = () => {
    setSourceCodes([]);
    setNbRowInMap(0);
  };
  const resetTargetCodes = () => {
    setTargetCodes([]);
    setNbRowInMap(0);
  };

  const createCodeSystem = () => {
    // TODO complete fhir code system (there are missing fields we could fill)
    const concepts = sourceCodes.reduce((acc: any[], code: string) => {
      return [...acc, { code }];
    }, []);

    return {
      name: '', // for computer
      title: '', // for human
      concept: concepts
    };
  };

  const createConceptMap = () => {
    // TODO complete fhir concept map (there are missing fields we could fill)
    const elements = sourceCodes.reduce(
      (acc: any[], code: string, index: number) => {
        return [...acc, { code, target: [{ code: targetCodes[index] }] }];
      },
      []
    );

    return {
      sourceUri: '', // value set uri
      targetUri: '', // value set uri
      group: [
        {
          source: '', // code system urisss
          target: '', // code system uri
          element: elements
        }
      ]
    };
  };

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (creatingNewCodeSystem) {
      const codeSystem = createCodeSystem();
      try {
        // await axios.post(`${FHIR_API_URL}/CodeSystem`, codeSystem);
        console.log('create code system', codeSystem);
      } catch (err) {
        console.error(
          `Could not create CodeSystem: ${
            err.response ? err.response.data : err.message
          }`
        );
      }
    }
    const conceptMap = createConceptMap();
    try {
      // await axios.post(`${FHIR_API_URL}/ConceptMap`, conceptMap);
      console.log('create concept map', conceptMap);
    } catch (err) {
      console.error(
        `Could not create ConceptMap: ${
          err.response ? err.response.data : err.message
        }`
      );
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="main-div">
        <form onSubmit={onSubmit}>
          <div className="center-text">
            <h1>CONCEPT MAPS</h1>
            <p> Explanation about concept maps. </p>
          </div>
          <div>
            <div className="source">
              <h2>source</h2>
              <div className="div-with-margin">
                <CodeSystemSelect
                  systems={codeSystems}
                  selectedSystem={selectedSourceSystem}
                  onChange={(s: string): void => {
                    setSelectedSourceSystem(s);
                    resetSourceCodes();
                  }}
                  onClear={(): void => {
                    setSelectedSourceSystem('');
                    resetSourceCodes();
                  }}
                  allowCreate={true}
                />
              </div>
              <div>
                <ButtonGroup vertical={true}>
                  {conceptMapExists
                    ? displayConceptMap('source')
                    : selectedSourceSystem !== ''
                    ? creatingNewCodeSystem
                      ? chooseSourceFields()
                      : createSourceFields()
                    : null}
                </ButtonGroup>
              </div>
            </div>
            <div className="center-text">
              <h2>target</h2>
              <div className="div-with-margin">
                <CodeSystemSelect
                  systems={codeSystems}
                  selectedSystem={selectedTargetSystem}
                  onChange={(s: string): void => {
                    setSelectedTargetSystem(s);
                    resetTargetCodes();
                  }}
                  onClear={(): void => {
                    setSelectedTargetSystem('');
                    resetTargetCodes();
                  }}
                />
              </div>
              <div>
                <ButtonGroup vertical={true}>
                  {conceptMapExists
                    ? displayConceptMap('target')
                    : selectedTargetSystem !== ''
                    ? chooseTargetFields()
                    : null}
                </ButtonGroup>
              </div>
            </div>
          </div>
          <div className="center-text">
            {selectedTargetSystem !== '' &&
            selectedSourceSystem !== '' &&
            !conceptMapExists ? (
              <Button
                fill={true}
                className="button-with-margin"
                text="add equivalence"
                onClick={() => setNbRowInMap(prev => prev + 1)}
              />
            ) : null}
          </div>
          <div className="align-right button-with-margin">
            <Button
              intent="primary"
              type="submit"
              text="Create concept map"
              disabled={
                selectedSourceSystem === '' ||
                selectedTargetSystem === '' ||
                nbRowInMap < 1
              }
            />
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default ConceptMap;
