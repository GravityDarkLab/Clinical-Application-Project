import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";


interface SubmissionStatusProps {
    submissionStatus: string | null;
    submissionTextSucess: string | null;
    submissionHeadlineSucess: string | null;
    submissionTextFailure: string | null;
    submissionHeadlineFailure: string | null;
}
  
const SubmissionStatus: React.FC<SubmissionStatusProps> = ({ submissionStatus, submissionTextSucess, submissionTextFailure, submissionHeadlineSucess, submissionHeadlineFailure }) => {
    const [status, setStatus] = useState<boolean>(true);

    useEffect(() => {
        if (submissionStatus === 'success') {
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
                                    {submissionStatus === 'success' ? submissionHeadlineSucess : submissionHeadlineFailure }
                                </p>
                                <button className="text-gray-800 hover:text-gray-600" onClick={handleCloseNotification}>
                                    <FontAwesomeIcon
                                    icon={faTimes}
                                    className="h-5 w-5 text-gray-800 hover:text-red-400"
                                    />
                                </button>
                            </div>
                                <p className="text-sm text-gray-600">
                                    {submissionStatus === 'success' ? submissionTextSucess : submissionTextFailure}
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