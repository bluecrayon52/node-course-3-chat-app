const expect = require('expect');
const {Users} = require('./users'); 

describe('Users', () => {
    var users; 

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Heather',
            room: 'Booty, Mind, and Soul'
        },{
            id: '2',
            name: 'Nathan',
            room: 'Nerd Alert'
        }, {
            id: '3',
            name: 'Rue',
            room: 'Booty, Mind, and Soul'
        }];
    });

    it('should add new user', () => {
        var users = new Users(); 
        var user = {
            id: '123',
            name: 'Nathan',
            room: 'Metal Heads'
        };
        var resUser = users.addUser(user.id, user.name, user.room); 
        expect(users.users[0]).toMatchObject(user);  
    });

    it('[getUserList] should return a list of user names for a room', () => {
        var namesArray = users.getUserList('Booty, Mind, and Soul');
        expect(namesArray).toEqual(['Heather', 'Rue']);
        expect(namesArray.length).toEqual(2);
        expect(namesArray[0]).toBe('Heather');
        expect(namesArray[1]).toBe('Rue'); 
    });

    it('[getUser] should find a user based on id', () => {
        var user = users.getUser('2');
        expect(user.name).toBe('Nathan'); 
    });

    it('[getUser] should NOT find a non-user', () => {
        var user = users.getUser('4');
        expect(user).toBeFalsy(); 
    });
    
    it('[removeUser] should remove a user based on id', () => {
        var user = users.removeUser('3');
        expect(users.users.length).toEqual(2); 
        expect(users.users[0].name).toBe('Heather');
        expect(users.users[1].name).toBe('Nathan');
        expect(user.name).toBe('Rue'); 
    });

    it('[removeUser] should NOT remove non-user', () => {
        var user = users.removeUser('4');
        expect(users.users.length).toEqual(3); 
        expect(user).toBeFalsy(); 
    });
});