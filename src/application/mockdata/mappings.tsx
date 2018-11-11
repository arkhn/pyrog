import {IMapping} from '../types'

export const cw_patient_mapping: IMapping = {
    primaryKeyColumn: {
        owner: 'ICSF',
        table: 'PATIENT',
        column: 'NOPAT',
    },
    fhirMapping: {
        'name': {
            inputColumns: [
                {
                    owner: 'ICSF',
                    table: 'PATIENT',
                    column: 'PREPAT',
                    script: 'parsePrenom1.py'
                },
            ],
            mergingScript: 'mergingScript.py',
        },
    }
}
