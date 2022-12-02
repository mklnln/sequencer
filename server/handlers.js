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
  const songInfo = req.body
  const {songName} = req.params
  console.log(songInfo, "songinfo")
  const userID = songInfo.userID
  // ! can't figure out why i cant get anything in the body of my post
  try {
    await client.connect()
    const userInfo = await db.collection("users").findOne({userID: userID})
    if (userInfo) {
      console.log(userInfo)
      await db.collection("users").updateOne({userID: userID}, {$set: songInfo})
      const updatedUserInfo = await db
        .collection("users")
        .findOne({userID: userID})
      res.status(200).json({
        status: 200,
        message: "Song saved. Here's the updated document",
        data: updatedUserInfo,
      })
    }
  } catch (err) {
    console.log(err.stack)
  } finally {
    client.close()
  }
}

const loadSongs = async (req, res) => {
  const {userID} = req.params
  console.log("hello, we reached loadSongs")
  console.log(userID)
  try {
    await client.connect()
    const userInfo = await db.collection("users").findOne({userID: userID})
    if (userInfo) {
      res.status(200).json({
        status: 200,
        message: "Request received. Here's the user and all songs.",
        data: userInfo,
      })
    }
  } catch (err) {
    console.log(err.stack)
  } finally {
    client.close()
  }
}

module.exports = {
  getUser,
  saveSong,
  loadSongs,
}
