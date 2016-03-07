function Laser()
{
	this.m_kOwner;
	
	this.m_liPos = new Array();
	this.m_liMove = new Array();
	this.m_liPos[0] = 0;
	this.m_liPos[1] = 0;
	
	this.m_iRotation = 0;
	this.m_iSpeed = 0;
	
	this.m_iDamage = 0;
	
	this.m_liMove[0] = 0;
	this.m_liMove[1] = 0
	
	// Delete
	this.m_iDeleteTimerMax = 0;
	this.m_iDeleteTimer = 0;
	this.m_bDelete = false;
	
	// Collision Detection
	//this.m_cdCollisionPolygon = new P(new V(0, 0), [new V(this.m_liPos[0], this.m_liPos[1]), new V(this.m_liPos[0] + this.m_liMove[0], this.m_liPos[1] + this.m_liMove[1])]);
}

Laser.prototype.update = function()
{	
	this.m_iDeleteTimer += m_fElapsedTime;
	
	if(this.m_iDeleteTimer > this.m_iDeleteTimerMax)
	{
		this.m_bDelete = true;
	}

	// Move laser
	this.m_liPos[0] += this.m_liMove[0];
	this.m_liPos[1] += this.m_liMove[1];
	
	// Collision Detection
	this.m_cdCollisionPolygon = new P(new V(0, 0), [new V(this.m_liPos[0], this.m_liPos[1]), new V(this.m_liPos[0] + this.m_liMove[0], this.m_liPos[1] + this.m_liMove[1])]);
}

Laser.prototype.draw = function()
{
}

// EVENTS

Laser.prototype.onHit = function(targetHit)
{	
	// Make sure you aren't hitting your owner!
	if(this.m_kOwner.m_iID != targetHit.m_iID)
	{		
		targetHit.onHit(this.m_iDamage);
		
		this.m_bDelete = true;
	}
}