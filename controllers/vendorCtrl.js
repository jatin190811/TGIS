const express = require('express');
const fs = require('fs');
const client = require('../config/database')
var ObjectId = require('mongodb').ObjectId;



async function listVendors(req, res) {
    let collection, cursor
    let token = req.headers['x-access-token'];
    let searchObj = {
        isDeleted: false
    }


    collection = await client.db("admin").collection('venues');
    cursor = collection.find(searchObj)
    let venues = await cursor.toArray()
    venues = venues.map(i => { i.type = "venues"; return i })


    collection = await client.db("admin").collection('bridals');
    cursor = collection.find(searchObj)
    let bridalsMakeup = await cursor.toArray()
    bridalsMakeup = bridalsMakeup.map(i => { i.type = "bridal_makeup"; return i })

    collection = await client.db("admin").collection('bridalwears');
    cursor = collection.find(searchObj)
    let bridalsWaer = await cursor.toArray()
    bridalsWaer = bridalsWaer.map(i => { i.type = "bridal_wear"; return i })

    collection = await client.db("admin").collection('photographers');
    cursor = collection.find(searchObj)
    let photographers = await cursor.toArray()
    photographers = photographers.map(i => { i.type = "photographer"; return i })

    collection = await client.db("admin").collection('groomwears');
    cursor = collection.find(searchObj)
    let groomwears = await cursor.toArray()
    groomwears = groomwears.map(i => { i.type = "groom_wears"; return i })


    collection = await client.db("admin").collection('mehndis');
    cursor = collection.find(searchObj)
    let mehndis = await cursor.toArray()
    mehndis = mehndis.map(i => { i.type = "mehndis"; return i })

    collection = await client.db("admin").collection('planners');
    cursor = collection.find(searchObj)
    let planners = await cursor.toArray()
    planners = planners.map(i => { i.type = "decor"; return i })

    let collective = [...bridalsMakeup, ...bridalsWaer, ...groomwears, ...mehndis, ...photographers, ...planners, ...venues]

    if (collective.length) {
        return res.json({ status: 'success', message: '', data: collective })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such vendor found' })
    }

}



async function searchVendors(req, res) {
    let collection, cursor

    if (!req.body.searchkey) {
        searchkey = ""
    } else {
        searchkey = String(req.body.searchkey).trim()
    }


    let searchObj =
    {
        $and: [
            { isDeleted: { $ne: true } },
            {
                $or: [
                    { name: { $regex: searchkey, $options: 'i' } },
                    { address: { $regex: searchkey, $options: 'i' }, },
                    { description: { $regex: searchkey, $options: 'i' } },
                    {
                        tags: { $elemMatch: { $eq: searchkey } }
                    }]

            }]
    }



    collection = await client.db("admin").collection('venues');
    cursor = collection.find(searchObj)
    let venues = await cursor.toArray()
   
    venues = venues.map(i => { i.type = "venues"; return i })


    collection = await client.db("admin").collection('bridals');
    cursor = collection.find(searchObj)
    let bridalsMakeup = await cursor.toArray()
    bridalsMakeup = bridalsMakeup.map(i => { i.type = "bridal_makeup"; return i })

    collection = await client.db("admin").collection('bridalwears');
    cursor = collection.find(searchObj)
    let bridalsWaer = await cursor.toArray()
    bridalsWaer = bridalsWaer.map(i => { i.type = "bridal_wear"; return i })

    collection = await client.db("admin").collection('photographers');
    cursor = collection.find(searchObj)
    let photographers = await cursor.toArray()
    photographers = photographers.map(i => { i.type = "photographer"; return i })

    collection = await client.db("admin").collection('groomwears');
    cursor = collection.find(searchObj)
    let groomwears = await cursor.toArray()
    groomwears = groomwears.map(i => { i.type = "groom_wears"; return i })


    collection = await client.db("admin").collection('mehndis');
    cursor = collection.find(searchObj)
    let mehndis = await cursor.toArray()
    mehndis = mehndis.map(i => { i.type = "mehndis"; return i })

    collection = await client.db("admin").collection('planners');
    cursor = collection.find(searchObj)
    let planners = await cursor.toArray()
    planners = planners.map(i => { i.type = "decor"; return i })

    let collective = [...bridalsMakeup, ...bridalsWaer, ...groomwears, ...mehndis, ...photographers, ...planners, ...venues]

    if (collective.length) {
        return res.json({ status: 'success', message: collective.length + ' objects found', data: collective })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such vendor found' })
    }
}


async function videosList(req, res) {
    let collection, cursor
    collection = await client.db("admin").collection('videos');
    cursor = collection.find({})
    let videos = await cursor.toArray()
    return res.json({ status: 'success', message: '', data: videos })
}


async function imagesList(req, res) {
    let collection, cursor
    collection = await client.db("admin").collection('images');
    cursor = collection.find({})
    let images = await cursor.toArray()
    return res.json({ status: 'success', message: '', data: images })
}

exports.list = listVendors;
exports.videos = videosList;
exports.images = imagesList;
exports.searchVendors = searchVendors;
