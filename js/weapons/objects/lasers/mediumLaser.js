MediumLaser.prototype = new Laser();
MediumLaser.prototype.constructor = MediumLaser;

function MediumLaser(owner, x, y, rotation)
{
	this.m_kOwner = owner;
	
	this.m_liPos = new Array();
	this.m_liMove = new Array();
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	
	this.m_iRotation = rotation;
	this.m_iSpeed = 10;
	
	this.m_iDeleteTimerMax = 5000;
	
	this.m_iDamage = 100;
	
	this.m_liMove[0] = Math.cos(rotation) * this.m_iSpeed;
	this.m_liMove[1] = Math.sin(rotation) * this.m_iSpeed;
	
	// Delete
	this.m_iDeleteTimer = 0;
	this.m_bDelete = false;
	
	// Collision Detection
	this.m_cdCollisionPolygon = new P(new V(0, 0), [new V(this.m_liPos[0], this.m_liPos[1]), new V(this.m_liPos[0] + this.m_liMove[0], this.m_liPos[1] + this.m_liMove[1])]);
}

MediumLaser.prototype.update = function()
{
	// Call base update
	Laser.prototype.update.call(this);
}

MediumLaser.prototype.draw = function()
{
	var _x = this.m_liPos[0];
	var _y = this.m_liPos[1];
	
	m_kContext.lineWidth = 10;
	m_kContext.strokeStyle = "purple";		
	
	m_kContext.beginPath();
	m_kContext.moveTo(_x, _y);
	m_kContext.lineTo(_x + (this.m_liMove[0] * 3), _y + (this.m_liMove[1] * 3));
	m_kContext.stroke();
}

// EVENTS

MediumLaser.prototype.onHit = function(targetHit)
{	
	Laser.prototype.onHit.call(this, targetHit);
}