const router = require('express').Router();
const paypal = require('../paypalAPI.js');


router.get('/ok', (req, res) => {
    console.log(req.headers);
    if (req.query.paymentId && req.query.PayerID) {
        paypal.execute_payment(req.query.paymentId, req.query.PayerID, (err, payment) => {
            if (err) {
                console.error(err);
                res.status(500);
                return;
            }
            console.log(payment);
            res.write("Payment approved.");
            res.end();
            // delete paypal id from calendar
        });
    }
});


router.get('/cancel', (req, res) => {
    res.write(`
Payment cancelled.
ID:      ${req.query.paymentId}
Token:   ${req.query.token}
PayerId: ${req.query.PayerID}
    `);
    res.end();
});


router.get('/payment-demo', (req, res) => {
    paypal.create_payment("Sample Item Name", "10.00", (err, payment) => {
        if (err) {
            console.error(err);
            res.status(500);
            return;
        }
        console.log(payment);
        const link = payment.links.find(link => link.rel == 'approval_url');
        res.redirect(link.href);
    });
});


module.exports = router;
