function Scrap(sector, component, moveX, moveY)
{
	this.m_kSector = sector;
	
	this.m_kComponent = component;
	
	this.m_iID = guid();
	
	// Location of weapon relative to the center of the ship
	this.m_liPos = new Array();
	this.m_liPos[0] = this.m_kComponent.m_kOwner.m_liPos[0];
	this.m_liPos[1] = this.m_kComponent.m_kOwner.m_liPos[1];
	
	this.m_liMove = new Array();
	this.m_liMove[0] = moveX;
	this.m_liMove[1] = moveY;
	
	this.m_iMaxSpeed = 5;
	
	this.m_iTeam = this.m_kComponent.m_kOwner.m_iTeam;
	
	// For cross compatability (unused currently)
	this.m_bDelete = false;
	
	this.m_iRotation = component.m_iRotation + component.m_iRotationOffset;
	this.m_iRotationMove = component.m_kOwner.m_iRotationSpeed * 0.25;	// Unused ATM
	
	this.m_kComponent.m_kOwner = this; // I'm your daddy now
	
	this.m_cdCollision = this.m_kComponent.m_cdCollision;
	
	// Switch
	this.m_bIsMoving = true;
}

Scrap.prototype.update = function()
{	
	this.capMove();
	
	if(Math.abs(this.m_liMove[0]) <= 0 && Math.abs(this.m_liMove[1]) <= 0)
	{
		this.m_bIsMoving = false;
	}
	else
	{
		this.m_bIsMoving = true;
	}
	
	// Move component
	this.m_liPos[0] += this.m_liMove[0];
	this.m_liPos[1] += this.m_liMove[1];
	
	this.m_kComponent.update();
	
	this.m_cdCollision = this.m_kComponent.m_cdCollision;
}

Scrap.prototype.draw = function()
{
	this.m_kComponent.draw();
}

// HEHLPERS

Scrap.prototype.capMove = function()
{
	if(Math.abs(this.m_liMove[0]) >= 10)
		this.m_liMove[0] *= 0.9;
	else
		this.m_liMove[0] *= 0.99;
	
	if(Math.abs(this.m_liMove[1]) >= 10)
		this.m_liMove[1] *= 0.9;
	else
		this.m_liMove[1] *= 0.99;
	
	if(Math.abs(this.m_liMove[0]) <= 0.1)
		this.m_liMove[0] = 0;
	
	if(Math.abs(this.m_liMove[1]) <= 0.1)
		this.m_liMove[1] = 0;
	
	if(this.m_liMove[0] > this.m_iMaxSpeed)
		this.m_liMove[0] = this.m_iMaxSpeed;
	
	if(this.m_liMove[0] < -this.m_iMaxSpeed)
		this.m_liMove[0] = -this.m_iMaxSpeed;
	
	if(this.m_liMove[1] > this.m_iMaxSpeed)
		this.m_liMove[1] = this.m_iMaxSpeed;
	
	if(this.m_liMove[1] < -this.m_iMaxSpeed)
		this.m_liMove[1] = -this.m_iMaxSpeed;
}
	

// EVENTS

Scrap.prototype.onCollision = function(vector)
{	
	this.m_liPos[0] += (vector.x);
	this.m_liPos[1] += (vector.y);
	
	this.m_liMove[0] += (vector.x * 1.5);
	this.m_liMove[1] += (vector.y * 1.5);
}
