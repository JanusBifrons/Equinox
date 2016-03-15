function Scrap(sector, component, moveX, moveY)
{
	this.m_eObjectType = "Scrap";
	
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
	this.m_bIsAlive = true;
	
	this.m_iRotation = component.m_iRotation + component.m_iRotationOffset;
	this.m_iRotationMove = component.m_kOwner.m_iRotationSpeed * 0.25;	// Unused ATM
	
	// Reinitialize
	this.m_kComponent.initialize(this, 0, 0, this.m_kComponent.m_fScale);
	
	this.m_iRadius = 50;
	
	this.m_cdCollision = this.m_kComponent.m_cdCollision;
	
	// Switch
	this.m_bIsMoving = true;
	this.m_bDrawUI = false;
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
	this.drawBody();
	
	if(this.m_bDrawUI)
	{
		this.drawUI();
	}
	
	this.m_bDrawUI = false;
}

// HELPERS

Scrap.prototype.drawBody = function()
{
	this.m_kComponent.draw();
}

// I hate this name, but nevermind... drawStats is already taken!
Scrap.prototype.drawUI = function()
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

Scrap.prototype.onMouseClick = function(mouse)
{
	
}

Scrap.prototype.onCollision = function(vector)
{	
	this.m_liPos[0] += (vector.x);
	this.m_liPos[1] += (vector.y);
	
	this.m_liMove[0] += (vector.x * 1.5);
	this.m_liMove[1] += (vector.y * 1.5);
}
