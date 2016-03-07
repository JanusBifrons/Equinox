function Missile(owner, x, y, rotation)
{
	this.m_kOwner = owner;
	
	this.m_liPos = new Array();
	this.m_liMove = new Array();
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	
	// Target
	this.m_liTarget = new Array();
	this.m_liTarget[0] = 0;
	this.m_liTarget[1] = 0;
	
	this.m_iRotation = rotation;
	this.m_iRotationSpeed = 0.15;
	this.m_iSpeed = 1;
	
	this.m_iDamage = 1;
	
	this.m_liMove[0] = Math.cos(this.m_iRotation) * this.m_iSpeed;
	this.m_liMove[1] = Math.sin(this.m_iRotation) * this.m_iSpeed;
	
	// Delete
	this.m_iDeleteTimer = 0;
	this.m_bDelete = false;
	
	// Collision Detection
	this.m_cdCollisionPolygon = new P(new V(0, 0), [new V(this.m_liPos[0], this.m_liPos[1]), new V(this.m_liPos[0] + this.m_liMove[0], this.m_liPos[1] + this.m_liMove[1])]);
}

Missile.prototype.update = function()
{	
	// Calculate vector to target
	var _x = this.m_liTarget[0] - this.m_liPos[0];
	var _y = this.m_liTarget[1] - this.m_liPos[1];
	
	// Calculate rotation to target based on vector
	var _desiredRotation = Math.atan2(-_y, -_x) + Math.PI;	// Fiddled so that it's from 0-2PI rather than -PI to +PI
	
	// Wrap to ensure its between 0-2PI
	_desiredRotation = wrapAngle(_desiredRotation);
	
	// Calculate the difference so we know how much to turn!
	var _turnAmount = _desiredRotation - this.m_iRotation;
	
	// Cap turn to turn speed!
	_turnAmount = clamp(_turnAmount, -this.m_iRotationSpeed, this.m_iRotationSpeed);
	
	this.m_iRotation += _turnAmount;

	this.m_liMove[0] = Math.cos(this.m_iRotation) * this.m_iSpeed;
	this.m_liMove[1] = Math.sin(this.m_iRotation) * this.m_iSpeed;

	// Move Missile
	this.m_liPos[0] += this.m_liMove[0];
	this.m_liPos[1] += this.m_liMove[1];
	
	// Collision Detection
	this.m_cdCollisionPolygon = new P(new V(0, 0), [new V(this.m_liPos[0], this.m_liPos[1]), new V(this.m_liPos[0] + this.m_liMove[0], this.m_liPos[1] + this.m_liMove[1])]);
}

Missile.prototype.draw = function()
{
	var _x = this.m_liPos[0];
	var _y = this.m_liPos[1];

	m_kCamera.begin();
	
	m_kContext.lineWidth = 1;
	m_kContext.fillStyle = "white";

	m_kContext.beginPath();
	m_kContext.arc(this.m_liPos[0], this.m_liPos[1], 20, 0, 2 * Math.PI);
	m_kContext.fill();
	m_kContext.closePath();	
	
	m_kCamera.end();
}

// EVENTS

Missile.prototype.onHit = function(targetHit)
{	
	// Make sure you aren't hitting your owner!
	if(this.m_kOwner.m_iID != targetHit.m_iID)
	{		
		targetHit.onHit(this.m_iDamage);
		
		this.m_bDelete = true;
	}
}