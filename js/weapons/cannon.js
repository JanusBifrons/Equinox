Cannon.prototype = new Weapon();
Cannon.prototype.constructor = Cannon;

function Cannon()
{
	this.m_sDescription = "Cannon";
	
	this.m_iType = 3;

	this.m_kOwner;

	this.m_kOffset = new Array();
	this.m_kOffset[0] = 0;
	this.m_kOffset[1] = 0;
	this.m_iDistance = 0;
	
	this.m_iPositionOffset = 0;
	
	this.m_liPos = new Array();
	this.m_liPos[0] = 0;
	this.m_liPos[1] = 0;
	
	this.m_iRotation = 0;
	
	this.m_iRotationMin = 0;
	this.m_iRotationMax = 0;
	this.m_iRotationSpeed = 0;
	
	// Stats
	this.m_iRange = 0;
	this.m_iCooldown = 0;
	this.m_iDamage = 0;			// Redundant in this class
	this.m_iDrain = 0;
	
	this.m_iR = 255;
	this.m_iG = 255;
	this.m_iB = 255;
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
	
	console.log("Cannon initialised successfully.");
}

Cannon.prototype.update = function()
{
	// Call base update
	Weapon.prototype.update.call(this);
}

Cannon.prototype.draw = function()
{			
	// Call base draw
	Weapon.prototype.draw.call(this);
}

Cannon.prototype.onFire = function()
{	
	Weapon.prototype.onFire.call(this);
}