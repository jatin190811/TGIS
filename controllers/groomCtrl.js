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


async function createGroom(req, res) {
    let images, name, address, tags, isVaccinated, price, lat, lon;

    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('groomwears');
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

    let result = await collection.insertOne({ name, images, tags, minprice, maxprice, address, lat, lon, createTime: Date.now(), isDeleted: false })
    if (result.acknowledged) {
        return res.json({ status: 'success', message: 'Groom wear successfully created', data: {} })
    } else {
        return res.json({ status: 'error', error: '009', message: 'Something went wrong' })
    }
}



async function listGroom(req, res) {

    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('groomwears');
    let appliedFilters = req.body.appliedFilters;
    let search = req.body.searchParam || false;
    let type = req.body.sub_cat || false;

    let cursor = collection.find({ isDeleted: false })
    let grooms = await cursor.toArray()
    if (grooms) {
        if (search) {
            grooms = grooms.filter(i => {
                return String(i.name).match(search)  || String(i.address).match(search) 
            })
        }

        if(type) {
            grooms = grooms.filter(i => {
                return i.type==type 
            })
        }


        if(appliedFilters) {
            
        grooms = grooms.filter(i => {
            let contains = false;
            Object.keys(appliedFilters).forEach(filter => {
                if (i.specifications && i.specifications[filter]) {
                    appliedFilters[filter].includes(i.specifications[filter])
                    contains = true
                }


            })
            return contains
        })
    }
        return res.json({ status: 'success', message: grooms.length + ' results found', data: grooms, filters: filtersList.groomWear })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such Groom wear found' })
    }

}

async function detailGroom(req, res) {

    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('groomwears');
    let id = req.params.id
    let cursor = collection.find({ _id: ObjectId(id) })
    let grooms = await cursor.toArray()
    if (grooms.length) {
        return res.json({ status: 'success', message: '', data: grooms[0] })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such Groom found' })
    }
}


async function deleteGroom(req, res) {

    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('groomwears');
    let id = req.params.id
    let cursor = collection.updateOne({ _id: ObjectId(id) }, { $set: { isDeleted: true } })
    if (cursor.modifiedCount) {
        return res.json({ status: 'success', message: 'Groom successfully deleted', data: {} })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such Groom found' })
    }

}


exports.create = createGroom;
exports.list = listGroom;
exports.details = detailGroom;
exports.delete = deleteGroom;