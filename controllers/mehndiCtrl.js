const express = require('express');
const fs = require('fs');
const client = require('../config/database')
const filtersList = require('../filtersConst')
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


async function createMehndi(req, res) {
    let images, name, address, tags, isVaccinated, price, lat, lon;

    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('mehndis');
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

    if (!req.body.minprice) {
        return res.json({ status: 'error', error: '006', message: 'minimum price not found' })
    } else {
        minprice = String(req.body.price).toLowerCase().trim()
    }

    if (!req.body.maxprice) {
        return res.json({ status: 'error', error: '006', message: 'maximum price not found' })
    } else {
        maxprice = String(req.body.price).toLowerCase().trim()
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

    let result = await collection.insertOne({ name, images, tags, minprice, maxprice, address, isVaccinated, lat, lon, createTime: Date.now(), isDeleted: false })
    if (result.acknowledged) {
        return res.json({ status: 'success', message: 'Mehndi  successfully created', data: {} })
    } else {
        return res.json({ status: 'error', error: '009', message: 'Something went wrong' })
    }
}



async function listMehndi(req, res) {

    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('mehndis');

    let cursor = collection.find({ isDeleted: false })
    let mehndis = await cursor.toArray()
    if (mehndis) {
        mehndis = mehndis.filter(i => {
            let contains = false;
            Object.keys(appliedFilters).forEach(filter => {
                if (i.specifications && i.specifications[filter]) {
                    appliedFilters[filter].includes(i.specifications[filter])
                    contains = true
                }


            })
            return contains
        })
        return res.json({ status: 'success', message: '', data: mehndis, filters: filtersList.mehndi })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such Mehndi  found' })
    }

}

async function detailMehndi(req, res) {

    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('mehndis');
    let id = req.params.id
    let cursor = collection.find({ _id: ObjectId(id) })
    let mehndis = await cursor.toArray()
    if (mehndis.length) {
        return res.json({ status: 'success', message: '', data: mehndis[0] })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such Mehndi found' })
    }
}


async function deleteMehndi(req, res) {

    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('mehndis');
    let id = req.params.id
    let cursor = collection.updateOne({ _id: ObjectId(id) }, { $set: { isDeleted: true } })
    if (cursor.modifiedCount) {
        return res.json({ status: 'success', message: 'Mehndi successfully deleted', data: {} })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such Mehndi found' })
    }

}


exports.create = createMehndi;
exports.list = listMehndi;
exports.details = detailMehndi;
exports.delete = deleteMehndi;