LeftWing.prototype = new ShipComponent();
LeftWing.prototype.constructor = LeftWing;

function LeftWing(owner, offsetX, offsetY, scale)
{
	// Call base initialize
	ShipComponent.prototype.initialize.call(this, owner, offsetX, offsetY, scale);
}

LeftWing.prototype.update = function()
{
	// Call base update
	ShipComponent.prototype.update.call(this);
}

LeftWing.prototype.draw = function()
{
	// Call base draw
	ShipComponent.prototype.draw.call(this);
	
	// Initialises the draw and rotates/scales/centers the view
	ShipComponent.prototype.startDraw.call(this);
	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = this.m_cSecondaryColour;
	m_kContext.lineWidth = 1;
	
	// Highlight Line
	m_kContext.beginPath();
	m_kContext.moveTo(30, -3);
	m_kContext.lineTo(20, -13);
	m_kContext.lineTo(0, -28);
	m_kContext.lineTo(-5, -30);
	m_kContext.lineTo(-5, -32);
	m_kContext.lineTo(0, -30);
	m_kContext.lineTo(20, -15);
	m_kContext.lineTo(30, -5);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	m_kContext.fillStyle = this.m_cSecondaryColour;
	m_kContext.strokeStyle = 'black';
	
	// Larger Circle
	m_kContext.beginPath();
	m_kContext.arc(5, -6, 5, 0, 2 * Math.PI);
	m_kContext.fill();
	m_kContext.stroke();
	m_kContext.closePath();	
	
	// Smaller Circle
	m_kContext.beginPath();
	m_kContext.arc(5, -6, 3, 0, 2 * Math.PI);
	m_kContext.fill();
	m_kContext.stroke();
	m_kContext.closePath();	

	// Restores the context
	ShipComponent.prototype.endDraw.call(this);
}

LeftWing.prototype.createPoints = function()
{
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(-5, -32));
	this.m_liPoints.push(new V(0, -30));
	this.m_liPoints.push(new V(20, -15));
	this.m_liPoints.push(new V(30, -5));
	this.m_liPoints.push(new V(30, 0));
	this.m_liPoints.push(new V(0, 0));
}