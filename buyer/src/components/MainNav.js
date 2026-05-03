import { useState } from 'react';
import { Button, Drawer, Input } from 'antd';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { clearAuthToken, getAuthUser } from '../auth';

const { Search } = Input;

const getInitials = (username) => {
    if(!username){
        return 'U';
    }

    return username
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
};

function MainNav() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const authUser = getAuthUser();
    const initials = getInitials(authUser?.username);

    const closeDrawer = () => {
        setIsOpen(false);
    };

    const handleSignOut = () => {
        clearAuthToken();
        window.location.href = '/signin';
    };

    const handleSearch = (value) => {
        const search = value.trim();

        if(search){
            navigate(`/?search=${encodeURIComponent(search)}`);
        }else{
            navigate('/');
        }
    };

    return (
        <header className="main-nav">
            <NavLink className="brand-button" to="/">
                Buyer App
            </NavLink>
            <Search
                allowClear
                className="header-search"
                defaultValue={searchParams.get('search') || ''}
                onSearch={handleSearch}
                placeholder="Search products"
            />
            <Button
                aria-label="Open user menu"
                className="profile-menu-button"
                onClick={() => setIsOpen(true)}
                shape="circle"
                type="primary"
            >
                <span aria-hidden="true" className="profile-menu-icon">{initials}</span>
            </Button>

            <Drawer
                open={isOpen}
                onClose={closeDrawer}
                placement="right"
                title={authUser?.email || 'User'}
                width={320}
            >
                <nav className="drawer-links">
                    <NavLink to="/profile" onClick={closeDrawer}>User profile</NavLink>
                    <NavLink to="/orders" onClick={closeDrawer}>Orders</NavLink>
                    <Button className="drawer-signout" danger onClick={handleSignOut} type="default">
                        Sign out
                    </Button>
                </nav>
            </Drawer>
        </header>
    );
}

export default MainNav;
