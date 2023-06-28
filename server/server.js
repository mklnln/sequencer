'use strict'

const express = require('express')
const port = 4000
const morgan = require('morgan')
const cors = require('cors')
const { getUser, saveSong, loadSongs, deleteSong } = require('./handlers')

express()
    .use(
        cors({
            origin: 'https://simple-sequencer.onrender.com'
        })
    ) // Access-Control-Allow-Origin in response header
    .use(morgan('tiny'))
    .use(express.static('./server/assets'))
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use('/', express.static(__dirname + '/'))
    .get('/api/user-login/:userID', getUser)
    .get(`/api/load-songs/:userID`, loadSongs)
    .get('/', (req, res) => {
        res.status(404).json({
            status: 404,
            message: 'This is obviously not what you are looking for.',
        })
    })
    // given that the BE uses $set, which either creates a new song or updates an old one, this post can be considered both the C and U in a CRUD method
    .post('/api/save-song', saveSong)
    .delete('/api/delete-song', deleteSong)

    .listen(port, () => {
        console.log(`Now listening on port ${port}`)
    })
