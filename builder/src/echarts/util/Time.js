// define(function (require) {

//     var numberUtil = require('./number');

//     // Timezoneoffset of Javascript Date have considered DST (Daylight Saving Time,
//     // https://tc39.github.io/ecma262/#sec-daylight-saving-time-adjustment).
//     // When setting system timezone as "Time Zone: America/Toronto",
//     // those code will get different result:
//     // new Date(1478411999999).getTimezoneOffset();  // get 240
//     // new Date(1478412000000).getTimezoneOffset();  // get 300
//     // So original method like `getDate` on Date object should not
//     // be used directly.
//     // For example:
//     // new Date(1478491200000).getDate() === new Date(1478491200000 - 3600 * 24 * 1000).getDate()
//     // Sun Nov 06 2016 23:00:00 GMT-0500 (EST)
//     // Sun Nov 06 2016 00:00:00 GMT-0400 (EDT)

//     var Time = function (value) {
//         var localDate = this._localDate = numberUtil.parseDate(value);
//         // Get default timezone offsete.
//         var timezoneOffset = this._timezoneOffset = numberUtil.getTimezoneOffset();

//         if (localDate.getTimezoneOffset() !== timezoneOffset) {
//             this._utcDate = Date.UTC(
//                 localDate.getFullYear(), month[, day[, hour[, minute[, second[, millisecond]]]]]
//             );
//         }
//     };

//     var timeProp = Time.prototype;

//     timeProp.getDate = function () {
//         var utcDate = this._giveUTCDate();
//     };

//     timeProp._giveUTCDate = function () {
//         if (!this._utcDate) {
//             var localDate = this._localDate;
//             var localTimezoneOffset = localDate.getTimezoneOffset();
//             this._utcDate = new Date(+localDate + localTimezoneOffset * 60000);
//         }
//         return this._utcDate;
//     }

//     return Time;
// })