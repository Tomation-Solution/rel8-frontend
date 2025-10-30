import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { SideBarLinkType } from '../../types/sidebarDataType';
import { useState } from 'react';

interface NavItemProps {
    item: SideBarLinkType;
    isMobileSidebarOpen: boolean;
    setIsMobileSidebarOpen: (value: boolean) => void;
    onLogout?: () => void;
    
}

const NavItem = ({ item, isMobileSidebarOpen, setIsMobileSidebarOpen, onLogout }: NavItemProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

    const handleClick = () => {
        if (item.name === 'Logout' && onLogout) {
            onLogout();
        } else if (item.subMenu) {
            setIsDropdownOpen(!isDropdownOpen);
        } else {
            navigate(item.path || '');
            if (isMobileSidebarOpen) {
                setIsMobileSidebarOpen(false);
            }
        }
    };

    const handleSubMenuClick = (path: string, isMessage?: boolean) => {
        if (isMessage) return; // Don't navigate if it's just a message
        
        setActiveSubMenu(path);
        navigate(path);
        setIsMobileSidebarOpen(false);
    };

    return (
        <>
            <NavLink to={item.path ? item.path : ""} onClick={handleClick} className="">
                <div className={`flex my-1 items-center justify-between gap-3 group text-[15px] font-[0.875rem]  p-3 mx-4 rounded-lg group ${
                    location.pathname === item.path ? "bg-org-secondary text-org-primary" : "hover:bg-org-secondary hover:text-org-primary text-org-secondary/50"
                }`}>
                    <div className='flex items-center gap-2'>
                        <div className='bg-org-primary rounded-full p-2'>
                            <img src={item.mainIcon} className='object-fit' alt="" />
                        </div>
                        <span className="text-sm md:text-lg">
                            {item.name}
                        </span>
                    </div>
                    {(item.activeLinkIcon || item.notActiveLinkIcon) && (
                        <img 
                            className='w-fit h-6 object-fit' 
                            src={location.pathname === item.path ? item.activeLinkIcon : item.notActiveLinkIcon} 
                            alt="" 
                        />
                    )}
                </div>
            </NavLink>
            {isDropdownOpen && item.subMenu && (
                <div className="ml-6 mt-2 space-y-2">
                    {item.subMenu.map((subItem, index) => (
                        <div 
                            key={index} 
                            onClick={() => handleSubMenuClick(subItem.path, subItem.isMessage)}
                            className={`block text-sm p-2 rounded-lg ${
                                subItem.isMessage 
                                    ? "text-gray-500 itali cursor-default" 
                                    : `cursor-pointer ${
                                        activeSubMenu === subItem.path 
                                            ? "text-white bg-org-primary" 
                                            : "text-gray-600 hover:text-white hover:bg-gray-700"
                                    }`
                            }`}
                        >
                            {subItem.name}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default NavItem;