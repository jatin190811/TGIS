const express = require('express');
const fs = require('fs');
const client = require('../config/database')
var ObjectId = require('mongodb').ObjectId;


const htmlEntities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
};

const encode = (str) => str.replace(/([&<>\"'])/g, match => htmlEntities[match]);

async function createBlog(req, res) {

}



async function listBlog(req, res) {
    let collection = await client.db("admin").collection('blogs');

    let cursor = collection.find({ isDeleted: false })
    let blogs = await cursor.toArray()
    if (blogs) {
        return res.json({ status: 'success', message: '', data: blogs })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such Blog  found' })
    }

}

async function detailBlog(req, res) {
    let collection = await client.db("admin").collection('blogs');
    let id = req.params.id
    let cursor = collection.find({ _id: ObjectId(id) })
    let blog = await cursor.toArray()
    if (blog.length) {
        return res.json({ status: 'success', message: '', data: blog[0] })
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such Blog found' })
    }
}



exports.create = createBlog;
exports.list = listBlog;
exports.details = detailBlog;
