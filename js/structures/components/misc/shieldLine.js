ShieldLine.prototype = new StructureComponent();
ShieldLine.prototype.constructor = ShieldLine;

function ShieldLine(owner, offsetX, offsetY, scale, targetX, targetY)
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
	
	// Target Vector
	this.m_liTarget = new Array();
	this.m_liTarget[0] = targetX - this.m_kOwner.m_liPos[0];
	this.m_liTarget[1] = targetY - this.m_kOwner.m_liPos[1];
	
	// Direction vector
	this.m_liDirection = new Array();
	this.m_liDirection[0] = targetX - this.m_kOwner.m_liPos[0];
	this.m_liDirection[1] = targetY - this.m_kOwner.m_liPos[1];
	
	// Convert to unit vector (normalized)
	this.m_liDirection = unitVector(this.m_liDirection);
	
	// Resize to desired length
	this.m_liDirection[0] *= 5;
	this.m_liDirection[1] *= 5;
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(this.m_liDirection[1], -this.m_liDirection[0]));
	this.m_liPoints.push(new V(-this.m_liDirection[1], this.m_liDirection[0]));
	this.m_liPoints.push(new V(this.m_liTarget[0] + -(this.m_liDirection[1]), this.m_liTarget[1] + this.m_liDirection[0]));
	this.m_liPoints.push(new V(this.m_liTarget[0] + this.m_liDirection[1], this.m_liTarget[1] + -(this.m_liDirection[0])));
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);
}

ShieldLine.prototype.update = function()
{
	// Call base update
	StructureComponent.prototype.update.call(this);
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(this.m_liDirection[1], -this.m_liDirection[0]));
	this.m_liPoints.push(new V(-this.m_liDirection[1], this.m_liDirection[0]));
	this.m_liPoints.push(new V(this.m_liTarget[0] + -(this.m_liDirection[1]), this.m_liTarget[1] + this.m_liDirection[0]));
	this.m_liPoints.push(new V(this.m_liTarget[0] + this.m_liDirection[1], this.m_liTarget[1] + -(this.m_liDirection[0])));
	
	// Scale the points
	StructureComponent.prototype.scale.call(this);
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);

	// Rotate and translate
	this.m_cdCollision.rotate(this.m_iRotation);
	this.m_cdCollision.translate(this.m_liPos[0], this.m_liPos[1]);
}

ShieldLine.prototype.draw = function()
{
	// Set shield to blue!
	this.m_cPrimaryColour = concatenate(0, 0, 255, 255);
	
	// Call base update
	StructureComponent.prototype.draw.call(this);
	
	// Save context!
	m_kContext.save();
	
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	// Rotate to players angle
	m_kContext.rotate(this.m_iRotation);
	
	// Scale
	m_kContext.scale(this.m_fScale, this.m_fScale);
	
	// NOTHING!
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}

// EVENTS

ShieldLine.prototype.onHit = function(damage)
{
	this.m_kOwner.onHitDrain(damage);
}