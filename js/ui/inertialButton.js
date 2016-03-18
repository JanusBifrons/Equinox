function InertialButton(owner)
{	
	this.m_kOwner = owner;
	this.m_kButton;
	
	this.m_bInertialDampeners = false;
}

InertialButton.prototype.update = function()
{
	this.m_bInertialDampeners = this.m_kOwner.m_kShip.m_bInertialDampeners;
}

InertialButton.prototype.draw = function(x, y, width, height)
{
	this.m_kButton = new UIButton(this, 0, x, y, width, height, false);
	
	this.drawBackground(x, y, width, height);
	
	return y;
}

// EVENTS

InertialButton.prototype.onMouseOver = function(mouse)
{
	// Do nothing
}

InertialButton.prototype.onMouseClick = function(mouse)
{	
	if(m_kCollisionManager.circlePolygonCollisionDetection(mouse, this.m_kButton.m_cdCollision))
	{
		this.m_kOwner.m_kShip.toggleDampeners();
	}
}

// HELPERS

InertialButton.prototype.drawBackground = function(x, y, width, height)
{	
	// Save context!
	m_kContext.save();
	
	// Translate to center// Translate to center
	m_kContext.translate(x, y);
	
	m_kContext.strokeStyle = 'white';	
	
	if(this.m_bInertialDampeners == false)
	{
		m_kContext.fillStyle = 'red';
	}
	else
	{
		m_kContext.fillStyle = 'green';
	}

	m_kContext.lineWidth = 1;
	
	// Background
	m_kContext.fillRect(0, 0, width, height);
	m_kContext.beginPath();
	m_kContext.rect(0, 0, width, height);
	m_kContext.closePath();
	m_kContext.stroke();
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}