import React from 'react';
import {Link} from "react-router-dom";
import cl from './Navbar.module.css'
interface NavbarProps {
    classNames?: string;
}

const Navbar: React.FC<NavbarProps> = ({ classNames }) => {


    return (
        <div className={[cl.navbar, classNames].join(' ')}>
            <div className={cl.main__links}>
                <Link to="/" className={cl.main__item}>Superheroes</Link>
            </div>
            <div className={cl.navbar__links}>
            </div>
        </div>
    );
};

export default Navbar;
