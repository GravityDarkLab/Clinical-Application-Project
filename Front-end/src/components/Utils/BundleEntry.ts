export {}
import { fhirR4 } from "@smile-cdr/fhirts";

interface BundleEntry {
  resource: fhirR4.Patient | fhirR4.Observation | fhirR4.Media ;
  // Define other properties of the Bundle entry if needed ---> Extensions if needed
}

export default BundleEntry;