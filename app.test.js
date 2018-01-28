const supertest = require('supertest');
const tester = supertest('http://localhost:3000');

describe('GET /', function() {
    it('Respond for Get /', function(done) {
        tester
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200, done);
    });
});

describe('GET all records from database', function() {
    it('respond with find record in json', function(done) {
        tester
            .get('/list')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('Find record in database', function() {
    it('respond with find record in json', function(done) {
        tester
            .get('/findteryt/20102')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});


describe('Fake route GET /', function() {
    it('Fake route', function(done) {
        tester
            .get('/fake_path')
            .expect('Content-Type', /html/)
            .expect(404, done);
    });
});


describe('Insert record to database', function() {
    it('Respond status 200', function(done) {
        tester
            .post('/insert')
                .send({"TERYT":123456,"Nazwa Gminy":"Gmina","Ilość zinwentaryzowana [kg]":8418,"Ilość unieszkodliwiona [kg]":1160,"Pozostała do unieszkodliwienia [kg]":7258})
            .expect(200, done);
    });
});

describe('Delete record from database', function() {
    it('Respond status 200', function(done) {
        tester
            .delete('/delete')
            .send({"TERYT":123456,"Nazwa Gminy":"Gmina","Ilość zinwentaryzowana [kg]":8418,"Ilość unieszkodliwiona [kg]":1160,"Pozostała do unieszkodliwienia [kg]":7258})
            .expect(200, done);
    });
});