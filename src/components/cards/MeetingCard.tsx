import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "react-query";
import meetingImage from "../../assets/images/meeting-image.png";
import Button from "../button/Button";
import { setMeetingReminder } from "../../api/meetings/api-meetings";
import { useAppContext } from "../../context/authContext";
import Toast from "../toast/Toast";

const REMINDER_OPTIONS: { label: string; value: 5 | 10 | 15 | 30 }[] = [
  { label: "5 minutes before", value: 5 },
  { label: "10 minutes before", value: 10 },
  { label: "15 minutes before", value: 15 },
  { label: "30 minutes before", value: 30 },
];

const MeetingCard = ({ meeting, linkTo = "meeting" }: any) => {
  const { name, event_date, organiserName, details, image, is_attending } = meeting;

  const meetingId = meeting.id || meeting._id;
  const { user } = useAppContext();
  const { notifyUser } = Toast();
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState<5 | 10 | 15 | 30>(10);

  const formattedDate = new Date(event_date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const truncatedDetails = details && details.length > 100 ? `${details.slice(0, 100)}...` : details;

  const { mutate: submitReminder, isLoading: settingReminder } = useMutation(setMeetingReminder, {
    onSuccess: () => {
      notifyUser(`Reminder set for ${selectedMinutes} minutes before the meeting`, "success");
      setShowReminderModal(false);
    },
    onError: (error: any) => {
      notifyUser(error?.response?.data?.message || "Failed to set reminder", "error");
    },
  });

  const handleConfirmReminder = () => {
    submitReminder({
      meetingId,
      orgId: user?.orgId,
      minutesBefore: selectedMinutes,
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 p-3 bg-neutral-3 rounded-md my-2">
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <img src={image || meetingImage} alt={name} className="w-28 h-24" />
            <div>
              <Link to={`/${linkTo}/${meetingId}/`}>
                <h6 className="font-medium text-org-primary-blue hover:underline">{name}</h6>
              </Link>
              <p className="font-light">{formattedDate}</p>
              <p className="text-sm text-gray-500">{organiserName}</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-700">{truncatedDetails}</p>
        </div>
        <div className="col-span-1 flex flex-col p-2 gap-2 items-center justify-center">
          {is_attending ? <Button text="You're Attending" borderRadius="rounded-md" padding="py-2 px-3" /> : <Button text="Remind me to Join" borderRadius="rounded-md" padding="py-2 px-3" onClick={() => setShowReminderModal(true)} />}
          <Link to={`/${linkTo}/${meetingId}/`} className="w-full py-2 px-3 border border-primary-blue text-sm bg-[inherit] text-org-primaryDark rounded-md text-center">
            View Details
          </Link>
        </div>
      </div>

      {showReminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowReminderModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Set a Reminder</h3>
            <p className="text-sm text-gray-500 mb-4">
              How many minutes before <span className="font-medium text-gray-700">{name}</span> would you like to be reminded?
            </p>
            <div className="flex flex-col gap-2 mb-6">
              {REMINDER_OPTIONS.map(option => (
                <label key={option.value} className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${selectedMinutes === option.value ? "border-org-primary bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <input type="radio" name="reminderMinutes" value={option.value} checked={selectedMinutes === option.value} onChange={() => setSelectedMinutes(option.value)} className="accent-org-primary" />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowReminderModal(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button type="button" onClick={handleConfirmReminder} disabled={settingReminder} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-org-primary rounded-md hover:bg-opacity-90 disabled:opacity-60">
                {settingReminder ? "Setting..." : "Set Reminder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MeetingCard;
