const express = require('express');
const client = require('../config/database')

async function createBlog(req, res) {

}



async function listBlog(req, res) {
    let collection = await client.db("admin").collection('inhouse');

    let cursor = collection.find()
    let services = await cursor.toArray()
    if (services) {
        return res.json({ status: 'success', message: '', data: services })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such services  found' })
    }

}




exports.create = createBlog;
exports.list = listBlog;
