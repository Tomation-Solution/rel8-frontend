import { sideBarData } from "../../data/sideBarData";
import NavItem from "./NavItem";

interface Props{
    isMobileSidebarOpen:boolean;
    setIsMobileSidebarOpen: (value: boolean) => void;
  }

const Sidebar = ({isMobileSidebarOpen,setIsMobileSidebarOpen}:Props) => {
  return (
    <>
     {/* Desktop Navbar */}
    <nav className="scrollbar-thin scrollbar-thumb-[#C1C1C1] scrollbar-track-gray-200 scrollbar-rounded overflow-y-auto hidden lg:inline-block lg:w-[330px] z-10 bg-[white]  fixed h-full border border-gray-200 shadow-md py-5" >
        {sideBarData.map((item,index)=>(
            <NavItem isMobileSidebarOpen={isMobileSidebarOpen} setIsMobileSidebarOpen={setIsMobileSidebarOpen} key={index} item={item} />
        ))}
    </nav>

    {/* Mobile Navbar */}
    {isMobileSidebarOpen && (
    <div onClick={()=>setIsMobileSidebarOpen(!isMobileSidebarOpen)} className={`lg:hidden   fixed top-0 w-full min-h-screen h-full   bg-black/70 transition-transform z-10 ${isMobileSidebarOpen ? 'translate-x-0 ease-in duration-900' : '-translate-x-full ease-out duration-900'} `} >
      <nav className={`lg:hidden fixed top-[60px] w-[80%] sm:w-[40%] md:w-[36%] overflow-y-auto min-h-screen h-full bg-[white] px-3 py-6`} >
          {sideBarData.map((item,index)=>(
              <NavItem  key={index} item={item} isMobileSidebarOpen={isMobileSidebarOpen}  setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
          ))}
      </nav>
    </div>
     )}
    </>
  )
}

export default Sidebar