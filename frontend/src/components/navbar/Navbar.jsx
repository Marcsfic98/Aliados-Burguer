import styles from './navbar.module.css'
import { LuShoppingCart ,LuCircleUser} from "react-icons/lu";
import { FaInstagram ,FaWhatsapp } from "react-icons/fa";
import { CgMenuCheese } from "react-icons/cg";
import {Drawer} from '@mui/material'
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar () {

    const [openMenu , setOpenMenu] = useState(false)

    const handleOpenMenu = () => {
        setOpenMenu(!openMenu)
    }
    return(
        <>
            <nav className={styles.navbarContainer}>
                <div className={styles.navbarItems}>
                    <div className={styles.contactsContainer}>
                        <div className={styles.contacts}>
                            <FaInstagram   className={styles.navbarIcons}/>
                            <a href="#">@ALIADOSBURGUER</a>
                        </div >

                        <div className={styles.contacts}>
                            <FaWhatsapp  className={styles.navbarIcons} />
                            <a href="#">(81) 99999-9999</a>
                        </div>
                    </div>
                    
                    <Link to={'/'}>
                        <img className={styles.logo} src='/img/logoAliados.svg'/>
                    </Link>
                    <div className={styles.navbarLinksContainer}>
                        <ul>
                            <li><Link to={'/'}>HOME</Link></li>
                            <li><Link to={'/plates'}>PRATOS</Link></li>
                            <Link to={'/cart'}><LuShoppingCart className={styles.navbarIcons} /></Link>
                            <Link to={'/profile'} ><LuCircleUser className={styles.navbarIcons} /></Link>
                        </ul>
                    </div>

                    <div className={styles.MobileNavbarLinksContainer}>
                        
                        <Link to={'/cart'}><LuShoppingCart className={styles.navbarIcons} /></Link>
                        <CgMenuCheese className={styles.navbarIcons} onClick={handleOpenMenu} />
                        
                    </div>
                </div>

                <Drawer
                anchor='right'
                open={openMenu}
                onClose={handleOpenMenu}>
                    
                    <div className={styles.drawer}>
                         <Link onClick={handleOpenMenu} to={'/'}>HOME</Link>
                         <Link onClick={handleOpenMenu} to={'/plates'}>PRATOS</Link>
                         <Link onClick={handleOpenMenu} to={'/profile'}>PERFIL</Link>
                    </div>
                    
                </Drawer>
            </nav>
        </>
    )
}