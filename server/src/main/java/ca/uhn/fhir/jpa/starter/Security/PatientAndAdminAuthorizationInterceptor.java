package ca.uhn.fhir.jpa.starter.Security;

import ca.uhn.fhir.interceptor.api.Interceptor;
import ca.uhn.fhir.rest.api.server.RequestDetails;
import ca.uhn.fhir.rest.server.interceptor.auth.AuthorizationInterceptor;
import ca.uhn.fhir.rest.server.interceptor.auth.IAuthRule;
import ca.uhn.fhir.rest.server.interceptor.auth.RuleBuilder;
import com.auth0.jwt.interfaces.DecodedJWT;


import java.security.InvalidParameterException;
import java.util.List;

@Interceptor
public class PatientAndAdminAuthorizationInterceptor extends AuthorizationInterceptor {

	@Override
	public List<IAuthRule> buildRuleList(RequestDetails theRequestDetails) {

		String authHeader = theRequestDetails.getHeader("Authorization");

		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String jwtToken = authHeader.substring(7); // Remove the "Bearer " prefix

			JwtValidator jwtValidator = new JwtValidator();

			try {
				jwtValidator.validate(jwtToken);
				return new RuleBuilder()
					.allowAll()
					.build();
			} catch (InvalidParameterException e) {
				System.out.println("Jwt is invalid");
			}
		}

		return new RuleBuilder()
			.denyAll()
			.build();
	}


}


