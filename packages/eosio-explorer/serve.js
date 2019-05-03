const express = require('express');
const path = require('path');
const app = express();
const mongodb = require('./routers/mongodb');

const openBrowser = require('react-dev-utils/openBrowser');

const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const envConfig = fs.existsSync('.env.local') && dotenv.parse(fs.readFileSync('.env.local'));

if (envConfig){
  for (let k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

const PORT = process.env.REACT_APP_APP_SERVE_PORT;

//only serve api calls ( not the static build/ ) in development mode, create react app in develop will call the APIs from a proxy.
if ( process.env.MODE !== 'development'){
  app.use(express.static(path.join(__dirname, 'build')));
}

app.use("/api/mongodb", mongodb);

app.on('error', function (e) {
  // do your thing
  console.log(e);
});

app.listen(PORT, ()=>{
  console.log(`Listening ${process.env.MODE !== `development`  ? `static \`build/\` folder and ` : `` }API calls on port ${PORT} in production mode.`);
  console.log(``);
  if(`${process.env.MODE}` !== `development`){
    let url = "http://localhost:" + PORT;
    console.log(`Application is ready on "${url}".`);
    console.log(`You can now view EOSIO Explorer in the browser.`);
    openBrowser(url);
  }
});
