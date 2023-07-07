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
            await db.collection('users').insertOne({ userID: userID })
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
    const songInfo = req.body
    const userID = songInfo.userID
    const songName = songInfo.song.songName
    const songObj = songInfo.song
    try {
        await client.connect()
        console.log('connected to mongo client')

        const objDBSongs = await db
            .collection('users')
            .findOne({ userID: userID })
        console.log(objDBSongs, 'dbdbdbdb')

        // todo create userID if objDBSongs is null
        await db.collection('users').insertOne({ userID: userID })
        if (!objDBSongs) {
            // ?
        }

        // objDBSongs.songs[songName] = songObj
        await db
            .collection('users')
            .updateOne(
                { userID: userID },
                { $set: { songs: objDBSongs.songs } }
            )
        const updatedUserInfo = await db
            .collection('users')
            .findOne({ userID: userID })
        res.status(200).json({
            status: 200,
            message: "Song saved. Here's the updated document",
            data: updatedUserInfo,
        })
    } catch (err) {
        console.log(err.stack)
    } finally {
        client.close()
        console.log('disconnected from mongo client')
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

        console.log(userInfo, 'da response we need')
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
