var express = require('express'), 
	app = express(),
    port = process.env.PORT || 8880,
    ip = process.env.IP || 'localhost',
    gpsPaths = [];

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

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.send(500, 'Something broke!');
});

app.listen(port, ip);

console.log('Running on http://' + ip + ':' + port);
