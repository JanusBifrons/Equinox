function TargetObject(owner, object, isLocked)
{
	this.m_kOwner = owner;
	this.m_kTarget = object;
	
	this.m_iLockTime = calculateDistance(this.m_kOwner.m_liPos, this.m_kTarget.m_liPos);
	this.m_iLockProgress = 0;
	this.m_bIsLocked = isLocked;
	
	this.m_bIsPrimary = false;
	this.m_iPrimaryTimer = 0;
	
	this.m_kButton;
}

TargetObject.prototype.update = function()
{
	this.m_iLockProgress += m_fElapsedTime;
	
	this.m_iPrimaryTimer += m_fElapsedTime;
	
	if(this.m_iPrimaryTimer > 2000)
		this.m_iPrimaryTimer = 0;
	
	if(this.m_iLockProgress >= this.m_iLockTime)
		this.m_bIsLocked = true;
}

TargetObject.prototype.draw = function(x, y, size, padding)
{
	this.m_kButton = new UIButton(this, 0, x, y, size, size, false);
	
	// Draw background and border
	this.drawBackground(x, y, size);
	
	// Draw the target... size is halved because it is compared to radius
	this.drawTarget(x, y,  size / 2, 10);
	
	if(this.m_bIsPrimary)
		this.drawHighlight(x, y, size);
	
	// Adjust down
	y += size;
	y += padding * 0.5;
	
	if(!this.m_bIsLocked)
	{
		// Target not locked...
		
		var _percent = this.m_iLockProgress / this.m_iLockTime;

		m_kContext.strokeStyle = 'white';	
		m_kContext.fillStyle = 'black';
		m_kContext.lineWidth = 1;
		
		// Border and background
		m_kContext.fillRect(x, y, size, 10);
		
		m_kContext.beginPath();
		m_kContext.rect(x, y, size, 10);
		m_kContext.closePath();
		m_kContext.stroke();
		
		m_kContext.fillStyle = 'white';
		
		// Percent
		m_kContext.fillRect(x, y, size * _percent, 10);
		
		y += padding * 0.5;
	}
	else
	{				
		// Draw stats for structures and ships
		if(this.m_kTarget.m_eObjectType == "Structure" || this.m_kTarget.m_eObjectType == "Ship")
		{		
			y = this.drawStats(x, y, size, padding);
		}
		else
		{
			y += padding * 0.5;
		}
		
		// Draw the distance to this target
		this.drawDistance(x, y);
	}
		
	// Add padding to next target!
	y += padding * 0.5;
	
	return y;
}

// EVENTS

TargetObject.prototype.onMouseOver = function(mouse)
{
	// Do nothing
}

TargetObject.prototype.onMouseClick = function(mouse)
{
	if(m_kCollisionManager.circlePolygonCollisionDetection(mouse, this.m_kButton.m_cdCollision))
	{			
		this.m_kOwner.setPrimaryTarget(this);
	}
}

// HELPERS

TargetObject.prototype.drawHighlight = function(x, y, size)
{
	var _percent = this.m_iPrimaryTimer / 2000;
	
	// Save context!
	m_kContext.save();
	
	m_kContext.translate(x + (size / 2), y + (size / 2));
	
	m_kContext.rotate((Math.PI * 2) * _percent);
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'white';
	m_kContext.lineWidth = 5;
	
	var _length = size / 8;
	
	m_kContext.beginPath();
	m_kContext.moveTo(size / 2, 0);
	m_kContext.lineTo((size / 2) + _length, 0);
	m_kContext.closePath();	
	m_kContext.stroke();
	
	m_kContext.beginPath();
	m_kContext.moveTo(-(size / 2), 0);
	m_kContext.lineTo(-(size / 2) - _length, 0);
	m_kContext.closePath();	
	m_kContext.stroke();
	
	m_kContext.beginPath();
	m_kContext.moveTo(0, -(size / 2));
	m_kContext.lineTo(0, -(size / 2) - _length);
	m_kContext.closePath();	
	m_kContext.stroke();
	
	m_kContext.beginPath();
	m_kContext.moveTo(0, (size / 2));
	m_kContext.lineTo(0, (size / 2) + _length);
	m_kContext.closePath();	
	m_kContext.stroke();
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}

TargetObject.prototype.drawInfoBar = function(x, y, size, current, total, colour)
{
	var _percent = current / total;
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'black';
	m_kContext.lineWidth = 1;
	
	// Border and background
	m_kContext.fillRect(x, y, size, 10);
	
	m_kContext.beginPath();
	m_kContext.rect(x, y, size, 10);
	m_kContext.closePath();
	m_kContext.stroke();
	
	m_kContext.fillStyle = colour;
	
	// Percent
	m_kContext.fillRect(x, y, size * _percent, 10);
}

TargetObject.prototype.drawDistance = function(x, y)
{
	var _distance = calculateDistance(this.m_kOwner.m_liPos, this.m_kTarget.m_liPos);
	_distance = Math.floor(_distance);
	
	if(_distance > 4999)
	{
		_distance = Math.floor(_distance / 1000);
		_distance = _distance.toString() + " KM";
	}
	else
	{
		_distance = _distance.toString() + " M";
	}
	
	// Font size, type and colour
	m_kContext.font="15px Verdana";
	m_kContext.fillStyle = "white";
	
	m_kContext.fillText(_distance, x, y);
}

TargetObject.prototype.drawTarget = function(x, y, size, padding)
{
	var _scale = (size - padding) / this.m_kTarget.m_iRadius;
	
	// Save context!
	m_kContext.save();
	
	x += padding;
	y += padding;
	
	x += this.m_kTarget.m_iRadius * _scale;
	y += this.m_kTarget.m_iRadius * _scale;
	
	// Translate to center// Translate to center
	m_kContext.translate(x, y);
	m_kContext.translate(-(this.m_kTarget.m_liPos[0] * _scale), -(this.m_kTarget.m_liPos[1] * _scale));
	m_kContext.scale(_scale, _scale);
	
	this.m_kTarget.drawBody();
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}

TargetObject.prototype.drawBackground = function(x, y, size)
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

TargetObject.prototype.drawStats = function(x, y, size, padding)
{
	// Draw shield 
	this.drawInfoBar(x, y, size, this.m_kTarget.m_iShields, this.m_kTarget.m_iShieldCap, 'blue');
	y += padding * 0.7;
	
	// Draw armour
	this.drawInfoBar(x, y, size, this.m_kTarget.m_iArmour, this.m_kTarget.m_iArmourCap, 'grey');
	y += padding * 0.7;
	
	// Draw hull
	this.drawInfoBar(x, y, size, this.m_kTarget.m_iHull, this.m_kTarget.m_iHullCap, 'brown');
	y += padding * 1.4;
	
	return y;
}