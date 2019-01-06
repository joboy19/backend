const moment = require('moment');


function momentToCalendarDate(m) {
    return {
        dateTime: (m || moment()).format("YYYY-MM-DDTHH:MM:ssZ"),
        timeZone: 'Europe/London',
    };
}


module.exports = {
    momentToCalendarDate,
};
