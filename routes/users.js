const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hi, I am Users');
});

module.exports = router;