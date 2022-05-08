import React,{ useContext,useEffect} from 'react'
import { IoIosCloseCircle} from 'react-icons/io'
import { CompanyContext } from '../context/CompanyContext'
import { HashLoader } from 'react-spinners'
import Link from 'next/link'

const BuyModal = ( {close,buyTokens } ) => {

  const styles = {
    container:`h-full w-full flex flex-col`,
    closeX:`w-full h-[50px] flex items-center justify-end mb-[10px]`,
    title:`text-3xl font-bold italic flex flex-1 items-center mt-[20px] justify-center mb-[30px]`,
    content:`flex w-full mb-[30px] text-xl justify-center`,
    input:`w-full h-full flex items-center justify-center bg-[#f7f6f2] rounded-md p-[10px] flexp mx-auto`,
    inputBox:`w-full h-full flex items-center justify-center bg-[#f7f6f2] focus:outline-none focus:ring focus:border-blue-300`,
    price:`w-full h-full flex justify-center items-center mt-[20px] font-bold text-3xl`,
    buyBtn:`w-[20%] h-[50px] bg-[#000] mt-[40px] rounded-lg p-[10px] flex mx-auto text-white justify-center items-center cursor-pointer`,
    loaderContainer:`w-full h-[500px] flex items-center justify-center`,
    etherscan:`w-full h-full flex items-center justify-center text-green-500 text-2xl mt-[20px] font-bold cursor-pointer`,
    success:`w-full h-full flex items-center justify-center text-xl mt-[20px] font-bolder`,

  }

  const {
    amountDue,
    setAmountDue,
    tokenAmount,
    setTokenAmount,
    isLoading,
    setIsLoading,
    etherscanLink,
    setEtherscanLink,
  } = useContext(CompanyContext)

  useEffect(()=>{
    calculatePrice()
  },[tokenAmount])

  const calculatePrice = () => {
    const price = parseFloat(tokenAmount * 0.0001)  //计算手续费
    price=  price.toFixed(4)
    setAmountDue(price)  //最小的amount
  }

  return (
    <div className={styles.container}>
      {
        isLoading? (
          <>
            <div className={styles.loaderContainer}>
            <HashLoader size={80} />
            </div>
          </>
        ) : (
          <>
            <div className={styles.closeX}>
              <IoIosCloseCircle 
              onClick={ () => {
                  close()
                  setAmountDue('')
                  setTokenAmount('')
                  setEtherscanLink('')
                  
              }}
              fontSize={55}
              className='cursor-pointer'
              /> 
            </div>

            <div className={styles.title}> Buy more CPC token here!</div>
            <div className={styles.content}>Select # of tokens you want to buy</div>
            <div className={styles.input} >
              <input 
                type='text'
                placeholder ='Amount ....'
                className={styles.inputBox}
                onChange = {e=>setTokenAmount(e.target.value)}
                value={tokenAmount}
              />
            </div>
            <div className={styles.price}>
              Total Due : {' '}
              {tokenAmount && tokenAmount > 0? amountDue + 'ETH' : '0 ETH'}
            </div>
              
            <button
              className={styles.buyBtn}
              disabled={!tokenAmount || tokenAmount<0}
              onClick = { () => {
                setIsLoading(true)
                buyTokens()
              }}
            >
              Buy  
            </button>
            {
              etherscanLink && (
                <>
                  <div className={styles.success}>
                    transaction success and pls check receipt for the transaction below!
                  </div>
                  <Link href={`${etherscanLink}`} className={styles.etherscan}>
                    <a className={styles.etherscan} target='_blank'>
                      Transaction receipt
                    </a>  
                  </Link>
                </>
              )
            }
          </>
        )
      }
    </div>
  )
}

export default BuyModal