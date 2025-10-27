import styles from './navbar.module.css'
import { LuShoppingCart ,LuCircleUser} from "react-icons/lu";
import { FaInstagram ,FaWhatsapp } from "react-icons/fa";
import { CgMenuCheese } from "react-icons/cg";
import {Drawer} from '@mui/material'
import { useState } from 'react';

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
                            <a href="#">@aliadosburguer</a>
                        </div >

                        <div className={styles.contacts}>
                            <FaWhatsapp  className={styles.navbarIcons} />
                            <a href="#">(81) 99999-9999</a>
                        </div>
                    </div>
                    <img className={styles.logo} src='/logoAliados.svg'/>
                    <div className={styles.navbarLinksContainer}>
                        <ul>
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Pratos</a></li>
                            <LuShoppingCart className={styles.navbarIcons} />
                            <LuCircleUser className={styles.navbarIcons} />
                        </ul>
                    </div>

                    <div className={styles.MobileNavbarLinksContainer}>
                        
                        <LuShoppingCart className={styles.navbarIcons} />
                        <CgMenuCheese className={styles.navbarIcons} onClick={handleOpenMenu} />
                        
                    </div>
                </div>

                <Drawer
                anchor='right'
                open={openMenu}
                onClose={handleOpenMenu}>
                    
                    <div className={styles.drawer}>
                        <a href="#">Home</a>
                        <a href="#">Pratos</a>
                    </div>
                    
                </Drawer>
            </nav>
        </>
    )
}