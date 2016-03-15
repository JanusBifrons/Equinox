RearWing.prototype = new Component();
RearWing.prototype.constructor = RearWing;

function RearWing(owner, offsetX, offsetY, scale, mirror)
{
	// Call base initialize
	Component.prototype.initialize.call(this, owner, offsetX, offsetY, scale, mirror);
}

RearWing.prototype.update = function()
{
	// Call base update
	Component.prototype.update.call(this);
}

RearWing.prototype.draw = function()
{
	// Call base draw
	Component.prototype.draw.call(this);
	
	// Initialises the draw and rotates/scales/centers the view
	Component.prototype.startDraw.call(this);
	
	m_kContext.fillStyle = this.m_cSecondaryColour;
	
	// Highlight Line
	m_kContext.beginPath();
	m_kContext.moveTo(-8, -3);
	m_kContext.lineTo(-16, -26);
	m_kContext.lineTo(-15, -29);
	m_kContext.lineTo(-18, -33);
	m_kContext.lineTo(-19, -26);
	m_kContext.lineTo(-12, 0);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	// Smaller Highlight Line
	m_kContext.beginPath();
	m_kContext.moveTo(-1, -9);
	m_kContext.lineTo(-7, -16);
	m_kContext.lineTo(-6, -18);
	m_kContext.lineTo(0, -10);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();

	// Restores the context
	Component.prototype.endDraw.call(this);
}

RearWing.prototype.createPoints = function()
{
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(-12, 0));
	this.m_liPoints.push(new V(-19, -26));
	this.m_liPoints.push(new V(-18, -33));
	this.m_liPoints.push(new V(0, -10));
}