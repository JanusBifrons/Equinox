RectHull.prototype = new StructureComponent();
RectHull.prototype.constructor = RectHull;

function RectHull(owner, offsetX, offsetY, rotationOffset, scale)
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
	
	var corner = 15;
	var x = 0;
	var y = 0;
	var width = 180;
	var height = 400;
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(x, y + corner));
	this.m_liPoints.push(new V(x + corner, y));
	this.m_liPoints.push(new V(x + (width - corner), y));
	this.m_liPoints.push(new V(x + width, y + corner));
	this.m_liPoints.push(new V(x + width, y + (height - corner)));
	this.m_liPoints.push(new V(x + (width - corner), y + height));
	this.m_liPoints.push(new V(x + corner, y + height));
	this.m_liPoints.push(new V(x, y + (height - corner)));
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);
}

RectHull.prototype.update = function()
{
	// Call base update
	StructureComponent.prototype.update.call(this);
	
	var corner = 15;
	var x = 0;
	var y = 0;
	var width = 180;
	var height = 400;
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(x, y + corner));
	this.m_liPoints.push(new V(x + corner, y));
	this.m_liPoints.push(new V(x + (width - corner), y));
	this.m_liPoints.push(new V(x + width, y + corner));
	this.m_liPoints.push(new V(x + width, y + (height - corner)));
	this.m_liPoints.push(new V(x + (width - corner), y + height));
	this.m_liPoints.push(new V(x + corner, y + height));
	this.m_liPoints.push(new V(x, y + (height - corner)));
	
	// Scale the points
	StructureComponent.prototype.scale.call(this);
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);

	// Rotate and translate
	this.m_cdCollision.rotate(this.m_iRotation);
	this.m_cdCollision.translate(this.m_liPos[0], this.m_liPos[1]);
}

RectHull.prototype.draw = function()
{
	// Overwrite primary colour!
	this.m_cPrimaryColour = 'grey';
	
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