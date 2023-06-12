package hapi.fhir.client;

import hapi.fhir.client.controller.PatientController;

public class Client {

	/**
	 * This is a demo backend Client.
	 */

	public static void main(String[] args) {

		PatientController controller = new PatientController();
		/**
		 * This will get a fake patient data.
		 */
		controller.readPatient();
		/**
		 * this will create a fake Patient with a CT image in the database
		 */
		controller.createNewPatient();

	}

}
