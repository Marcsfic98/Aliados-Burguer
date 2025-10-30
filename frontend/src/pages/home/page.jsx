import styles from './page.module.css'
import Dessert from '../../../public/img/homepage/dessert'
import NaturalFood from '../../../public/img/homepage/naturalFood'
import Vegetable from '../../../public/img/homepage/vegetable'
import { FaMapMarkerAlt, FaFacebookSquare, FaInstagram, FaWhatsapp } from "react-icons/fa"
import Box from '../../components/box/box'

export default function Home() {
    return (
        <div className={styles.pageContainer}>
            <section className={styles.bannerSection}>

               <div className={styles.bannerTxt}>
                    <h2>HAMBÚRGUER <br/> DE VERDADE</h2>
                    <button>PEÇA AGORA</button>
               </div>
               <div className={styles.bannerImg}></div>
            </section >
            
            <section className={styles.promoSection}>
                 <h2>PROMOÇÕES</h2>

                 <Box/>
            </section>
           
        </div>
    )
}