import {IMapping} from '../types'

export const cw_patient_mapping: IMapping = {
    pathToPrimaryKey: {
        owner: 'ISCF',
        table: 'PATIENT',
        column: 'NOPAT',
    },
    fhirMapping: {
        'Name.FirstName': {
            inputColumns: [
                {
                    owner: 'ISCF',
                    table: 'PATIENT',
                    column: 'PREPAT',
                    join: null,
                    script: 'parsePrenom.py'
                }

            ]
        },
        'name': {
            inputColumns: [
                {
                    owner: 'ISCF',
                    table: 'PATIENT',
                    column: 'PREPAT',
                    join: null,
                    script: 'parsePrenom.py'
                }

            ]
        },
    }
}
