'use strict';

const express = require('express');
const ratesController = require('../controllers/ratesController');

var router = express.Router();
router.route('/:clientId').get(ratesController.queryRates);

module.exports = router;