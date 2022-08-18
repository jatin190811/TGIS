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


async function createPlanner(req, res) {
    let name, price, isFeatured, specifications, area_avail, description,  ameneties, execuisite, facts, contact_details, tags, type, sub_cat, address;

    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('planners');
    
   
    if (!req.body.name) {
        return res.json({ status: 'error', error: '006', message: 'name not found' })
    } else {
        name = String(req.body.name).trim()
    }

    if (!req.body.price) {
        return res.json({ status: 'error', error: '006', message: 'price not found' })
    } else {
        price = String(req.body.price).trim()
    }


    if (!req.body.type) {
        return res.json({ status: 'error', error: '006', message: 'type not found' })
    } else {
        type = String(req.body.type).trim()
    }


    if (!req.body.sub_cat) {
        return res.json({ status: 'error', error: '006', message: 'sub type not found' })
    } else {
        sub_cat = String(req.body.sub_cat).trim()
    }

    if (!req.body.description) {
        return res.json({ status: 'error', error: '006', message: 'description not found' })
    } else {
        description = String(req.body.description).trim()
    }


    if (!req.body.address) {
        return res.json({ status: 'error', error: '006', message: 'address not found' })
    } else {
        address = String(req.body.address).trim()
    }

    if (!req.body.tags || req.body.tags.length<1 ) {
        return res.json({ status: 'error', error: '006', message: 'Tags not found' })
    } else {
        tags = req.body.tags
    }

    if (!req.body.ameneties || req.body.ameneties.length<1 ) {
        return res.json({ status: 'error', error: '006', message: 'Ameneties not found' })
    } else {
        ameneties = req.body.ameneties
    }

    if (!req.body.area_avail || req.body.area_avail.length<1 ) {
        return res.json({ status: 'error', error: '006', message: 'Area available not found' })
    } else {
        area_avail = req.body.area_avail
    }

    if (!req.body.specifications || req.body.specifications.length<1 ) {
        return res.json({ status: 'error', error: '006', message: 'Specifications not found' })
    } else {
        specifications = req.body.specifications
    }

    if (!req.body.facts || req.body.facts.length<1 ) {
        return res.json({ status: 'error', error: '006', message: 'FAQs not found' })
    } else {
        facts = req.body.facts
    }
    
    if (!req.body.contact_details || req.body.contact_details.length<1 ) {
        return res.json({ status: 'error', error: '006', message: 'Contact Details not found' })
    } else {
        contact_details = req.body.contact_details
    }
    
    if (!req.body.execuisite) {
        execuisite = false
    } else {
        execuisite = Boolean(execuisite)
    }
    
    if (!req.body.isFeatured) {
        isFeatured = false
    } else {
        isFeatured = Boolean(isFeatured)
    }

    let detailedPrice = req.body.detailedPrice


    let result = await collection.insertOne({ 
        name,
        price, 
        isFeatured,
        specifications,
        area_avail, 
        description, 
        ameneties, 
        execuisite,
        facts, 
        contact_details, 
        tags, 
        type, 
        sub_cat, 
        address, 
        detailedPrice,
        createTime: Date.now(), 
        isDeleted: false })

        
    if (result.acknowledged) {
        return res.json({ status: 'success', message: 'Planner  successfully created', data: {} })
    } else {
        return res.json({ status: 'error', error: '009', message: 'Something went wrong' })
    }
}



