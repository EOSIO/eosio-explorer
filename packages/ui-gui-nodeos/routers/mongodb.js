const express = require('express');
const router = express.Router();

const apiMongodbPlugin = require('@eos-toppings/api-mongodb-plugin').default;

router.get("*", (req, res) => {
  let endpoint = req.path.substring(1); // remove leading '/'
  apiMongodbPlugin[endpoint]()
    .then(doc=>{
      res.setHeader('Cache-Control', 'no-cache');
      res.json(doc);
    })
    .catch(err=>{
      console.error(err);
    });
});

module.exports = router;
