const express = require('express');
const router = express.Router();
const url = require('url');
const apiPostgresPlugin = require('@eosio-toppings/api-postgres-plugin');

router.get("*", (req, res) => {
  let { pathname, query } = url.parse(req.url, true);
  let endpoint = pathname.substring(1); // remove leading '/'

  apiPostgresPlugin[endpoint](query)
    .then(doc=>{
      res.setHeader('Cache-Control', 'no-cache');
      res.json(doc);
    })
    .catch(err=>{
      console.error(err);
      res.status(500);
      res.json(err).end();
    });

 
});

module.exports = router;
