const {google} = require('googleapis');
const moment = require('moment');
const calendar = google.calendar('v3');
const privatekey = require('./keys/privatekey.json');
const PAYPAL_ID = '1mlpohc4b7q3ujqvpndg27vna4@group.calendar.google.com'; // paypal calendar
const CALENDAR_ID  = 'durhamredthunder2018@gmail.com'; // main calendar

function connect() {
    let jwtClient = new google.auth.JWT(
        privatekey.client_email,
        null,
        privatekey.private_key,
        ['https://www.googleapis.com/auth/calendar']
    );

    jwtClient.authorize((err, tokens) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('API access authenticated');
    });

    return jwtClient;
}

//auth is the jwtClient object returned by connect()
//resource can have start, end, summary, description and id
function addEvent(auth, resource, callback) {
    addSlot(CALENDAR_ID, auth, resource, callback);
}

function addLock(auth, resource, callback) {
    addSlot(PAYPAL_ID, auth, resource, callback);
}

function addSlot(calendarId, auth, resource, callback) {
    calendar.events.insert({
        calendarId,
        auth,
        resource,
    }, callback);
}

function deleteLock(auth, eventId, callback) {
    deleteSlot(PAYPAL_ID, auth, eventId, callback);
}

function deleteEvent(auth, eventId, callback) {
    deleteSlot(CALENDAR_ID, auth, eventId, callback);
}

function deleteSlot(calendarId, auth, eventId, callback) {
    calendar.events.delete({
        calendarId,
        auth,
        eventId,
    }, callback);
}

function eventClash(auth, resource, callback) {
    checkBusy(CALENDAR_ID, auth, resource, callback);
}

function findLock(auth, query, callback) {
    return calendar.events.list({
        calendarId: PAYPAL_ID,
        auth: auth,
        timeMin: query.start,
        timeMax: query.end,
    }, (err, res) => {
        if (err) {
            return callback(null, err);
        }
        const timeout = moment().subtract(15, 'minutes');
        const events = res.data.items;
        const event = events.find((event) =>
            moment(event.updated).isAfter(timeout)
            && query.predicate(event, JSON.parse(event.description))
        );
        callback(null, event);
    });
}

function checkBusy(calendarId, auth, resource, callback) {
    calendar.events.list({
        calendarId: calendarId,
        auth: auth,
        timeMin: resource.start, // lower bound for end times
        timeMax: resource.end // upper bound for start times
    }, (err, res) => {
        if (err) {
            callback(err, null);
            return;
        } else {
            let events = res.data.items;
            for (let i=0; i<events.length; i++) {
                if (events[i].summary == resource.summary) {
                    callback(null, true);
                    return;
                }
            }
            callback(null, false);
        }
    });
}

module.exports = {
    auth: connect(),
    PAYPAL_ID,
    findLock,
    addLock,
    deleteLock,
};
