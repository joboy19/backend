const {google} = require('googleapis');
const moment = require('moment');
const calendar = google.calendar('v3');
const privatekey = require('./keys/privatekey.json');
const PAYPAL_ID = '1mlpohc4b7q3ujqvpndg27vna4@group.calendar.google.com'; // paypal calendar


const IDS = {
    astro_turf: 'tur9s2qokdfi7rs2056o84hgms@group.calendar.google.com',
};


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
        calendar.calendarList.list({auth: jwtClient}, (a, b) => {
            console.log(a);
            b.data.items.forEach(cal => {
                console.log(cal.id, cal.summary);
            });
        });
    });

    return jwtClient;
}

// auth is the jwtClient object returned by connect()
// resource can have start, end, summary, description and id
// start and end should be like:
//   { dateTime: 'string', timeZone: 'string' }
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


function deleteSlot(calendarId, auth, eventId, callback) {
    calendar.events.delete({
        calendarId,
        auth,
        eventId,
    }, callback);
}


function findLock(auth, query, callback) {
    const og = query.predicate || (() => true);
    const timeout = moment().subtract(15, 'minutes');
    query.predicate = (event) =>
        moment(event.updated).isAfter(timeout) &&
            og(event, JSON.parse(event.description));
    return findFirst(PAYPAL_ID, auth, query, callback);
}


function findFirst(calendarId, auth, query, callback) {
    query.predicate = query.predicate || (() => true);
    return calendar.events.list({
        calendarId,
        auth,
        timeMin: query.start,
        timeMax: query.end,
    }, (err, res) => {
        if (err) {
            callback(err, null);
            return;
        }
        const events = res.data.items;
        const event = events.find((event) => query.predicate(event));
        callback(null, event);
    });
}

module.exports = {
    auth: connect(),
    ids: IDS,
    PAYPAL_ID,
    findLock,
    findFirst,
    addLock,
    addSlot,
    deleteLock,
};
