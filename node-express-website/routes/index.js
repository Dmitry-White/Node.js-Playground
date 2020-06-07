const express = require('express');

const router = express.Router();

const indexRoute = () => {
  router.get('/', (req, res) => {
    res.render('pages/index', { pageTitle: 'Welcome' });
  });

  return router
}

module.exports = indexRoute;