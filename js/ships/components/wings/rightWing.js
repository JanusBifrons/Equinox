RightWing.prototype = new ShipComponent();
RightWing.prototype.constructor = RightWing;

function RightWing(owner, offsetX, offsetY, scale)
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
	
	this.m_liPoints.push(new V(0, 0));
	this.m_liPoints.push(new V(30, 0));
	this.m_liPoints.push(new V(30, 5));
	this.m_liPoints.push(new V(20, 15));
	this.m_liPoints.push(new V(0, 30));
	this.m_liPoints.push(new V(-5, 32));
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);
}

RightWing.prototype.update = function()
{
	// Call base update
	ShipComponent.prototype.update.call(this);
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(0, 0));
	this.m_liPoints.push(new V(30, 0));
	this.m_liPoints.push(new V(30, 5));
	this.m_liPoints.push(new V(20, 15));
	this.m_liPoints.push(new V(0, 30));
	this.m_liPoints.push(new V(-5, 32));
	
	// Scale the points
	ShipComponent.prototype.scale.call(this);
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);

	// Rotate and translate
	this.m_cdCollision.rotate(this.m_iRotation);
	this.m_cdCollision.translate(this.m_liPos[0], this.m_liPos[1]);
}

RightWing.prototype.draw = function()
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
	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = this.m_cSecondaryColour;
	m_kContext.lineWidth = 1;
	
	// Highlight Line
	m_kContext.beginPath();
	m_kContext.moveTo(30, 3);
	m_kContext.lineTo(20, 13);
	m_kContext.lineTo(0, 28);
	m_kContext.lineTo(-5, 30);
	m_kContext.lineTo(-5, 32);
	m_kContext.lineTo(0, 30);
	m_kContext.lineTo(20, 15);
	m_kContext.lineTo(30, 5);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	m_kContext.fillStyle = this.m_cSecondaryColour;
	m_kContext.strokeStyle = 'black';
	
	// Larger Circle
	m_kContext.beginPath();
	m_kContext.arc(5, 6, 5, 0, 2 * Math.PI);
	m_kContext.fill();
	m_kContext.stroke();
	m_kContext.closePath();	
	
	// Smaller Circle
	m_kContext.beginPath();
	m_kContext.arc(5, 6, 3, 0, 2 * Math.PI);
	m_kContext.fill();
	m_kContext.stroke();
	m_kContext.closePath();	
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}

