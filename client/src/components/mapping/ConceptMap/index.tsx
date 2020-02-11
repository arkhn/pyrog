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
}

const ConceptMap = ({ isOpen, onClose }: Props) => {
  const [selectedSourceSystem, setSelectedSourceSystem] = useState('');
  const [selectedTargetSystem, setSelectedTargetSystem] = useState('');
  const [nbRowInMap, setNbRowInMap] = useState(0);
  const [sourceCodes, setSourceCodes] = useState([] as string[]);
  const [targetCodes, setTargetCodes] = useState([] as string[]);

  const conceptMaps: ConceptMap[] = [{ source: 'system1', target: 'system2' }];

  const systems = [{ name: 'system1' }, { name: 'system2' }];

  const creatingNewCodeSystem = systems
    .map(s => s.name)
    .includes(selectedSourceSystem);

  const codesForSystem = ['code1', 'code2', 'code3'];
  const chooseSourceFields = () => {
    return [...Array(nbRowInMap).keys()].map(index => (
      <StringSelect
        key={index}
        icon={'numerical'}
        inputItem={sourceCodes[index]}
        items={codesForSystem}
        onChange={(code: string) =>
          setSourceCodes(prev => {
            prev[index] = code;
            return prev;
          })
        }
      />
    ));
  };
  const chooseTargetFields = () => {
    return [...Array(nbRowInMap).keys()].map(index => (
      <StringSelect
        key={index}
        icon={'numerical'}
        inputItem={targetCodes[index]}
        items={codesForSystem}
        onChange={(code: string) =>
          setTargetCodes(prev => {
            prev[index] = code;
            return prev;
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
    const elements = sourceCodes.reduce((acc: any[], code: string) => {
      return [...acc, { concept: { code } }];
    }, []);

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

  const onSubmit = async () => {
    if (creatingNewCodeSystem) {
      const codeSystem = createCodeSystem();
      try {
        await axios.post(`${FHIR_API_URL}/CodeSystem`, codeSystem);
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
      await axios.post(`${FHIR_API_URL}/ConceptMap`, conceptMap);
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
              <div className="button-with-margin">
                <CodeSystemSelect
                  // icon={'group-objects'}
                  // inputItem={'abc'}
                  systems={systems}
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
                  {selectedSourceSystem !== ''
                    ? creatingNewCodeSystem
                      ? chooseSourceFields()
                      : createSourceFields()
                    : null}
                </ButtonGroup>
              </div>
            </div>
            <div className="target">
              <h2>target</h2>
              <div className="button-with-margin">
                <CodeSystemSelect
                  // icon={'group-objects'}
                  // inputItem={'abc'}
                  systems={systems}
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
            </div>
          </div>
          <div>
            <ButtonGroup vertical={true}>
              {selectedTargetSystem !== '' ? chooseTargetFields() : null}
            </ButtonGroup>
          </div>
          <div className="center-text">
            {selectedTargetSystem !== '' && selectedSourceSystem !== '' ? (
              <Button
                fill={true}
                className="button-with-margin"
                text="add equivalence"
                onClick={() => setNbRowInMap(prev => prev + 1)}
              />
            ) : null}
          </div>
          <div className="align-right">
            <Button
              intent="primary"
              type="submit"
              text="Create concept map"
              disabled={
                selectedSourceSystem === '' || selectedTargetSystem === ''
              }
            />
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default ConceptMap;
