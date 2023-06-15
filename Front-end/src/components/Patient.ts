import { fhirR4 } from "@smile-cdr/fhirts";

/*
* Simplify Patient usage.
*/

interface Patient extends fhirR4.Patient {
  identifier?: fhirR4.Identifier[];
  name?: fhirR4.HumanName[];
  birthDate?: string;
  // Define other properties of the Patient if needed
}

export default Patient;