async function updatePlanner(req, res) {
    let id, name, price, isFeatured, specifications, description, ameneties, execuisite, facts, contact_details, tags, type, sub_cat, address;

    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('planners');


    if (!req.body.name) {
        return res.json({ status: 'error', error: '006', message: 'name not found' })
    } else {
        name = String(req.body.name).trim()
    }

    if (!req.body.price) {
        return res.json({ status: 'error', error: '006', message: 'price not found' })
    } else {
        price = String(req.body.price).trim()
    }


    if (!req.body.type) {
        return res.json({ status: 'error', error: '006', message: 'type not found' })
    } else {
        type = String(req.body.type).trim()
    }


    if (!req.body.sub_cat) {
        return res.json({ status: 'error', error: '006', message: 'sub type not found' })
    } else {
        sub_cat = String(req.body.sub_cat).trim()
    }

    if (!req.body.description) {
        return res.json({ status: 'error', error: '006', message: 'description not found' })
    } else {
        description = String(req.body.description).trim()
    }


    if (!req.body.address) {
        return res.json({ status: 'error', error: '006', message: 'address not found' })
    } else {
        address = String(req.body.address).trim()
    }

    if (!req.body.tags || req.body.tags.length < 1) {
        return res.json({ status: 'error', error: '006', message: 'Tags not found' })
    } else {
        tags = req.body.tags
    }

    if (!req.body.ameneties || req.body.ameneties.length < 1) {
        return res.json({ status: 'error', error: '006', message: 'Ameneties not found' })
    } else {
        ameneties = req.body.ameneties
    }

   

    if (!req.body.specifications || req.body.specifications.length < 1) {
        return res.json({ status: 'error', error: '006', message: 'Specifications not found' })
    } else {
        specifications = req.body.specifications
    }

    if (!req.body.facts || req.body.facts.length < 1) {
        return res.json({ status: 'error', error: '006', message: 'FAQs not found' })
    } else {
        facts = req.body.facts
    }

    if (!req.body.contact_details || req.body.contact_details.length < 1) {
        return res.json({ status: 'error', error: '006', message: 'Contact Details not found' })
    } else {
        contact_details = req.body.contact_details
    }

    if (!req.body.execuisite) {
        execuisite = false
    } else {
        execuisite = req.body.execuisite
    }

    if (!req.body.isFeatured) {
        isFeatured = false
    } else {
        isFeatured = req.body.isFeatured
    }

    let detailedPrice = req.body.detailedPrice

    let result = await collection.update({ _id: ObjectId(req.body.pid) }, {
        $set: {
            name,
            price,
            isFeatured,
            specifications,
            description,
            ameneties,
            execuisite,
            facts,
            contact_details,
            tags,
            type,
            sub_cat,
            address,
            detailedPrice,
            updateTime: Date.now(),
            isDeleted: false
        }
    })

    if (result.modifiedCount) {
        return res.json({ status: 'success', message: 'Venue successfully Updated', data: {} })
    } else {
        return res.json({ status: 'error', error: '009', message: 'Something went wrong' })
    }
}

