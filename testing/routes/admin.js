const express = require('express');
const router = express.Router();
const _ = require('lodash');
const reservations = require('../lib/reservations');

/* GET admin listing. */
router.get('/', function(req, res) {
  reservations.getAll()
    .then((reservations) => {
      res.render('admin', {
        title: 'Booking Requests - Nadia\'s Garden',
        reservations,
        header: _.keys(reservations[0])
      });
    })
});

module.exports = router;
