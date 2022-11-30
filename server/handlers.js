"use strict"

const {MongoClient} = require("mongodb")

require("dotenv").config()
const {MONGO_URI} = process.env
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
const client = new MongoClient(MONGO_URI, options)

const db = client.db("sequencer")

const getUser = async (req, res) => {
  console.log(req.params)
  const {userID} = req.params
  console.log("hello, we reached handler")
  console.log(userID)
  try {
    await client.connect()
    // ! findOne & insertOne parameter prolly no work
    // ! findOne & insertOne parameter prolly no work
    const userInfo = await db.collection("users").findOne({userID: userID})
    if (userInfo) {
      res.status(200).json({
        status: 200,
        message: "Request received. Here's the user.",
        data: userInfo,
      })
    } else {
      // ! MAKE a new user if none found
      // ! MAKE a new user if none found
      await db.collection("users").insertOne({userID: userID})
      const userInfo = await db.collection("users").findOne({userID: userID})
      if (userInfo) {
        res.status(200).json({
          status: 200,
          message: `User created.`,
          data: userInfo,
        })
      }
    }
  } catch (err) {
    console.log(err.stack)
  } finally {
    client.close()
  }
}

const saveSong = async (req, res) => {
  const songInfo = {...req.body}
  // ! can't figure out why i cant get anything in the body of my post
  console.log(songInfo, "song")
  try {
    await client.connect()
    // const userInfo = await db.collection("users").findOne({userID: userID})
    // if (userInfo) {
    //   res.status(200).json({
    //     status: 200,
    //     message: "Request received. Here's the user.",
    //     data: userInfo,
    //   })
    // } else {
    //   // // await db.collection("users").insertOne({userID: userID})
    //   // const userInfo = await db.collection("users").findOne({userID: userID})
    //   if (userInfo) {
    //     res.status(200).json({
    //       status: 200,
    //       message: `User created.`,
    //       data: userInfo,
    //     })
    //   }
    // }
  } catch (err) {
    console.log(err.stack)
  } finally {
    client.close()
  }
}

module.exports = {
  getUser,
  saveSong,
}
