import styles from './box.module.css'

export default function Box (){
    return (
        <div  className={styles.boxContainer}>
            <div  className={styles.box}>
                <img src='/img/promos/promosmash.jpg'/>
                <p>3 smash + guarana de um litro</p>
                <p className={styles.boxPrice}>R$ 32,90</p>
            </div>

            <div  className={styles.box}>
                 <img src='/img/promos/promoxburguer.jpg'/>
                 <p>2 cheese burguer + guarana de um litro</p>
                 <p className={styles.boxPrice}>R$ 26,90</p>
            </div>

            <div  className={styles.box}>
                 <img src='/img/promos/promoxbacon.jpg'/>
                 <p>2 cheddar bacon + coca cola 1 litro</p>
                 <p className={styles.boxPrice}>R$ 39,99</p>
            </div>
        </div>
    )
}