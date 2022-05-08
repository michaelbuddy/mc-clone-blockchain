import React,{useContext} from 'react'
import Image from 'next/image'
import { CompanyContext } from '../context/CompanyContext'
import {FaCoins} from 'react-icons/fa'

const Card = ({item}) => {
    const styles = {
        cardContainer:`flex flex-col`,
        card:`h-[250px] w-[190px] rounded-3xl flex cursor-pointer transition-all duration-300  hover:scale-105 hover:shadow-xl overflow-hidden border border-black shadow-xl border-4 border-[#fb9725]`,
        cardTitle:`text-xl font-bold flex text-center w-full flex-1 justify-center mt-[10px]`,
        price:`text-md font-bold flex justify-center`,
        coins:`ml-[10px]`,
    }

    const {buyAsset} = useContext(CompanyContext)

    return (
    <div className={styles.cardContainer}
      onClick={() => buyAsset(item.price,item)}>
        <div className={styles.card}>
            <Image 
            src={item.src}
            className='object-cover object-center'
            width={200}
            height={250}
            alt="product" />
         </div>
         <div>
             <div className={styles.cardTitle}> {item.name} </div>
             <div className={styles.price}>
             {item.price} CompanyCoin <FaCoins className={styles.coins}/>    
             </div>
         </div>
    </div>
  )
}

export default Card