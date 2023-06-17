import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const HomeButton = () => {
  return (
    <div className="fixed top-4 left-4">
      <Link to="/">
        <FontAwesomeIcon
          icon={faHome}
          className="text-white hover:text-blue-400 text-2xl cursor-pointer"
        />
      </Link>
    </div>
  );
};

export default HomeButton;
