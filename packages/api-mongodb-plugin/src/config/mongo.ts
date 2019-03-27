const mongoose = require('mongoose')

export default async (DB_URL: string) => {
  const connect = (DB_URL: string) => {
    mongoose.Promise = global.Promise
    mongoose.connect(
      DB_URL,
      {
        keepAlive: true,
        reconnectTries: 2,
        reconnectInterval: 100,
        useNewUrlParser: true
      },
      (err: any) => {
        let dbStatus = ''
        if (err) {
          dbStatus = `*    Error connecting to DB: ${err}\n****************************\n`
        }
        dbStatus = `*    DB Connection: OK\n****************************\n`
        if (process.env.NODE_ENV !== 'test') {
          // Prints initialization
          console.log('****************************')
          console.log('*    Starting Server')
          // console.log(`*    Port: ${process.env.PORT || 3000}`)
          // console.log(`*    NODE_ENV: ${process.env.NODE_ENV}`)
          console.log(`*    Database: MongoDB`)
          console.log(dbStatus)
        }
      }
    )
    mongoose.set('useCreateIndex', true)
    mongoose.set('useFindAndModify', false)

  }
  connect(DB_URL)

  mongoose.connection.once('error', (err: Error)=>{
    console.log("-->error");
    console.log(err);
    console.log("-->error");
  })
  mongoose.connection.once('reconnected', ()=>{
    console.log("-->reconnected");
    console.log(DB_URL);
    console.log("-->reconnected");
  })
  mongoose.connection.once('disconnected', ()=>{
    console.log("-->disconnected");
    console.log(DB_URL);
    console.log("-->disconnected");
  })

  return await mongoose;


  // loadModels()
}
