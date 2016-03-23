StatusBar.prototype = new Component();
StatusBar.prototype.constructor = StatusBar;

function StatusBar(owner, offsetX, offsetY, scale)
{
	// Call base initialize
	Component.prototype.initialize.call(this, owner, offsetX, offsetY, scale, false);
	
	this.m_bCanScrap = false;
}

StatusBar.prototype.update = function()
{
	// Call base update
	Component.prototype.update.call(this);
}

StatusBar.prototype.draw = function()
{		
	// Call base draw
	Component.prototype.draw.call(this);
	
	// Initialises the draw and rotates/scales/centers the view
	Component.prototype.startDraw.call(this);
	
	// Font size, type and colour
	m_kContext.font="bold 32px Verdana";
	m_kContext.fillStyle = "black";
	m_kContext.textBaseline = "middle";
	
	var _x = -250;
	var _y = 0;
	
	// Draw descriptor
	m_kContext.fillText("STATUS", _x, _y);
	
	// Reset text size
	m_kContext.font="32px Verdana";
	
	var _textSize = 32;
	var _width = 0;
	var _statusText = this.setStatusText();
	var _width = m_kContext.measureText(_statusText).width;
	
	if(_width > 195)
	{
		var _textScale = 1 - (_width / 195);
		_textScale = 1 + _textScale;
		_textSize = _textSize * _textScale;
	}
	
	m_kContext.font = _textSize + "px Verdana";
			
	// Recalculate width
	_width = m_kContext.measureText(_statusText).width;
	
	_x = -(_width / 2);
	
	// Draw status information
	m_kContext.fillText(_statusText, _x, _y);
	
	// Restores the context
	Component.prototype.endDraw.call(this);
}

StatusBar.prototype.createPoints = function()
{
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(-100, -20));
	this.m_liPoints.push(new V(-100, 20));
	this.m_liPoints.push(new V(100, 20));
	this.m_liPoints.push(new V(100, -20));
}

// HELPERS

StatusBar.prototype.setStatusText = function()
{	
	var _owner = this.m_kOwner;
	
	if(_owner.m_bNeedsBlueprint)
	{
		if(_owner.m_kCargoHold.m_liStored.length > 0)
		{
			if(_owner.m_kCargoHold.m_liStored[0].m_kObject.m_eObjectType != "Blueprint")
			{
				m_kContext.fillStyle = "blue";
				return "NO BLUEPRINT";
			}
		}
		else
		{
			m_kContext.fillStyle = "blue";
			return "NO BLUEPRINT";
		}
	}

	if(_owner.m_bNeedsPower)
	{
		if(_owner.m_iPowerStored < _owner.m_iPowerStoreMax)
		{
			m_kContext.fillStyle = "red";
			
			return "LOW POWER";
		}
	}
	
	if(_owner.m_bNeedsMetal)
	{
		if(_owner.m_iMetalStored < _owner.m_iMetalStoredMax)
		{
			m_kContext.fillStyle = "red";
			
			return "LOW METAL";
		}
	}
	
	m_kContext.fillStyle = "green";
	return "SAUL GOODMAN";
}