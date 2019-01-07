const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('pages/whats-on');
});

router.get('/:evt', (req, res) => {
    res.render('pages/whats-on/' + req.params.evt);
});

module.exports = router;
