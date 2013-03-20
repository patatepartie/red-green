var express = require('express'), 
	app = express(),
    port = process.env.PORT || 8880,
    ip = process.env.IP || 'localhost';

app.use(express.static('app'));
app.use(express.bodyParser());

app.use('/js/lib/', express.static('node_modules/requirejs'));
app.use('/node_modules', express.static('node_modules'));

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.send(500, 'Something broke!');
});

app.listen(port, ip);

console.log('Running on http://' + ip + ':' + port);