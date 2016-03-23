LightBeam.prototype = new Beam();
LightBeam.prototype.constructor = LightBeam;

function LightBeam(owner, offsetX, offsetY, minRot, maxRot)
{
	this.m_sDescription = "Light Beam";
	
	this.m_iType = 1;

	this.m_kOwner = owner;
	
	this.m_liHitLocation = new Array();
	this.m_liHitLocation[0] = 0;
	this.m_liHitLocation[1] = 0;

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
	this.m_iDamage = 150;
	this.m_iDrain = 0.25;
	
	// Local variables	
	this.m_iBeamDistance = 250;
	this.m_liBeam = new Array();
	this.m_liBeam[0] = this.m_liPos[0] + (this.m_iBeamDistance * Math.cos(this.m_iRotation));
	this.m_liBeam[1] = this.m_liPos[1] + (this.m_iBeamDistance * Math.sin(this.m_iRotation));
	
	// Initialise collision detection polygon
	this.m_cdCollisionPolygon = new P(new V(0, 0), [new V(this.m_liPos[0], this.m_liPos[1]), new V(this.m_liBeam[0], this.m_liBeam[1])]);
	
	this.m_iR = 255;
	this.m_iG = 0;
	this.m_iB = 0;
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
	
	console.log("Light Beam initialised successfully.");
}

LightBeam.prototype.update = function()
{
	// Call base update
	Weapon.prototype.update.call(this);
	
	// Update beam position
	this.m_liBeam[0] = this.m_liPos[0] + (this.m_iBeamDistance * Math.cos(this.m_iRotation - 0.01));
	this.m_liBeam[1] = this.m_liPos[1] + (this.m_iBeamDistance * Math.sin(this.m_iRotation - 0.01));
	this.m_liBeam[2] = this.m_liPos[0] + (this.m_iBeamDistance * Math.cos(this.m_iRotation + 0.01));
	this.m_liBeam[3] = this.m_liPos[1] + (this.m_iBeamDistance * Math.sin(this.m_iRotation + 0.01));
	
	// Update collision polygon
	this.m_cdCollisionPolygon = new P(new V(0, 0), [new V(this.m_liPos[0], this.m_liPos[1]), new V(this.m_liBeam[0], this.m_liBeam[1]), new V(this.m_liBeam[2], this.m_liBeam[3])]);
}

LightBeam.prototype.draw = function()
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
	
	// Barrel
	m_kContext.beginPath();
	m_kContext.moveTo(0, -1);
	m_kContext.lineTo(0, 1);
	m_kContext.lineTo(10, 1);
	m_kContext.lineTo(10, -1);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	// Restore context back to default from relative to the ship
	m_kContext.restore();	
}

// EVENTS

//LightBeam.prototype.onHit = function(targetHit, componentHit)
//{
	//Beam.prototype.onHit.call(this, targetHit);
//}