const express = require("express");
const helmet = require("helmet");
const port = 8000;
const morgan = require("morgan");
express()
  .use(express.json())
  .use(helmet())
  .use(morgan("tiny"))
  .get("/hello", (req, res) => {
    res.status(200).json({ status: 200, message: "yo waddap" });
  })
  .listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
