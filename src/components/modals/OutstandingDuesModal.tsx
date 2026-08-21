import { useNavigate } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";

import { Button, Card } from "../ui";
import { formatMoney } from "../../utils/currency";

interface OutstandingDuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  currencySymbol: string;
}

/**
 * The dues blocker. Shown only when the organization has `settings.show_dues_blocker` on
 * and the member owes something — `DashboardLayout` decides that, not this component.
 *
 * There is deliberately no dismiss control: it is a blocker. A `handleRemindLater` that
 * wrote `localStorage.duesReminderTime` used to sit here with no button wired to it and
 * nothing anywhere reading the key back, so it has been removed rather than left looking
 * like a feature.
 */
const OutstandingDuesModal = ({ isOpen, onClose, totalAmount, currencySymbol }: OutstandingDuesModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="outstanding-dues-title">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />

      <Card className="relative w-full max-w-md p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-status-warning-bg grid place-items-center mb-4">
          <FiAlertTriangle className="w-6 h-6 text-status-warning" />
        </div>

        <h3 id="outstanding-dues-title" className="text-[18px] font-semibold text-ink mb-2">
          Outstanding Dues
        </h3>
        <p className="text-sm text-muted mb-5">You have outstanding dues that need to be paid before you can continue using the application.</p>

        <div className="bg-org-tint rounded-xl px-4 py-5 mb-6">
          <p className="text-2xl font-semibold text-org-primary">{formatMoney(totalAmount, currencySymbol)}</p>
          <p className="text-sm text-muted mt-1">Total Outstanding Amount</p>
        </div>

        <Button
          fullWidth
          onClick={() => {
            navigate("/dues");
            onClose();
          }}
        >
          Pay Now
        </Button>
      </Card>
    </div>
  );
};

export default OutstandingDuesModal;
