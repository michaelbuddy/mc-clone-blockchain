import { createContext, useState,useEffect} from "react"
import { useMoralis,useMoralisQuery } from 'react-moralis'
import { companyAbi,companyCoinAddress } from "../lib/constants"
import { ethers } from "ethers"

export const CompanyContext = createContext()


export const CompanyProvider = ({ children }) => {

    const [username,setUserName] = useState('')  //数组结构，useState[0] useState[1] 传递
    const [nickname,setNickname] = useState('')
    const [balance,setBalance] = useState('')
    const [tokenAmount,setTokenAmount] = useState('')
    const [etherscanLink,setEtherscanLink] = useState('')
    const [isLoading,setIsLoading] = useState(false)
    const [currentAccount,setCurrentAccount] = useState('')
    const [amountDue,setAmountDue] = useState('')
    const [assets,setAssets] = useState([])
    const [recentTransactions,setRecentTransactions] = useState([])
    const [ownedItems,setOwnedItems] = useState([])

    const {
        authenticate,
        isAuthenticated,
        enableWeb3,
        Moralis,
        user,
        isWeb3Enabled,
    } = useMoralis()

    const {
        data: assetsData,
        error:assetsDataError,
        isLoading:assetsDataIsLoading,
    } = useMoralisQuery('assets')

    //这里用来query user，用来保存nft和user的匹配关系，调用Moralis的查询接口
    const {
        data: userData,
        error: userDataError,
        isLoading: userDataIsLoading,
    } = useMoralisQuery('_User')




    // useEffect( async() => {
    //     console.log(assetsData)
    //     await enableWeb3()
    //     await getAssets()
    // },[assetsData,assetsDataIsLoading])

    useEffect(()=> {
        ;(async() => {
            console.log(assetsData)
            await enableWeb3()
            await getAssets()
            await getOwnedAssets()
        })()
    } ,[userData,assetsData,assetsDataIsLoading,userDataIsLoading])

    const getBalance = async() => {
        try{
              if(!isAuthenticated || !currentAccount) return
              
              const options ={
                  contractAddress: companyCoinAddress,
                  functionName: 'balanceOf',
                  abi: companyAbi,
                  params:{
                      account: currentAccount,
                  },
              }
              if(isWeb3Enabled) {
                  const response = await Moralis.executeFunction(options)
                  console.log('Token Balance is ',response.toString())
                  setBalance(response.toString())
              }
        }
     catch(error) {
        console.log(error)
        }
    }

    useEffect(
        () => {
            ;(async()=>{
                if(!isWeb3Enabled) {
                  await enableWeb3()
                }
                await listenToUpdates()

                if(isAuthenticated) {
                    await getBalance()
                    const currentUsername=await user?.get('nickname')  //Moralis里MongoDB的字段
                    setUserName(currentUsername)
                    const account = await user?.get('ethAddress')  //Moralis里MongoDB的字段ethAddress
                    setCurrentAccount(account)
                } else {
                    setCurrentAccount('')
                    setBalance('')
                }
        })()
    }, [isWeb3Enabled,isAuthenticated,balance,setBalance,authenticate,setUserName,currentAccount,user,username])
    

    // useEffect(() => {
    //     ;(async()=>{
    //         if(isWeb3Enabled){
    //             await getAssets()
    //         }
    //     })()
    // },[isWeb3Enabled,assetsData,assetsDataIsLoading])

    const handleSetUsername=() =>{
        if(user) {
            if(nickname) {
                user.set('nickname',nickname)
                user.save()
                setNickname('')
            } else {
                console.log('can not set an empty nickname')
            }
        } else {
            console.log('no user found')
        }
    }
    
    //通过token来购买NFT assets,price是token代币的数量
    const buyAsset = async(price,asset) => {
        try {
            if(!isAuthenticated) return
            console.log("[buyAsset] BEGIN...")
            console.log('price: ',price)
            console.log('assets: ',asset.name)
            console.log('userData: ',userData)
            
            const options = {
                type: 'erc20',
                amount: price,
                receiver: companyCoinAddress,
                contractAddress: companyCoinAddress
            }

            let transaction = await Moralis.transfer(options)
            const receipt = await transaction.wait()
            if(receipt) {
                console.log("[buyAsset] WAITING FOR RECEIPT")
                console.log("[buyAsset] userData[0]: ",userData[0])

                //userData[0]代表最近一次logon的用户,并添加ownedAssets字段,Moralis里的_User表
                const res = userData[0].add('ownedAssets',{
                    ...asset,
                    purchaseDate: Date.now(),
                    etherscanLink: `https://rinkeby.etherscan.io/tx/${receipt.transactionHash}`   
                })
                
                await res.save().then(() => {
                    alert("Great! You have succ purchased the asset!!!")
                }
                ) 
            }

            console.log("[buyAsset] SUCCESS")

        } catch(error) {
            console.log('buy assets error:',error)
        }

    }

    const connectWallet = async() => {
        await enableWeb3()
        await authenticate()
    }

    const buyTokens = async() => {
        if(!isAuthenticated) {
            await connectWallet()
        }

        const amount = ethers.BigNumber.from(tokenAmount)  //the amount of CompanyCoin Token 
        const price = ethers.BigNumber.from('100000000000000')  //Unit Wei convert from 0.0001 ether
        const calPrice = amount.mul(price)

        let options = {
            contractAddress: companyCoinAddress,
            functionName: 'mint',
            abi: companyAbi,
            msgValue: calPrice,
            params: {
                amount,
            },
        }

        const transaction = await Moralis.executeFunction(options)
        const receipt = await transaction.wait()  //wait 4 blocks
        setIsLoading(false)
        console.log(receipt)
        setEtherscanLink(
            `https://rinkeby.etherscan.io/tx/${receipt.transactionHash}`,
            )

    }
 
    const listenToUpdates = async() => {
       let query = new Moralis.Query('EthTransactions') 
       let subscription = await query.subscribe()
       //每次transaction有update，捕获到放到object中
       subscription.on('update', async object => {
           console.log('NEW TRANSACTION')
           console.log(object)
           setRecentTransactions([object])
       })    
    }

    const getAssets= async() => {
        try {
            await enableWeb3()
            console.log("query Moralis running")
            setAssets(assetsData)
        } catch(error) {
            console.log(error)
        }

    }

    const getOwnedAssets = async() => {
        try {
            console.log('Logon User : ',userData[0])

            if(userData[0]) {  //login account is userData[0]
                setOwnedItems(prevItems => [
                    ...prevItems,
                    userData[0].attributes.ownedAssets,
                ])
            }
            console.log('Begin setOwnedItems: ',ownedItems)

        } catch (error) {
            console.log('getOwnedAssets ERROR: ',error)
        }

    }

    return (
        <CompanyContext.Provider
        value ={{
                isAuthenticated,
                nickname,
                setNickname,
                username,
                handleSetUsername,
                assets,
                balance,
                getBalance,
                tokenAmount, //必须添加这个，否则buyModal部分找不到
                setTokenAmount,
                amountDue,
                setAmountDue,
                isLoading,
                setIsLoading,
                setEtherscanLink,
                etherscanLink,
                currentAccount,
                buyTokens,
                buyAsset,
                recentTransactions,
                ownedItems,
    
        }}>
            {children}
        </CompanyContext.Provider>
    )
}