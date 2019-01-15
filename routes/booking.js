const router = require('express').Router();
const utils = require('../utils.js');


router.post('/', (req, res) => {
    const venue   = req.body.venue;
    const start   = utils.clientDateToMoment(req.body.start);
    const end     = utils.clientDateToMoment(req.body.end);
    const details = {
        name:  req.body.name,
        phone_number: req.body.phone_number,
    };
    // sanity checks
    if (!end.isAfter(start) || !details.name || !details.phone_number || !venue) {
        res.status(400).end();
        return;
    }
    // check first if someone else is trying to book
    // the same slot.
    calendar.findLock(calendar.auth, {
        start: utils.momentToCalendarDate(start),
        end:   utils.momentToCalendarDate(end),
        predicate: (event) => event.summary === venue,
    }, (err, event) => {
        if (err) throw err;
        if (event) {
            console.log("Event taken");
            res.status(400).end();
            return;
        }
        // now check if there is a booking in place
        calendar.findFirst(calendar.ids[venue], calendar.auth, {
            start: utils.momentToCalendarDate(start),
            end:   utils.momentToCalendarDate(end),
            predicate: () => true,
        }, (err, event) => {
            if (err) throw err;
            if (event) return res.status(400).end();
            // ok, lock + redirect to payment
            // TODO: fix prices
            paypal.create_payment(venue, "10.00", (err, payment, info) => {
                if (err) throw err;
                calendar.addLock(calendar.auth, {
                    start:   utils.momentToCalendarDate(start),
                    end:     utils.momentToCalendarDate(end),
                    summary: venue,
                    description: JSON.stringify({
                        payment_id: payment.id,
                        token:      info.token,
                        details:    details,
                    }),
                }, (err) => {
                    if (err) throw err;
                    res.redirect(info.redirect);
                });
            });
        });
    });
});
