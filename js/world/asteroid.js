function Asteroid(x, y, radius)
{
	this.m_liPos = new Array();
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	
	this.m_iRadius = radius;
	
	this.m_iID = guid();
	
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
		var _x = this.m_liPos[0] + (this.m_iRadius * Math.cos(_randomPoints[i]));
		var _y = this.m_liPos[1] + (this.m_iRadius * Math.sin(_randomPoints[i]));
		
		this.m_liPoints.push(new V(_x, _y));
	}
	
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);
}














