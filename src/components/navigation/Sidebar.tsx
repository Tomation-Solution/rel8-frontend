import { sideBarData as initialSideBarData } from "../../data/sideBarData";
import NavItem from "./NavItem";
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchAllCommittees } from '../../api/committee/committee';
import { useEffect, useState } from 'react';
import { SubMenuItem, SideBarLinkType } from '../../types/sidebarDataType';

interface Committee {
    id: string;
    name: string;
}

interface Props {
    isMobileSidebarOpen: boolean;
    setIsMobileSidebarOpen: (value: boolean) => void;
}

const Sidebar = ({ isMobileSidebarOpen, setIsMobileSidebarOpen }: Props) => {
    const navigate = useNavigate();
    const [committees, setCommittees] = useState<SubMenuItem[]>([]); // Updated type
    const [sideBarData, setSideBarData] = useState<SideBarLinkType[]>(initialSideBarData);

    const { data } = useQuery('committees', fetchAllCommittees);

    useEffect(() => {
        if (data && data.data) {
            if (data.data.length === 0) {
                const messageItem: SubMenuItem = {
                    name: "You are not part of any committee",
                    path: "#",
                    isMessage: true
                };
                setCommittees([messageItem]);
            } else {
                const committeeItems: SubMenuItem[] = data.data.map((committee: Committee) => ({
                    name: committee.name,
                    path: `/committees/${committee.id}`,
                    isMessage: false
                }));
                setCommittees(committeeItems);
            }
        }
    }, [data]);

    useEffect(() => {
        const updatedSideBarData = initialSideBarData.map(item => {
            if (item.name === 'Committee Environment') {
                return { ...item, subMenu: committees };
            }
            return item;
        });
        setSideBarData(updatedSideBarData);
    }, [committees]);

    const handleLogout = () => {
        localStorage.removeItem('rel8User');
        localStorage.removeItem('userRel8RegistrationData');
        navigate('/login');
    };

    return (
        <>
            {/* Desktop Navbar */}
            {/* <nav className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 overflow-y-auto hidden lg:inline-block lg:w-80 z-10 !bg-[#FAFAFB] fixed h-full shadow-md py-5"> */}
            <nav className="hidden lg:block lg:w-80 z-10 !bg-[#FAFAFB] h-screen shadow-md py-5 sticky top-0 overflow-y-auto">
                {sideBarData.map((item, index) => (
                    <NavItem
                        key={index}
                        item={item}
                        isMobileSidebarOpen={isMobileSidebarOpen}
                        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                        onLogout={item.name === 'Logout' ? handleLogout : undefined}
                    />
                ))}
            </nav>

            {/* Mobile Navbar */}
            {/* {isMobileSidebarOpen && (
                <div
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={`lg:hidden fixed top-0 w-full min-h-screen h-full bg-black/70 transition-transform z-10 ${
                        isMobileSidebarOpen ? 'translate-x-0 ease-in duration-900' : '-translate-x-full ease-out duration-900'
                    }`}
                >
                    <nav 
                        className="lg:hidden fixed top-[60px] w-[80%] sm:w-[40%] md:w-[36%] overflow-y-auto min-h-screen h-full bg-white px-3 py-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {sideBarData.map((item, index) => (
                            <NavItem
                                key={index}
                                item={item}
                                isMobileSidebarOpen={isMobileSidebarOpen}
                                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                                onLogout={item.name === 'Logout' ? handleLogout : undefined}
                            />
                        ))}
                    </nav>
                </div>
            )} */}
        </>
    );
};

export default Sidebar;