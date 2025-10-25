import styles from './navbar.module.css'
import { LuShoppingCart ,LuCircleUser} from "react-icons/lu";
import { FaInstagram ,FaWhatsapp } from "react-icons/fa";

export default function Navbar () {
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
                </div>
            </nav>
        </>
    )
}