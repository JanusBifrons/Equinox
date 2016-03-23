MediumBeam.prototype = new Beam();
MediumBeam.prototype.constructor = MediumBeam;

function MediumBeam(owner, offsetX, offsetY, minRot, maxRot)
{
	this.m_sDescription = "Medium Beam";
	
	this.m_iType = 1;

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
	this.m_iRotationSpeed = 0.0015;
	
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
	this.m_iRange = 1000;
	this.m_iCooldown = 0;
	this.m_iDamage = 200;
	this.m_iDrain = 1;
	
	// Local variables	
	this.m_iBeamDistance = this.m_iRange;
	this.m_liBeam = new Array();
	this.m_liBeam[0] = this.m_liPos[0] + (this.m_iBeamDistance * Math.cos(this.m_iRotation));
	this.m_liBeam[1] = this.m_liPos[1] + (this.m_iBeamDistance * Math.sin(this.m_iRotation));
	
	// Initialise collision detection polygon
	this.m_cdCollisionPolygon = new P(new V(0, 0), [new V(this.m_liPos[0], this.m_liPos[1]), new V(this.m_liBeam[0], this.m_liBeam[1])]);
	
	this.m_iR = 0;
	this.m_iG = 0;
	this.m_iB = 255;
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
	
	console.log("Medium Beam initialised successfully.");
}

MediumBeam.prototype.update = function()
{
	// Update beam position
	this.m_liBeam[0] = this.m_liPos[0] + (this.m_iBeamDistance * Math.cos(this.m_iRotation - 0.01));
	this.m_liBeam[1] = this.m_liPos[1] + (this.m_iBeamDistance * Math.sin(this.m_iRotation - 0.01));
	this.m_liBeam[2] = this.m_liPos[0] + (this.m_iBeamDistance * Math.cos(this.m_iRotation + 0.01));
	this.m_liBeam[3] = this.m_liPos[1] + (this.m_iBeamDistance * Math.sin(this.m_iRotation + 0.01));
	
	// Update collision polygon
	this.m_cdCollisionPolygon = new P(new V(0, 0), [new V(this.m_liPos[0], this.m_liPos[1]), new V(this.m_liBeam[0], this.m_liBeam[1]), new V(this.m_liBeam[2], this.m_liBeam[3])]);
	
	// Call base update
	Weapon.prototype.update.call(this);
}

MediumBeam.prototype.draw = function()
{	
	// Call base draw
	Beam.prototype.draw.call(this);	
	
	// Move screen to Beam location
	m_kContext.save();
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	// Rotate to players angle
	m_kContext.rotate(this.m_iRotation);
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'white';
	m_kContext.lineWidth = 1;
	
	// Base
	m_kContext.beginPath();
	m_kContext.arc(0, 0, 3, 0, 2 * Math.PI);
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
	m_kContext.lineTo(30, 5);
	m_kContext.lineTo(30, -5);
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

// EVENTS

MediumBeam.prototype.onHit = function(targetHit)
{
	Beam.prototype.onHit.call(this, targetHit);
}