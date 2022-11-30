"use strict"

const express = require("express")
// const helmet = require("helmet")
const port = 4000
const morgan = require("morgan")

const {getUser, saveSong} = require("./handlers")
express()
  //   .use(morgan("tiny"))
  //   .use(express.static("./server/assets"))
  //   .use(express.json())
  //   .use(express.urlencoded({extended: false}))
  //   .use("/", express.static(__dirname + "/"))
  // .get("/hello", (req, res) => {
  //   res.status(200).json({status: 200, message: "yo waddap"})
  // })
  .get("/api/user-login/:userID", getUser)
  .get("/", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    })
  })
  .post("/api/save-song", saveSong)

  .listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
