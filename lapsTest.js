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
		loc = computeLocationOfProjectionOnLineContainingSegment(closest, point),
		v1 = closest.a.speed,
		v2 = closest.b.speed;

	var interp = v1 + (v2 - v1) * loc;
	// console.log("v1 %s v2 %s location %s inter %s", v1, v2, loc, interp);
	// return (v2 - v1) / location + v2;
	return interp;
}

function speedInKmH(speedInMph) {
	return speedInMph * 3.6;
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
	console.log("speed at projection of %s is %s against %s", coord.id, speedInKmH(interpolatedSpeed), speedInKmH(coord.speed));
});

JSON.stringify(segments.map(function(seg) {
	return {id: seg.id, a: seg.a.id, b: seg.b.id};
}));