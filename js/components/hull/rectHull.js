RectHull.prototype = new Component();
RectHull.prototype.constructor = RectHull;

function RectHull(owner, offsetX, offsetY, scale, width, height, corner)
{
	// Call base initialize
	Component.prototype.initialize.call(this, owner, offsetX, offsetY, scale, false);
	

	this.m_iWidth = width;
	this.m_iHeight = height;
	this.m_iCorner = corner;
}

RectHull.prototype.update = function()
{
	// Call base update
	Component.prototype.update.call(this);
}

RectHull.prototype.draw = function()
{		
	// Call base draw
	Component.prototype.draw.call(this);
	
	// Initialises the draw and rotates/scales/centers the view
	Component.prototype.startDraw.call(this);
	
	
	// Restores the context
	Component.prototype.endDraw.call(this);
}

RectHull.prototype.createPoints = function()
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