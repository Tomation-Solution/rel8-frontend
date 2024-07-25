import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {  SideBarLinkType } from '../../types/sidebarDataType'

interface NavItemProps {
    item:SideBarLinkType,
    // toggleSidebarLink?: () => void;
    isMobileSidebarOpen:boolean;
    setIsMobileSidebarOpen: (value: boolean) => void;
    onLogout?: () => void; 
}

const NavItem = ({ item, isMobileSidebarOpen, setIsMobileSidebarOpen, onLogout }: NavItemProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = () => {
        if (item.name === 'Logout' && onLogout) {
            onLogout(); 
        } else {
            navigate(item.path || '');
            if (isMobileSidebarOpen) {
                setIsMobileSidebarOpen(false);
            }
        }
    };

    return (
        <NavLink to={item.path ? item.path : ""} onClick={handleClick} className="">
            <div className={`flex my-1 items-center justify-between gap-3 group text-[15px] font-[0.875rem] text-[#6C7383] p-3 mx-4 rounded-lg group ${location.pathname === item.path ? "bg-activeLink text-white" : "hover:bg-activeLink hover:text-white"}`}>
                <div className='flex items-center gap-2'>
                    <div className='bg-primary-dark1 rounded-full p-2'>
                        <img src={item.mainIcon} className='object-fit' alt="" />
                    </div>
                    <span className="text-sm md:text-lg">
                        {item.name}
                    </span>
                </div>
                {(item.activeLinkIcon || item.notActiveLinkIcon) && (
                    <img className='w-fit h-6 object-fit' src={location.pathname === item.path ? item.activeLinkIcon : item.notActiveLinkIcon} alt="" />
                )}
            </div>
        </NavLink>
    );
}

export default NavItem;