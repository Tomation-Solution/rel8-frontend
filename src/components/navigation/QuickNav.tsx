import quickPublicationsIcon from "../../assets/icons/publication.png";
import eventsIcon from "../../assets/icons/events.png";
import meetingsIcon from "../../assets/icons/members-enviroment.png";
import galleryIcon from "../../assets/icons/gallery.png";
import fundAProjectIcon from "../../assets/icons/fund-a-project.png";
import serviceRequestIcon from "../../assets/icons/service-request.png";
import { Link } from "react-router-dom";
const QuickNav = () => {
  const QuickNavData = [
    {
      title: "Publications",
      image: quickPublicationsIcon,
      path: "/publications",
    },
    {
      title: "Events",
      image: eventsIcon,
      path: "/events",
    },
    {
      title: "Meetings",
      image: meetingsIcon,
      path: "/meeting",
    },
    {
      title: "Gallery",
      image: galleryIcon,
      path: "/gallery",
    },
    {
      title: "Fund a Project",
      image: fundAProjectIcon,
      path: "/fund-a-project",
    },
    {
      title: "Service Request",
      image: serviceRequestIcon,
      path: "/service-requests",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  return (
    <div className="grid broder border-t border-gray-300 ">
        <h3 className="font-bold text-center  my-3" >Quick Nav</h3>
      <div className="grid grid-cols-2 gap-3">
        {QuickNavData.map((data, index) => (
          <div key={index} className="grid place-items-center">
            <Link
              to={data.path}
              onClick={scrollToTop}
              className=" w-fit h-fit p-3 rounded-full bg-primary-blue"
              key={index}
            >
              <img
                src={data.image}
                className="w-4 h-4 object-contain text-white"
                alt=""
              />
            </Link>
            <span className="text-sm font-medium text-center">{data.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickNav;
