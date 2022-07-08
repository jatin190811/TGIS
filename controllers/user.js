const express = require('express');
const client = require('../config/database')
const jwt = require('jsonwebtoken');
var ObjectId = require('mongodb').ObjectId;
const fs = require('fs');


function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


async function login(req, res) {
    let username, password, type, isOnboarding
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
            if(user[0]['personType'] && user[0]['budget']) {
                isOnboarding = true
            } else {
                isOnboarding = false
            }

            return res.json({
                status: 'success', message: 'User Found', data: {
                    token: token,
                    isOnboarding,
                    profile: user[0]
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


    let cursor = collection.find({ $and: [{ $or: [{ email: email }, { number: number }], active: true }] })
    let user = await cursor.toArray()
    if (user.length) {
        return res.json({ status: 'error', error: '027', message: 'Email or Mobile Number already exist' })
    }

    let otp = 222222 // Math.floor(100000 + Math.random() * 900000) ;  
    otp = String(otp)

    let result = await collection.insertOne({ name, email, number, password, otp, active: false })
    if (result.acknowledged) {
        return res.json({ status: 'success', message: 'OTP sent to your mobile number and email', data: { ref: result.insertedId, profile : { name, email, number, password, otp, active: false } } })
    } else {
        return res.json({ status: 'error', error: '009', message: 'Something went wrong' })
    }


}


async function updateProfile(req, res) {
    let name, email, number

    let token = req.headers['x-access-token'];
    if (!token) {
        return res.json({ status: 'error', error: '010', message: 'Token not found' })
    } else {
        token = token
    }

    if (!req.body.name) {
        return res.json({ status: 'error', error: '005', message: 'name not found' })
    } else {
        name = String(req.body.name).toLowerCase().trim()
    }

    if (!req.body.email) {
        return res.json({ status: 'error', error: '007', message: 'number not found' })
    } else {
        email = String(req.body.email).toLowerCase().trim()
    }

    if (!req.body.number) {
        return res.json({ status: 'error', error: '007', message: 'number not found' })
    } else {
        number = String(req.body.number).toLowerCase().trim()
    }


    let collection = await client.db("admin").collection('users');
    let cursor = collection.find({ token  })
    let user = await cursor.toArray();

    if(user.length) {
       let result =  await collection.updateOne({ token },{ $set : {
            name ,
            email,
            number
        }});

        if (result.modifiedCount) {
            return res.json({ status: 'success', message: 'Profile Updated Successfully', data: {} })
        } else {
            return res.json({ status: 'error', error: '018', message: 'Something went wrong' })
        }

    } else {
        return res.json({ status: 'error', error: '014', message: 'Session Expired' })
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
    let ref, otp;
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

    await client.connect();

    let collection
    if (!req.body.type) {
        collection = await client.db("admin").collection('users');
    } else if (req.body.type == 'vendor') {
        collection = await client.db("admin").collection('vendors');
    }
    let nref = makeid(14)
    console.log(nref)
    let result = await collection.updateOne({ $and: [{ _id: new ObjectId(ref) }, { forgetPasswordOtp: otp }] }, { $set: { ref: nref } })
    if (result.modifiedCount) {
        return res.json({ status: 'success', message: 'Otp Successfully matched', data: { ref: nref } })
    } else {
        return res.json({ status: 'error', error: '023', message: 'Invalid Otp' })
    }

}



async function changePassword(req, res) {
    let ref, password;
    if (!req.body.ref) {
        return res.json({ status: 'error', error: '020', message: 'Reference not found' })
    } else {
        ref = String(req.body.ref)
    }

    if (!req.body.password) {
        return res.json({ status: 'error', error: '021', message: 'OTP not found' })
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

    let result = await collection.updateOne({ $and: [{ ref: ref }] }, { $set: { password: password } })
    if (result.modifiedCount) {
        return res.json({ status: 'success', message: 'Password Successfully changed', data: {} })
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
        let cursor = collection.find({ _id: new ObjectId(ref) })
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
                        token: token,
                        isOnboarding:false,
                        profile: { ...user[0]}
                    }
                })
            } else {
                return res.json({ status: 'error', error: '003', message: 'Something went wrong' })
            }

        } else {
            return res.json({ status: 'error', error: '004', message: 'Incorrect username or password' })
        }

    } else {
        return res.json({ status: 'error', error: '026', message: 'Invalid Otp' })
    }

}


async function socialSign(req, res) {
    let name, email, socialId, token, type, isOnboarding

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

    if (!req.body.type) {
        return res.json({ status: 'error', error: '008', message: 'social type not found' })
    } else {
        socialId = String(req.body.socialId).trim()
    }

    if (!req.body.token) {
        return res.json({ status: 'error', error: '008', message: 'social token not found' })
    } else {
        socialId = String(req.body.socialId).trim()
    }

    if (!req.body.socialId) {
        return res.json({ status: 'error', error: '008', message: 'Something not found' })
    } else {
        socialId = String(req.body.socialId).trim()
    }

    await client.connect();
    let collection = await client.db("admin").collection('users');

    let cursor = collection.find({ $or: [{ email: email }] })
    let user = await cursor.toArray()
    if (!user.length) {
        await collection.insertOne({ name, email, socialId, type, socialId, socialtoken: token, number:'', password: '', forgetPasswordOtp:'',
        budget:'', city:'', personType:'',  weddingDate:'',
        active: true })
        cursor = collection.find({ email: email })
        user = await cursor.toArray()
    }

    let jwttoken = jwt.sign({ name: user[0]['name'], id: user[0]['_id'] }, 'P!yush@1994');
    let result = await collection.updateOne({ '_id': user[0]['_id'] }, { $set: { token: jwttoken } })
    if (result.modifiedCount) {


        if(user[0]['personType'] && user[0]['budget']) {
            isOnboarding = true
        } else {
            isOnboarding = false
        }


        return res.json({
            status: 'success', message: 'User Found', data: {
                token: jwttoken,
                isOnboarding,
                profile : {...user[0]}
            }
        })
    } else {
        return res.json({ status: 'error', error: '003', message: 'Something went wrong' })
    }

}



