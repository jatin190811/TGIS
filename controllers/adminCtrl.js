const express = require('express');
const client = require('../config/database')
const jwt = require('jsonwebtoken');

async function login(req, res) {
    let username, password 
    if (!req.body.username) {
        return res.json({ status: 'error', error: '001', message: 'Username not found' })
    } else {
        username = String(req.body.username).toLowerCase().trim()
    }

    if (!req.body.password) {
        return res.json({ status: 'error', error: '002', message: 'Pasword not found' })
    } else {
        password = String(req.body.password).trim()
    }

    await client.connect();

    let collection
    collection = await client.db("admin").collection('admin');
    
    let cursor = collection.find({ $and: [{ username: username }, { password: password }] })
    let user = await cursor.toArray()
    if (user.length) {
       
        let token = jwt.sign({ name: user[0]['name'], id: user[0]['_id'] }, 'P!yush@1994');
        let result = await collection.updateOne({ '_id': user[0]['_id'] }, { $set: { token: token } })
        if (result.modifiedCount) {
           
            return res.json({
                status: 'success', message: 'Admin Found', data: {
                    token: token,
                }
            })
        } else {
            return res.json({ status: 'error', error: '003', message: 'Something went wrong' })
        }

    } else {
        return res.json({ status: 'error', error: '004', message: 'Incorrect username or password' })
    }
}



exports.login = login;
