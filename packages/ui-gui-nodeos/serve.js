const express = require('express');
const axios = require('axios');
const path = require('path');
const router = express.Router();
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

router.get("/getData", (req, res) => {
  axios.get('http://worldclockapi.com/api/json/est/now')
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.use("/api", router);

app.listen(9000);
