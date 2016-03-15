HexHull.prototype = new Component();
HexHull.prototype.constructor = HexHull;

function HexHull(owner, offsetX, offsetY, scale)
{
	// Call base initialize
	Component.prototype.initialize.call(this, owner, offsetX, offsetY, scale, false);
}

HexHull.prototype.update = function()
{
	// Call base update
	Component.prototype.update.call(this);
}

HexHull.prototype.draw = function()
{		
	// Call base draw
	Component.prototype.draw.call(this);
	
	// Initialises the draw and rotates/scales/centers the view
	Component.prototype.startDraw.call(this);
	
	// NO DETAIL!
	
	// Restores the context
	Component.prototype.endDraw.call(this);
}

HexHull.prototype.createPoints = function()
{
	// Drawing variables
	var _hexHeight = Math.sqrt(3) * 100;
	var _hexWidth = 2 * 100;
	var _hexSide = (3 / 2) * 100;
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(-(_hexWidth / 2), 0));
	this.m_liPoints.push(new V(-(_hexWidth - _hexSide), (_hexHeight / 2)));
	this.m_liPoints.push(new V((_hexWidth - _hexSide), (_hexHeight / 2)));
	this.m_liPoints.push(new V((_hexWidth / 2), 0));
	this.m_liPoints.push(new V((_hexWidth - _hexSide), -(_hexHeight / 2)));
	this.m_liPoints.push(new V(-(_hexWidth - _hexSide), -(_hexHeight / 2)));
}