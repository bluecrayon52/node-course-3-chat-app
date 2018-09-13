const expect = require('expect'); 
const {isRealString} = require('./validation');

// synchronouse tests, no need for done arg 
describe('isRealString', () => {
    it('should reject non-string values', () => {
        expect(isRealString(6)).toBe(false); 
    });
    it('should reject strings with only spaces', () => {
        expect(isRealString('     ')).toBe(false); 
    }); 
    it('should allow strings with non-space chartacters', () => {
        expect(isRealString('testing')).toBe(true); 
    });
});
