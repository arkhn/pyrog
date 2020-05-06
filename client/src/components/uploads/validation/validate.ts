import Ajv from 'ajv';

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
export const validator = (fhirSchema: any) => ajv.compile(fhirSchema);
