var express = require('express');
var path = require('path');
var logger = require('morgan');
var hbs = require('hbs');
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const azbestJSON = require('./azbest.json');

var port = process.env.PORT || 3000;


var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
    res.render('index', { title: 'Azbest' });
});


MongoClient.connect('mongodb://254076:gifnaHoondyeif5@ds025973.mlab.com:25973/azbest_db', (err, client) => {
    if (err)
        console.log(err + '\nConnection with mongodb server not established');
    else{
        console.log('Connection with mongodb server established');

        const db = client.db('azbest_db');

        app.listen(port, () => {
            console.log('Server listen on port: ' + port);
        });

        app.post('/fill', function (req, res) {
            db.collection('Azbest').insertMany(azbestJSON, function (err, result) {
                if (err)
                    console.log(err + "\nError in filling database");
                else
                    res.send("Filling database completed");
            });
        });

        app.delete('/clear', function (req, res) {
            db.collection('Azbest').deleteMany({}, function (err, result) {
                if (err)
                    console.log(err + "\nError in cleaning database");
                else
                    res.send("Database cleaned");
            });
        });

        app.get('/list', function (req, res) {
                db.collection('Azbest').find({}).toArray(function (err, result) {
                    if (err)
                        console.log(err + "\nError in listing database");
                    else
                        res.send(result);
            });
        });

        app.get('/findteryt/:teryt', function (req, res) {
            db.collection('Azbest').find({TERYT: parseInt(req.params.teryt)}).toArray(function (err, result) {
                if (err)
                    console.log(err + "\nError in searching teryt");
                else
                    res.send(result);
            });
        });

        app.get('/findgmina/:gmina', function (req, res) {
            db.collection('Azbest').find({"Nazwa Gminy": req.params.gmina}).toArray(function (err, result) {
                if (err)
                    console.log(err + "\nError in searching gmina");
                else
                    res.send(result);
            });
        });

        app.post('/insert', function (req, res) {
            db.collection('Azbest').insertOne(req.body, function (err, result) {
                if (err)
                    console.log(err + "\nError in add record");
                else
                    res.send("Record added");
            });
        });

        app.delete('/delete', function (req, res) {

            var record = { TERYT: parseInt(req.params.teryt), "Nazwa Gminy": req.body.Nazwa_Gminy };

            db.collection('Azbest').deleteMany(record, function (err, result) {
                if (err)
                    console.log(err + "\nError in delete record");
                else
                    res.send("Record deleted");
            });
        });

        app.patch('/update', function (req, res) {

            var record = { TERYT: parseInt(req.params.teryt), "Nazwa Gminy": req.body.Nazwa_Gminy };

            db.collection('Azbest').updateOne(record, { $set: { TERYT: parseInt(req.params.teryt) } }, function (err, result) {
                if (err)
                    console.log(err + "\nError in update record");
                else
                    res.send("Record updated");
            });

        });


    }

    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });


    app.use(function(err, req, res, next) {

        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};


        res.status(err.status || 500);
        res.render('error');
    });

});

