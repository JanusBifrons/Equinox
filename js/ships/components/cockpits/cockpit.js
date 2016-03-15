Cockpit.prototype = new ShipComponent();
Cockpit.prototype.constructor = Cockpit;

function Cockpit(owner, offsetX, offsetY, scale)
{
	// Call base initialize
	ShipComponent.prototype.initialize.call(this, owner, offsetX, offsetY, scale);
}

Cockpit.prototype.update = function()
{
	// Call base update
	ShipComponent.prototype.update.call(this);
}

Cockpit.prototype.draw = function()
{
	// Call base draw
	ShipComponent.prototype.draw.call(this);
	
	// Initialises the draw and rotates/scales/centers the view
	ShipComponent.prototype.startDraw.call(this);
	
	m_kContext.fillStyle = this.m_cSecondaryColour;
	
	// Tip Highlight
	m_kContext.beginPath();
	m_kContext.moveTo(0, 0);
	m_kContext.lineTo(-1, -1);
	m_kContext.lineTo(-3, -2);
	m_kContext.lineTo(-5, -3);
	m_kContext.lineTo(-7, -4);
	m_kContext.lineTo(-9, -4);
	m_kContext.lineTo(-9, 4);
	m_kContext.lineTo(-7, 4);
	m_kContext.lineTo(-5, 3);
	m_kContext.lineTo(-3, 2);
	m_kContext.lineTo(-1, 1);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	m_kContext.strokeStyle = 'black';	
	
	// Tip Highlight Strip
	m_kContext.beginPath();
	m_kContext.moveTo(-11, -4);
	m_kContext.lineTo(-11, 4);
	m_kContext.lineTo(-12, 4);
	m_kContext.lineTo(-12, -4);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
		
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'green';
	
	// Actual Cockpit
	m_kContext.save();
	m_kContext.scale(1.75, 1);
	m_kContext.beginPath();
	m_kContext.arc(-14, 0, 5, 0, Math.PI * 2);
	m_kContext.stroke();
	m_kContext.fill();
	m_kContext.closePath();
	m_kContext.restore();
	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = this.m_cSecondaryColour;
	
	// Actual Cockpit Tail Strips
	m_kContext.beginPath();
	m_kContext.moveTo(-25, -5);
	m_kContext.lineTo(-30, 0);
	m_kContext.lineTo(-25, 5);
	m_kContext.lineTo(-27, 5);
	m_kContext.lineTo(-35, 0);
	m_kContext.lineTo(-27, -5);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();

	// Restores the context
	ShipComponent.prototype.endDraw.call(this);
}

Cockpit.prototype.createPoints = function()
{
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(-1, 1));
	this.m_liPoints.push(new V(-3, 2));
	this.m_liPoints.push(new V(-5, 3));
	this.m_liPoints.push(new V(-7, 4));
	this.m_liPoints.push(new V(-15, 4));
	this.m_liPoints.push(new V(-18, 6));
	this.m_liPoints.push(new V(-25, 8));
	this.m_liPoints.push(new V(-25, -8));
	this.m_liPoints.push(new V(-18, -6));
	this.m_liPoints.push(new V(-15, -4));
	this.m_liPoints.push(new V(-7, -4));
	this.m_liPoints.push(new V(-5, -3));
	this.m_liPoints.push(new V(-3, -2));
	this.m_liPoints.push(new V(-1, -1));
	this.m_liPoints.push(new V(0, 0));
}