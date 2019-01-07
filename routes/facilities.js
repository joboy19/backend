const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('pages/facilities');
});

router.get('/:facility', (req, res) => {
    res.render('pages/facilities/' + req.params.facility);
});

module.exports = router;
