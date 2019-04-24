// Import custom types
import { ISimpleAction } from "../../types";
import { IMappingExplorerState } from "./index";

export const availableResourceNames = [
  {
    type: "Clinical",
    subtype: "Medication & Immunization",
    name: "Immunization"
  },
  {
    type: "Clinical",
    subtype: "Medication & Immunization",
    name: "MedicationAdministration"
  },
  {
    type: "Clinical",
    subtype: "Medication & Immunization",
    name: "Medication"
  },
  {
    type: "Clinical",
    subtype: "Medication & Immunization",
    name: "MedicationStatement"
  },
  {
    type: "Clinical",
    subtype: "Medication & Immunization",
    name: "ImmunizationRecommendation"
  },
  {
    type: "Clinical",
    subtype: "Medication & Immunization",
    name: "MedicationDispense"
  },
  {
    type: "Clinical",
    subtype: "Medication & Immunization",
    name: "MedicationRequest"
  },
  { type: "Clinical", subtype: "Diagnostics", name: "BodySite" },
  { type: "Clinical", subtype: "Diagnostics", name: "ImagingStudy" },
  { type: "Clinical", subtype: "Diagnostics", name: "Observation" },
  { type: "Clinical", subtype: "Diagnostics", name: "Specimen" },
  { type: "Clinical", subtype: "Diagnostics", name: "DiagnosticReport" },
  { type: "Clinical", subtype: "Diagnostics", name: "ImagingManifest" },
  { type: "Clinical", subtype: "General", name: "ClinicalImpression" },
  { type: "Clinical", subtype: "General", name: "Condition" },
  { type: "Clinical", subtype: "General", name: "RiskAssessment" },
  { type: "Clinical", subtype: "General", name: "DetectedIssue" },
  { type: "Clinical", subtype: "General", name: "FamilyMemberHistory" },
  { type: "Clinical", subtype: "General", name: "Procedure" },
  { type: "Clinical", subtype: "General", name: "AllergyIntolerance" },
  { type: "Clinical", subtype: "Care Provision", name: "CarePlan" },
  { type: "Clinical", subtype: "Care Provision", name: "Goal" },
  { type: "Clinical", subtype: "Care Provision", name: "ReferralRequest" },
  { type: "Clinical", subtype: "Care Provision", name: "NutritionOrder" },
  { type: "Clinical", subtype: "Care Provision", name: "ProcedureRequest" },
  { type: "Clinical", subtype: "Care Provision", name: "VisionPrescription" },
  { type: "Identification", subtype: "Individuals", name: "Patient" },
  { type: "Identification", subtype: "Individuals", name: "Practitioner" },
  { type: "Identification", subtype: "Individuals", name: "RelatedPerson" },
  { type: "Identification", subtype: "Entities", name: "Contract" },
  { type: "Identification", subtype: "Entities", name: "Location" },
  { type: "Identification", subtype: "Entities", name: "Substance" },
  { type: "Identification", subtype: "Entities", name: "Person" },
  { type: "Identification", subtype: "Groups", name: "Group" },
  { type: "Identification", subtype: "Groups", name: "HealthcareService" },
  { type: "Identification", subtype: "Groups", name: "Organization" },
  { type: "Identification", subtype: "Devices", name: "DeviceMetric" },
  { type: "Identification", subtype: "Devices", name: "Device" },
  { type: "Identification", subtype: "Devices", name: "DeviceComponent" },
  { type: "Workflow", subtype: "Scheduling", name: "Slot" },
  { type: "Workflow", subtype: "Scheduling", name: "AppointmentResponse" },
  { type: "Workflow", subtype: "Scheduling", name: "Schedule" },
  { type: "Workflow", subtype: "Scheduling", name: "Appointment" },
  { type: "Workflow", subtype: "Patient Management", name: "Flag" },
  { type: "Workflow", subtype: "Patient Management", name: "Encounter" },
  { type: "Workflow", subtype: "Patient Management", name: "EpisodeOfCare" },
  { type: "Workflow", subtype: "Patient Management", name: "Communication" },
  { type: "Workflow", subtype: "Workflow #1", name: "Task" },
  { type: "Workflow", subtype: "Workflow #1", name: "CommunicationRequest" },
  { type: "Workflow", subtype: "Workflow #1", name: "DeviceRequest" },
  { type: "Workflow", subtype: "Workflow #1", name: "DeviceUseStatement" },
  { type: "Workflow", subtype: "Workflow #2", name: "SupplyRequest" },
  { type: "Workflow", subtype: "Workflow #2", name: "ProcessResponse" },
  { type: "Workflow", subtype: "Workflow #2", name: "ProcessRequest" },
  { type: "Workflow", subtype: "Workflow #2", name: "SupplyDelivery" },
  { type: "Infrastructure", subtype: "Structure", name: "Media" },
  { type: "Infrastructure", subtype: "Structure", name: "Basic" },
  { type: "Infrastructure", subtype: "Structure", name: "Binary" },
  { type: "Infrastructure", subtype: "Structure", name: "Bundle" },
  { type: "Infrastructure", subtype: "Documents & Lists", name: "List" },
  {
    type: "Infrastructure",
    subtype: "Documents & Lists",
    name: "DocumentReference"
  },
  {
    type: "Infrastructure",
    subtype: "Documents & Lists",
    name: "DocumentManifest"
  },
  { type: "Infrastructure", subtype: "Documents & Lists", name: "Composition" },
  { type: "Infrastructure", subtype: "Exchange", name: "MessageHeader" },
  { type: "Infrastructure", subtype: "Exchange", name: "OperationOutcome" },
  { type: "Infrastructure", subtype: "Exchange", name: "Parameters" },
  { type: "Infrastructure", subtype: "Exchange", name: "Subscription" },
  {
    type: "Infrastructure",
    subtype: "Information Tracking",
    name: "AuditEvent"
  },
  {
    type: "Infrastructure",
    subtype: "Information Tracking",
    name: "Provenance"
  },
  {
    type: "Infrastructure",
    subtype: "Information Tracking",
    name: "QuestionnaireResponse"
  },
  {
    type: "Infrastructure",
    subtype: "Information Tracking",
    name: "Questionnaire"
  },
  { type: "Financial", subtype: "Billing", name: "Claim" },
  { type: "Financial", subtype: "Billing", name: "ClaimResponse" },
  { type: "Financial", subtype: "Support", name: "EnrollmentResponse" },
  { type: "Financial", subtype: "Support", name: "EnrollmentRequest" },
  { type: "Financial", subtype: "Support", name: "Coverage" },
  { type: "Financial", subtype: "Support", name: "EligibilityRequest" },
  { type: "Financial", subtype: "Support", name: "EligibilityResponse" },
  { type: "Financial", subtype: "Other", name: "ExplanationOfBenefit" },
  { type: "Financial", subtype: "Payment", name: "PaymentReconciliation" },
  { type: "Financial", subtype: "Payment", name: "PaymentNotice" },
  { type: "Conformance", subtype: "Terminology", name: "ValueSet" },
  { type: "Conformance", subtype: "Terminology", name: "ConceptMap" },
  { type: "Conformance", subtype: "Terminology", name: "NamingSystem" },
  { type: "Conformance", subtype: "Misc", name: "ImplementationGuide" },
  { type: "Conformance", subtype: "Misc", name: "TestScript" },
  {
    type: "Conformance",
    subtype: "Operations Control",
    name: "SearchParameter"
  },
  {
    type: "Conformance",
    subtype: "Operations Control",
    name: "OperationDefinition"
  },
  {
    type: "Conformance",
    subtype: "Operations Control",
    name: "CapabilityStatement"
  },
  { type: "Conformance", subtype: "Content", name: "StructureDefinition" },
  { type: "Conformance", subtype: "Content", name: "DataElement" }
];

