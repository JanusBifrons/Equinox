Pad.prototype = new Component();
Pad.prototype.constructor = Pad;

function Pad(owner, offsetX, offsetY, scale, mirror)
{
	// Call base initialize
	Component.prototype.initialize.call(this, owner, offsetX, offsetY, scale, mirror);
}

Pad.prototype.update = function()
{
	// Call base update
	Component.prototype.update.call(this);
}

Pad.prototype.draw = function()
{
	// Call base draw
	Component.prototype.draw.call(this);
	
	// Initialises the draw and rotates/scales/centers the view
	Component.prototype.startDraw.call(this);
	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = this.m_cSecondaryColour;
	
	// Highlight
	m_kContext.beginPath();
	m_kContext.moveTo(10, 0);
	m_kContext.lineTo(23, -11);
	m_kContext.lineTo(20, -12);
	m_kContext.lineTo(10, -7);
	m_kContext.lineTo(2, -5);
	m_kContext.lineTo(0, 0);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();

	// Restores the context
	Component.prototype.endDraw.call(this);
}

Pad.prototype.createPoints = function()
{
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(2, -5));
	this.m_liPoints.push(new V(10, -7));
	this.m_liPoints.push(new V(20, -12));
	this.m_liPoints.push(new V(25, -10));
	this.m_liPoints.push(new V(27, -5));
	this.m_liPoints.push(new V(20, 0));
	this.m_liPoints.push(new V(0, 0));
}