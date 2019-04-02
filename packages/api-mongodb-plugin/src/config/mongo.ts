const mongoose = require('mongoose')

export default async (DB_URL: string) => {
  const connect = (DB_URL: string) => {
    return new Promise(function (resolve, reject) {
      mongoose.Promise = global.Promise;
      let dbStatus = '';
      
      mongoose.connect(
        DB_URL,
        {
          keepAlive: true,
          reconnectTries: 2,
          reconnectInterval: 100,
          useNewUrlParser: true
        })
        .then(
          (db:any) => {
            dbStatus = `*    DB Connection: OK\n****************************\n`
            if (process.env.NODE_ENV !== 'test') {
              // Prints initialization
              console.log('****************************')
              console.log('*    Starting Server')
              // console.log(`*    Port: ${process.env.PORT || 3000}`)
              // console.log(`*    NODE_ENV: ${process.env.NODE_ENV}`)
              console.log(`*    Database: MongoDB ` + DB_URL)
              console.log(dbStatus)
            }
            resolve(db);
          }
        )
        .catch((err:any)=>{
          dbStatus = `*    Error connecting to DB: ${err}\n****************************\n`;
          console.log(dbStatus);
          reject(err.message);
        });
        
      mongoose.set('useCreateIndex', true);
      mongoose.set('useFindAndModify', false);
    });
  }
  return connect(DB_URL);
}
