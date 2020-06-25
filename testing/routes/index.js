const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'Nadia\'s Garden' });
});

router.delete('/', function(req, res) {
  res.end(500);
});

module.exports = router;
