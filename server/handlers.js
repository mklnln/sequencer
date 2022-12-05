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

// ! somaye sol'n to mongo closed error. 'mb due to a connection happening when the client.close() runs
// let clientDB = null;
// let timeOut=0
// const getClientDB = async() => {
//     clearTimeout(timeOut)
//     if(!clientDB){
//         const client = new MongoClient(MONGO_URI, options);
//         await client.connect();
//         clientDB = await client.db(DB_NAME);
//     }
//     timeOut= setTimeout(() => {
//         client.close()
//         clientDB=null
//     }, 5000);
//     return clientDB;
// }

const getUser = async (req, res) => {
  // ! somaye: avoid closed mongo server error by naming fxn where you create the db string, i.e. client.db("sequencer")
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
  console.log(songInfo, "songinfo")
  const userID = songInfo.userID
  try {
    await client.connect()

    await db.collection("users").updateOne({userID: userID}, {$set: songInfo})
    const updatedUserInfo = await db
      .collection("users")
      .findOne({userID: userID})
    res.status(200).json({
      status: 200,
      message: "Song saved. Here's the updated document",
      data: updatedUserInfo,
    })
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

const deleteSong = async (req, res) => {
  const {userID, songName} = req.body
  console.log(userID, songName)
  try {
    await client.connect()
    await db
      .collection("users")
      .updateOne({userID: userID}, {$unset: {[songName]: ""}})
    const userInfo = await db.collection("users").findOne({userID: userID})
    if (userInfo) {
      res.status(200).json({
        status: 200,
        message: "Song deleted. Here's the updated user.",
        data: userInfo,
      })
    } else {
      console.log("failed? idkwhy")
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
  deleteSong,
}
