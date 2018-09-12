var moment = require('moment');

// (Unix Epoch) Jan 1st 1970 00:00:00 am 
 
// date = moment();
// date.add(100, 'years').subtract(9, 'months'); 
// console.log(date.format('MMM Do, YYYY')); 

// var createdAt = 1234; 
// date = moment(createdAt);
// console.log(date.format('h:mm a')); 

var someTimeStamp = moment().valueOf(); 
console.log(someTimeStamp)
