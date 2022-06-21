const express = require('express');
const fs = require('fs');
const client = require('../config/database')
var ObjectId = require('mongodb').ObjectId;

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


async function createBridal(req, res) {
    let images, name, address, tags, isVaccinated, price, lat, lon;

    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('bridals');
    if (req.files && req.files.length) {
        images = req.files.map(i => {
            const newName = makeid(14) + "." + i.filename.split('.').pop()
            const nameArr = String(i.path).split('/');
            nameArr.pop()
            nameArr.push(newName)
            const newPath = nameArr.join('/')
            fs.renameSync(i.path, newPath)
            return newPath
        })
    } else {
        return res.json({ status: 'error', error: '003', message: 'Image not found' })
    }

    if (!req.body.name) {
        return res.json({ status: 'error', error: '006', message: 'name not found' })
    } else {
        name = String(req.body.name).toLowerCase().trim()
    }

    if (!req.body.isVaccinated) {
        return res.json({ status: 'error', error: '006', message: 'isVaccinated not found' })
    } else {
        isVaccinated = String(req.body.isVaccinated).toLowerCase().trim()
    }

    if (!req.body.address) {
        return res.json({ status: 'error', error: '006', message: 'name not found' })
    } else {
        address = String(req.body.address).toLowerCase().trim()
    }


    if (!req.body.tags) {
        return res.json({ status: 'error', error: '006', message: 'Tags not found' })
    } else {
        tags = req.body.tags.split(',').map(i => String(i).toLowerCase().trim())
    }

    if (!req.body.price) {
        return res.json({ status: 'error', error: '006', message: 'price not found' })
    } else {
        price = String(req.body.price).toLowerCase().trim()
    }

    if (!req.body.lat) {
        return res.json({ status: 'error', error: '006', message: 'Latitude not found' })
    } else {
        lat = String(req.body.lat)
    }

    if (!req.body.lon) {
        return res.json({ status: 'error', error: '006', message: 'Longitude not found' })
    } else {
        lon = String(req.body.lon)
    }

    let result = await collection.insertOne({ name, images, tags, price, address, lat, lon, isVaccinated, createTime: Date.now(), isDeleted : false })
    if (result.acknowledged) {
        return res.json({ status: 'success', message: 'Bridal successfully created', data: {} })
    } else {
        return res.json({ status: 'error', error: '009', message: 'Something went wrong' })
    }
}



async function listBridal(req, res) {
    
    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('bridals');
    
    let cursor = collection.find({isDeleted : false})
    let bridals = await cursor.toArray()
    if (bridals) {
            return res.json({ status: 'success', message: '', data: bridals })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such Bridal found' })
    }

}

async function detailBridal(req, res) {
    
    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('bridals');
    let id = req.params.id
    let cursor = collection.find({_id : ObjectId(id)})
    let bridals = await cursor.toArray()
    if (bridals.length) {
            return res.json({ status: 'success', message: '', data: bridals[0] })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such Bridal found' })
    }
}


async function deleteBridal(req, res) {
    
    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('bridals');
    let id = req.params.id
    let cursor = collection.updateOne({_id : ObjectId(id)},{$set : { isDeleted : true }})
    if (cursor.modifiedCount) {
            return res.json({ status: 'success', message: 'Bridal successfully deleted', data: {} })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such Bridal found' })
    }

}


exports.create = createBridal;
exports.list = listBridal;
exports.details = detailBridal;
exports.delete = deleteBridal;