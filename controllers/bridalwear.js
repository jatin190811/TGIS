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


async function createBridal(req, res) {
    let images, name, address, tags, isVaccinated, price, lat, lon;

    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('bridalwears');
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
        return res.json({ status: 'success', message: 'Bridal wear successfully created', data: {} })
    } else {
        return res.json({ status: 'error', error: '009', message: 'Something went wrong' })
    }
}



async function listBridal(req, res) {

    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('bridalwears');
    let appliedFilters = req.body.appliedFilters;
    let search = req.body.searchParam || false;
    let type = req.body.sub_cat || false;

    let cursor = collection.find({ isDeleted: false })
    let bridals = await cursor.toArray()


    for (let i = 0; i < bridals.length; i++) {

        let collection = await client.db("admin").collection('reviews');
        let cursor = await collection.find({ pid : bridals[i]['_id'] })
        let reviews = await cursor.toArray();
        let sum = 0
        totalRating  = reviews.forEach((item)=>{
            sum+= number(item.rating)
        })
        bridals[i]['avgRating'] = totalRating/bridals.length
        if(!bridals[i]['avgRating'])  bridals[i]['avgRating'] = 0


        if(token) {
            let collection = await client.db("admin").collection('users');
            let cursor = collection.find({ token  })
            let user = await cursor.toArray();
        
            if(user.length) {
                let collection = await client.db("admin").collection('likes');
                let cursor = await collection.find({ uid: user[0]['_id'], pid : bridals[i]['_id'], type:'bridal_wear' })
                let likes = await cursor.toArray();
                if(likes.length) {
                    bridals[i]['liked'] = true
                } else {
                    bridals[i]['liked'] = false
                }
            }
        } else {
            bridals[i]['liked'] = false
        }
    }




    if (bridals) {
        if (search) {
            bridals = bridals.filter(i => {
                return String(i.name).toLowerCase().match(String(search).toLowerCase())  || String(i.address).toLowerCase().match(String(search).toLowerCase())
            })
        }

        if(type) {
            bridals = bridals.filter(i => {
                return i.type==type 
            })
        }


        if(appliedFilters) {
        bridals = bridals.filter(i => {
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
        return res.json({ status: 'success', message: bridals.length + ' results found', data: bridals, filters: filtersList.bridalWears })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such Bridal wear found' })
    }

}

async function detailBridal(req, res) {

    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('bridalwears');
    let id = req.params.id
    let cursor = collection.find({ _id: ObjectId(id) })
    let bridals = await cursor.toArray()
    if (bridals.length) {

        cursor = collection.find({tags : {$in :bridals[0]['tags'] }}).limit(3)
        let relatedObjects = await cursor.toArray();
        bridals[0]['relatedObjects'] = relatedObjects;
       
        if(token) {
            let i =0;
            let collection = await client.db("admin").collection('users');
            let cursor = collection.find({ token  })
            let user = await cursor.toArray();
        
            if(user.length) {
                let collection = await client.db("admin").collection('likes');
                let cursor = await collection.find({ uid: user[0]['_id'], pid : bridals[i]['_id'], type:'bridal_wear' })
                let likes = await cursor.toArray();
                if(likes.length) {
                    bridals[i]['liked'] = true
                } else {
                    bridals[i]['liked'] = false
                }
            }
        } else {
            bridals[i]['liked'] = false
        }

        return res.json({ status: 'success', message: '', data: bridals[0] })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such Bridal found' })
    }
}


async function deleteBridal(req, res) {

    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('bridalwears');
    let id = req.params.id
    let cursor = collection.updateOne({ _id: ObjectId(id) }, { $set: { isDeleted: true } })
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