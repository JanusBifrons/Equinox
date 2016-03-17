function ThrottleBar(owner)
{	
	this.m_kOwner = owner;
	this.m_kButton;
	
	this.m_iThrottle = 0;
}

ThrottleBar.prototype.update = function()
{
	this.m_iThrottle = this.m_kOwner.m_kShip.m_iThrottle;
}

ThrottleBar.prototype.draw = function(x, y, width, height)
{
	this.m_kButton = new UIButton(this, 0, x, y, width, height, false);
	
	this.drawBackground(x, y, width, height);
	
	//this.m_kButton.draw();
	
	return y;
}

// EVENTS

ThrottleBar.prototype.onMouseOver = function(mouse)
{
	// Do nothing
}

ThrottleBar.prototype.onMouseClick = function(mouse)
{	
	if(m_kCollisionManager.circlePolygonCollisionDetection(mouse, this.m_kButton.m_cdCollision))
	{
		var _difference = m_iMouseY - (this.m_kButton.m_liPos[1] - (this.m_kButton.m_iHeight / 2));
		
		this.m_kOwner.m_kShip.m_iThrottle = 1 - (_difference / this.m_kButton.m_iHeight);
	}
}

// HELPERS

ThrottleBar.prototype.drawBackground = function(x, y, width, height)
{	
	// Save context!
	m_kContext.save();
	
	// Translate to center// Translate to center
	m_kContext.translate(x, y);
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'black';
	m_kContext.lineWidth = 1;
	
	// Background
	m_kContext.fillRect(0, 0, width, height);
	m_kContext.beginPath();
	m_kContext.rect(0, 0, width, height);
	m_kContext.closePath();
	m_kContext.stroke();
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'purple';
	m_kContext.lineWidth = 1;
	
	// Fill
	m_kContext.fillRect(0, height, width,  -(height * this.m_iThrottle));
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}