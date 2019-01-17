const moment = require('moment');


function momentToCalendarDate(m) {
    return (m || moment()).utc().toISOString();
}


function clientDateToMoment(s) {
    const m = moment.utc(s, "YYYY-MM-DDTHH:mm:ss");
    if (!m.isValid()) {
        throw new Error("invalid date!");
    }
    // round to nearest hour
    return m.startOf('hour');
}


module.exports = {
    momentToCalendarDate,
    clientDateToMoment,
};
