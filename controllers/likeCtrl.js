const express = require('express');
const fs = require('fs');
const client = require('../config/database')
var ObjectId = require('mongodb').ObjectId;

async function like(req,res) {
    let token = req.headers['x-access-token'];
    let pid, type;

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

    if (!token) {
        return res.json({ status: 'error', error: '010', message: 'Token not found' })
    } else {
        token = token
    }


    let collection = await client.db("admin").collection('users');
    let cursor = collection.find({ token  })
    let user = await cursor.toArray();

    if(user.length) {
        let _id = user[0]['_id']
        let collection = await client.db("admin").collection('likes');
        let result = await collection.insertOne({ uid: _id, pid : ObjectId(pid), type })
        if (result.acknowledged) {
            return res.json({ status: 'success', message: 'Successfully Liked', data: {} })
        } else {
            return res.json({ status: 'error', error: '009', message: 'Something went wrong' })
        }
    
    } else {
        return res.json({ status: 'error', error: '014', message: 'Session Expired' })
    }
}


async function unlike(req,res) {
    let token = req.headers['x-access-token'];
    let pid, type;

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

    if (!token) {
        return res.json({ status: 'error', error: '010', message: 'Token not found' })
    } else {
        token = token
    }


    let collection = await client.db("admin").collection('users');
    let cursor = collection.find({ token  })
    let user = await cursor.toArray();

    if(user.length) {
        let _id = user[0]['_id']
        let collection = await client.db("admin").collection('likes');
        let result = await collection.deleteMany({ uid: _id, pid : ObjectId(pid), type })
        if (result.acknowledged) {
            return res.json({ status: 'success', message: 'Sucessfully Unliked', data: { } })
        } else {
            return res.json({ status: 'error', error: '009', message: 'Something went wrong' })
        }
    
    } else {
        return res.json({ status: 'error', error: '014', message: 'Session Expired' })
    }


}

async function list(req,res) {
    let token = req.headers['x-access-token'];
    if (!token) {
        return res.json({ status: 'error', error: '010', message: 'Token not found' })
    } else {
        token = token
    }


    let collection = await client.db("admin").collection('users');
    let cursor = collection.find({ token  })
    let user = await cursor.toArray();

    if(user.length) {
        let _id = user[0]['_id']
        let collection = await client.db("admin").collection('likes');
        let cursor = await collection.find({ uid: _id })
        let likes = await cursor.toArray();
        let likedObj = []
      
      
        for(let i=0;i<likes.length;i++) {
            let collectionIn ;
            if(likes[i]['type']=='venue') collectionIn  = await client.db("admin").collection('venues');
            if(likes[i]['type']=='makeup') collectionIn  = await client.db("admin").collection('bridals');
            if(likes[i]['type']=='bridalwear') collectionIn  = await client.db("admin").collection('bridalwears');
            if(likes[i]['type']=='photographer') collectionIn  = await client.db("admin").collection('photographers');
            if(likes[i]['type']=='groomwears') collectionIn  = await client.db("admin").collection('groomwears');
            if(likes[i]['type']=='mehndis') collectionIn  = await client.db("admin").collection('mehndis');
            if(likes[i]['type']=='decor') collectionIn  = await client.db("admin").collection('planners');
            console.log(collectionIn)
            let cursorIn = await collectionIn.find({ _id: ObjectId(likes[i]['pid']) })
            let obj = await cursorIn.toArray();
            likedObj.push({...obj[0], likeType : likes[i]['type'] } );
        }

        return res.json({ status: 'success', message: '', data: likedObj })
        
    } else {
        return res.json({ status: 'error', error: '014', message: 'Session Expired' })
    }




}

exports.list = list;
exports.unlike = unlike;
exports.like = like