import {IMapping} from '../types'

export const cw_patient_mapping: IMapping = {
    pathToPrimaryKey: {
        owner: 'ISCF',
        table: 'PATIENT',
        column: 'PKPAT',
    },
    fhirMapping: {
        'Name.FirstName': {
            [Symbol.iterator]: function* () {
                let properties = Object.keys(this);
                for (let i of properties) {
                    yield [i, this[i]];
                }
            },
            inputColumns: [
                {
                    owner: 'ISCF',
                    table: 'PATIENT',
                    column: 'PREPAT',
                    join: null,
                    script: 'parsePrenom.py'
                },
            ]
        },
        'name': {
            [Symbol.iterator]: function* () {
                let properties = Object.keys(this);
                for (let i of properties) {
                    yield [i, this[i]];
                }
            },
            inputColumns: [
                {
                    owner: 'ISCF',
                    table: 'PATIENT',
                    column: 'FAKPAT',
                    join: {
                        sourceColumn: 'INJOIN',
                        targetColumn: {
                            owner: 'ISCF',
                            table: 'TABLE',
                            column: 'COL1',
                        }
                    },
                    script: 'parsePrenom.py'
                },
                {
                    owner: 'ISCF',
                    table: 'PATIENT',
                    column: 'FAK2PAT',
                    join: {
                        sourceColumn: 'IN2JOIN',
                        targetColumn: {
                            owner: 'ISCF',
                            table: 'TABLE',
                            column: 'COL2',
                        }
                    },
                    script: 'parsePrenom.py'
                },
            ],
            mergingScript: 'mergingScript.py'
        },
    }
}
