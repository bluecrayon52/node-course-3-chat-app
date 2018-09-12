var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

/* 
----TEMPLATE--------

describe('', () => {
    it('', (done) => {
        
    });
}); 

*/

// synchronous, no need to call done 
describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var from = 'Bob';
        var text = 'I love Burgers!';
        var message = generateMessage(from, text); 
        expect (message).toMatchObject({from, text}); 
        expect(typeof message.createdAt).toBe('number');
    });
}); 

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        var from = 'Bob';
        var latitude = 10; 
        var longitude = 15; 
        var url = `https://www.google.com/maps?q=${latitude},${longitude}`;

        var message = generateLocationMessage(from, latitude, longitude); 
        expect (message).toMatchObject({from, url}); 
        expect(typeof message.createdAt).toBe('number');
    });
}); 