async function onboarding(req, res) {
    let personal, city, date, budget

    let token = req.headers['x-access-token'];
    if (!token) {
        return res.json({ status: 'error', error: '010', message: 'Token not found' })
    } else {
        token = token
    }

    if (!req.body.personal) {
        return res.json({ status: 'error', error: '011', message: 'Person Type not found' })
    } else {
        personal = String(req.body.personal).toLowerCase().trim()
    }

    if (!req.body.city) {
        return res.json({ status: 'error', error: '012', message: 'City not found' })
    } else {
        city = String(req.body.city).toLowerCase().trim()
    }

    if (!req.body.date) {
        return res.json({ status: 'error', error: '013', message: 'Date not found' })
    } else {
        date = String(req.body.date).toLowerCase().trim()
    }

    if (!req.body.budget) {
        return res.json({ status: 'error', error: '014', message: 'Budget not found' })
    } else {
        budget = String(req.body.budget).toLowerCase().trim()
    }

    let collection = await client.db("admin").collection('users');
    let cursor = collection.find({ token  })
    let user = await cursor.toArray();

    if(user.length) {
       let result =   await collection.updateOne({ token },{ $set : {
            personType : personal,
            weddingDate : date,
            city,
            budget
        }});

        if (result.modifiedCount) {
            return res.json({ status: 'success', message: 'Data Saved Successfully', data: {} })
        } else {
            return res.json({ status: 'error', error: '018', message: 'Something went wrong' })
        }

    } else {
        return res.json({ status: 'error', error: '014', message: 'Session Expired' })
    }


}


async function updatePassword(req, res) {
    let oldpassword, newpassword ;
    let token = req.headers['x-access-token'];
    if (!token) {
        return res.json({ status: 'error', error: '010', message: 'Token not found' })
    } else {
        token = token
    }

    if (!req.body.oldpassword) {
        return res.json({ status: 'error', error: '011', message: 'Old Password not found' })
    } else {
        oldpassword = String(req.body.oldpassword).toLowerCase().trim()
    }

    if (!req.body.newpassword) {
        return res.json({ status: 'error', error: '012', message: 'New Password not found' })
    } else {
        city = String(req.body.city).toLowerCase().trim()
    }


    let collection = await client.db("admin").collection('users');
    let cursor = collection.find({ token  })
    let user = await cursor.toArray();

    if(user.length) {
        
        if(user[0]['password'] != oldpassword) {
            return res.json({ status: 'error', error: '018', message: 'Invalid Old Password' })
        }
        
       let result =  await  collection.updateOne({ token },{ $set : {
            password : newpassword,
        }});

        if (result.modifiedCount) {
            return res.json({ status: 'success', message: 'Password Successfully Updated', data: {} })
        } else {
            return res.json({ status: 'error', error: '018', message: 'Something went wrong' })
        }

    } else {
        return res.json({ status: 'error', error: '014', message: 'Session Expired' })
    }


}



async function profile(req, res) {
    let isOnboarding;
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
        let resp = JSON.parse(JSON.stringify(user[0]))      
        delete resp['password']
        delete resp['token']
        delete resp['ref']
        delete resp['forgetPasswordOtp']
        
        if(resp['personType'] && resp['budget']) {
            isOnboarding = true
        } else {
            isOnboarding = false
        }


        return res.json({ status: 'success', message: 'profile Successfully fetched', data: {...resp, isOnboarding} })
    } else {
        return res.json({ status: 'error', error: '014', message: 'Session Expired' })
    }
}



async function profilePic(req, res) {
    let profilePicArr;
    let token = req.headers['x-access-token'];
    if (!token) {
        return res.json({ status: 'error', error: '010', message: 'Token not found' })
    } else {
        token = token
    }

    if (req.files && req.files.length) {
        profilePicArr = req.files.map(i => {
            const newName = makeid(14) + "." + i.filename.split('.').pop()
            const nameArr = String(i.path).split('/');
            nameArr.pop()
            nameArr.push(newName)
            const newPath = nameArr.join('/')
            fs.renameSync(i.path, newPath)
            return newPath
        })
    } else {
        return res.json({ status: 'error', error: '003', message: 'Image not found' })
    }

    let collection = await client.db("admin").collection('users');
    let cursor = collection.find({ token  })
    let user = await cursor.toArray();
    let profilePic = profilePicArr[0];

    if(user.length) {
        
        let result =  await  collection.updateOne({ token },{ $set : {
            profilePic : profilePic,
        }});

        if (result.modifiedCount) {
            return res.json({ status: 'success', message: 'Profile Pic Successfully Updated', data: {
                profilePic : profilePic.replace('public','')
            } })
        } else {
            return res.json({ status: 'error', error: '018', message: 'Something went wrong' })
        }
  
    } else {
        return res.json({ status: 'error', error: '014', message: 'Session Expired' })
    }
}



exports.login = login;
exports.register = register;
exports.onboarding = onboarding;
exports.updateProfile = updateProfile;
exports.updatePassword = updatePassword;
exports.verifyonboarding = verifyonboarding
exports.frgtPassword = frgtPassword;
exports.rcvrPassword = rcvrPassword;
exports.changePassword = changePassword;
exports.profile = profile;
exports.verifyregisteration = verifyregisteration
exports.socialSign = socialSign
exports.profilePic = profilePic