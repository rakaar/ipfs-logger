const express = require('express')
const IPFS = require('ipfs')

const app = express()
const port = 3000

const sqlite3 = require('sqlite3').verbose();
const db_name =  "hashes.db";
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the Database");
});

const sql_create = `CREATE TABLE IF NOT EXISTS Hashes (
   Hash VARCHAR(300)
 );`;


 db.run(sql_create, err => {
   if (err) {
     return console.error(err.message);
   }
   console.log("Successful creation of the 'Hashes' table");
 });


// GET endpoint to test if server is working or not
app.get('/', (req, res) => res.send('Alive !'))


//POST endpoint to add data to the IPFS
app.post('/write', async (req, res) => {
   const data = JSON.stringify(res.body)

   const node = await IPFS.create()
   const  results =  node.add(data)

   results
      .then(res => {
        const sql_insert = `INSERT INTO Hashes (Hash) VALUES ${(res.path)};`;
        db.run(sql_insert, err => {
         if (err) {
            return console.error(err.message);
          }

          console.log("Successful creation of Hashes");
          res.send("success")

        })

      })
      .catch(err => {
         res.send(err);
         return
      })
})

// GET endpoint to get all the hashes and information from the hashes
app.get('/read', (req, res) => {
   const sql_read = `SELECT * FROM Hashes;`
   db.all(sql_read, [], (err, rows) => {
      if(err) {
         console.log("Error in reading DB")
         return err;
      }

      res.send(rows)

   })
})


// async function main() {
// 	let  cid;
//        // adding to ipfs
//        console.log("test called")
//        const node = await IPFS.create()
//        const version = await node.version()
       
//        let  data = {
//         "activity" : "access data",
//             	"by" : "me",
// 	             "to" : "me",
// 	            "time" : "now"
//            }
//       let stringified_data = JSON.stringify(data)
//       const  results =  node.add(stringified_data)

//      results.then(async res => { 
//      console.log("Res is ",res); 
//      cid = res.path 
//      console.log("cid is ", cid)
//      const stream = node.cat(cid);
//     console.log("steam ", stream)
//     let data1 = ``
//     for await (const chunk of stream) {
//   // chunks of data are returned as a Buffer, convert it back to a string
//      data1 += chunk.toString()
//   }

//    console.log(data1)
// }).catch(err => console.log("err is ",err))
// }

app.listen(port, () =>{
   console.log(`Listening at port ${port}`)
})



//Future plans 
//- make a endpoint which takes POST requests and stringifies the data and adds to IPFS
//- make a endpoint which takes GET requests and returns all CIDS from DB and from CIDs fetches data and shows a frontend

