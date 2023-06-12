package hapi.fhir.client.utils;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.imageio.ImageIO;

public class ImageTools {

	private static final String INITIAL_PATH = "client/src/main/resources/attachments/";

	public static byte[] getImageData(String imgName) throws IOException {
		Path path = Paths.get(INITIAL_PATH + imgName);
		return Files.readAllBytes(path);
	}

	public static void generateImageFromBytes(byte[] imageData, String outputFormat) {
		try {
			ByteArrayInputStream bis = new ByteArrayInputStream(imageData);
			BufferedImage bufferedImage = ImageIO.read(bis);
			bis.close();

			File outputFile = new File(INITIAL_PATH + "result/image.png");
			ImageIO.write(bufferedImage, outputFormat, outputFile);
			System.out.println("Image generated successfully.");
		} catch (IOException e) {
			System.err.println("Error generating image: " + e.getMessage());
		}
	}

}
