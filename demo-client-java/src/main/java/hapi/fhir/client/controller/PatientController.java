package hapi.fhir.client.controller;

import java.io.IOException;

import org.hl7.fhir.instance.model.api.IIdType;
import org.hl7.fhir.r4.model.*;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.server.exceptions.ResourceNotFoundException;
import hapi.fhir.client.utils.ImageTools;
import hapi.fhir.client.utils.RandomGenerator;

public class PatientController {

	/**
	 * Create a context and set the client. Both are heavy resources, so it makes
	 * sense to create them once.
	 */
	private static final FhirContext CTX = FhirContext.forR4();
	private static final IGenericClient CLIENT = CTX.newRestfulGenericClient("http://localhost:8080/fhir");

	public PatientController() {
	}

	public void readPatient() {
		Patient patient;
		// This should give you Max Mustermann back.
		try {
			patient = CLIENT.read().resource(Patient.class).withId("1").execute();
			String string = CTX.newJsonParser().setPrettyPrint(true).encodeResourceToString(patient);
			System.out.println(string);
		} catch (ResourceNotFoundException e) {
			System.out.println("Resource not found!");
		}
		// This should fail!
		try {
			patient = CLIENT.read().resource(Patient.class).withId(RandomGenerator.generateRandomID()).execute();
			String string = CTX.newJsonParser().setPrettyPrint(true).encodeResourceToString(patient);
			System.out.println(string);
		} catch (ResourceNotFoundException e) {
			System.err.println("Resource not found!");
			System.out.println("Previous Result should be NOT FOUND :)");
		}
	}

	public void createNewPatient() {
		Patient newPatient = generateRandomPatient();
		/**
		 * Invoke the server create method (and send pretty-printed JSON encoding to the
		 * server. The MethodOutcome object will contain information about the response
		 * from the server, including the ID of the created resource, the
		 * OperationOutcome response, etc...
		 */
		MethodOutcome outcome = CLIENT.create().resource(newPatient).prettyPrint().encodedJson().execute();
		IIdType id = outcome.getId();
		System.out.println("Created patient, got ID: " + id);
		readPatientByID(id);
	}

	public static void readPatientByID(IIdType id) {
		Patient patient;
		try {
			patient = CLIENT.read().resource(Patient.class).withId(id.getValue()).execute();
			System.out.println(patient.getName().get(0).getGiven().get(0) + " " + patient.getName().get(0).getFamily());
			System.out.println(patient.getAddress().get(0).getText());
			extractImage(id);
		} catch (ResourceNotFoundException e) {
			System.out.println("Resource not found!");
		}
	}

	private static void extractImage(IIdType id) {

		Patient patient;
		try {
			patient = CLIENT.read().resource(Patient.class).withId(id.getValue()).execute();
			Attachment imageAttachment = patient.getPhoto().get(0);
			String imageContentType = imageAttachment.getContentType();
			byte[] imageData = imageAttachment.getData();
			ImageTools.generateImageFromBytes(imageData, imageContentType.substring(imageContentType.indexOf("/") + 1));

		} catch (ResourceNotFoundException e) {
			System.out.println("Resource not found!");
		}
	}

	private Patient generateRandomPatient() {
		// Creating New Patient
		Patient newPatient = new Patient();
		String[] randomName = RandomGenerator.generateRandomName();
		// Populate the patient with fake information
		newPatient.addName().setFamily(randomName[1]).addGiven(randomName[0]);
		newPatient.setId(RandomGenerator.generateRandomID());
		newPatient.setGender(Enumerations.AdministrativeGender.MALE);
		newPatient.setBirthDateElement(new DateType("2015-11-18"));
		Attachment attachment = new Attachment();
		attachment.setContentType("image/png");
		try {
			attachment.setData(ImageTools.getImageData(RandomGenerator.getRandomImage()));
		} catch (IOException e) {
			System.err.println("Attachment not Found!");
		}
		newPatient.addPhoto(attachment);
		newPatient.addTelecom().setSystem(ContactPoint.ContactPointSystem.PHONE)
				.setUse(ContactPoint.ContactPointUse.MOBILE).setValue(RandomGenerator.generateRandomPhoneNumber());
		Address address = new Address();
		address.setText(RandomGenerator.generateRandomAddress());
		newPatient.addAddress(address);
		/**
		 * Using identifiers allows you to represent various identification systems or
		 * assign multiple identifiers to a resource, which can be useful in
		 * interoperability scenarios or when integrating with different healthcare
		 * systems.
		 *
		 * The id field is different from the identifier field in that it represents the
		 * internal identifier assigned by the FHIR server, while the identifier field
		 * allows for the representation of additional external identifiers associated
		 * with the resource. Both fields serve different purposes and provide different
		 * levels of identification and reference.
		 **/
		newPatient.addIdentifier().setSystem("http://acme.org/mrn").setValue(RandomGenerator.generateRandomID());

		return newPatient;
	}
}
