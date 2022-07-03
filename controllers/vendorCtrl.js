const express = require('express');
const fs = require('fs');
const client = require('../config/database')
var ObjectId = require('mongodb').ObjectId;



async function listVendors(req, res) {
    let collection, cursor
    let token = req.headers['x-access-token'];
    
    collection = await client.db("admin").collection('bridals');
    cursor = collection.find({is : false})
    let bridalsMakeup = await cursor.toArray()

    collection = await client.db("admin").collection('bridalwears');
    cursor = collection.find({isDeleted : false})
    let bridalsWaer = await cursor.toArray()

    collection = await client.db("admin").collection('photographers');
    cursor = collection.find({isDeleted : false})
    let photographers = await cursor.toArray()

    collection = await client.db("admin").collection('groomwears');
    cursor = collection.find({isDeleted : false})
    let groomwears = await cursor.toArray()


    collection = await client.db("admin").collection('mehndis');
    cursor = collection.find({isDeleted : false})
    let mehndis = await cursor.toArray()

    collection = await client.db("admin").collection('planners');
    cursor = collection.find({isDeleted : false})
    let planners = await cursor.toArray()

    let collective= [...bridalsMakeup, ...bridalsWaer, ...groomwears, ...mehndis, ...photographers, ...planners]

    if (collective.length) {
            return res.json({ status: 'success', message: '', data: collective })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such vandor found' })
    }

}

exports.list = listVendors;