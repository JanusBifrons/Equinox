ShortPillar.prototype = new ShipComponent();
ShortPillar.prototype.constructor = ShortPillar;

function ShortPillar(owner, offsetX, offsetY, scale)
{
	// Call base initialize
	ShipComponent.prototype.initialize.call(this, owner, offsetX, offsetY, scale);
}

ShortPillar.prototype.update = function()
{
	// Call base update
	ShipComponent.prototype.update.call(this);
}

ShortPillar.prototype.draw = function()
{
	// Call base draw
	ShipComponent.prototype.draw.call(this);
	
	// Initialises the draw and rotates/scales/centers the view
	ShipComponent.prototype.startDraw.call(this);
	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = this.m_cSecondaryColour;
	
	// Left Highlight
	m_kContext.beginPath();	
	m_kContext.moveTo(-25, -5);
	m_kContext.lineTo(-20, -5);
	m_kContext.lineTo(-20, 5);
	m_kContext.lineTo(-25, 5);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	// Right Highlight
	m_kContext.beginPath();	
	m_kContext.moveTo(25, -5);
	m_kContext.lineTo(20, -5);
	m_kContext.lineTo(20, 5);
	m_kContext.lineTo(25, 5);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();

	// Restores the context
	ShipComponent.prototype.endDraw.call(this);
}

ShortPillar.prototype.createPoints = function()
{
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(0, 0));
	this.m_liPoints.push(new V(50, 0));
	this.m_liPoints.push(new V(50, 10));
	this.m_liPoints.push(new V(0, 10));
}