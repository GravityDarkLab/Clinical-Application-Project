import React, { FC, ReactNode, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx"; // if it's not already installed, you can add it to your project with `npm install clsx`

interface BannerProps {
  children: ReactNode;
}

const Banner: FC<BannerProps> = memo(({ children }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <header
      className={clsx(
        "bg-gradient-to-r",
        "from-blue-500",
        "to-sky-800",
        "mb-5"
      )}
    >
      <div
        className={clsx(
          "container",
          "mx-auto",
          "px-4",
          "py-6",
          "flex",
          "items-center",
          "justify-between"
        )}
      >
        <div className={clsx("flex", "items-center", "space-x-4")}>
          <button
            className={clsx(
              "text-white",
              "text-xl",
              "focus:outline-none",
              "hover:text-blue-400"
            )}
            onClick={handleGoBack}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <Link to="/" className="text-white">
            <FontAwesomeIcon
              icon={faHome}
              className={clsx("text-2xl", "hover:text-blue-400")}
            />
          </Link>
        </div>
        <h1 className={clsx("text-white", "text-3xl", "font-bold")}>
          {children}
        </h1>
        <div></div>
      </div>
    </header>
  );
});

export default Banner;
