import Ajv from 'ajv';
import fhirSchema from './StructureDefinition.schema.json';

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
export const validate = ajv.compile(fhirSchema);