async function listPlanner(req, res) {

    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('planners');
    let appliedFilters = req.body.appliedFilters;
    let search = req.body.searchParam || false;
    let type = req.body.sub_cat || false;
    let city = req.body.city || false;
    let avgRating = req.body.avgRating || false;

    let cursor = collection.find({ isDeleted: false })
    let planners = await cursor.toArray()


    for (let i = 0; i < planners.length; i++) {

        let collection = await client.db("admin").collection('reviews');
        let cursor = await collection.find({ pid: planners[i]['_id'] })
        let reviews = await cursor.toArray();
        let sum = 0
        totalRating = reviews.forEach((item) => {
            sum += number(item.rating)
        })
        planners[i]['avgRating'] = totalRating / planners.length
        if (!planners[i]['avgRating']) planners[i]['avgRating'] = 0


        if (token) {
            let collection = await client.db("admin").collection('users');
            let cursor = collection.find({ token })
            let user = await cursor.toArray();

            if (user.length) {
                let collection = await client.db("admin").collection('likes');
                let cursor = await collection.find({ uid: user[0]['_id'], pid: planners[i]['_id'], type: 'decor' })
                let likes = await cursor.toArray();
                if (likes.length) {
                    planners[i]['liked'] = true
                } else {
                    planners[i]['liked'] = false
                }
            }
        } else {
            planners[i]['liked'] = false
        }
    }


    if (planners) {
        if (search) {
            planners = planners.filter(i => {
                return String(i.name).toLowerCase().match(String(search).toLowerCase()) || String(i.address).toLowerCase().match(String(search).toLowerCase())
            })
        }

        if (type) {
            planners = planners.filter(i => {
                return i.type == type
            })
        }


        if (city) {
            appliedFilters ? appliedFilters['city'] = city : appliedFilters = { city }
            appliedFilters['city'] = city
        }
        
        if (appliedFilters) {
            planners = planners.filter(i => {
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
            planners = planners.filter(i => {
                return i['avgRating'] >= avgRating
            })
        }
        return res.json({ status: 'success', message: planners.length + ' results found', data: planners, filters: filtersList.planner })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such Planner  found' })
    }

}

async function detailPlanner(req, res) {

    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('planners');
    let id = req.params.id
    let cursor = collection.find({ _id: ObjectId(id) })
    let planners = await cursor.toArray()
    if (planners.length) {


        cursor = collection.find({ tags: { $in: planners[0]['tags'] } }).limit(3)
        let relatedObjects = await cursor.toArray();
        planners[0]['relatedObjects'] = relatedObjects;

        if (token) {
            let i = 0;
            let collection = await client.db("admin").collection('users');
            let cursor = collection.find({ token })
            let user = await cursor.toArray();

            if (user.length) {
                let collection = await client.db("admin").collection('likes');
                let cursor = await collection.find({ uid: user[0]['_id'], pid: planners[i]['_id'], type: 'decor' })
                let likes = await cursor.toArray();
                if (likes.length) {
                    planners[i]['liked'] = true
                } else {
                    planners[i]['liked'] = false
                }
            }
        } else {
            let i = 0
            planners[i]['liked'] = false
        }

        return res.json({ status: 'success', message: '', data: planners[0] })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such Planner found' })
    }
}


async function deletePlanner(req, res) {


    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('admin');
    let cursor = collection.find({ token })
    let admin = await cursor.toArray();
    if (admin.length) {
        let collection = await client.db("admin").collection('planners');
        let id = req.params.id
        let cursor = await collection.updateOne({ _id: ObjectId(id) }, { $set: { isDeleted: true } })
        if (cursor.modifiedCount) {
            return res.json({ status: 'success', message: 'Planner successfully deleted', data: {} })
        } else {
            return res.json({ status: 'error', error: '019', message: 'No such Planner found' })
        }
    } else {
        return res.json({ status: 'error', error: '999', message: 'Token Expired' })
    }
    
    
   

}



async function imageUpload(req, res) {

    let collection = await client.db("admin").collection('planners');
    let id = req.params.id

    if (req.files && req.files.length) {
        images = req.files.map(i => {
            const newName = 'decor/'+makeid(14) + "." + i.filename.split('.').pop()
            const newPath = newName

            console.log(i.path, newPath)
            fs.renameSync(i.path, "public/"+newPath)
            return newName
        })
    } else {
        return res.json({ status: 'error', error: '003', message: 'Image not found' })
    }

    let result = await collection.updateOne({ _id: ObjectId(id) }, {
        $push: {
            images: images[0]
        }
    })

    if (result.modifiedCount) {
        return res.json({ status: 'success', message: 'Planner Images successfully Updated', data: {} })
    } else {
        return res.json({ status: 'error', error: '009', message: 'Something went wrong' })
    }


}


async function imageDelete(req, res) {
    let images;
    let collection = await client.db("admin").collection('planners');
    let id = req.params.id

    if (req.body.images) {
        images = req.body.images
    } else {
        return res.json({ status: 'error', error: '003', message: 'Image not found' })
    }

    if (req.body.deletedImage) {
        deletedImage = req.body.deletedImage
    } else {
        return res.json({ status: 'error', error: '003', message: 'Deleted image not found' })
    }

    let result = await collection.updateOne({ _id: ObjectId(id) }, {
        $set: {
            images
        }
    })

    try {
        fs.unlinkSync('/public/decor/' + deletedImage)
        if (result.modifiedCount) {
            return res.json({ status: 'success', message: 'Planner Images successfully Updated', data: {} })
        } else {
            return res.json({ status: 'error', error: '009', message: 'Something went wrong' })
        }
    }
    catch (e) {
        return res.json({ status: 'error', error: '009', message: 'Something went wrong' })

    }
}


async function videoUpload(req, res) {

    let collection = await client.db("admin").collection('planners');
    let id = req.params.id

    if (req.files && req.files.length) {
        videos = req.files.map(i => {
            const newName = 'venues/'+makeid(14) + "." + i.filename.split('.').pop()
            const newPath = newName

            console.log(i.path, newPath)
            fs.renameSync(i.path, "public/"+newPath)
            return newName
        })
    } else {
        return res.json({ status: 'error', error: '003', message: 'Video not found' })
    }

    let result = await collection.updateOne({ _id: ObjectId(id) }, {
        $push: {
            videos: videos[0]
        }
    })

    if (result.modifiedCount) {
        return res.json({ status: 'success', message: 'Planner Videos successfully Updated', data: {} })
    } else {
        return res.json({ status: 'error', error: '009', message: 'Something went wrong' })
    }


}


async function videoDelete(req, res) {
    let videos;
    let collection = await client.db("admin").collection('planners');
    let id = req.params.id

    if (req.body.videos) {
        videos = req.body.videos
    } else {
        return res.json({ status: 'error', error: '003', message: 'Video not found' })
    }

    if (req.body.deletedVideo) {
        deletedVideo = req.body.deletedVideo
    } else {
        return res.json({ status: 'error', error: '003', message: 'Deleted video not found' })
    }

    let result = await collection.updateOne({ _id: ObjectId(id) }, {
        $set: {
            videos
        }
    })

    try {
        fs.unlinkSync('/public/venues/' + deletedVideo)
        if (result.modifiedCount) {
            return res.json({ status: 'success', message: 'Planner Videos successfully Updated', data: {} })
        } else {
            return res.json({ status: 'error', error: '009', message: 'Something went wrong' })
        }
    }
    catch (e) {
        return res.json({ status: 'error', error: '009', message: 'Something went wrong' })

    }
}


exports.create = createPlanner;
exports.update = updatePlanner;
exports.list = listPlanner;
exports.details = detailPlanner;
exports.delete = deletePlanner;
exports.imageUpload = imageUpload;
exports.imageDelete = imageDelete

exports.videoUpload = videoUpload;
exports.videoDelete = videoDelete