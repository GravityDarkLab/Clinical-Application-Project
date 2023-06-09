package test;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.instance.model.api.IIdType;
import org.hl7.fhir.r4.model.Patient;

public class TestApplication {

	/**
	 * This is the Java main method, which gets executed
	 */
	public static void main(String[] args) {

		/**
		 * Create a context
		 */
		FhirContext ctx = FhirContext.forR4();

		/**
		 * Create a client
		 */
		IGenericClient client = ctx.newRestfulGenericClient("http://localhost:8080/fhir");

		/**
		 * GET
		 */
		// Get Patient by ID
		Patient patient = client.read().resource(Patient.class).withId("1").execute();
		// Print the output
		String string = ctx.newJsonParser().setPrettyPrint(true).encodeResourceToString(patient);
		System.out.println(string);

		/**
		 * CREATE
		 */
		// Creating New Patient
		Patient newPatient = new Patient();
		newPatient.addIdentifier().setSystem("urn:system").setValue("9239");
		newPatient.addName().setFamily("TestPerson").addGiven("Test");
		// newPatient.addExtension()

		// Invoke the server create method (and send pretty-printed JSON encoding to the
		// server instead of the default which is non-pretty printed XML)
		MethodOutcome outcome = client.create().resource(newPatient).prettyPrint().encodedJson().execute();
		// The MethodOutcome object will contain information about the response from the
		// server, including the ID of the created resource, the OperationOutcome
		// response, etc. (assuming that any of these things were provided by the
		// server! They may not always be)
		IIdType id = outcome.getId();
		System.out.println("Got ID: " + id.getValue());
		Patient newPatientResult = client.read().resource(Patient.class).withId(id.getValue()).execute();
		String stringNewPatient = ctx.newJsonParser().setPrettyPrint(true).encodeResourceToString(newPatientResult);
		System.out.println(stringNewPatient);

	}

}
