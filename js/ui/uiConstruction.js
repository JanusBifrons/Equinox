function UIConstruction(x, y, width, height, structure, name, scale)
{
	this.m_liPos = new Array();
	this.m_liPos[0] = x + (width / 2);
	this.m_liPos[1] = y + (height / 2);
	
	this.m_sName = name;
	
	this.m_fScale = scale;
	
	this.m_kStructure = structure;
	this.m_kStructure.onPlace();
	this.m_kStructure.onConstruct(999999);
	this.m_kStructure.onConstruct(1);
	
	this.m_kButtonCollision = new P(new V(0, 0), [new V(x, y), new V(x + width, y), new V(x + width, y + height), new V(x, y + height)]);
	
	this.m_cColour = concatenate(255, 255, 255, 255);
}

UIConstruction.prototype.draw = function()
{
	m_kContext.lineWidth = 5;	
		
	m_kContext.strokeStyle = "white";
	m_kContext.fillStyle = this.m_cColour;
	m_kContext.globalAlpha = 0.5;
	
	m_kContext.beginPath();
	
	for(var i = 0; i < this.m_kButtonCollision.points.length; i++)
	{
		_x = this.m_kButtonCollision.points[i].x;
		_y = this.m_kButtonCollision.points[i].y;
		
		m_kContext.lineTo(_x, _y);	
	}
	
	m_kContext.closePath();
	m_kContext.fill();	
	
		
	m_kContext.fillStyle = "black";
	m_kContext.font="14px Verdana";
	m_kContext.fillText(this.m_sName, this.m_liPos[0] - 35, this.m_liPos[1] + 35);
	
	m_kContext.save();
	
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	m_kContext.scale(this.m_fScale, this.m_fScale);
	
	m_kContext.globalAlpha = 1;
	this.m_kStructure.draw();
	
	// Restore context back to default from relative to the structure
	m_kContext.restore();
}

// EVENTS

UIConstruction.prototype.onClick = function()
{	
	this.m_cColour = concatenate(255, 0, 0, 255);
}