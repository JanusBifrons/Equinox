HexHull.prototype = new StructureComponent();
HexHull.prototype.constructor = HexHull;

function HexHull(owner, offsetX, offsetY, scale)
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
	
	// Drawing variables
	var _hexHeight = Math.sqrt(3) * 100;
	var _hexWidth = 2 * 100;
	var _hexSide = (3 / 2) * 100;
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(-(_hexWidth / 2), 0));
	this.m_liPoints.push(new V(-(_hexWidth - _hexSide), (_hexHeight / 2)));
	this.m_liPoints.push(new V((_hexWidth - _hexSide), (_hexHeight / 2)));
	this.m_liPoints.push(new V((_hexWidth / 2), 0));
	this.m_liPoints.push(new V((_hexWidth - _hexSide), -(_hexHeight / 2)));
	this.m_liPoints.push(new V(-(_hexWidth - _hexSide), -(_hexHeight / 2)));
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);
}

HexHull.prototype.update = function()
{
	// Call base update
	StructureComponent.prototype.update.call(this);
	
	// Drawing variables
	var _hexHeight = Math.sqrt(3) * 100;
	var _hexWidth = 2 * 100;
	var _hexSide = (3 / 2) * 100;
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(-(_hexWidth / 2), 0));
	this.m_liPoints.push(new V(-(_hexWidth - _hexSide), (_hexHeight / 2)));
	this.m_liPoints.push(new V((_hexWidth - _hexSide), (_hexHeight / 2)));
	this.m_liPoints.push(new V((_hexWidth / 2), 0));
	this.m_liPoints.push(new V((_hexWidth - _hexSide), -(_hexHeight / 2)));
	this.m_liPoints.push(new V(-(_hexWidth - _hexSide), -(_hexHeight / 2)));
	
	// Scale the points
	StructureComponent.prototype.scale.call(this);
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);

	// Rotate and translate
	this.m_cdCollision.rotate(this.m_iRotation);
	this.m_cdCollision.translate(this.m_liPos[0], this.m_liPos[1]);
}

HexHull.prototype.draw = function()
{
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