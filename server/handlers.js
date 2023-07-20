'use strict'

const { MongoClient } = require('mongodb')

require('dotenv').config()
const { MONGO_URI } = process.env
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
const client = new MongoClient(MONGO_URI, options)
const db = client.db('sequencer')

const getUser = async (req, res) => {
    const { userID } = req.params
    console.log('getting user')
    try {
        await client.connect()
        console.log('connected to mongo client')
        const userInfo = await db
            .collection('users')
            .findOne({ userID: userID })
        console.log(userInfo, 'userInfo, already made')
        if (userInfo) {
            res.status(200).json({
                status: 200,
                message: "Request received. Here's the user.",
                data: userInfo,
            })
        } else {
            await users.insertOne({ userID: userID })
            const newUserInfo = await db
                .collection('users')
                .findOne({ userID: userID })
            console.log(newUserInfo, 'newUserInfo, freshly made')
            if (newUserInfo) {
                res.status(200).json({
                    status: 200,
                    message: `User created.`,
                    data: newUserInfo,
                })
            }
        }
    } catch (err) {
        console.log(err.stack)
    } finally {
        client.close()
        console.log('disconnected from mongo client')
    }
}

const saveSong = async (req, res) => {
    const userID = req.body.userID
    const songObj = req.body.song
    const songName = req.body.song.songName
    const users = db.collection('users')
    // ? should i remove songName from the song object before committing it to the DB?
    try {
        await client.connect()
        const DBSongs = await users.findOne({ userID: userID })
        if (!DBSongs) {
            await users.insertOne({ userID: userID })
        }
        const updateCommand = { $set: { [`songs.${songName}`]: songObj } }
        await users.findOneAndUpdate({ userID: userID }, updateCommand)
        const updatedUserInfo = await users.findOne({ userID: userID })
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
    const { userID } = req.params
    console.log(userID, 'from load-songs BE handler')
    try {
        await client.connect()
        console.log('connected to mongo client')
        const userInfo = await db
            .collection('users')
            .findOne({ userID: userID })

        if (userInfo) {
            res.status(200).json({
                status: 200,
                message: "Request received. Here's the user and all songs.",
                data: userInfo,
            })
        } else {
            res.status(200).json({
                status: 200,
                message: 'Request received. User has not yet saved any songs.',
            })
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.close()
        console.log('disconnected from mongo client')
    }
}

const deleteSong = async (req, res) => {
    const { userID, songName } = req.body
    try {
        await client.connect()
        console.log('connected to mongo client')
        await db
            .collection('users')
            .updateOne({ userID: userID }, { $unset: { [songName]: '' } })
        const userInfo = await db
            .collection('users')
            .findOne({ userID: userID })
        if (userInfo) {
            res.status(200).json({
                status: 200,
                message: "Song deleted. Here's the updated user.",
                data: userInfo,
            })
        }
    } catch (err) {
        console.log(err.stack)
    } finally {
        client.close()
        console.log('disconnected from mongo client')
    }
}

module.exports = {
    getUser,
    saveSong,
    loadSongs,
    deleteSong,
}
