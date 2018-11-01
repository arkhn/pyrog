// Taken from fhir-store
export const patientJson: any = `{
    "resourceType" : "Patient",
    "identifier<list::Identifier>": null,
    "active<boolean>": null,
    "name<list::HumanName>": null,
    "telecom<list::ContactPoint>": null,
    "gender<code=male|female|other|unknown>": null,
    "birthDate<date>": null,
    "deceasedBoolean<boolean>": null,
    "deceasedDateTime<dateTime>": null,
    "address<list::Address>": null,
    "maritalStatus<CodeableConcept>": null,
    "multipleBirthBoolean<boolean>": null,
    "multipleBirthInteger<integer>": null,
    "photo<list::Attachment>": null,
    "contact<list>": [{
        "relationship<list::CodeableConcept>": null,
        "name<HumanName>": null,
        "telecom<list::ContactPoint>": null,
        "address<Address>": null,
        "gender<code=male|female|other|unknown>": null,
        "organization<Reference(Organization)>": null,
        "period<Period>": null
    }],
    "animal" : {
    "species<CodeableConcept>": null,
    "breed<CodeableConcept>": null,
    "genderStatus<CodeableConcept>": null
    },
    "communication<list>": [{
        "language<CodeableConcept>": null,
        "preferred<boolean>": null
    }],
    "generalPractitioner<list::Reference(Organization|Practitioner)>": null,
    "managingOrganization<Reference(Organization)>": null,
    "link<list>": [{
        "other<Reference(Patient|RelatedPerson)>": null,
        "type<code=replaced-by|replaces|refer|seealso>": null
    }]
}`
