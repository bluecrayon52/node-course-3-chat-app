var expect = require('expect');

var {generateMessage} = require('./message');

/* 
----TEMPLATE--------

describe('', () => {
    it('', (done) => {
        
    });
}); 

*/

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var from = 'Bob';
        var text = 'I love Burgers!';
        var message = generateMessage(from, text); 
        expect (message).toMatchObject({from, text}); 
        expect(typeof message.createdAt).toBe('number');
    });
}); 
