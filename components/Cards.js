import React,{useContext} from 'react'
import { CompanyContext } from '../context/CompanyContext'
import Card from './Card'

const Cards = () => {

    const {assets} = useContext(CompanyContext)

    // const item = {
    //     id:0,
    //     attributes:{
    //         name:"dog",
    //         price:3,
    //         src:"https://media2.giphy.com/media/z8n8dWgQ0mgEIyzlmV/giphy.gif?cid=ecf05e47y86zf0a44okj0fksvb83wc3n7x1xpkvtva6nbqg4&rid=giphy.gif&ct=g"
    //     }
    // }

    const styles = {
        container:`h-full w-full flex flex-col ml-[20px] mt-[40px]`,
        title:`text-xl font-bolder mb-[20px] mt-[30px] ml-[30px]`,
        cards:`flex items-center flex-wrap gap-[80px]`,
    }

    console.log(assets)

  return (
    <div className={styles.container}>
        <div className={styles.title}>New release!!</div>
        <div className={styles.cards}>
            {/* <Card key={item.id} item = {item.attributes} /> */}
            {
                assets.map(item=>{
                return    <Card key={item.id} item = {item.attributes} />
                })
            }
        </div>
        
    </div>
  )
}

export default Cards