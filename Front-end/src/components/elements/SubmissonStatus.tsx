import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface SubmissionStatusProps {
  submissionStatus: string | null;
  submissionTextSuccess: string | null;
  submissionHeadlineSuccess: string | null;
  submissionTextFailure: string | null;
  submissionHeadlineFailure: string | null;
}

/**
 * `SubmissionStatus` is a React functional component that displays submission success or failure notifications.
 * It uses the FontAwesome library to provide the closing icon for the notification.
 * It's styled using the Tailwind CSS library.
 *
 * @component
 * @param {SubmissionStatusProps} props - Props that pass the submission status, submission success text and headline,
 * submission failure text and headline.
 *
 * @property {string | null} submissionStatus - Represents the status of submission, can be "success", "failure", or null.
 * @property {string | null} submissionTextSuccess - Text that is shown on successful submission.
 * @property {string | null} submissionHeadlineSuccess - Headline that is shown on successful submission.
 * @property {string | null} submissionTextFailure - Text that is shown on failed submission.
 * @property {string | null} submissionHeadlineFailure - Headline that is shown on failed submission.
 *
 * @returns {ReactElement} The rendered `SubmissionStatus` component.
 *
 * @example
 * <SubmissionStatus
 *   submissionStatus="success"
 *   submissionTextSuccess="Your submission was successful."
 *   submissionHeadlineSuccess="Success!"
 *   submissionTextFailure="An error occurred. Please try again."
 *   submissionHeadlineFailure="Failure!"
 * />
 */
const SubmissionStatus: React.FC<SubmissionStatusProps> = ({
  submissionStatus,
  submissionTextSuccess,
  submissionTextFailure,
  submissionHeadlineSuccess,
  submissionHeadlineFailure,
}) => {
  const [status, setStatus] = useState<boolean>(true);

  useEffect(() => {
    if (submissionStatus === "success") {
      setStatus(true);
    }
  }, [submissionStatus]);

  const handleCloseNotification = () => {
    setStatus(false);
  };

  return (
    <div>
      {submissionStatus && status && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-center justify-center">
            <div className="max-w-md mx-auto">
              <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-semibold mr-2">
                    {submissionStatus === "success"
                      ? submissionHeadlineSuccess
                      : submissionHeadlineFailure}
                  </p>
                  <button
                    className="text-gray-800 hover:text-gray-600"
                    onClick={handleCloseNotification}
                  >
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="h-5 w-5 text-gray-800 hover:text-red-400"
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {submissionStatus === "success"
                    ? submissionTextSuccess
                    : submissionTextFailure}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionStatus;
