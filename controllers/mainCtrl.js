const express = require('express');
const indianCitiesDatabase = require('indian-cities-database');
const fs = require('fs');
const client = require('../config/database')
var ObjectId = require('mongodb').ObjectId;

async function cities(req, res) {

    var cities = indianCitiesDatabase.cities;
    return res.json({ status: 'success', message: 'cities', data: [...cities] })

}


async function areas(req, res) {


    if (!req.body.type) {
        return res.json({ status: 'error', error: '006', message: 'Type not found' })
    } else {
        type = String(req.body.type).toLowerCase().trim()
    }

    if (!req.body.city) {
        return res.json({ status: 'error', error: '006', message: 'City not found' })
    } else {
        city = String(req.body.city).toLowerCase().trim()
    }


    let collectionIn;
    if (type == 'venue') collectionIn = await client.db("admin").collection('venues');
    if (type == 'makeup') collectionIn = await client.db("admin").collection('bridals');
    if (type == 'bridalwear') collectionIn = await client.db("admin").collection('bridalwears');
    if (type == 'photographer') collectionIn = await client.db("admin").collection('photographers');
    if (type == 'groomwears') collectionIn = await client.db("admin").collection('groomwears');
    if (type == 'mehndis') collectionIn = await client.db("admin").collection('mehndis');


    let areas = [];
    let cursorIn = collectionIn.find({ "specifications.city": city })
    let obj = await cursorIn.toArray();
    obj.forEach(element => {
        if (element.specifications.area in areas) {

        } else {
            areas.push(element.specifications.area)
        }
    });

    return res.json({ status: 'success', message: 'areas', data: [...areas] })



}

exports.cities = cities;
exports.areas = areas;
