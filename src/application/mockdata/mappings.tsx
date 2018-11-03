import {IMapping} from '../types'

export const cw_patient_mapping: IMapping = {
    primaryKeyColumn: {
        owner: 'ISCF',
        table: 'PATIENT',
        column: 'NOPAT',
    },
    fhirMapping: {
        'name': {
            inputColumns: [
                {
                    owner: 'ISCF',
                    table: 'PATIENT',
                    column: 'PREPAT',
                    join: {
                        sourceColumn: 'INJOIN',
                        targetColumn: {
                            owner: 'ISCF',
                            table: 'TABLE',
                            column: 'COL1',
                        }
                    },
                    script: 'parsePrenom1.py'
                },
                {
                    owner: 'ISCF',
                    table: 'PATIENT',
                    column: 'FAKPAT',
                    script: 'parseCol.py'
                },
            ],
            mergingScript: 'mergingScript.py'
        },
    }
}