const initialState: IMappingExplorerState = {
  createdProfiles: 0,
  createdResources: 0,
  expandedAttributesIdList: [] as string[],
  selectedAddResource: {
    type: null,
    subtype: null,
    name: null
  },
  selectedFhirResource: {
    id: null,
    name: null
  },
  selectedFhirAttribute: {
    id: null,
    name: null
  }
};

const reducer = (
  state = initialState,
  action: ISimpleAction
): IMappingExplorerState => {
  switch (action.type) {
    case "UPDATE_FHIR_RESOURCE":
      return {
        ...state,
        selectedFhirResource: {
          id: action.payload.resourceId,
          name: action.payload.resourceName
        },
        selectedFhirAttribute: {
          id: null,
          name: null
        }
      };

    case "UPDATE_ADD_RESOURCE":
      return {
        ...state,
        selectedAddResource: {
          type: action.payload.type,
          subtype: action.payload.subtype,
          name: action.payload.name
        }
      };

    case "ADD_RESOURCE":
      return {
        ...state,
        createdResources: state.createdResources + 1,
        selectedAddResource: {
          type: null,
          subtype: null,
          name: null
        }
      };

    case "ADD_PROFILE":
      return {
        ...state,
        createdProfiles: state.createdProfiles + 1
      };

    case "DELETE_PROFILE":
      return {
        ...state,
        createdProfiles: state.createdProfiles - 1
      };

    case "NODE_COLLAPSE":
      return {
        ...state,
        expandedAttributesIdList: state.expandedAttributesIdList.filter(
          (item: any) => item !== action.payload.nodeData.id
        )
      };

    case "NODE_EXPAND":
      return {
        ...state,
        expandedAttributesIdList: [
          ...state.expandedAttributesIdList,
          action.payload.nodeData.id
        ]
      };

    case "UPDATE_FHIR_ATTRIBUTE":
      return {
        ...state,
        selectedFhirAttribute: {
          id: action.payload.attributeId,
          name: action.payload.attributeName
        }
      };

    default:
      return state;
  }
};

export default reducer;
