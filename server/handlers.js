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
    console.log('literally anything coming out of this handler?')
    try {
        await client.connect()
        const userInfo = await db
            .collection('users')
            .findOne({ userID: userID })
        if (userInfo) {
            res.status(200).json({
                status: 200,
                message: "Request received. Here's the user.",
                data: userInfo,
            })
        } else {
            await db.collection('users').insertOne({ userID: userID })
            const userInfo = await db
                .collection('users')
                .findOne({ userID: userID })
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
    const userID = songInfo.userID
    try {
        await client.connect()

        await db
            .collection('users')
            .updateOne({ userID: userID }, { $set: songInfo })
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
    }
}

const loadSongs = async (req, res) => {
    const { userID } = req.params
    console.log(userID, 'from load-songs BE handler')
    try {
        await client.connect()
        const userInfo = await db
            .collection('users')
            .findOne({ userID: userID })
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
    const { userID, songName } = req.body
    try {
        await client.connect()
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
    }
}

module.exports = {
    getUser,
    saveSong,
    loadSongs,
    deleteSong,
}
