const express = require('express');
const path = require('path');
const app = express();
const mongodb = require('./routers/mongodb');

const openBrowser = require('./helpers/openBrowser');

const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const envConfig = fs.existsSync('.env.local') && dotenv.parse(fs.readFileSync('.env.local'));

if (envConfig){
  for (let k in envConfig) {
    process.env[k] = envConfig[k];
  }
}
let endpointConfigPath = process.argv.slice(2)[0];
let endpointConfig = JSON.parse(fs.readFileSync(endpointConfigPath, 'utf-8')); 

const PORT = process.env.REACT_APP_APP_SERVE_PORT;

// If serve.js is called from yarn serve-clear, set lastTimestamp = current timestamp
const lastTimestamp = process.env.CLEARBROWSERSTORAGE ? Math.floor(new Date() / 1000) : "";

app.use((req, res, next) => {

  // Always assign a value to the lastTimestamp cookie, either current timestamp or an empty string.
  res.cookie("lastTimestamp", lastTimestamp );
  next();
});

//only serve api calls ( not the static build/ ) in development mode, create react app in develop will call the APIs from a proxy.
if ( process.env.MODE !== 'development'){
  app.use(express.static(path.join(__dirname, 'build')));
}

app.use("/api/mongodb", mongodb);

// catch-all route to /page-not-found/index.html defined last to handle page not found error
app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/build/page-not-found/index.html');
})

app.on('error', function (e) {
  // do your thing
  console.log(e);
});

app.listen(PORT, ()=>{
  console.log(`Listening ${process.env.MODE !== `development`  ? `static \`build/\` folder and ` : `` }API calls on port ${PORT} in production mode.`);
  console.log(``);
  if(`${process.env.MODE}` !== `development`){
    let url;
    if(endpointConfig.hasOwnProperty("NodesEndpoint") && endpointConfig["NodesEndpoint"] != "" 
        && endpointConfig.hasOwnProperty("DBEndpoint") && endpointConfig["DBEndpoint"] != ""){
      console.log("Here");
      url = "http://localhost:" + PORT +"?nodeos="+endpointConfig.NodesEndpoint.trim()+"&mongodb="+endpointConfig.DBEndpoint.trim();
    }else{
      url = "http://localhost:" + PORT;
    }    
    console.log(`Application is ready on "${url}".`);
    console.log(`You can now view EOSIO Labs™: EOSIO Explorer in the browser.`);
    openBrowser(url);
  }
});
