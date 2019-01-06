const {google} = require('googleapis');
const calendar = google.calendar('v3');
const moment = require('moment');
const {auth, PAYPAL_ID} = require('../calendarAPI');
const utils = require('../utils');


function task() {
    return new Promise((resolve, reject) => {
        calendar.events.list({
            auth,
            calendarId: PAYPAL_ID,
            timeMin: utils.momentToCalendarDate(moment().subtract(1, 'month')),
            timeMax: utils.momentToCalendarDate(moment().add(1, 'month')),
        }, (err, res) => {
            if (err) {
                return console.error(err);
            }
            const timeout = moment().subtract(15, 'minutes');
            const events = res.data.items;
            const stale = events.filter(event => moment(event.updated).isBefore(timeout));
            let done = stale.length;
            stale.forEach(event =>
                calendar.events.delete({calendarId: PAYPAL_ID, auth, eventId: event.id}, () => {
                    done--;
                    if (done == 0) {
                        resolve();
                    }
                })
            );
        });
    });
}

task().then(() => console.log("Done"));
