Construction.prototype = new Beam();
Construction.prototype.constructor = Construction;

function Construction(owner, offsetX, offsetY, minRot, maxRot)
{
	this.m_sDescription = "Construction Beam";
	
	this.m_iType = 2;

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
	this.m_bUnlimitedRotation = false;
	this.m_iRotationSpeed = 0.015;
	
	var _difference = this.m_iRotationMax - this.m_iRotationMin;
	
	if(_difference >= (Math.PI * 2))
	{
		this.m_bUnlimitedRotation = true;	
	}
	
	// Initialise starting rotations
	this.m_iRotationOffset = this.m_iRotationMin + ((this.m_iRotationMax - this.m_iRotationMin) / 2);
	this.m_iRotation = this.m_kOwner.m_iRotation;
	this.m_iRotation += this.m_iRotationOffset;
	
	// Stats
	this.m_iRange = 250;
	this.m_iCooldown = 0;
	this.m_iDamage = 0;
	this.m_iDrain = 0.5;
	
	// Local Variables
	this.m_iBeamDistance = 250;
	this.m_liBeam = new Array();
	this.m_liBeam[0] = this.m_liPos[0] + (this.m_iBeamDistance * Math.cos(this.m_kOwner.m_iRotation));
	this.m_liBeam[1] = this.m_liPos[1] + (this.m_iBeamDistance * Math.sin(this.m_kOwner.m_iRotation));
	
	// Initialise collision detection polygon
	this.m_cdCollisionPolygon = new P(new V(0, 0), [new V(this.m_liPos[0], this.m_liPos[1]), new V(this.m_liBeam[0], this.m_liBeam[1])]);
	
	this.m_iR = 255;
	this.m_iG = 165;
	this.m_iB = 0;
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
	
	console.log("Construction Beam initialised successfully.");
}

Construction.prototype.update = function()
{
	// Call base update
	Weapon.prototype.update.call(this);
	
	// Update beam position
	this.m_liBeam[0] = this.m_liPos[0] + (this.m_iBeamDistance * Math.cos(this.m_iRotation - 0.05));
	this.m_liBeam[1] = this.m_liPos[1] + (this.m_iBeamDistance * Math.sin(this.m_iRotation - 0.05));
	this.m_liBeam[2] = this.m_liPos[0] + (this.m_iBeamDistance * Math.cos(this.m_iRotation + 0.05));
	this.m_liBeam[3] = this.m_liPos[1] + (this.m_iBeamDistance * Math.sin(this.m_iRotation + 0.05));
	
	// Update collision polygon
	this.m_cdCollisionPolygon = new P(new V(0, 0), [new V(this.m_liPos[0], this.m_liPos[1]), new V(this.m_liBeam[0], this.m_liBeam[1]), new V(this.m_liBeam[2], this.m_liBeam[3])]);
}

Construction.prototype.draw = function()
{	
	// Call base draw
	Beam.prototype.draw.call(this);
}

// EVENTS

Construction.prototype.onHit = function(targetHit)
{	
	// If target isn't constructed
	if(!targetHit.m_bIsConstructed)
	{
		// Construct it!
		targetHit.onConstruct(1000);
	}
	else
	{
		// Repair target!
		targetHit.onRepair(1);
	}
}