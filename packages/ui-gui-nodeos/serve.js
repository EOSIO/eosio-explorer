const express = require('express');
const path = require('path');
const app = express();
const mongodb = require('./routers/mongodb');

const PORT = 5000;

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
  console.log(`Listening ${process.env.MODE !== `development`  ? `static \`build/\` folder and ` : `` }API calls on port ${PORT} in production mode.`)
});
