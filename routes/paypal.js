const url = require('url');
const router = require('express').Router();
const paypal = require('../paypalAPI.js');


// Paypal Lock schema
// Start/End <=> timeslot
// Summary: venue
// Description: {
//   "token": "...",
//   "payment_id": "...",
// }


router.get('/ok', (req, res) => {
    // expect token, paymentId, and PayerId.
    const { paymentId, PayerID, token } = req.query;
    if (paymentId && PayerID && token) {
        // make sure that the lock still exists and isn't
        // already deleted.
        paypal.execute_payment(paymentId, PayerID, (err, payment) => {
            // delete paypal lock from calendar
            if (err) {
                console.error(err);
                res.status(500);
                return;
            }
            console.log(payment);
            res.write("Payment approved.");
            res.end();
        });
    }
});


router.get('/cancel', (req, res) => {
    // expect token
    res.write(`
Payment cancelled.
Token:   ${req.query.token}
    `);
    res.end();
    // find + delete paypal lock from calendar
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
        const token = url.parse(link.href, {parseQueryString: true}).query.token;
        console.log({
            token: token,
            payment_id: payment.id,
        });
        res.redirect(link.href);
    });
});


module.exports = router;
