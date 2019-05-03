const express = require('express');
const router = express.Router();
const url = require('url');
const apiMongodbPlugin = require('@eosio-toppings/api-mongodb-plugin').default;
const connectMongo = require('@eosio-toppings/api-mongodb-plugin').connectMongo;

router.get("*", (req, res) => {
  let { pathname, query } = url.parse(req.url, true);
  let endpoint = pathname.substring(1); // remove leading '/'

  if ( endpoint === "set_endpoint"){
    let { path } = query;
    connectMongo(path)
     .then(()=>{
       
        res.setHeader('Cache-Control', 'no-cache');
        res.json({response: `Mongodb connection changed to ${path}.`});
      })
      .catch(err=>{
        console.error(err);
        res.status(500);
        res.json(err).end();
      });
  }else{
    apiMongodbPlugin[endpoint](query)
      .then(doc=>{
        res.setHeader('Cache-Control', 'no-cache');
        res.json(doc);
      })
      .catch(err=>{
        console.error(err);
        res.status(500);
        res.json(err).end();
      });
  }
});

module.exports = router;
