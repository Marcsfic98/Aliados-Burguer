import styles from './footer.module.css'
import { FaInstagram , FaTwitter , FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
    return(
        <div className={styles.footerContainer}>
            <img src="/img/logoAliados.svg" />
            <div className={styles.infos}>
                <h5>COMPARTILHE ALGO DELICIOSO</h5>
                <div className={styles.logos}>
                    <FaInstagram className={styles.logoItem}/>
                    <FaTwitter className={styles.logoItem}/>
                    <FaWhatsapp className={styles.logoItem}/>
                </div>
            </div>
        </div>
    )
}