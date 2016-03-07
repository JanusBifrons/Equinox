MediumCannon.prototype = new Cannon();
MediumCannon.prototype.constructor = MediumCannon;

function MediumCannon(owner, offsetX, offsetY, minRot, maxRot)
{
	this.m_sDescription = "Medium Cannon";
	
	this.m_iType = 4;

	this.m_kOwner = owner;

	this.m_kOffset = new Array();
	this.m_kOffset[0] = offsetX;
	this.m_kOffset[1] = offsetY;
	this.m_iDistance = calculateMagnitude(this.m_kOffset);
	
	this.m_iPositionOffset = Math.atan2(-this.m_kOffset[1], -this.m_kOffset[0]) + Math.PI;
	this.m_iPositionOffset += this.m_kOwner.m_iRotation;
	
	this.m_liPos = new Array();
	this.m_liPos[0] = this.m_kOwner.m_liPos[0] + (this.m_iDistance * Math.cos(this.m_iPositionOffset));
	this.m_liPos[1] = this.m_kOwner.m_liPos[1] + (this.m_iDistance * Math.sin(this.m_iPositionOffset));
	
	this.m_iRotation = this.m_kOwner.m_iRotation;
	
	this.m_iRotationMin = minRot;
	this.m_iRotationMax = maxRot;
	this.m_iRotationSpeed = 0.015;
	
	// Initialise starting rotations
	this.m_iRotationOffset = this.m_iRotationMin + ((this.m_iRotationMax - this.m_iRotationMin) / 2);
	this.m_iRotation = this.m_kOwner.m_iRotation;
	this.m_iRotation += this.m_iRotationOffset;
	
	// Stats
	this.m_iRange = 5000;
	this.m_iCooldown = 1500;
	this.m_iCooldownTimer = this.m_iCooldown;
	this.m_iDamage = 0;			// Redundant in this class
	this.m_iDrain = 75;
	
	this.m_iR = 255;
	this.m_iG = 0;
	this.m_iB = 0;
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
	
	console.log("Medium Cannon initialised successfully.");
}

MediumCannon.prototype.update = function()
{
	// Call base update
	Cannon.prototype.update.call(this);
}

MediumCannon.prototype.draw = function()
{			
	// Call base draw
	Cannon.prototype.draw.call(this);
	
	var _cocked = this.m_iCooldownTimer / this.m_iCooldown;
	
	if(_cocked > 1)
	{
		_cocked = 1;
	}
	
	if(_cocked < 0.2)
	{
		_cocked = 0.2;
	}
	
	// Move screen to player location
	m_kContext.save();
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	// Rotate to players angle
	m_kContext.rotate(this.m_iRotation);
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'white';
	m_kContext.lineWidth = 1;
	
	// Base
	m_kContext.beginPath();
	m_kContext.arc(0, 0, 10, 0, 2 * Math.PI);
	m_kContext.closePath();
	m_kContext.fill();
	m_kContext.stroke();
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'black';
	m_kContext.lineWidth = 1;
	
	// Barrel Moving Part
	m_kContext.beginPath();
	m_kContext.moveTo(0, -5);
	m_kContext.lineTo(0, 5);
	m_kContext.lineTo(30 * _cocked, 5);
	m_kContext.lineTo(30 * _cocked, -5);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	// Barrel Base
	m_kContext.beginPath();
	m_kContext.moveTo(0, -10);
	m_kContext.lineTo(0, 10);
	m_kContext.lineTo(10, 10);
	m_kContext.lineTo(10, -10);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	// Restore context back to default from relative to the ship
	m_kContext.restore();	
}

// HELPERS

MediumCannon.prototype.onFire = function()
{	
	Cannon.prototype.onFire.call(this);
	
	if(this.m_bIsFiring)
	{
		m_kObjectFactory.createMediumLaser(this);	
	}
}