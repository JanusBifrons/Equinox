function ShipComponent()
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
	
	// Scale
	this.m_fScale = 1.0;
	
	// Graphics
	this.m_liPoints = new Array();
	this.m_cPrimaryColour = concatenate(255, 255, 255, 255);
	this.m_cSecondaryColour = concatenate(255, 255, 255, 255);
	
	// Collision Detection	
	this.m_cdCollision = new SAT.Polygon(new SAT.Vector(0, 0), [new SAT.Vector(0, 0), new SAT.Vector(0, 0)]);
}

ShipComponent.prototype.update = function()
{
	this.updateColours();
	
	this.updateOffsets();
}

ShipComponent.prototype.draw = function()
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

// HELPERS

ShipComponent.prototype.scale = function()
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

ShipComponent.prototype.updateColours = function()
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

ShipComponent.prototype.updateOffsets = function()
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