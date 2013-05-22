var MongoClient = require('mongodb').MongoClient;

exports.findAll = function(req, res) {
    MongoClient.connect("mongodb://dev.patatepartie.fr/red_green", function(err, db) {
        if(err) throw err;
        db.collection('tracks', function(err, collection) {
            if(err) throw err;
            
            collection.find({}, {name: true, key: true}).toArray(function(err, items) {
                if(err) throw err;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(items);
                
                db.close();
            });
        });
    });
};

exports.findByKey = function(req, res) {
    var key = req.params.key;
    MongoClient.connect("mongodb://dev.patatepartie.fr/red_green", function(err, db) {
        if(err) throw err;
        
        db.collection('tracks', function(err, collection) {
            if(err) throw err;
            
            collection.findOne({key: key}, function(err, item) {
                if(err) throw err;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(item);
                
                db.close();
            });
        });
    });
};

exports.addTrack = function(req, res) {
    var track = req.body;
    
    MongoClient.connect("mongodb://dev.patatepartie.fr/red_green", function(err, db) {
        if(err) throw err;
        db.collection('tracks', function(err, collection) {
            if(err) throw err;
            
            collection.insert(track, {safe: true}, function(err, result) {
                if(err) throw err;
                
                res.send('Track added');
                
                db.close();
            });
        });
    });    
};

exports.addSession = function(req, res) {
    var trackKey = req.params.key,
        session = req.body;
        
    session.trackKey = trackKey;
    
    MongoClient.connect("mongodb://dev.patatepartie.fr/red_green", function(err, db) {
        if(err) throw err;
        db.collection('sessions', function(err, collection) {
            if(err) throw err;
            
            collection.insert(session, {safe: true}, function(err, result) {
                if(err) throw err;
                
                res.send('Session added');
                
                db.close();
            });
        });
    });    
};

exports.findAllSessionsForTrack = function(req, res) {
    var trackKey = req.params.key;
    
    MongoClient.connect("mongodb://dev.patatepartie.fr/red_green", function(err, db) {
        if(err) throw err;
        
        db.collection('sessions', function(err, collection) {
            if(err) throw err;
            
            collection.find({trackKey: trackKey}, {date: true, key: true}).toArray(function(err, items) {
                if(err) throw err;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(items);
                
                db.close();
            });
        });
    });
};

exports.findSessionForTrackByDate = function(req, res) {
    var trackKey = req.params.key,
        sessionDate = req.params.date;
        
    MongoClient.connect("mongodb://dev.patatepartie.fr/red_green", function(err, db) {
        if(err) throw err;
        
        db.collection('sessions', function(err, collection) {
            if(err) throw err;
            
            collection.findOne({trackKey: trackKey, date: sessionDate}, function(err, item) {
                if(err) throw err;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(item);
                
                db.close();
            });
        });
    });
};