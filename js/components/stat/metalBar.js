MetalBar.prototype = new Component();
MetalBar.prototype.constructor = MetalBar;

function MetalBar(owner, offsetX, offsetY, scale)
{
	// Call base initialize
	Component.prototype.initialize.call(this, owner, offsetX, offsetY, scale, false);
	
	this.m_bCanScrap = false;
}

MetalBar.prototype.update = function()
{
	// Call base update
	Component.prototype.update.call(this);
}

MetalBar.prototype.draw = function()
{		
	// Call base draw
	Component.prototype.draw.call(this);
	
	// Initialises the draw and rotates/scales/centers the view
	Component.prototype.startDraw.call(this);
	
	// Variables required for drawing
	var _metal = 0;
	
	if(this.m_kOwner.m_iMetalStored > 0)
	{
		_metal = (this.m_kOwner.m_iMetalStored / this.m_kOwner.m_iMetalStoredMax) * 100;
		
		_metal = Math.round(_metal);
	}
	
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
	
	// Restores the context
	Component.prototype.endDraw.call(this);
}

MetalBar.prototype.createPoints = function()
{
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(-10, -50));
	this.m_liPoints.push(new V(10, -50));
	this.m_liPoints.push(new V(10, 50));
	this.m_liPoints.push(new V(-10, 50));
}