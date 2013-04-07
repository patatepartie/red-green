#!/usr/bin/env node
var argv = require('optimist')
    .usage('Usage: $0 -x [num] -y [num]')
    .default('d', '.')
    .demand(['f','s'])
    .alias({'f': 'session-file', 's': 'start-line-file'})
    .argv;

var fs = require('fs');
var path = require('path');
var util = require('util');


conv = ({
	r_major:6378137.0,//Equatorial Radius, WGS84
	r_minor:6356752.314245179,//defined as constant
	f:298.257223563,//1/f=(a-b)/a , a=r_major, b=r_minor

	deg2rad:function(d)
	{
		var r=d*(Math.PI/180.0);
		return r;
	},

	ll2m:function(lat,lon) //lat lon to mercator
	{
		//lat, lon in rad
		var x=this.r_major * this.deg2rad(lon);

		if (lat > 89.5) lat = 89.5;
		if (lat < -89.5) lat = -89.5;


		var temp = this.r_minor / this.r_major;
		var es = 1.0 - (temp * temp);
		var eccent = Math.sqrt(es);

		var phi = this.deg2rad(lat);

		var sinphi = Math.sin(phi);

		var con = eccent * sinphi;
		var com = 0.5 * eccent;
		var con2 = Math.pow((1.0-con)/(1.0+con), com);
		var ts = Math.tan(0.5 * (Math.PI*0.5 - phi))/con2;
		var y = 0 - this.r_major * Math.log(ts);
		var ret={'x':x,'y':y};
		return ret;
	}
});

var startLine = JSON.parse(fs.readFileSync(argv.s, "utf8"));
var cartesian = conv.ll2m(startLine.a.latitude, startLine.a.longitude);
startLine.a.x = cartesian.x;
startLine.a.y = cartesian.y;
cartesian = conv.ll2m(startLine.b.latitude, startLine.b.longitude);
startLine.b.x = cartesian.x;
startLine.b.y = cartesian.y;
startLine.length = computeLength(startLine.a, startLine.b);

var session = fs.readFileSync(argv.f, "utf8").split('\n').filter(function(line) {
	return line !== '';
}).map(function(line) {
	return JSON.parse(line);
}).map(function(sample) {
	var cartesian = conv.ll2m(sample.coords.latitude, sample.coords.longitude);
	sample.coords.x = cartesian.x;
	sample.coords.y = cartesian.y;
	return sample;
});

var currentLap = [];
session.forEach(function(sample) {
	if (currentLap.length > 0 && isNewLap(sample)) {
		writeLap();
		currentLap = [];
	}

	currentLap.push(sample);
});

writeLap();

function computeLength(a, b) {
	return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

function computeLocationOfProjectionOnLineContainingSegment(segment, point) {
	var L = segment.length,
		a = segment.a,
		b = segment.b,
		c = point;

	return ((a.y - c.y) * (a.y - b.y) - (a.x - c.x) * (b.x - a.x)) / (L * L);
}

function isProjectionContainedInSegment(segment, point) {
	var location = computeLocationOfProjectionOnLineContainingSegment(segment, point);
	return location >= 0 && location <= 1;
}

function computeLocationOnPerpendicular(segment, point) {
	var L = segment.length,
		a = segment.a,
		b = segment.b
		c = point;
	return ((a.y - c.y) * (b.x - a.x) - (a.x - c.x) * (b.y - a.y)) / (L * L);
}

function isPointLeftOfSegment(segment, point) {
	return computeLocationOnPerpendicular(segment, point) < 0;
}

function isPointRightOfSegment(segment, point) {
	return computeLocationOnPerpendicular(segment, point) >= 0;
}

function isNewLap(sample) {
	var onStraight = isProjectionContainedInSegment(startLine, sample.coords);
	var previousBeforeStartLine = isPointLeftOfSegment(startLine, currentLap[currentLap.length - 1]);
	var currentAfterStartLine = isPointRightOfSegment(startLine, sample.coords);
	return onStraight && previousBeforeStartLine && currentAfterStartLine;
}

function writeLap() {
	console.log("New Lap %d", currentLap.length);
	// console.log(currentLap);
}

if (!fs.existsSync()) {
	// TODO check is dir or fail

}