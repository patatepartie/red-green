var express = require('express'),
    util = require("util"),
    strftime = require("strftime"),
	app = express(),
    port = process.env.PORT || 8880,
    ip = process.env.IP || 'localhost',
    gpsPaths = [],
    tracks = require('./routes/tracks');

app.use(express.static('app'));
app.use(express.bodyParser());

app.use('/js/lib/', express.static('node_modules/requirejs'));
app.use('/node_modules', express.static('node_modules'));

app.get('/gps-paths', function(req, res) {
	console.log('Request all gps paths');
	
    res.setHeader('Content-Type', 'application/json');	
	res.send(gpsPaths);
});
app.post('/gps-paths', function(req, res) {
    console.log('Post new gps path');
	
    gpsPaths.push(req.body);
	
    res.send('OK');
});
app.put('/gps-paths/:pathName', function(req, res) {
    console.log('Put coordinate to gps path ' + req.params.pathName);
    
    gpsPaths.filter(function(path) {
        return path.name === req.params.pathName;
    }).forEach(function(path) {
        path.gpsCoordinates = req.body.gpsCoordinates;
    });
    
	res.send('OK');
});
app.delete('/gps-paths/:pathName', function(req, res) {
    console.log('Delete gps path ' + req.params.pathName);
        
    res.send('OK');
});


app.get('/tracks', tracks.findAll);
app.post('/tracks', tracks.addTrack);
app.get('/tracks/:key', tracks.findByKey);

app.post('/sessions', function(req, res) {
    console.log('Add sessions');
    
    req.body.sessions.forEach(function (session) {
        var trackName = util.format("%s-%s", session.track, strftime('%d%m%Y', session.date));
        if (!(trackName in tracks)) {
            tracks[trackName] = {
                name: trackName,
                sessions: []
            };
        }
        
        tracks[trackName].sessions.push({id: session.id, samples: session.samples});    
    });
    
        
    res.send('OK');
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.send(500, 'Something broke! ' + JSON.stringify(err));
});

app.listen(port, ip);

console.log('Running on http://' + ip + ':' + port);
