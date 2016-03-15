function Component()
{
	this.m_kOwner;
	
	this.m_liOffset = new Array();
	this.m_liOffset[0] = 0;
	this.m_liOffset[1] = 0;
	this.m_iDistance = 0;
	
	// Location of weapon relative to the center of the ship
	this.m_liPos = new Array();
	this.m_liPos[0] = 0;
	this.m_liPos[1] = 0;
	this.m_iPositionOffset = 0;
	
	this.m_bDelete = false;
	
	this.m_iRotation = 0;
	this.m_iRotationOffset = 0;
	
	// Switch
	this.m_bCanScrap = true;
	this.m_bMirror = false;
	
	// Scale
	this.m_fScale = 1.0;
	
	// Center
	this.m_liCenter = new Array();
	this.m_liCenter[0] = 0;
	this.m_liCenter[1] = 0;
	
	// Graphics
	this.m_liPoints = new Array();
	this.m_cPrimaryColour = concatenate(128, 128, 128, 255);
	this.m_cSecondaryColour = concatenate(128, 128, 128, 255);
	
	// Collision Detection	
	this.m_cdCollision = new SAT.Polygon(new SAT.Vector(0, 0), [new SAT.Vector(0, 0), new SAT.Vector(0, 0)]);
}

Component.prototype.initialize = function(owner, offsetX, offsetY, scale, mirror)
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
	this.m_bMirror = mirror;
	
	// Center
	this.m_liCenter = new Array();
	this.m_liCenter[0] = 0;
	this.m_liCenter[1] = 0;
}

Component.prototype.update = function()
{
	this.updateColours();
	
	this.updateOffsets();
	
	this.createPoints();
	
	if(this.m_bMirror)
		this.mirrorPoints();
	
	// Scale the points
	this.scale();
	
	// Calculate and adjust to dyanmic center
	this.calculateCenter(this);
	this.adjustCenter(this);
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);

	// Rotate and translate
	this.m_cdCollision.rotate(this.m_iRotation);
	this.m_cdCollision.translate(this.m_liPos[0], this.m_liPos[1]);
}

Component.prototype.draw = function()
{
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = this.m_cPrimaryColour;
	m_kContext.lineWidth = 1;
	
	m_kContext.beginPath();
	
	// Draw Hull from collision points (this makes sure bugs are highly visible)
	for(var i = 0; i < this.m_cdCollision.points.length; i++)
		m_kContext.lineTo(this.m_cdCollision.points[i].x, this.m_cdCollision.points[i].y);	
	
	m_kContext.closePath();
	m_kContext.stroke();	
	m_kContext.fill();
}

// EVENTS

Component.prototype.onHit = function(damage)
{	
	this.m_kOwner.onHit(damage);
}

// HELPERS

Component.prototype.mirrorPoints = function()
{
	var _mirrorPoints = new Array();
	
	for(var i = 0; i < this.m_liPoints.length; i++)
	{
		_mirrorPoints.push(new V(this.m_liPoints[i].x, this.m_liPoints[i].y * -1));
	}
	
	// Clear points list
	this.m_liPoints.length = 0;
	
	// Reinput list from scratch
	for(var i = 0; i < _mirrorPoints.length; i++)
	{
		var _point = _mirrorPoints[i];
		
		this.m_liPoints.push(_point);
	}
}

Component.prototype.startDraw = function()
{
	// Save context!
	m_kContext.save();
	
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	// Rotate to players angle
	m_kContext.rotate(this.m_iRotation);
	
	// Translate to center
	m_kContext.translate(-this.m_liCenter[0], -this.m_liCenter[1]);
			
	if(this.m_bMirror)
	{
		m_kContext.scale(1, -1);
	}
	
	// Scale
	m_kContext.scale(this.m_fScale, this.m_fScale);
}

Component.prototype.endDraw = function()
{
	// Restore the context back to how it was before!
	m_kContext.restore();
}

// This function is abstract
Component.prototype.createPoints = function()
{
	var _adjustedPoints = new Array();
	
	for(var i = 0; i < this.m_liPoints.length; i++)
	{
		_adjustedPoints.push(new V(this.m_liPoints[i].x - this.m_liCenter[0], this.m_liPoints[i].y - this.m_liCenter[1]));
	}
	
	// Clear points list
	this.m_liPoints.length = 0;
	
	// Reinput list from scratch
	for(var i = 0; i < _adjustedPoints.length; i++)
	{
		this.m_liPoints.push(_adjustedPoints[i]);
	}
}

Component.prototype.calculateCenter = function()
{
	var _x = 0;
	var _y = 0;
	
	for(var i = 0; i < this.m_liPoints.length; i++)
	{
		_x += this.m_liPoints[i].x;
		_y += this.m_liPoints[i].y;
	}
	
	this.m_liCenter[0] = _x / this.m_liPoints.length;
	this.m_liCenter[1] = _y / this.m_liPoints.length;
}

Component.prototype.adjustCenter = function()
{
	var _adjustedPoints = new Array();
	
	for(var i = 0; i < this.m_liPoints.length; i++)
	{
		_adjustedPoints.push(new V(this.m_liPoints[i].x - this.m_liCenter[0], this.m_liPoints[i].y - this.m_liCenter[1]));
	}
	
	// Clear points list
	this.m_liPoints.length = 0;
	
	// Reinput list from scratch
	for(var i = 0; i < _adjustedPoints.length; i++)
	{
		this.m_liPoints.push(_adjustedPoints[i]);
	}
}

Component.prototype.scale = function()
{
	var _scaledPoints = new Array();
	
	for(var i = 0; i < this.m_liPoints.length; i++)
	{
		_scaledPoints.push(new V(this.m_liPoints[i].x * this.m_fScale, this.m_liPoints[i].y * this.m_fScale));
	}
	
	// Clear points list
	this.m_liPoints.length = 0;
	
	// Reinput list from scratch
	for(var i = 0; i < _scaledPoints.length; i++)
	{
		this.m_liPoints.push(_scaledPoints[i]);
	}
}

Component.prototype.updateColours = function()
{
	this.m_cPrimaryColour = concatenate(255, 255, 255, 255);
	this.m_cSecondaryColour = concatenate(255, 255, 255, 255);
	
	if(this.m_kOwner.m_iTeam == 1)
	{
		this.m_cPrimaryColour = concatenate(0, 0, 255, 255);
		this.m_cSecondaryColour = concatenate(255, 255, 0, 255);
	}
	else if(this.m_kOwner.m_iTeam == 2)
	{
		this.m_cPrimaryColour = concatenate(255, 0, 0, 255);
		this.m_cSecondaryColour = concatenate(255, 255, 255, 255);
	}
}

Component.prototype.updateOffsets = function()
{
	// Update the position relative to the main ship 
	this.m_iPositionOffset = Math.atan2(this.m_liOffset[1], this.m_liOffset[0]);	
	this.m_iPositionOffset += this.m_kOwner.m_iRotation;
	
	// Update components actual position relative to ship
	this.m_liPos[0] = (this.m_kOwner.m_liPos[0]) + (this.m_iDistance * Math.cos(this.m_iPositionOffset));
	this.m_liPos[1] = (this.m_kOwner.m_liPos[1]) + (this.m_iDistance * Math.sin(this.m_iPositionOffset));
	
	// Reset rotation
	this.m_iRotation = this.m_kOwner.m_iRotation + this.m_iRotationOffset;
}
