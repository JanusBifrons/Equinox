RearRightWing.prototype = new ShipComponent();
RearRightWing.prototype.constructor = RearRightWing;

function RearRightWing(owner, offsetX, offsetY, scale)
{
	this.m_kOwner = owner;
	
	this.m_liOffset = new Array();
	this.m_liOffset[0] = offsetX;
	this.m_liOffset[1] = offsetY;
	this.m_iDistance = calculateMagnitude(this.m_liOffset);
	
	this.m_iPositionOffset = Math.atan2(-this.m_liOffset[1], -this.m_liOffset[0]) + Math.PI;
	this.m_iPositionOffset += this.m_kOwner.m_iRotation;
	
	this.m_liPos = new Array();
	this.m_liPos[0] = this.m_kOwner.m_liPos[0] + (this.m_iDistance * Math.cos(this.m_iPositionOffset));
	this.m_liPos[1] = this.m_kOwner.m_liPos[1] + (this.m_iDistance * Math.sin(this.m_iPositionOffset));
	
	this.m_iRotation = this.m_kOwner.m_iRotation;
	
	this.m_fScale = scale;
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(0, 10));
	this.m_liPoints.push(new V(-18, 33));
	this.m_liPoints.push(new V(-19, 26));
	this.m_liPoints.push(new V(-12, 0));
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);
}

RearRightWing.prototype.update = function()
{
	// Call base update
	ShipComponent.prototype.update.call(this);
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(0, 10));
	this.m_liPoints.push(new V(-18, 33));
	this.m_liPoints.push(new V(-19, 26));
	this.m_liPoints.push(new V(-12, 0));
	
	// Scale the points
	ShipComponent.prototype.scale.call(this);
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);
	
	// Rotate and translate
	this.m_cdCollision.rotate(this.m_iRotation);
	this.m_cdCollision.translate(this.m_liPos[0], this.m_liPos[1]);
}

RearRightWing.prototype.draw = function()
{
	// Call base update
	ShipComponent.prototype.draw.call(this);
	
	// Save context!
	m_kContext.save();
	
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	// Rotate to players angle
	m_kContext.rotate(this.m_iRotation);
	
	// Scale
	m_kContext.scale(this.m_fScale, this.m_fScale);
	
	m_kContext.fillStyle = this.m_cSecondaryColour;
	
	// Highlight Line
	m_kContext.beginPath();
	m_kContext.moveTo(-8, 3);
	m_kContext.lineTo(-16, 26);
	m_kContext.lineTo(-15, 29);
	m_kContext.lineTo(-18, 33);
	m_kContext.lineTo(-19, 26);
	m_kContext.lineTo(-12, 0);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	// Smaller Highlight Line
	m_kContext.beginPath();
	m_kContext.moveTo(-1, 9);
	m_kContext.lineTo(-7, 16);
	m_kContext.lineTo(-6, 18);
	m_kContext.lineTo(0, 10);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}