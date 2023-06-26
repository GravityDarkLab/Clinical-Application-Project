/*
* This class is no more being used. It will be keept if needed otherwise it will be deleted at production time.
*/

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
