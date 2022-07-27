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




async function doContact(req, res) {
    let name, email, message;


    if (!req.body.name) {
        return res.json({ status: 'error', error: '006', message: 'name not found' })
    } else {
        name = String(req.body.name).toLowerCase().trim()
    }

    if (!req.body.email) {
        return res.json({ status: 'error', error: '006', message: 'email not found' })
    } else {
        email = String(req.body.email).toLowerCase().trim()
    }

    if (!req.body.message) {
        return res.json({ status: 'error', error: '006', message: 'message not found' })
    } else {
        message = String(req.body.message).toLowerCase().trim()
    }


    return res.json({ status: 'success', message: 'Message successfully Sent', data: {} })

}







async function doMessage(req, res) {
    let name, phone, email, message, metadata;


    if (!req.body.name) {
        return res.json({ status: 'error', error: '006', message: 'name not found' })
    } else {
        name = String(req.body.name).toLowerCase().trim()
    }

    if (!req.body.vtype) {
        return res.json({ status: 'error', error: '006', message: 'Vendor type not found' })
    } else {
        vtype = String(req.body.vtype).toLowerCase().trim()
    }


    if (!req.body.vid) {
        return res.json({ status: 'error', error: '006', message: 'Vendor id not found' })
    } else {
        vid = req.body.vid
    }

    if (!req.body.email) {
        return res.json({ status: 'error', error: '006', message: 'email not found' })
    } else {
        email = String(req.body.email).toLowerCase().trim()
    }

    if (!req.body.phone) {
        return res.json({ status: 'error', error: '006', message: 'phone number not found' })
    } else {
        phone = String(req.body.phone).toLowerCase().trim()
    }

    if (!req.body.message) {
        return res.json({ status: 'error', error: '006', message: 'message not found' })
    } else {
        message = String(req.body.message).toLowerCase().trim()
    }

    if (!req.body.metadata) {
        metadata = {}
    } else {
        metadata = req.body.metadata
    }

    let otp = 222222 // Math.floor(100000 + Math.random() * 900000) ;  
    otp = String(otp)

    let collection = await client.db("admin").collection('messages');
    let result = await collection.insertOne({ name, vtype, vid, email, phone, message, metadata, otp  })
    if (result.acknowledged) {
        return res.json({ status: 'success', message: 'Message successfully Sent', data: { ref: result.insertedId } })
    } else {
        return res.json({ status: 'error', error: '009', message: 'Something went wrong' })
    }


}


exports.doContact = doContact;
exports.doMessage = doMessage;

