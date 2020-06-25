const express = require('express');
const router = express.Router();
const debug = require('debug')('nadia:route:reservations')
const reservations = require('../lib/reservations');
const Reservation = require('../lib/schema/reservation');

router.get('/', function(req, res) {
  res.render('reservations');
});

router.post('/', function(req, res) {
  const reservation = new Reservation(req.body);
  reservations.create(reservation)
    .then(reservationId => res.render('reservations', {
      success: true,
      reservationId
    }))
    .catch(err => {
      debug(err.message, req.body);
      res.status(400).render('reservations', {
        errors: [
          err.message
        ],
        success: false,
        submission: req.body
      });
    })
});

module.exports = router;
