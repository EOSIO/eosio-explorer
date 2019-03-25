const express = require('express');
const router = express.Router();
const url = require('url');
const apiMongodbPlugin = require('@eos-toppings/api-mongodb-plugin').default;

router.get("*", (req, res) => {
  let { pathname, query } = url.parse(req.url, true);
  let endpoint = pathname.substring(1); // remove leading '/'
  
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
});

module.exports = router;
