import messageIcon from "../../../assets/icons/message.png";
import userIcon from "../../../assets/icons/user.png";
import locationIcon from "../../../assets/icons/location.png";
import EventGrid from '../../../components/grid/EventGrid';
import GalleryGrid from '../../../components/grid/GalleryGrid';
import SeeAll from '../../../components/SeeAll';
import { useQuery } from 'react-query';
import { fetchUserProfile } from "../../../api/profile/profile-api";
import { useAppContext } from "../../../context/authContext";


const ProfilePage = () => {

  const { user } = useAppContext();
 

  const  userProfile = useQuery('news', fetchUserProfile,{
    // enabled: false,
  });

  
  return (
    <main className="grid grid-cols-5 gap-7 text-textColor">
    <section className="col-span-5 xl:col-span-3 ">
      <div className="grid grid-cols-5 h-[200px] gap-4 text-sm">
        <div className="col-span-3 grid place-items-center bg-[#f4ce9b] border border-gray-200 rounded-md">
          {user && 
          <img
            src={user.profile_image}
            className="w-[100px] h-[100px] rounded-full"
            alt=""
          />
          }
        </div>
        <div className="col-span-2 font-light h-full flex justify-center flex-col gap-y-3">
          <div className="" >
            <h4 className="font-semibold text-xl capitalize my-1">{userProfile?.data?.data[0]?.more_info[0]?.value}</h4>
            {/* <p className="text-sm my-1" >Employed full time since 2005</p> */}
            <p className="text-sm my-1">{userProfile?.data?.data[0]?.more_info[1]?.value}</p>
            <p className="text-sm font-medium my-1">Matriculation No. : <span className="font-light" > {userProfile?.data?.data[0]?.more_info[5]?.value}</span></p>
            {/* <p className="text-sm font-medium my-1">Chapter : <span className="font-light">{user?.chapter.name}</span></p> */}
          </div>
          {/* <div className="w-full " >
            <h3 className="text-org-primary-blue font-semibold text-sm">
              Pictures
            </h3>
            <div className="flex items-center gap-3">
              <img className="w-10 h-10 rounded-md" src={avatarImg} alt="" />
              <img className="w-10 h-10 rounded-md" src={avatarImg} alt="" />
              <img className="w-10 h-10 rounded-md" src={avatarImg} alt="" />
            </div>
          </div> */}
        </div>
      </div>

      <div className="flex flex-col gap-y-4 my-4 text-sm">
        <div className="flex items-center gap-2" >
            <img
              className="w-10 h-10 object-cover bg-neutral-3 p-[10px] rounded-md"
              src={messageIcon}
              alt=""
            />
            <span className="flex-1 bg-neutral-3 p-[10px] rounded-md px-3" >{userProfile?.data?.data[0].more_info[2].value === null ? "Not Available" : userProfile?.data?.data[0].more_info[2].value}</span>
        </div>
        <div className="flex items-center gap-2" >
            <img
              className="w-10 h-10 object-cover bg-neutral-3 p-[10px] rounded-md"
              src={locationIcon}
              alt=""
            />
            <span className="flex-1 bg-neutral-3 p-[10px] rounded-md text-txt px-3" >No 20, Kings Avenue, Ikoyi, Lagos.</span>
        </div>
        <div className="flex items-center gap-2" >
            <img
              className="w-10 h-10 object-cover bg-neutral-3 p-[10px] rounded-md"
              src={userIcon}
              alt=""
            />
            <span className="flex-1 bg-neutral-3 p-[10px] rounded-md text-txt px-3" >Accountant</span>
        </div>
        <div className="flex flex-col gap-2 mt-7" >
            <p className="font-semibold flex flex-col" >Bio</p>
            <span className="flex-1 bg-neutral-3 p-[10px] rounded-md text-txt px-3" >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et lacus lacus, proin proin egestas. Augue scelerisque pellentesque nullam montes, pretium. Nisl, in netus Et lacus lacus, proin proin egestas. Augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et lacus lacus, proin proin egestas. Augue scelerisque pellentesque nullam montes, pretium. Nisl, in netus Et lacus lacus, proin proin egestas. AugueLorem ipsum dolor sit amet, consectetur adipiscing elit. Et lacus lacus, proin proin egestas. Augue scelerisque pellentesque nullam montes, pretium. Nisl, in netus Et lacus lacus, proin proin egestas. Augue.. Read more
            </span>
        </div>
   
      </div>
    </section>
    <div className="hidden xl:inline col-span-1">
      <SeeAll title="Events" path="/events" />
      <EventGrid heightOfCard={"h-[170px]"} numberOfItemsToShow={2}  />
    </div>
    <div className="hidden xl:inline col-span-1">
      <SeeAll title="Gallery" path="/gallery" />
      <GalleryGrid heightOfCard={"h-[170px]"} numberOfItemsToShow={2}/>
    </div>
  </main>
  )
}

export default ProfilePage