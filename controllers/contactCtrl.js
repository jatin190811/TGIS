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




exports.doContact = doContact;

