import React,{useContext} from 'react'
import { CompanyContext } from '../context/CompanyContext'
import Image from 'next/image'
import logo from '../assets/tiger-logo.jpg'
import { CgMenuGridR } from 'react-icons/cg'
import { FaSearchDollar } from 'react-icons/fa'
import { FaCoins } from 'react-icons/fa'
import {
    ModalProvider,
    Modal,
    useModal,
    ModalTransition,
} from 'react-simple-hook-modal'
import 'react-simple-hook-modal/dist/styles.css'
import BuyModal from './BuyModal'

// const balance = "999"

const Header = () => {
  const styles = {
      container :`h-[60px] w-full flex items-center gap-5 px-16`,
      logo: `flex items-center ml-[10px]  flex-1`,
      search: `p-[35px] mr-[30px] w-[400px] h-[40px] bg-white rounded-full shadow-lg flex flex items-center border border-black`,
      searchInput: `bg-transparent focus:outline-none border-none flex-1 items-center flex`,
      menu: `flex items-center gap-6`,
      menuItem: `flex items-center text-md font-bold cursor-pointer`,
      coins: `ml-[10px]`,
  }  

//   const { buyTokens } = useContext(CompanyContext)
  const { balance ,buyTokens } = useContext(CompanyContext)
  const { openModal,isModalOpen,closeModal } = useModal()
   

  return (
    <ModalProvider> 
        <div className={styles.container}>
            <div className={styles.logo}>
                <Image 
                    src={logo}
                    alt="Tiger Company"
                    height={100}
                    width={140}
                    className='object-cover'/>
            </div>

            <div className={styles.search}>
                <input
                    type='text'
                    placeholder='search the NFT assets...'
                    className={styles.searchInput} />
                <FaSearchDollar fontSize={20} />
            </div>

            <div className={styles.menu}>
                <div className={styles.menuItem}>New Releases</div>
                <div className={styles.menuItem}>Featured</div>

                { balance? (
                <div className={(styles.balance,styles.menuItem)}
                    onClick={openModal}
                > 
                {balance}
                <FaCoins className={styles.coins} />
                <Modal isOpen={isModalOpen} transition={ModalTransition.BOTTOM_UP}>
                    <BuyModal close={closeModal}  buyTokens={buyTokens} />
                </Modal>
                </div>
                ) : (
                <div className={(styles.balance,styles.menuItem)}
                    onClick={openModal}
            > 
                0 CPC <FaCoins className={styles.coins} />
                <Modal isOpen={isModalOpen} transition={ModalTransition.SCALE}>
                        <BuyModal close={closeModal}  buyTokens={buyTokens} />
                </Modal>
                </div>
                )
                }
                <CgMenuGridR fontSize={30} className={styles.menuItem}/>
            </div>        
        </div>
    </ModalProvider>
  )
}

export default Header