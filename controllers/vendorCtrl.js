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
    venues = venues.map(i => { i.type = "venue"; return i })


    collection = await client.db("admin").collection('bridals');
    cursor = collection.find(searchObj)
    let bridalsMakeup = await cursor.toArray()
    bridalsMakeup = bridalsMakeup.map(i => { i.type = "makeup"; return i })

    collection = await client.db("admin").collection('bridalwears');
    cursor = collection.find(searchObj)
    let bridalsWaer = await cursor.toArray()
    bridalsWaer = bridalsWaer.map(i => { i.type = "bridalwear"; return i })

    collection = await client.db("admin").collection('photographers');
    cursor = collection.find(searchObj)
    let photographers = await cursor.toArray()
    photographers = photographers.map(i => { i.type = "photographer"; return i })

    collection = await client.db("admin").collection('groomwears');
    cursor = collection.find(searchObj)
    let groomwears = await cursor.toArray()
    groomwears = groomwears.map(i => { i.type = "groomwear"; return i })


    collection = await client.db("admin").collection('mehndis');
    cursor = collection.find(searchObj)
    let mehndis = await cursor.toArray()
    mehndis = mehndis.map(i => { i.type = "mehandi"; return i })

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
   
    venues = venues.map(i => { i.type = "venue"; return i })


    collection = await client.db("admin").collection('bridals');
    cursor = collection.find(searchObj)
    let bridalsMakeup = await cursor.toArray()
    bridalsMakeup = bridalsMakeup.map(i => { i.type = "makeup"; return i })

    collection = await client.db("admin").collection('bridalwears');
    cursor = collection.find(searchObj)
    let bridalsWaer = await cursor.toArray()
    bridalsWaer = bridalsWaer.map(i => { i.type = "bridalwear"; return i })

    collection = await client.db("admin").collection('photographers');
    cursor = collection.find(searchObj)
    let photographers = await cursor.toArray()
    photographers = photographers.map(i => { i.type = "photographer"; return i })

    collection = await client.db("admin").collection('groomwears');
    cursor = collection.find(searchObj)
    let groomwears = await cursor.toArray()
    groomwears = groomwears.map(i => { i.type = "groomwear"; return i })


    collection = await client.db("admin").collection('mehndis');
    cursor = collection.find(searchObj)
    let mehndis = await cursor.toArray()
    mehndis = mehndis.map(i => { i.type = "mehandi"; return i })

    collection = await client.db("admin").collection('planners');
    cursor = collection.find(searchObj)
    let planners = await cursor.toArray()
    planners = planners.map(i => { i.type = "decor"; return i })

    let collective = [...bridalsMakeup, ...bridalsWaer, ...groomwears, ...mehndis, ...photographers, ...planners, ...venues]

    if (collective.length) {
        return res.json({ status: 'success', message: collective.length + ' vendor found', data: collective })
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


async function requestVenddor(req, res) {
    let brand_name, city, type, email, phone

    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('vendor_requests');
    
    if (!req.body.brand_name) {
        return res.json({ status: 'error', error: '006', message: 'Brand Name not found' })
    } else {
        brand_name = String(req.body.brand_name).trim()
    }

    if (!req.body.city) {
        return res.json({ status: 'error', error: '006', message: 'City not found' })
    } else {
        city = String(req.body.city).trim()
    }


    if (!req.body.type) {
        return res.json({ status: 'error', error: '006', message: 'Type not found' })
    } else {
        type = String(req.body.type).trim()
    }


    if (!req.body.email) {
        return res.json({ status: 'error', error: '006', message: 'Email not found' })
    } else {
        email = String(req.body.email).trim()
    }

    if (!req.body.phone) {
        return res.json({ status: 'error', error: '006', message: 'Phone number not found' })
    } else {
        phone = String(req.body.phone).trim()
    }



    let result = await collection.insertOne({
        brand_name, city, type, email, phone,
        createTime: Date.now(),
        isDeleted: false
    })

    if (result.acknowledged) {
        return res.json({ status: 'success', message: 'Message successfully Sent', data: {} })
    } else {
        return res.json({ status: 'error', error: '009', message: 'Something went wrong' })
    }
}



async function requestList(req, res) {
    let collection, cursor
    collection = await client.db("admin").collection('vendor_requests');
    cursor = collection.find({})
    let requests = await cursor.toArray()
    requests = requests.filter(i=>i.isDeleted!=true)
    return res.json({ status: 'success', message: '', data: requests })
}



async function deleteReq(req, res) {

    await client.connect();
    let id = req.params.id;
    let collection = await client.db("admin").collection('vendor_requests');
   
    let result = await collection.updateOne({ _id: ObjectId(id) }, { $set: { isDeleted: true } })
    if (result.acknowledged) {
        return res.json({ status: 'success', message: 'Requests Deleted Successfully', data: { } })
    } else {
        return res.json({ status: 'error', error: '018', message: 'Something went wrong' })
    }

}

exports.list = listVendors;
exports.videos = videosList;
exports.images = imagesList;
exports.searchVendors = searchVendors;
exports.request = requestVenddor;
exports.requestList = requestList;
exports.deleteReq = deleteReq;