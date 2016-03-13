function Asteroid(x, y, radius)
{
	this.m_eObjectType = "Asteroid";
	
	this.m_liPos = new Array();
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	
	this.m_iRadius = radius;
	
	this.m_iID = guid();
	
	this.m_bDrawUI = false;
	this.m_bIsSelected = false;
	
	// Contains the points of the asteroid for collision detection
	this.m_liPoints = new Array();
	
	// Collision Detection	
	this.m_cdCollision = new SAT.Polygon(new SAT.Vector(0, 0), [new SAT.Vector(0, 0), new SAT.Vector(0, 0)]);
	
	this.generateAsteroid();
}

Asteroid.prototype.update = function(moveX, moveY)
{
}

Asteroid.prototype.draw = function()
{	
	this.drawBody();
	
	if(this.m_bDrawUI || this.m_bIsSelected)
	{
		this.drawUI();
	}
	
	this.m_bDrawUI = false;
}

// EVENTS

Asteroid.prototype.onHit = function()
{
	// Nothing
}

Asteroid.prototype.onTractor = function(x, y)
{
	// Nothing
}

// HELPERS

Asteroid.prototype.drawBody = function()
{
	m_kContext.lineWidth = 5;	
	m_kContext.fillStyle = "grey";
	
	m_kContext.beginPath();
	
	// Draw Structure
	for(var i = 0; i < this.m_cdCollision.points.length; i++)
	{
		m_kContext.lineTo(this.m_cdCollision.points[i].x, this.m_cdCollision.points[i].y);	
	}
	
	m_kContext.closePath();
	m_kContext.fill();		
}

// I hate this name, but nevermind... drawStats is already taken!
Asteroid.prototype.drawUI = function()
{
	// Save context!
	m_kContext.save();
	
	// Translate to center
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'white';
	m_kContext.lineWidth = 1;
	
	// Top Left
	m_kContext.beginPath();
	m_kContext.moveTo(-this.m_iRadius, -this.m_iRadius);
	m_kContext.lineTo(-this.m_iRadius + (this.m_iRadius * 0.5), -this.m_iRadius);
	m_kContext.moveTo(-this.m_iRadius, -this.m_iRadius);
	m_kContext.lineTo(-this.m_iRadius, -this.m_iRadius  + (this.m_iRadius * 0.5));
	m_kContext.closePath();	
	m_kContext.stroke();
	
	// Top Right
	m_kContext.beginPath();
	m_kContext.moveTo(this.m_iRadius, -this.m_iRadius);
	m_kContext.lineTo(this.m_iRadius - (this.m_iRadius * 0.5), -this.m_iRadius);
	m_kContext.moveTo(this.m_iRadius, -this.m_iRadius);
	m_kContext.lineTo(this.m_iRadius, -this.m_iRadius  + (this.m_iRadius * 0.5));
	m_kContext.closePath();	
	m_kContext.stroke();
	
	// Bottom Left
	m_kContext.beginPath();
	m_kContext.moveTo(-this.m_iRadius, this.m_iRadius);
	m_kContext.lineTo(-this.m_iRadius + (this.m_iRadius * 0.5), this.m_iRadius);
	m_kContext.moveTo(-this.m_iRadius, this.m_iRadius);
	m_kContext.lineTo(-this.m_iRadius, this.m_iRadius  - (this.m_iRadius * 0.5));
	m_kContext.closePath();	
	m_kContext.stroke();
	
	// Bottom Right
	m_kContext.beginPath();
	m_kContext.moveTo(this.m_iRadius, this.m_iRadius);
	m_kContext.lineTo(this.m_iRadius - (this.m_iRadius * 0.5), this.m_iRadius);
	m_kContext.moveTo(this.m_iRadius, this.m_iRadius);
	m_kContext.lineTo(this.m_iRadius, this.m_iRadius  - (this.m_iRadius * 0.5));
	m_kContext.closePath();	
	m_kContext.stroke();
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}

Asteroid.prototype.generateAsteroid = function()
{	
	var _numberOfVerts = (Math.random() * 6) + 10;
	var _randomPoints = new Array();

	for(var i = 0; i < _numberOfVerts; i++)
	{
		_randomPoints.push(Math.random() * (Math.PI * 2));
	}
	
	// Sort from lowest to highest
	_randomPoints.sort(function(a, b){return a-b});
	
	for(var i = 0; i < _randomPoints.length; i++)
	{
		var _x = this.m_liPos[0] + ((this.m_iRadius - 10) * Math.cos(_randomPoints[i]));
		var _y = this.m_liPos[1] + ((this.m_iRadius - 10) * Math.sin(_randomPoints[i]));
		
		this.m_liPoints.push(new V(_x, _y));
	}
	
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);
}














