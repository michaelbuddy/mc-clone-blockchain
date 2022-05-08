import Image from 'next/image'
import React,{useContext} from 'react'
import {ConnectButton} from 'web3uikit'
import Link from 'next/link'
import { CompanyContext } from '../context/CompanyContext'
// import logo from '../assets/amazon_logo.png'
// import logoFull from '../assets/amazon_logo_full.png'
import logo from '../assets/tiger-logo.jpg'
import logoFull from '../assets/tiger-logo.jpg'

import {FaBandcamp} from 'react-icons/fa'
import {BsFillBookmarkFill} from 'react-icons/bs'
import {BsFillPersonFill} from 'react-icons/bs'
import {AiOutlineHistory} from 'react-icons/ai'


//https://www.tailwindcss.cn/docs/font-size#class-reference tailwinds样式速查
//https://react-icons.github.io/react-icons/icons?name=bs react-icons图标速查

// const isAuthenticated=true
// const username='' //Qazi Lance
// const nickname=''



const Sidebar = () => {

    const styles = {
        container : `h-full w-[300px] flex flex-col bg-[#fff] static`,
        container: `h-full w-[300px] flex flex-col bg-[#fff] static`,
        profile: ` w-full py-16 flex flex-col justify-center items-center rounded-r-3xl bg-gradient-to-t from-[#0d141c] to-[#42667e] mt-[40px] mb-[50px] border-2 border-[#fb9701]`,
        profilePicContainer: `flex  rounded-xl items-center justify-center w-full h-full mb-5`,
        profilePic: `rounded-3xl object-cover`,
        welcome: ` text-md mb-2 font-bold text-2xl text-white`,
        menu: `flex flex-col w-full h-full px-10 gap-10`,
        menuItem: `flex items-center text-lg font-bold cursor-pointer gap-2`,
        usernameInput: `bg-transparent border-white border-2 rounded-lg w-[80%] py-2 px-4 text-lg mt-[20px] placeholder:text-white focus:outline-none flex justify-center items-center text-white`,
        username: `flex items-center w-full justify-center`,
        companyLogo: `mr-4 flex object-cover`,
        companyName: `text-lg font-bold flex flex-1 pl-10 items-center mt-[20px]`,

    }

const {
    isAuthenticated,
    nickname,
    setNickname,
    username,
    handleSetUsername,
} = useContext(CompanyContext)

  return (
    <div className={styles.container}>
        <div className={styles.profile}>
            {
                isAuthenticated && (
                <>
                    <div className={styles.profilePicContainer}>
                        <Image 
                        src={`https://avatars.dicebear.com/api/pixel-art/${username}.svg`}
                        alt='profile'
                        className={styles.profilePic}
                        height={100}
                        width={100}
                        />
                    </div>
                    {!username ? (
                        <>
                        <div className={styles.username}>
                            <input 
                            type='text'
                            placeholder='Username....'
                            className={styles.usernameInput}
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                            />
                        </div>
                        <button
                        className={styles.setNickname}
                        onClick={handleSetUsername}
                        >
                         Set Nickname       
                        </button>
                        </>
                    ):(
                        <div>
                          <div className={styles.welcome}>Welcome to {username} </div>      
                        </div>

                    )}
                    </>    
                    
                )
            }
            <div className={styles.ConnectButton}>
                <ConnectButton/>
            </div>
        </div>

        <div className={styles.menu}>
            <Link href='/'>
                <div className={styles.menuItem}>
                    <Image
                    src ={logo}
                    height={40}
                    width={40}
                    className={styles.companyLogo}>

                    </Image>
                    My coin
                    <br/> board
                </div>
            </Link>
                <div className={styles.menuItem}>
                    <FaBandcamp/>
                    Collections
                </div>
                <div className={styles.menuItem}> 
                    <BsFillBookmarkFill/>
                    Saved
                </div>
                <div className={styles.menuItem}> 
                    <BsFillPersonFill/>
                    Profile
                </div>

                <Link href='/history'>
                    <div className={styles.menuItem}>
                    <AiOutlineHistory/>
                    Transcation history
                    </div>
                </Link>
        </div>

       <div className={styles.companyName}>
           <Image src={logoFull} alt='COMPANY' height={100} width={100}/>
       </div>     

     </div>
  )
}

export default Sidebar