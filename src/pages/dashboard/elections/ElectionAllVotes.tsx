// import BreadCrumb from "../../.../components/BreadCrumb"
import ProgressBar from "../../../components/progress-bar/ProgressBar";
// import avatarImg1 from '../../../assets/images/avatar-1.jpg'
// import ElectionsCard from "../../../components/cards/ElectionsCard"
import SeeAll from "../../../components/SeeAll";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";

const ElectionAllVotes = () => {
  return (
    <main className="grid grid-cols-5 space-x-[50px]">
      <div className="col-span-3">
        <BreadCrumb title="Elections" />
        <section className="grid">
          <div className="border p-3 rounded-md border-neutral3 grid grid-cols-3 w-3/4 items-center my-1">
            <h4 className="col-span-2 font-semibold ">Myin Adedeji</h4>
            <div className="col-span-1">
              <small>50% of total votes (520)</small>
              <ProgressBar percentCompleted="50%" />
            </div>
          </div>
          <div className="border p-3 rounded-md border-neutral3 grid grid-cols-3 w-3/4 items-center my-1">
            <h4 className="col-span-2 font-semibold ">Myin Adedeji</h4>
            <div className="col-span-1">
              <small>50% of total votes (520)</small>
              <ProgressBar percentCompleted="50%" />
            </div>
          </div>
          <div className="border p-3 rounded-md border-neutral3 grid grid-cols-3 w-3/4 items-center my-1">
            <h4 className="col-span-2 font-semibold ">Myin Adedeji</h4>
            <div className="col-span-1">
              <small>50% of total votes (520)</small>
              <ProgressBar percentCompleted="50%" />
            </div>
          </div>
          <div className="border p-3 rounded-md border-neutral3 grid grid-cols-3 w-3/4 items-center my-1">
            <h4 className="col-span-2 font-semibold ">Myin Adedeji</h4>
            <div className="col-span-1">
              <small>50% of total votes (520)</small>
              <ProgressBar percentCompleted="50%" />
            </div>
          </div>
        </section>
      </div>
      <section className="col-span-2 grid">
        <SeeAll title="Other Contestants" />
        <div className="grid grid-cols-2 gap-4">
          {/* <ElectionsCard image={avatarImg1} name='Adedeji Moyin' about='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit esse quis magni ipsum, molestias non fugiat, quos repudiandae ea culpa magnam repellat, iusto molestiae debitis reprehenderit veritatis expedita! Eveniet, quae.' />
   <ElectionsCard image={avatarImg1} name='Adedeji Moyin' about='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit esse quis magni ipsum, molestias non fugiat, quos repudiandae ea culpa magnam repellat, iusto molestiae debitis reprehenderit veritatis expedita! Eveniet, quae.' />
   <ElectionsCard image={avatarImg1} name='Adedeji Moyin' about='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit esse quis magni ipsum, molestias non fugiat, quos repudiandae ea culpa magnam repellat, iusto molestiae debitis reprehenderit veritatis expedita! Eveniet, quae.' />
   <ElectionsCard image={avatarImg1} name='Adedeji Moyin' about='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit esse quis magni ipsum, molestias non fugiat, quos repudiandae ea culpa magnam repellat, iusto molestiae debitis reprehenderit veritatis expedita! Eveniet, quae.' />
  */}
        </div>
      </section>
    </main>
  );
};

export default ElectionAllVotes;
