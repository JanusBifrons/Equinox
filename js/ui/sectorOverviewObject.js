function SectorOverviewObject(owner, object)
{	
	this.m_kOwner = owner;

	this.m_kObject = object;
	
	var _distance = calculateDistance(this.m_kOwner.m_kShip.m_liPos, object.m_liPos);
	
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
	
	this.m_iDistance = _distance;
}

SectorOverviewObject.prototype.draw = function(x, y, width, height)
{	
	this.drawBackground(x, y, width, height);
	
	this.drawInfo(x, y, width, height);
}

// HELPERS

SectorOverviewObject.prototype.drawInfo = function(x, y, width, height)
{
	// Font size, type and colour
	m_kContext.font="15px Verdana";
	m_kContext.fillStyle = "black";
	
	y += 15;
	
	m_kContext.fillText(this.m_iDistance, x + (width * 0.105), y);
	
	m_kContext.fillText(this.m_kObject.m_eObjectType, x + (width * 0.31), y);
}

SectorOverviewObject.prototype.drawBackground = function(x, y, width, height)
{	
	// Save context!
	m_kContext.save();
	
	// Translate to center// Translate to center
	m_kContext.translate(x, y);
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'white';
	m_kContext.lineWidth = 1;
	
	// Background
	m_kContext.fillRect(0, 0, width, height);
	m_kContext.beginPath();
	m_kContext.rect(0, 0, width, height);
	m_kContext.closePath();
	m_kContext.stroke();
	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'white';
	m_kContext.lineWidth = 1;
	
	var _step1 = width * 0.1;
	var _step2 = width * 0.3;
	var _step3 = width * 0.75;
	
	// Seperator
	m_kContext.beginPath();
	m_kContext.moveTo(_step1, 0);
	m_kContext.lineTo(_step1, height);
	m_kContext.moveTo(_step2, 0);
	m_kContext.lineTo(_step2, height);
	m_kContext.moveTo(_step3, 0);
	m_kContext.lineTo(_step3, height);
	m_kContext.closePath();	
	m_kContext.stroke();
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}