const express = require('express');
const db      = require('../db');
const _       = require('lodash');
var request = require('request');

let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/patients', function(req, res, next) {
  console.log(req.query);
  for (var propName in req.query) { 
    if (req.query[propName] === null || req.query[propName] === undefined || req.query[propName] === '') {
      delete req.query[propName];
    }
  }
  console.log(req.query);
  db.query(['patient', req.query], function(err, results) {
    if (err) return next(new Error('An error occured'));
    res.render('patients/list', { data: results, query: req.query });
  });
});

router.get('/patients/:id', function(req, res, next) {
  db.query(['patient', {id: req.params.id}], function(err, results) {
    if (err) throw new Error();
    if (results.length === 0) return next(new Error('That patient does not exist'));
    res.render('patients/view', results[0]);
  });
});

router.get('/stats', function(req, res, next) {
  db.query(['stats', {}], function(err, results) {
    if (err) throw new Error();
    res.render('stats', {stats:results});
  });
});

router.get('/load', function(req, res, next) {
  request('https://randomuser.me/api/?nat=us', function (error, response, body) {
    body = JSON.parse(body).results[0];
    db.post('INSERT INTO ?? (id, name, phone_number, address, balance, will_contents, insurance_company_id, condition_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
      'patient',
      25,
      body.name.first + ' ' + body.name.last,
      body.phone,
      body.location.street + ' ' + body.location.city + ' ' + body.location.state + ' ' + body.location.zipcode,
      Math.floor(Math.random() * (10000 - 1000)) + 1000,
      '',
      0, 0
    ], function() {

    });
  });
  res.send('');
});
 
module.exports = router;
