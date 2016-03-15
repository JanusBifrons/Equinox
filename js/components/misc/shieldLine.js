ShieldLine.prototype = new Component();
ShieldLine.prototype.constructor = ShieldLine;

function ShieldLine(owner, offsetX, offsetY, scale, targetX, targetY)
{
	// Call base initialize
	Component.prototype.initialize.call(this, owner, offsetX, offsetY, scale, false);
	
	// Target Vector
	this.m_liTarget = new Array();
	this.m_liTarget[0] = targetX - this.m_kOwner.m_liPos[0];
	this.m_liTarget[1] = targetY - this.m_kOwner.m_liPos[1];
	
	// Direction vector
	this.m_liDirection = new Array();
	this.m_liDirection[0] = targetX - this.m_kOwner.m_liPos[0];
	this.m_liDirection[1] = targetY - this.m_kOwner.m_liPos[1];
	
	// Convert to unit vector (normalized)
	this.m_liDirection = unitVector(this.m_liDirection);
	
	// Resize to desired length
	this.m_liDirection[0] *= 5;
	this.m_liDirection[1] *= 5;
}

ShieldLine.prototype.update = function()
{
	// Call base update
	Component.prototype.update.call(this);
}

ShieldLine.prototype.draw = function()
{		
	// Call base draw
	Component.prototype.draw.call(this);
	
	// Initialises the draw and rotates/scales/centers the view
	Component.prototype.startDraw.call(this);
	
	// Variables required for drawing
	var _metal = 0;
	
	if(this.m_kOwner.m_iMetalStored > 0)
	{
		_metal = (this.m_kOwner.m_iMetalStored / this.m_kOwner.m_iMetalStoredMax) * 100;
		
		_metal = Math.round(_metal);
	}
	
	// Set drawing parameters
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'grey';
	m_kContext.lineWidth = 5;
	
	// Bar background
	m_kContext.beginPath();
	
	m_kContext.moveTo(-10, -50);	
	m_kContext.lineTo(10, -50);	
	m_kContext.lineTo(10, 50);	
	m_kContext.lineTo(-10, 50);	
	
	m_kContext.closePath();
	m_kContext.stroke();	
	m_kContext.fill();
	
	// Set drawing parameters
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'orange';
	
	// Bar contents
	m_kContext.beginPath();
	
	m_kContext.moveTo(-10, 50);	
	m_kContext.lineTo(10, 50);	
	m_kContext.lineTo(10, 50 - (100 * (_metal / 100)));	
	m_kContext.lineTo(-10, 50 - (100 * (_metal / 100)));
	
	m_kContext.closePath();
	m_kContext.stroke();	
	m_kContext.fill();
	
	// Restores the context
	Component.prototype.endDraw.call(this);
}

ShieldLine.prototype.createPoints = function()
{
	if(this.m_kOwner.onRequest(new Request(this.m_kOwner, 0, 1)))
	{
		// Collision Detection
		this.m_liPoints = new Array();
		this.m_liPoints.push(new V(this.m_liDirection[1], -this.m_liDirection[0]));
		this.m_liPoints.push(new V(-this.m_liDirection[1], this.m_liDirection[0]));
		this.m_liPoints.push(new V(this.m_liTarget[0] + -(this.m_liDirection[1]), this.m_liTarget[1] + this.m_liDirection[0]));
		this.m_liPoints.push(new V(this.m_liTarget[0] + this.m_liDirection[1], this.m_liTarget[1] + -(this.m_liDirection[0])));	
	}
	else
	{
		m_kLog.addStaticItem("Shield Line Component is NOT draining power!");
		
		// Collision Detection
		this.m_liPoints = new Array();
		this.m_liPoints.push(new V(0, 0));
	}
}

// EVENTS

ShieldLine.prototype.onHit = function(damage)
{
	this.m_kOwner.onHitDrain(damage);
}