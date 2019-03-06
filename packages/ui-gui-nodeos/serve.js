const express = require('express');
const path = require('path');
const router = express.Router();
const app = express();
const { getAccounts } = require('@eos-toppings/api-mongodb-plugin');

app.use(express.static(path.join(__dirname, 'build')));

router.get("/getAccounts", (req, res) => {
  getAccounts
    .then(doc=>{
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

app.listen(9000);
