const express = require('express');
const indianCitiesDatabase = require('indian-cities-database');


async function cities(req, res) {
   
    var cities = indianCitiesDatabase.cities;
    return res.json({ status: 'success', message: 'cities', data: [...cities] })

}


exports.cities = cities;

