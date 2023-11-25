import meetingImage from "../../assets/images/meeting-image.png";
import Button from "../button/Button";

const MeetingCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 p-3 bg-neutral-3 rounded-md my-2">
      <div className="col-span-2" >
        <div className=" flex items-center gap-2">
          <img src={meetingImage} className=" " alt="" />
          <div>
            <h6 className="font-medium">Managing Supply Chain Disruption</h6>
            <p className="font-light">January 20th 2023 - 12:05pm</p>
          </div>
          
        </div>
      </div>
      <div className="col-span-1 flex flex-col p-2 gap-2 item-center justify-center">
        <Button text="Remind me to Join" borderRadius="rounded-md" padding="py-2 px-3" />
        {/* <Button text="Remind me to Join" borderRadius="rounded-md" padding="py-2 px-3" /> */}
        <button className="py-2 px-3 border border-primary-blue text-sm bg-[inherit] text-primaryDark rounded-md">
          Remind me to Join
        </button>
      </div>
    </div>
  );
};

export default MeetingCard;
