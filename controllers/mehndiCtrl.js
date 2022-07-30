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
    let appliedFilters = req.body.appliedFilters;
    let search = req.body.searchParam || false;
    let type = req.body.sub_cat || false;
    let city = req.body.city || false;
    let avgRating = req.body.avgRating || false;

    let cursor = collection.find({ isDeleted: false })
    let mehndis = await cursor.toArray()

    for (let i = 0; i < mehndis.length; i++) {

        let collection = await client.db("admin").collection('reviews');
        let cursor = await collection.find({ pid: mehndis[i]['_id'] })
        let reviews = await cursor.toArray();
        let sum = 0
        totalRating = reviews.forEach((item) => {
            sum += number(item.rating)
        })
        mehndis[i]['avgRating'] = totalRating / mehndis.length
        if (!mehndis[i]['avgRating']) mehndis[i]['avgRating'] = 0


        if (token) {
            let collection = await client.db("admin").collection('users');
            let cursor = collection.find({ token })
            let user = await cursor.toArray();

            if (user.length) {
                let collection = await client.db("admin").collection('likes');
                let cursor = await collection.find({ uid: user[0]['_id'], pid: mehndis[i]['_id'], type: 'mehndis' })
                let likes = await cursor.toArray();
                if (likes.length) {
                    mehndis[i]['liked'] = true
                } else {
                    mehndis[i]['liked'] = false
                }
            }
        } else {
            mehndis[i]['liked'] = false
        }
    }




    if (mehndis) {
        if (search) {
            mehndis = mehndis.filter(i => {
                return String(i.name).toLowerCase().match(String(search).toLowerCase()) || String(i.address).toLowerCase().match(String(search).toLowerCase())
            })
        }

        if (type) {
            mehndis = mehndis.filter(i => {
                return i.type == type
            })
        }

        if (city) {
            appliedFilters ? appliedFilters['city'] = city : appliedFilters = { city }
            appliedFilters['city'] = city
        }

        if (appliedFilters) {
            mehndis = mehndis.filter(i => {
                let contains = false;
                Object.keys(appliedFilters).forEach(filter => {
                    if (i.specifications && i.specifications[filter]) {
                        if (appliedFilters[filter].includes(i.specifications[filter])) {
                            contains = true
                        }
                    }


                })
                return contains
            })
        }

        if (avgRating) {
            mehndis = mehndis.filter(i => {
                return i['avgRating'] >= avgRating
            })
        }

        return res.json({ status: 'success', message: mehndis.length + ' results found', data: mehndis, filters: filtersList.mehndi })
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

        cursor = collection.find({ tags: { $in: mehndis[0]['tags'] } }).limit(3)
        let relatedObjects = await cursor.toArray();
        mehndis[0]['relatedObjects'] = relatedObjects;

        if (token) {
            let i = 0
            let collection = await client.db("admin").collection('users');
            let cursor = collection.find({ token })
            let user = await cursor.toArray();

            if (user.length) {
                let collection = await client.db("admin").collection('likes');
                let cursor = await collection.find({ uid: user[0]['_id'], pid: mehndis[i]['_id'], type: 'mehndis' })
                let likes = await cursor.toArray();
                if (likes.length) {
                    mehndis[i]['liked'] = true
                } else {
                    mehndis[i]['liked'] = false
                }
            }
        } else {
            let i = 0
            mehndis[i]['liked'] = false
        }

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