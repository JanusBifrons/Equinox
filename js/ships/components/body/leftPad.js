LeftPad.prototype = new ShipComponent();
LeftPad.prototype.constructor = LeftPad;

function LeftPad(owner, offsetX, offsetY, scale)
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
	this.m_liPoints.push(new V(2, -5));
	this.m_liPoints.push(new V(10, -7));
	this.m_liPoints.push(new V(20, -12));
	this.m_liPoints.push(new V(25, -10));
	this.m_liPoints.push(new V(27, -5));
	this.m_liPoints.push(new V(20, 0));
	this.m_liPoints.push(new V(0, 0));
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);
}

LeftPad.prototype.update = function()
{
	// Call base update
	ShipComponent.prototype.update.call(this);
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(2, -5));
	this.m_liPoints.push(new V(10, -7));
	this.m_liPoints.push(new V(20, -12));
	this.m_liPoints.push(new V(25, -10));
	this.m_liPoints.push(new V(27, -5));
	this.m_liPoints.push(new V(20, 0));
	this.m_liPoints.push(new V(0, 0));
	
	// Scale the points
	ShipComponent.prototype.scale.call(this);
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);

	// Rotate and translate
	this.m_cdCollision.rotate(this.m_iRotation);
	this.m_cdCollision.translate(this.m_liPos[0], this.m_liPos[1]);
}

LeftPad.prototype.draw = function()
{
	// Call base draw
	ShipComponent.prototype.draw.call(this);
	
	// Save context!
	m_kContext.save();
	
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	// Rotate to players angle
	m_kContext.rotate(this.m_iRotation);
	
	// Scale
	m_kContext.scale(this.m_fScale, this.m_fScale);
	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = this.m_cSecondaryColour;
	
	// Highlight
	m_kContext.beginPath();
	m_kContext.moveTo(10, 0);
	m_kContext.lineTo(23, -11);
	m_kContext.lineTo(20, -12);
	m_kContext.lineTo(10, -7);
	m_kContext.lineTo(2, -5);
	m_kContext.lineTo(0, 0);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}