export const questions: any = [
  {
    chapter_name: 'DPI Niveau 1',
    sections: [
      {
        resource: 'Patient',
        head_table: 'patients',
        mapping_items: [
          {
            title: 'Nom de famille',
            text:
              'Indiquez quelle colonne contient nom de famille du patient. Nous avons proposé des suggestions de colonne contenant des noms de famille, vous pouvez affiner la recherche en renseignant des mots clefs. Choisissez la colonne qui convient.',
            fhir_attribute: 'patient.name.family'
            // "type": "Nom de famille",
          },
          {
            title: 'Prénom',
            text: 'Ainsi que le ou les prénom(s).',
            fhir_attribute: 'patient.name.given'
            // "type": "Prénom",
          },
          {
            title: 'Identifiant unique',
            text:
              "Précisez l'identifiant du patient, son numéro de sécurité sociale ou INSEE. Vous pouvez affiner la recherche avec des mots clefs tels que 'secu', 'insee', etc.",
            fhir_attribute: 'patient.identifier.value'
          },
          {
            title: 'Date de naissance',
            text: 'Renseignez la date de naissance.',
            fhir_attribute: 'patient.birthDate'
          },
          {
            title: 'Sexe',
            text: 'Où se trouve le genre du patient ?',
            fhir_attribute: 'patient.gender'
          },
          {
            title: 'Adresse',
            text:
              "Indiquez la ou les colonne(s) qui contiennent les informations d'immeuble, de numéro et de rue.",
            fhir_attribute: 'patient.address.line'
          },
          {
            title: 'Code postal',
            text: 'Ainsi que le code postal.',
            fhir_attribute: 'patient.address.postalCode'
          },
          {
            title: 'Ville',
            text: 'Et la ville.',
            fhir_attribute: 'patient.address.city'
          }
        ]
      },
      {
        resource: 'Practitioner',
        mapping_items: [
          {
            text:
              'On cherche désormais les informations sur le médecin ou praticien. Où se trouve son nom de famille.',
            fhir_attribute: 'practitioner.name.family'
          },
          {
            text: 'Et son ou ses prénoms ?',
            fhir_attribute: 'practitioner.name.given'
          },
          {
            text:
              "On a besoin d'un identifiant. Pouvez-vous trouver la ou les colonne(s) qui stockent le numéro Adeli ou RPPS ou tout autre identifant pertinent ? Vous pouvez indiquez plusieurs colonnes s'il y a plusieurs identifiants, et utiliser des mots cledfs pour faciliter votre recherche.",
            fhir_attribute: 'practitioner.identifier.value'
          },
          {
            text:
              "Indiquez en toute lettre le type d'identifiant (Exemple: Adeli, RPPS...)",
            fhir_attribute: 'practitioner.identifier.type'
          },
          {
            text:
              'Où se trouve le téléphone du médecin ? Vous pouvez indiquer plusieurs colonnes si par exemple il y a une colonne pour les portables et une autres pour les téléphones fixes.',
            fhir_attribute: 'practitioner.telecom.value'
          },
          {
            text:
              'Le type de numéro (portable, fixe, professionnel, fax) peut-il être précisé ? Vous pouvez renseigner un type en toutes lettres.',
            fhir_attribute: 'practitioner.telecom.system'
          },
          {
            text:
              'Peut-on trouver une colonne qui précise la spécialité du médecin ?',
            fhir_attribute: 'practitioner.qualification.code.coding.code'
          }
        ]
      }
    ]
  }
];

export const availableTypes: any = {
  'Nom de famille': 'name',
  Prénom: 'firstname',
  Adresse: 'address',
  Date: 'date',
  Identifiant: 'id',
  Code: 'code',
  Ville: 'city'
};
