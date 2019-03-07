const express = require('express');
const path = require('path');
const router = express.Router();
const app = express();
const { getAccounts } = require('@eos-toppings/api-mongodb-plugin');

const PORT = 5000;

//only serve api calls ( not the static build/ ) in development mode, create react app in develop will call the APIs from a proxy.
if ( process.env.MODE !== 'development'){
  app.use(express.static(path.join(__dirname, 'build')));
}

router.get("/getAccounts", (req, res) => {
  getAccounts
    .then(doc=>{
      res.setHeader('Cache-Control', 'no-cache');
      res.json(doc);
    })
    .catch(err=>{
      console.error(err);
    });
});

app.use("/api", router);

app.on('error', function (e) {
  // do your thing
  console.log(e);
});

app.listen(PORT, ()=>{
  console.log(`Listening ${process.env.MODE !== `development`  ? `static \`build/\` folder and ` : `` }API calls on port ${PORT} in production mode.`)
});
