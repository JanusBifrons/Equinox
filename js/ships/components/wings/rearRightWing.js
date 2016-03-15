RearRightWing.prototype = new ShipComponent();
RearRightWing.prototype.constructor = RearRightWing;

function RearRightWing(owner, offsetX, offsetY, scale)
{
	// Call base initialize
	ShipComponent.prototype.initialize.call(this, owner, offsetX, offsetY, scale);
}

RearRightWing.prototype.update = function()
{
	// Call base update
	ShipComponent.prototype.update.call(this);
}

RearRightWing.prototype.draw = function()
{
	// Call base draw
	ShipComponent.prototype.draw.call(this);
	
	// Initialises the draw and rotates/scales/centers the view
	ShipComponent.prototype.startDraw.call(this);
	
	m_kContext.fillStyle = this.m_cSecondaryColour;
	
	// Highlight Line
	m_kContext.beginPath();
	m_kContext.moveTo(-8, 3);
	m_kContext.lineTo(-16, 26);
	m_kContext.lineTo(-15, 29);
	m_kContext.lineTo(-18, 33);
	m_kContext.lineTo(-19, 26);
	m_kContext.lineTo(-12, 0);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	// Smaller Highlight Line
	m_kContext.beginPath();
	m_kContext.moveTo(-1, 9);
	m_kContext.lineTo(-7, 16);
	m_kContext.lineTo(-6, 18);
	m_kContext.lineTo(0, 10);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();

	// Restores the context
	ShipComponent.prototype.endDraw.call(this);
}

RearRightWing.prototype.createPoints = function()
{
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(0, 10));
	this.m_liPoints.push(new V(-18, 33));
	this.m_liPoints.push(new V(-19, 26));
	this.m_liPoints.push(new V(-12, 0));
}