const url = require('url');
const moment = require('moment');
const router = require('express').Router();
const paypal = require('../paypalAPI.js');
const calendar = require('../calendarAPI.js');
const utils = require('../utils.js');


// Paypal Lock schema
// Start/End <=> timeslot
// Summary: venue
// Description: {
//   "token": "...",
//   "payment_id": "...",
// }


router.get('/ok', (req, res) => {
    // expect token, paymentId, and PayerID.
    const { paymentId, PayerID, token } = req.query;
    if (!(paymentId && PayerID && token)) {
        res.status(403);
        res.end();
        return;
    }

    const today = moment().startOf('day');
    calendar.lockClash(calendar.auth, {
        start: utils.momentToCalendarDate(today),
        end:   utils.momentToCalendarDate(today.add(1, 'month')),
        predicate: (_, d) => d.token === token && d.payment_id == paymentId,
    }, (event, err) => {
        // make sure that the lock still exists and isn't
        // already deleted.
        if (!event) {
            res.status(404);
            res.end();
            return;
        }
        console.log(event);
        paypal.execute_payment(paymentId, PayerID, (err, payment) => {
            // delete paypal lock from calendar
            calendar.deleteLock(calendar.auth, event.id, (err) => console.error(error));
            if (err) {
                console.error(err);
                res.status(500);
                return;
            }
            console.log(payment);
            res.write("Payment approved.");
            res.end();
        });
    });
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
        const desc = JSON.stringify({
            token: url.parse(link.href, {parseQueryString: true}).query.token,
            payment_id: payment.id,
        });
        calendar.addLock(calendar.auth, {
            start:   utils.momentToCalendarDate(moment()),
            end:     utils.momentToCalendarDate(moment().add(2, 'hours')),
            summary: 'venue',
            description: desc,
        }, (err) => console.log(err))
        res.redirect(link.href);
    });
});


module.exports = router;
