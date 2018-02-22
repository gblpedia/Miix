
function Point(_x, _y) {
	this.x = _x;
	this.y = _y;
}

Point.prototype.relativeTo = function(_P) {
	return new Point(this.x - _P.x, this.y - _P.y);
}


function getDiagonalIntersection(P1, P2, P3, P4) {
	//Diagnal of P1(->1), P4(->2)
	var r1 = (P4.y-P1.y)/(P4.x-P1.x);
	var a1 = r1;
	var b1 = P1.y-r1*P1.x;
	
	//Diagnal of P2(->1), P3(->2)
	var r2 = (P3.y-P2.y)/(P3.x-P2.x);
	var a2 = r2;
	var b2 = P2.y-r2*P2.x;
	
	var x = (b2-b1)/(a1-a2);
	var y = a1*x+b1;
	
	return new Point(x,y);
}

function getMidPoint(P1, P2) {

	return new Point( (P1.x+P2.x)/2, (P1.y+P2.y)/2 );
}