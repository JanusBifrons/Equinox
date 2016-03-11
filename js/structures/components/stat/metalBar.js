MetalBar.prototype = new StructureComponent();
MetalBar.prototype.constructor = MetalBar;

function MetalBar(owner, offsetX, offsetY, scale)
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
	
	this.m_bCanScrap = false;
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(-10, -50));
	this.m_liPoints.push(new V(10, -50));
	this.m_liPoints.push(new V(10, 50));
	this.m_liPoints.push(new V(-10, 50));
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);
}

MetalBar.prototype.update = function()
{
	// Call base update
	StructureComponent.prototype.update.call(this);
	
	// Drawing variables
	var _hexHeight = Math.sqrt(3) * 100;
	var _hexWidth = 2 * 100;
	var _hexSide = (3 / 2) * 100;
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(-10, -50));
	this.m_liPoints.push(new V(10, -50));
	this.m_liPoints.push(new V(10, 50));
	this.m_liPoints.push(new V(-10, 50));
	
	// Scale the points
	StructureComponent.prototype.scale.call(this);
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);

	// Rotate and translate
	this.m_cdCollision.rotate(this.m_iRotation);
	this.m_cdCollision.translate(this.m_liPos[0], this.m_liPos[1]);
}

MetalBar.prototype.draw = function()
{	
	// Variables required for drawing
	var _metal = 0;
	
	if(this.m_kOwner.m_iMetalStored > 0)
	{
		_metal = (this.m_kOwner.m_iMetalStored / this.m_kOwner.m_iMetalStoredMax) * 100;
		
		_metal = Math.round(_metal);
	}

	// Call base update
	StructureComponent.prototype.draw.call(this);
	
	// Save context!
	m_kContext.save();
	
	// Negating the position so we can use the collision points to draw
	// this should be a relatively unique situation
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	// Rotate to players angle
	m_kContext.rotate(this.m_iRotation);
	
	// Scale
	m_kContext.scale(this.m_fScale, this.m_fScale);
	
	// Set drawing parameters
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'grey';
	m_kContext.lineWidth = 5;
	
	// Bar background
	m_kContext.beginPath();
	
	m_kContext.moveTo(-10, -50);	
	m_kContext.lineTo(10, -50);	
	m_kContext.lineTo(10, 50);	
	m_kContext.lineTo(-10, 50);	
	
	m_kContext.closePath();
	m_kContext.stroke();	
	m_kContext.fill();
	
	// Set drawing parameters
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'orange';
	
	// Bar contents
	m_kContext.beginPath();
	
	m_kContext.moveTo(-10, 50);	
	m_kContext.lineTo(10, 50);	
	m_kContext.lineTo(10, 50 - (100 * (_metal / 100)));	
	m_kContext.lineTo(-10, 50 - (100 * (_metal / 100)));
	
	m_kContext.closePath();
	m_kContext.stroke();	
	m_kContext.fill();
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}