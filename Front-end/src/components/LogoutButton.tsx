import { useAuth0 } from "@auth0/auth0-react";
import { faUserLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
    <FontAwesomeIcon icon={faUserLock} className="mr-2" />
      Log Out
    </button>
  );
};

export default LogoutButton;