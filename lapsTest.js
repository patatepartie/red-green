function distanceOfProjectionOnLine(a, b, c) {
	var L = computeLength(a, b);
	return ((a.y - c.y) * (a.y - b.y) - (a.x - c.x) * (b.x - a.x)) / (L * L);
}

function normal(a, b, c) {
	var x, y, L, r;
	L = length(a, b);
	r = distanceOfProjectionOnLine(a, b, c);

	x = a.x + r * (b.x - a.x);
	y = a.y + r * (b.y - a.y);

	return {x: x, y: y};
}

function findSegment(segments, point) {
	var results = segments.filter(function(segment) {
		var r = distanceOfProjectionOnLine(segment.a, segment.b, point);
		// console.log("%O: %f", segment, r);
		return r >= 0 && r <= 1;
	});

	return results;
}

function findComparativeSpeed(segments, sample) {
	var seg = findClosest(findSegment(segments, sample), sample);

	var r = distanceOfProjectionOnLine(seg.a, seg.b, sample);
	var projectedSpeed = (seg.b.speed - seg.a.speed) * r + seg.a.speed;
	return projectedSpeed;
}

function speedInKmH(speedInMph) {
	return speedInMph * 3.6;
}

function distanceToProj(a, b, c) {
	var L = length(a, b);
	return Math.abs((a.y - c.y) * (b.x - a.x) - (a.x - c.x) * (b.y - a.y) / (L * L));
}

function findClosest(segments, sample) {
	var closest = segments[0],
		closestDistance = distanceToProj(closest.a, closest.b, sample);

	segments.forEach(function(seg) {
		var distance = distanceToProj(seg.a, seg.b, sample);
		// console.log("%s < %s ?", distance, closestDistance);
		if (distance < closestDistance) {
			// console.log("yes");
			closest = seg;
			closestDistance = distanceToProj(closest.a, closest.b, sample);
		}
	});

	return closest;
}

lap2.cartesianCoordinates.forEach(function(coord) {
	console.log("lap1: %f lap2: %f", speedInKmH(findComparativeSpeed(segments, coord)), speedInKmH(coord.speed));
});

lap2.cartesianCoordinates.forEach(function(coord) {
	var res = findSegment(segments, coord);
	res.forEach(function(seg) {
		console.log("distance from coord %s to seg %s is %s", coord.id, seg.id, distanceOfProjectionOnLine(seg.a, seg.b, coord));
	});
});

lap2.cartesianCoordinates.forEach(function(coord) {
	var seg = findClosest(findSegment(segments, coord), coord);
	console.log("distance from coord %s to seg %s is %s", coord.id, seg.id, distanceOfProjectionOnLine(seg.a, seg.b, coord));
});






function computeLength(a, b) {
	return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

function computeSegments(samples) {
	var segments = [], previous, segmentIndex = 0;

	samples.forEach(function(sample) {
		if (previous) {
			var length = computeLength(previous, sample);
			segments.push({a: previous, b: sample, length: length, id: segmentIndex++});
		}

		previous = sample;
	});

	return segments;
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

function findSegmentsContainingProjection(segments, point) {
	return segments.filter(function(segment) {
		return isProjectionContainedInSegment(segment, point);
	});
}

function distanceToProjection(segment, point) {
	var L = segment.length,
		a = segment.a,
		b = segment.b
		c = point;
	return Math.abs( ((a.y - c.y) * (b.x - a.x) - (a.x - c.x) * (b.y - a.y)) / L);
}

function findClosestSegment(segments, point) {
	var potentials = findSegmentsContainingProjection(segments, point),
		closest = potentials[0],
		closestDistance = distanceToProjection(closest, point);

	potentials.forEach(function(segment) {
		var distance = distanceToProjection(segment, point);
		// console.log("%s < %s ?", distance, closestDistance);
		if (distance < closestDistance) {
			// console.log("yes");
			closest = segment;
			closestDistance = distanceToProjection(closest, point);
		}
	});

	return closest;
}

function interpolateSpeedOfProjection(segments, point) {
	var closest = findClosestSegment(segments, point),
		location = computeLocationOfProjectionOnLineContainingSegment(closest, point),
		v1 = closest.a.speed,
		v2 = closest.b.speed;

	console.log("v1 %s v2 %s location %s inter %s", v1, v2, location, v1 + (v2 - v1) / location);
	// return (v2 - v1) / location + v2;
	return v1;
}

var segments = computeSegments(lap1.cartesianCoordinates);

lap2.cartesianCoordinates.forEach(function(coord) {
	findSegmentsContainingProjection(segments, coord).forEach(function(segment) {
		console.log("coord %s contained in segment %s with location %s", coord.id, segment.id, computeLocationOfProjectionOnLineContainingSegment(segment, coord));
	});
});

lap2.cartesianCoordinates.forEach(function(coord) {
	var seg = findClosestSegment(segments, coord);
	console.log("closest segment from coord %s is seg %s at %s", coord.id, seg.id, distanceToProjection(seg, coord));
});

lap2.cartesianCoordinates.forEach(function(coord) {
	var interpolatedSpeed = interpolateSpeedOfProjection(segments, coord);
	console.log("speed at projection of %s is %s against %s", coord.id, interpolatedSpeed, coord.speed);
});