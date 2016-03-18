function CargoObject(object)
{
	this.m_kObject = object;
	
	this.m_liPos = new Array();
	this.m_liPos[0] = 0;
	this.m_liPos[1] = 0;
	this.m_iSize = 0;
	
	this.m_kButton;
}

CargoObject.prototype.update = function()
{
	this.m_kButton = new UIButton(this, 0, this.m_liPos[0], this.m_liPos[1], this.m_iSize, this.m_iSize, false);
}

CargoObject.prototype.draw = function(x, y, size, padding)
{
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	this.m_iSize = size;
	
	this.drawBackground(x, y, size);
	
	this.drawObject(x, y, size / 2, 10);
}

// EVENTS

CargoObject.prototype.onMouseOver = function(mouse)
{
	// Do nothing
}

CargoObject.prototype.onMouseClick = function(mouse)
{	
	if(m_kCollisionManager.circlePolygonCollisionDetection(mouse, this.m_kButton.m_cdCollision))
	{		
		m_kPlayer.selectObject(this.m_kObject);
		
		return true;
	}
	
	return false;
}

// HELPERS

CargoObject.prototype.drawObject = function(x, y, size, padding)
{
	var _scale = (size - padding) / this.m_kObject.m_iRadius;
	
	// Save context!
	m_kContext.save();
	
	x += padding;
	y += padding;
	
	x += this.m_kObject.m_iRadius * _scale;
	y += this.m_kObject.m_iRadius * _scale;
	
	// Translate to center// Translate to center
	m_kContext.translate(x, y);
	
	m_kContext.font="10px Verdana";
	m_kContext.fillStyle = "white";
	m_kContext.fillText(this.m_kObject.m_eObjectType, (size / 2) - (m_kContext.measureText(this.m_kObject.m_eObjectType).width), size * 0.9);
	
	m_kContext.translate(-(this.m_kObject.m_liPos[0] * _scale), -(this.m_kObject.m_liPos[1] * _scale));
	m_kContext.scale(_scale, _scale);
	
	this.m_kObject.drawBody();
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}

CargoObject.prototype.drawBackground = function(x, y, size)
{
	// Save context!
	m_kContext.save();
	
	// Translate to center// Translate to center
	m_kContext.translate(x, y);
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'black';
	m_kContext.lineWidth = 1;
	
	// Background
	m_kContext.fillRect(0, 0, size, size);
	m_kContext.beginPath();
	m_kContext.rect(0, 0, size, size);
	m_kContext.closePath();
	m_kContext.stroke();
	
	// Restore the context back to how it was before!
	m_kContext.restore();	
}