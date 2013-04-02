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

lap1.cartesianCoordinates = lap1.gpsCoordinates.map(function(coord) {
	var res = conv.ll2m(coord.lat, coord.lng);
	res.speed = parseFloat(coord.speed);
	return res;
});

var coordIndex = 0;
lap2.cartesianCoordinates = lap2.gpsCoordinates.map(function(coord) {
	var res = conv.ll2m(coord.lat, coord.lng);
	res.speed = parseFloat(coord.speed);
	res.id = coordIndex++;
	return res;
});