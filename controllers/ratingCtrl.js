const express = require('express');
const fs = require('fs');
const client = require('../config/database')
var ObjectId = require('mongodb').ObjectId;


async function addRating(req, res) {
    let token = req.headers['x-access-token'];
    if (!token) {
        return res.json({ status: 'error', error: '010', message: 'Token not found' })
    } else {
        token = token
    }


    if (!req.body.pid) {
        return res.json({ status: 'error', error: '005', message: 'Product ID not found' })
    } else {
        pid = req.body.pid
    }

    if (!req.body.type) {
        return res.json({ status: 'error', error: '006', message: 'Type not found' })
    } else {
        type = String(req.body.type).trim()
    }

    if (!req.body.rating) {
        return res.json({ status: 'error', error: '006', message: 'rating not found' })
    } else {
        rating = String(req.body.rating).trim()
    }

    if (!req.body.review) {
        review = ''
    } else {
        review = String(req.body.review).trim()

    }


    let collection = await client.db("admin").collection('users');
    let cursor = collection.find({ token })
    let user = await cursor.toArray();

    if (user.length) {
        let _id = user[0]['_id']
        let collection = await client.db("admin").collection('reviews');
        let result = await collection.insertOne({ uid: _id, pid, type, rating, review, name: user[0]['name'], currentDate: new Date().toLocaleString(), pic: user[0]['profilePic'] })
        if (result.acknowledged) {
            return res.json({ status: 'success', message: 'Successfully added', data: {} })
        } else {
            return res.json({ status: 'error', error: '009', message: 'Something went wrong' })
        }

    } else {
        return res.json({ status: 'error', error: '014', message: 'Session Expired' })
    }




}




async function listRating(req, res) {
    let token = req.headers['x-access-token'];
    if (!token) {
        token = ''
    } else {
        token = token
    }


    if (!req.body.pid) {
        return res.json({ status: 'error', error: '005', message: 'Product ID not found' })
    } else {
        pid = req.body.pid
    }

    if (!req.body.type) {
        return res.json({ status: 'error', error: '006', message: 'Type not found' })
    } else {
        type = String(req.body.type).trim()
    }

    let collection = await client.db("admin").collection('reviews');
    let cursor = await collection.find({ pid, type })
    let reviews = await cursor.toArray();

    if (token) {
        let collection = await client.db("admin").collection('users');
        let cursor = collection.find({ token })
        let user = await cursor.toArray();

        if (user.length) {
            let _id = user[0]['_id']
            ownReview = reviews.filter(item => String(item.uid) == String(_id))[0]
            return res.json({ status: 'success', message: reviews.length + ' reviews found', data: { reviews, ownReview } })

        } else {
            return res.json({ status: 'error', error: '014', message: 'Session Expired' })
        }

    } else {
        return res.json({ status: 'success', message: reviews.length + ' reviews found', data: { reviews } })
    }

}

async function subscribe(req, res) {


    if (!req.body.email) {
        return res.json({ status: 'error', error: '006', message: 'Email not found' })
    } else {
        email = String(req.body.email).trim()
    }


    let collection = await client.db("admin").collection('subscribers');
    let cursor = collection.find({ email })
    let subscribers = await cursor.toArray();

    if (!subscribers.length) {
        let _id = user[0]['_id']
        let result = await collection.insertOne({ email })
        if (result.acknowledged) {
            return res.json({ status: 'success', message: 'Successfully Subscribed', data: {} })
        } else {
            return res.json({ status: 'error', error: '009', message: 'Something went wrong' })
        }

    } else {
        return res.json({ status: 'success', data: {}, message: 'Already Subscribed' })
    }




}




async function appFound(req, res) {

    if (!req.body.phone) {
        return res.json({ status: 'error', error: '006', message: 'Phone Number not found' })
    } else {
        phone = String(req.body.phone).trim()
    }

    return res.json({ status: 'success', message: 'Successfully Subscribed', data: {} })
}


exports.add = addRating
exports.list = listRating
exports.subscribe = subscribe
exports.appFound = appFound
