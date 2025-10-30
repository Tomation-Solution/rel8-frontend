// import BreadCrumb from "../../../components/BreadCrumb";
import SeeAll from "../../../components/SeeAll";
import { Link } from "react-router-dom";
import profileImage from '../../../assets/images/avatar-1.jpg'
import ProgressBar from "../../../components/progress-bar/ProgressBar";
import ElectionContestantCard from '../../../components/cards/ElectionContestantCard';
import avatarImg1 from '../../../assets/images/avatar-1.jpg'
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";

const ElectionContestantDetailPage = () => {
  return (
    <main className="grid grid-cols-5 space-x-[50px] text-textColor">
      <div className="col-span-3">
        <BreadCrumb title="Elections" />
        <section>

        <div className="grid grid-cols-2 gap-8" >
          <div className="bg-[#F4CE9B] grid place-items-center rounded-md" >
            <img src={profileImage}  className="w-[200px] h-[200px] rounded-full " alt="" />
          </div>
          <div>
            <h3 className="font-medium" >Bio</h3>
            <p className="text-justify font-light " >
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non
              dolores vel maiores eligendi, velit modi, quam, eaque at voluptate
              autem nisi illum similique. Libero est quibusdam ex fugit ipsum
              accusamus? Lorem ipsum dolor sit amet, consectetur adipisicing
              elit. Nobis veniam distinctio sunt nostrum quod quibusdam corporis
              consequatur dolor aperiam suscipit, quam totam architecto
              similique modi laborum nam iure dicta libero.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 my-3" >
          <span className="space-y-3" >

        <button className="px-3 py-2 bg-primaryBlue rounded-md text-white w-full" >Vote</button>
        <ProgressBar percentCompleted="50%" />
        <small>50% of votes (520)</small>
          </span>

        </div>
        </section>
        {/* mainfesto */}
        <div>
          <h3 className="font-semibold" >Manifesto</h3>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat
          dolores molestias accusantium corporis blanditiis iste reprehenderit
          delectus nobis, asperiores culpa facilis ratione deserunt quis, rem
          nemo commodi earum ullam voluptate! Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Sint, incidunt sed ipsa magni et nobis
          accusamus libero, labore voluptatem inventore, sapiente rem vitae
          accusantium deleniti ab enim repellendus adipisci consequuntur! <br />
          <Link to='' className="font-semibold text-org-primaryBlue my-2" >Download Full manifesto</Link>
        </div>
      </div>
      <div className="col-span-2">
        <SeeAll title="Other Contestants" />
        <div className="grid grid-cols-2 gap-4">
        <ElectionContestantCard image={avatarImg1} name='Adedeji Moyin' about='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit esse quis magni ipsum, molestias non fugiat, quos repudiandae ea culpa magnam repellat, iusto molestiae debitis reprehenderit veritatis expedita! Eveniet, quae.' />
        <ElectionContestantCard image={avatarImg1} name='Adedeji Moyin' about='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit esse quis magni ipsum, molestias non fugiat, quos repudiandae ea culpa magnam repellat, iusto molestiae debitis reprehenderit veritatis expedita! Eveniet, quae.' />
        <ElectionContestantCard image={avatarImg1} name='Adedeji Moyin' about='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit esse quis magni ipsum, molestias non fugiat, quos repudiandae ea culpa magnam repellat, iusto molestiae debitis reprehenderit veritatis expedita! Eveniet, quae.' />
        <ElectionContestantCard image={avatarImg1} name='Adedeji Moyin' about='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit esse quis magni ipsum, molestias non fugiat, quos repudiandae ea culpa magnam repellat, iusto molestiae debitis reprehenderit veritatis expedita! Eveniet, quae.' />
      
        </div>
      </div>
    </main>
  )
}

export default ElectionContestantDetailPage