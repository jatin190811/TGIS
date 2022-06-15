const express = require('express');
const client = require('../config/database')
const jwt = require('jsonwebtoken');
var ObjectId = require('mongodb').ObjectId;

async function login(req, res) {
    let username, password, type
    if (!req.body.username) {
        return res.json({ status: 'error', error: '001', message: 'email or mobile number not found' })
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
    if (!req.body.type) {
        collection = await client.db("admin").collection('users');
    } else if (req.body.type == 'vendor') {
        collection = await client.db("admin").collection('vendors');
    }

    let cursor = collection.find({ $or: [{ $and: [{ email: username }, { password: password }] }, { $and: [{ number: username }, { password: password }] }] })
    let user = await cursor.toArray()
    if (user.length) {
        if (!user[0].active) {
            return res.json({ status: 'error', error: '003', message: 'User Not Active' })
        }

        let token = jwt.sign({ name: user[0]['name'], id: user[0]['_id'] }, 'P!yush@1994');
        let result = await collection.updateOne({ '_id': user[0]['_id'] }, { $set: { token: token } })
        if (result.modifiedCount) {
            return res.json({
                status: 'success', message: 'User Found', data: {
                    token: token
                }
            })
        } else {
            return res.json({ status: 'error', error: '003', message: 'Something went wrong' })
        }

    } else {
        return res.json({ status: 'error', error: '004', message: 'Incorrect username or password' })
    }

}


async function register(req, res) {
    let name, email, number, password
    if (!req.body.name) {
        return res.json({ status: 'error', error: '005', message: 'name not found' })
    } else {
        name = String(req.body.name).toLowerCase().trim()
    }

    if (!req.body.email) {
        return res.json({ status: 'error', error: '006', message: 'email not found' })
    } else {
        email = String(req.body.email).toLowerCase().trim()
    }

    if (!req.body.number) {
        return res.json({ status: 'error', error: '007', message: 'number not found' })
    } else {
        number = String(req.body.number).toLowerCase().trim()
    }

    if (!req.body.password) {
        return res.json({ status: 'error', error: '008', message: 'Pasword not found' })
    } else {
        password = String(req.body.password).trim()
    }

    await client.connect();
    let collection = await client.db("admin").collection('users');


    let cursor = collection.find({ $or: [{ email: email }, { number: number }] })
    let user = await cursor.toArray()
    if (user.length) {
        return res.json({ status: 'error', error: '027', message: 'Email or Mobile Number already exist' })
    }

    let otp = 222222 // Math.floor(100000 + Math.random() * 900000) ;  
    otp = String(otp)

    let result = await collection.insertOne({ name, email, number, password, otp, active: false })
    if (result.acknowledged) {
        return res.json({ status: 'success', message: 'OTP sent to your mobile number and email', data: { ref: result.insertedId } })
    } else {
        return res.json({ status: 'error', error: '009', message: 'Something went wrong' })
    }


}


async function onboarding(req, res) {
    let brandName, city, vendorType, email, number, password
    if (!req.body.brandName) {
        return res.json({ status: 'error', error: '010', message: 'Brand name not found' })
    } else {
        brandName = String(req.body.brandName).toLowerCase().trim()
    }

    if (!req.body.city) {
        return res.json({ status: 'error', error: '011', message: 'City not found' })
    } else {
        city = String(req.body.city).toLowerCase().trim()
    }

    if (!req.body.vendorType) {
        return res.json({ status: 'error', error: '012', message: 'Vendor Type not found' })
    } else {
        vendorType = String(req.body.vendorType).toLowerCase().trim()
    }

    if (!req.body.email) {
        return res.json({ status: 'error', error: '013', message: 'Email not found' })
    } else {
        email = String(req.body.email).toLowerCase().trim()
    }

    if (!req.body.number) {
        return res.json({ status: 'error', error: '014', message: 'Number not found' })
    } else {
        number = String(req.body.number).toLowerCase().trim()
    }

    if (!req.body.password) {
        return res.json({ status: 'error', error: '015', message: 'Pasword not found' })
    } else {
        password = String(req.body.password).trim()
    }

    let otp = 222222 // Math.floor(100000 + Math.random() * 900000) ;  
    otp = String(otp)

    await client.connect();
    let collection = await client.db("admin").collection('vendors');
    let result = await collection.insertOne({ brandName, city, vendorType, email, number, password, otp, active: false })
    if (result.acknowledged) {
        return res.json({ status: 'success', message: 'OTP has been sent on your email and phone number', data: { ref: result.insertedId } })
    } else {
        return res.json({ status: 'error', error: '016', message: 'Something went wrong' })
    }

}



async function frgtPassword(req, res) {
    let username, type
    if (!req.body.username) {
        return res.json({ status: 'error', error: '017', message: 'email or mobile number not found' })
    } else {
        username = String(req.body.username).toLowerCase().trim()
    }


    await client.connect();
    let collection
    if (!req.body.type) {
        collection = await client.db("admin").collection('users');
    } else if (req.body.type == 'vendor') {
        collection = await client.db("admin").collection('vendors');
    }
    let cursor = collection.find({ $or: [{ email: username }, { number: username }] })
    let user = await cursor.toArray()

    if (user.length) {
        let otp = 222222 // Math.floor(100000 + Math.random() * 900000) ;  
        otp = String(otp)

        let result = await collection.updateOne({ _id: user[0]._id }, { $set: { forgetPasswordOtp: otp } })
        if (result.modifiedCount) {
            return res.json({ status: 'success', message: 'OTP has been sent on your email and phone number', data: { ref: user[0]._id } })
        } else {
            return res.json({ status: 'error', error: '018', message: 'Something went wrong' })
        }
    } else {
        return res.json({ status: 'error', error: '019', message: 'No such user found' })
    }


}


async function rcvrPassword(req, res) {
    let ref, otp, password;
    if (!req.body.ref) {
        return res.json({ status: 'error', error: '020', message: 'Reference not found' })
    } else {
        ref = String(req.body.ref)
    }

    if (!req.body.otp) {
        return res.json({ status: 'error', error: '021', message: 'OTP not found' })
    } else {
        otp = String(req.body.otp).toLowerCase().trim()
    }

    if (!req.body.password) {
        return res.json({ status: 'error', error: '022', message: 'Password not found' })
    } else {
        password = String(req.body.password).trim()
    }


    await client.connect();

    let collection
    if (!req.body.type) {
        collection = await client.db("admin").collection('users');
    } else if (req.body.type == 'vendor') {
        collection = await client.db("admin").collection('vendors');
    }

    let result = await collection.updateOne({ $and: [{ _id: new ObjectId(ref) }, { forgetPasswordOtp: otp }] }, { $set: { password } })
    if (result.modifiedCount) {
        return res.json({ status: 'success', message: 'Password Successfully Updated', data: {} })
    } else {
        return res.json({ status: 'error', error: '023', message: 'Invalid Otp' })
    }

}


async function verifyonboarding(req, res) {
    let ref, otp;
    if (!req.body.ref) {
        return res.json({ status: 'error', error: '024', message: 'Reference not found' })
    } else {
        ref = String(req.body.ref)
    }

    if (!req.body.otp) {
        return res.json({ status: 'error', error: '025', message: 'OTP not found' })
    } else {
        otp = String(req.body.otp).toLowerCase().trim()
    }

    await client.connect();
    let collection = await client.db("admin").collection('vendors');
    let result = await collection.updateOne({ $and: [{ _id: new ObjectId(ref) }, { otp: otp }] }, { $set: { 'active': true } })
    if (result.modifiedCount) {
        return res.json({ status: 'success', message: 'Account Successfully created', data: {} })
    } else {
        return res.json({ status: 'error', error: '026', message: 'Invalid Otp' })
    }

}


async function verifyregisteration(req, res) {
    let ref, otp;
    if (!req.body.ref) {
        return res.json({ status: 'error', error: '024', message: 'Reference not found' })
    } else {
        ref = String(req.body.ref)
    }

    if (!req.body.otp) {
        return res.json({ status: 'error', error: '025', message: 'OTP not found' })
    } else {
        otp = String(req.body.otp).toLowerCase().trim()
    }

    await client.connect();
    let collection = await client.db("admin").collection('users');
    let result = await collection.updateOne({ $and: [{ _id: new ObjectId(ref) }, { otp: otp }] }, { $set: { 'active': true } })
    if (result.modifiedCount) {
        return res.json({ status: 'success', message: 'Account Successfully created', data: {} })
    } else {
        return res.json({ status: 'error', error: '026', message: 'Invalid Otp' })
    }

}


async function socialSign(req, res) {
    let name, email, socialId
    if (!req.body.name) {
        return res.json({ status: 'error', error: '005', message: 'name not found' })
    } else {
        name = String(req.body.name).toLowerCase().trim()
    }

    if (!req.body.email) {
        return res.json({ status: 'error', error: '006', message: 'email not found' })
    } else {
        email = String(req.body.email).toLowerCase().trim()
    }

    if (!req.body.socialId) {
        return res.json({ status: 'error', error: '008', message: 'Something Went Wrong' })
    } else {
        socialId = String(req.body.socialId).trim()
    }

    await client.connect();
    let collection = await client.db("admin").collection('users');

    let cursor = collection.find({ $or: [{ email: email }] })
    let user = await cursor.toArray()
    if (!user.length) {
        await collection.insertOne({ name, email, socialId, active: true })
    }

    let token = jwt.sign({ name: user[0]['name'], id: user[0]['_id'] }, 'P!yush@1994');
    let result = await collection.updateOne({ '_id': user[0]['_id'] }, { $set: { token: token } })
    if (result.modifiedCount) {
        return res.json({
            status: 'success', message: 'User Found', data: {
                token: token
            }
        })
    } else {
        return res.json({ status: 'error', error: '003', message: 'Something went wrong' })
    }

}



exports.login = login;
exports.register = register;
exports.onboarding = onboarding;
exports.verifyonboarding = verifyonboarding
exports.frgtPassword = frgtPassword;
exports.rcvrPassword = rcvrPassword;
exports.verifyregisteration = verifyregisteration
exports.socialSign = socialSign