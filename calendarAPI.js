const {google} = require('googleapis');
const calendar = google.calendar('v3');
const privatekey = require('./keys/privatekey.json');
const PAYPAL_ID = '1mlpohc4b7q3ujqvpndg27vna4@group.calendar.google.com'; // paypal calendar
const CALENDAR_ID  = 'durhamredthunder2018@gmail.com'; // main calendar

function connect() {
    let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/calendar']);

    jwtClient.authorize((err, tokens) => {
    if (err) {
        console.log(err);
        return;
    }
    else {
        console.log('API access authenticated');
    }
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
        calendarId: calendarId,
        auth: auth,
        resource: resource
    }, (err, res) => {
        callback(err);
    });
}

function deleteLock(auth, resource, callback) {
    deleteSlot(PAYPAL_ID, auth, resource, callback);
}

function deleteEvent(auth, resource, callback) {
    deleteSlot(CALENDAR_ID, auth, resource, callback);
}

function deleteSlot(calendarId, auth, resource, callback) {
    calendar.events.delete({
        calendarId: calendarId,
        auth: auth,
        resource: resource
    }, (err, res) => {
        callback(err);
    });
}

function demo() {
    let jwtClient = connect();
    let resource = {
        start: {dateTime: '2019-01-10T14:00:00+01:00', timeZone: 'Europe/London'},
        end: {dateTime: '2019-01-10T16:00:00+01:00', timeZone: 'Europe/London'},
        summary: 'the location',
        description: 'the person who booked'
    }
    addEvent(jwtClient, resource, (err) => {
        if (err) console.log(err);
    });
    /*
    addLock(jwtClient, resource, (err) => {
        if (err) console.log(err);
    });
    */
}

module.exports.demo = demo;
