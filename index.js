const express = require('express')
const IPFS = require('ipfs')

const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

async function main() {
	let  cid;
       // adding to ipfs
       console.log("test called")
       const node = await IPFS.create()
       const version = await node.version()
       
       let  data = {
        "activity" : "access data",
	"by" : "me",
	"to" : "me",
	"time" : "now"
      }
      let stringified_data = JSON.stringify(data)
      const  results =  node.add(stringified_data)

     results.then(async res => { 
     console.log("Res is ",res); 
     cid = res.path 
     console.log("cid is ", cid)
     const stream = node.cat(cid);
    console.log("steam ", stream)
    let data1 = ``
    for await (const chunk of stream) {
  // chunks of data are returned as a Buffer, convert it back to a string
     data1 += chunk.toString()
  }

   console.log(data1)
}).catch(err => console.log("err is ",err))
	
      

}

app.listen(port, () =>{

main()


})



//Future plans 
//- make a endpoint which takes POST requests and stringifies the data and adds to IPFS
//- make a endpoint which takes GET requests and returns all CIDS from DB and from CIDs fetches data and shows a frontend

