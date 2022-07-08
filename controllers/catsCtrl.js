const express = require('express');
const client = require('../config/database')
const _ = require('underscore');


async function createBlog(req, res) {

}



async function popBlog(req, res) {
    let collection = await client.db("admin").collection('categories');

    let cursor = collection.find({isPopular:true})
    let cats = await cursor.toArray()
    if (cats) {
        return res.json({ status: 'success', message: '', data: cats })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such Category found' })
    }

}


async function listBlog(req, res) {
    let collection = await client.db("admin").collection('categories');

    let cursor = collection.find()
    let cats = await cursor.toArray()
    if (cats) {
       cats =  _.groupBy( cats, 'name' ) 
        return res.json({ status: 'success', message: '', data: cats })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such Category found' })
    }

}



exports.popBlog= popBlog;
exports.create = createBlog;
exports.list = listBlog;
