const express = require('express');
const fs = require('fs');
const client = require('../config/database')
var ObjectId = require('mongodb').ObjectId;




async function listTestis(req, res) {
    
    let token = req.headers['x-access-token'];
    let collection = await client.db("admin").collection('testimonials');
    let cursor = collection.find({})
    let testies = await cursor.toArray()
    if (testies.length) {
            return res.json({ status: 'success', message: '', data: testies })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such Testimonial found' })
    }
}





exports.list = listTestis;
