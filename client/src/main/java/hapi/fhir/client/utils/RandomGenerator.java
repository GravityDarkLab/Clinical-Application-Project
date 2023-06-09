package hapi.fhir.client.utils;

import java.util.Random;
import java.util.UUID;

public class RandomGenerator {
	private static final String[] FIRST_NAMES = { "Alice", "Bob", "Charlie", "David", "Eve", "Frank" };
	private static final String[] LAST_NAMES = { "Smith", "Johnson", "Brown", "Davis", "Miller" };
	private static final String[] STREET_NAMES = { "Hauptstraße", "Bahnhofstraße", "Berliner Straße", "Goethestraße",
			"Mozartstraße" };
	private static final String[] STREET_TYPES = { "Straße", "Allee", "Weg", "Platz", "Gasse" };
	private static final String[] CITIES = { "Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne" };
	private static final String COUNTRY = "Germany";

	private static final String[] IMAGES = { "legsCT_arterial_phase.png", "brainCT.png", "brainMRI.png" };

	private RandomGenerator() {
	}

	public static String[] generateRandomName() {
		Random random = new Random();
		String firstName = FIRST_NAMES[random.nextInt(FIRST_NAMES.length)];
		String lastName = LAST_NAMES[random.nextInt(LAST_NAMES.length)];
		String[] randomName = { firstName, lastName };
		return randomName;
	}

	public static String generateRandomID() {
		UUID uuid = UUID.randomUUID();
		return uuid.toString();
	}

	public static String generateRandomPhoneNumber() {
		Random random = new Random();

		int areaCode = random.nextInt(900) + 100; // Generates a random 3-digit area code (100-999)
		int firstPart = random.nextInt(900) + 100; // Generates a random 3-digit number (100-999)
		int secondPart = random.nextInt(9000) + 1000; // Generates a random 4-digit number (1000-9999)

		return String.format("%03d-%03d-%04d", areaCode, firstPart, secondPart);
	}

	public static String generateRandomAddress() {
		Random random = new Random();

		// Generate random street number
		int streetNumber = random.nextInt(100) + 1;

		// Randomly select street name and type
		String streetName = STREET_NAMES[random.nextInt(STREET_NAMES.length)];
		String streetType = STREET_TYPES[random.nextInt(STREET_TYPES.length)];

		// Randomly select city
		String city = CITIES[random.nextInt(CITIES.length)];

		// Generate random postal code (5 digits)
		String postalCode = String.format("%05d", random.nextInt(100000));

		// Construct the address string
		String address = streetName + " " + streetNumber + " " + streetType + ", " + postalCode + " " + city + ", "
				+ COUNTRY;

		return address;
	}

	public static String getRandomImage() {
		Random random = new Random();
		return IMAGES[random.nextInt(IMAGES.length)];
	}

}
