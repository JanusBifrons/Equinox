PackedHull.prototype = new Component();
PackedHull.prototype.constructor = PackedHull;

function PackedHull(owner, offsetX, offsetY, scale, width, height, corner)
{
	// Call base initialize
	Component.prototype.initialize.call(this, owner, offsetX, offsetY, scale, false);
	
	this.m_iWidth = width;
	this.m_iHeight = height;
	this.m_iCorner = corner;
	
	this.m_kObject = owner.m_kObject;
}

PackedHull.prototype.update = function()
{
	// Call base update
	Component.prototype.update.call(this);
}

PackedHull.prototype.draw = function()
{		
	// Call base draw
	Component.prototype.draw.call(this);
	
	// Initialises the draw and rotates/scales/centers the view
	Component.prototype.startDraw.call(this);
		
	// Font size, type and colour
	m_kContext.font="12px Verdana";
	m_kContext.fillStyle = "white";
	
	var _title = this.m_kOwner.m_sName;
	
	var _x = -(m_kContext.measureText(_title).width / 2);
	var _y = 0;
	
	_x += this.m_iWidth / 2;
	_y += 32;
	
	m_kContext.fillText(_title, _x, _y);
	
	_y += 10;
	_x += this.m_iWidth / 4;
	
	m_kContext.fillRect(_x, _y, this.m_iWidth * 0.7, this.m_iWidth * 0.7);
	
	// Save context!
	m_kContext.save();
	
	var _size = (this.m_iWidth * 0.7) / 2;
	var _scale = _size / this.m_kOwner.m_kObject.m_iRadius;
	
	m_kContext.translate(_x + _size, _y + _size);
	m_kContext.scale(_scale, _scale);
	
	this.m_kOwner.m_kObject.drawBody();
	
	// Restore the context back to how it was before!
	m_kContext.restore();
	
	// Restores the context
	Component.prototype.endDraw.call(this);
}

PackedHull.prototype.createPoints = function()
{
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(0, this.m_iCorner));
	this.m_liPoints.push(new V(this.m_iCorner, 0));
	this.m_liPoints.push(new V(this.m_iWidth - this.m_iCorner, 0));
	this.m_liPoints.push(new V(this.m_iWidth, this.m_iCorner));
	this.m_liPoints.push(new V(this.m_iWidth, this.m_iHeight - this.m_iCorner));
	this.m_liPoints.push(new V(this.m_iWidth - this.m_iCorner, this.m_iHeight));
	this.m_liPoints.push(new V(this.m_iCorner, this.m_iHeight));
	this.m_liPoints.push(new V(0, this.m_iHeight - this.m_iCorner));	
}