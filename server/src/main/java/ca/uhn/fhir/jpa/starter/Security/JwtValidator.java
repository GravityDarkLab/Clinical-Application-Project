package ca.uhn.fhir.jpa.starter.Security;

import com.auth0.jwk.JwkException;
import com.auth0.jwk.JwkProvider;
import com.auth0.jwk.UrlJwkProvider;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.MalformedURLException;
import java.net.URL;
import java.security.InvalidParameterException;
import java.security.interfaces.RSAPublicKey;

public class JwtValidator {

	private static final Logger logger = LoggerFactory.getLogger(JwtValidator.class);
	private static final String allowedIsses = "https://dev-iev30nuk0firr85e.eu.auth0.com/";
	private static final String allowedAud = "medTechAPI2023";

	private String getKeycloakCertificateUrl(DecodedJWT token) {
		return token.getIssuer() + ".well-known/jwks.json ";
	}

	public RSAPublicKey loadPublicKey(DecodedJWT token) throws JwkException, MalformedURLException {

		final String url = getKeycloakCertificateUrl(token);
		JwkProvider provider = new UrlJwkProvider(new URL(url));

		return (RSAPublicKey) provider.get(token.getKeyId()).getPublicKey();
	}

	/**
	 * Validate a JWT token
	 * @param token
	 * @return decoded token
	 */
	public DecodedJWT validate(String token) {
		try {
			final DecodedJWT jwt = JWT.decode(token);

			if (!allowedIsses.contains(jwt.getIssuer())) {
				throw new InvalidParameterException(String.format("Unknown Issuer %s", jwt.getIssuer()));
			}

			RSAPublicKey publicKey = loadPublicKey(jwt);

			Algorithm algorithm = Algorithm.RSA256(publicKey, null);
			JWTVerifier verifier = JWT.require(algorithm)
				.withIssuer(jwt.getIssuer())
				.withAudience(allowedAud)
				.build();

			verifier.verify(token);
			return jwt;

		} catch (Exception e) {
			logger.error("Failed to validate JWT", e);
			throw new InvalidParameterException("JWT validation failed");
		}
	}

	public static void main(String[] args)  {

		JwtValidator val = new JwtValidator();

		String encodedToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkY4MklMcWRvMHM1UFJiT2RFSWUwaiJ9.eyJpc3MiOiJodHRwczovL2Rldi1pZXYzMG51azBmaXJyODVlLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhYkRNbEwydnZCOXo1TUpseWtDOFRPZzgyYjlQOVlsYUBjbGllbnRzIiwiYXVkIjoibWVkVGVjaEFQSTIwMjMiLCJpYXQiOjE2ODg1ODM4NzIsImV4cCI6MTY4ODY3MDI3MiwiYXpwIjoiYWJETWxMMnZ2Qjl6NU1KbHlrQzhUT2c4MmI5UDlZbGEiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.aY7c93-uqWdMtsoTLlaxlPoXetOurZAR7NUyMgfBBpF7aF7PpFXfjolMV1qoGtROFogIlk930J1rBEpjQi6sZ_QogLST1ZYBrgYjBIQN1WMURxLpgmf571MjPrCeZM2LCRmUA-FOgHVJECluiCVhqMQ_9yrrQwq1dV0UJz6QxIP1MHYV2Y_NpNqqSIOcGSXT6OVI0KOXsIIunARBLGBxblSuF_Gn3MlvMGhoK4uHKNCz-RYQkaJzsJ1nVQgkVFKmHGco28j-A89PwnCTqp51mihH3Hw1HBHzlqtW99MEJmLOj5iGtXklyabC5L-deEXSy59IwySPz_9u1v4es2QfXg";

		try {
			DecodedJWT token = val.validate(encodedToken);
			System.out.println( "Jwt is valid" );
		} catch (InvalidParameterException e) {
			System.out.println( "Jwt is invalid" );
			e.printStackTrace();
		}

	}
}