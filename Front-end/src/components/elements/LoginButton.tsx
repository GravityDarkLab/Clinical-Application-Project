import { useAuth0 } from "@auth0/auth0-react";
import { faUserLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoginButton = () => {
  const { loginWithRedirect, loginWithPopup } = useAuth0();

  return (
    <div className="flex justify-center">
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => loginWithRedirect()}
      >
        <FontAwesomeIcon icon={faUserLock} className="mr-2" />
        Log In
      </button>
    </div>
  );
};

export default LoginButton;
