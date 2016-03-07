RoundEngine.prototype = new ShipComponent();
RoundEngine.prototype.constructor = RoundEngine;

function RoundEngine(owner, offsetX, offsetY, scale, rotationOffset)
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
	
	this.m_iRotationOffset = rotationOffset;
	this.m_iRotation = this.m_kOwner.m_iRotation + this.m_iRotationOffset;
	
	this.m_fScale = scale;
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(12, 2));
	this.m_liPoints.push(new V(10, 5));
	this.m_liPoints.push(new V(6, 8));
	this.m_liPoints.push(new V(6, 14));
	this.m_liPoints.push(new V(10, 18));
	this.m_liPoints.push(new V(12, 19));
	this.m_liPoints.push(new V(18, 19));
	this.m_liPoints.push(new V(20, 18));
	this.m_liPoints.push(new V(24, 14));
	this.m_liPoints.push(new V(24, 8));
	this.m_liPoints.push(new V(20, 5));
	this.m_liPoints.push(new V(18, 2));
	
	// Scale the points
	ShipComponent.prototype.scale.call(this);
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);

	// Rotate and translate
	this.m_cdCollision.rotate(this.m_iRotation);
	this.m_cdCollision.translate(this.m_liPos[0], this.m_liPos[1]);
}

RoundEngine.prototype.update = function()
{
	// Call base update
	ShipComponent.prototype.update.call(this);
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(12, 2));
	this.m_liPoints.push(new V(10, 5));
	this.m_liPoints.push(new V(6, 8));
	this.m_liPoints.push(new V(6, 14));
	this.m_liPoints.push(new V(10, 18));
	this.m_liPoints.push(new V(12, 19));
	this.m_liPoints.push(new V(18, 19));
	this.m_liPoints.push(new V(20, 18));
	this.m_liPoints.push(new V(24, 14));
	this.m_liPoints.push(new V(24, 8));
	this.m_liPoints.push(new V(20, 5));
	this.m_liPoints.push(new V(18, 2));
	
	// Scale the points
	ShipComponent.prototype.scale.call(this);
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);

	// Rotate and translate
	this.m_cdCollision.rotate(this.m_iRotation);
	this.m_cdCollision.translate(this.m_liPos[0], this.m_liPos[1]);
}

RoundEngine.prototype.draw = function()
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
	
	m_kContext.fillStyle = this.m_cPrimaryColour;
	m_kContext.strokeStyle = this.m_cSecondaryColour;
	m_kContext.lineWidth = 1;
	
	// Centre Circle
	m_kContext.beginPath();
	m_kContext.arc(15, 11, 5, Math.PI - (Math.PI * 0.3), (2 * Math.PI) + (Math.PI * 0.3));
	m_kContext.stroke();
	m_kContext.closePath();	
	
	m_kContext.strokeStyle = this.m_cSecondaryColour;
	m_kContext.fillStyle = this.m_cSecondaryColour;
	m_kContext.lineWidth = 1;
	
	// Highlight Line
	m_kContext.beginPath();
	m_kContext.moveTo(23, 13);
	m_kContext.lineTo(20, 11);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	// Highlight Line
	m_kContext.beginPath();
	m_kContext.moveTo(7, 13);
	m_kContext.lineTo(10, 11);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	// Highlight Line
	m_kContext.beginPath();
	m_kContext.moveTo(23, 11);
	m_kContext.lineTo(19, 8);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	// Highlight Line
	m_kContext.beginPath();
	m_kContext.moveTo(7, 11);
	m_kContext.lineTo(11, 8);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}