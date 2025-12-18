import React from 'react';
import { useNavigate } from 'react-router-dom';

interface OutstandingDuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  currencySymbol: string;
}

const OutstandingDuesModal: React.FC<OutstandingDuesModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  currencySymbol
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handlePayNow = () => {
    navigate('/dues');
    onClose();
  };

  const handleRemindLater = () => {
    // Store a timestamp to remind later (e.g., after 24 hours)
    const remindLaterTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours from now
    localStorage.setItem('duesReminderTime', remindLaterTime.toString());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurry background */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

      {/* Modal content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="text-center">
          {/* Warning icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Outstanding Dues
          </h3>

          <p className="text-sm text-gray-600 mb-4">
            You have outstanding dues that need to be paid before you can continue using the application.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-2xl font-bold text-org-primary">
              {currencySymbol}{totalAmount.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Outstanding Amount</div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePayNow}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-org-primary border border-transparent rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-org-primary"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutstandingDuesModal;