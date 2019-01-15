const moment = require('moment');


function momentToCalendarDate(m) {
    return {
        dateTime: (m || moment()).format("YYYY-MM-DDTHH:MM:ssZ"),
        timeZone: 'Europe/London',
    };
}


function clientDateToMoment(s) {
    const m = moment(s, "YYYY-MM-DDTHH:MM:ssZ");
    if (!m.isValid()) {
        throw new Error("invalid date!");
    }
    // round to nearest hour
    return m.startOf('hour');
}


module.exports = {
    momentToCalendarDate,
};
