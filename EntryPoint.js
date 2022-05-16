const { json } = require("express");
const express = require("express");
const getBusinesses = require("./getBusinesses");
const getBusiness = require("./getBusiness");

const app = express();

app.get("/id_search", async (req, res) => {
  const { id_number } = req.query;
  console.log(id_number);
  const results = await getBusinesses(id_number);
  const data = res.status(200).json(results);
});
app.get("/kc_search", async (req, res) => {
  const { kc_number } = req.query;
  console.log(kc_number);
  const results = await getBusiness(kc_number);
  const data = res.status(200).json(results);
});

const port = process.env.PORT || 4000;

app.listen(port, function () {
  console.log("listening on port " + port);
});
