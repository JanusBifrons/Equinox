function SectorOverviewObject(owner, object)
{	
	this.m_kOwner = owner;

	this.m_kObject = object;
	this.m_iDistanceActual = calculateDistance(this.m_kOwner.m_kShip.m_liPos, object.m_liPos)
	
	var _distance = Math.floor(this.m_iDistanceActual);
	
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

SectorOverviewObject.prototype.draw = function(x, y, width, height, segments)
{	
	this.drawSegments(x, y, width, height, segments);
	
	this.drawInfo(x, y, width, height, segments);
}

// HELPERS

SectorOverviewObject.prototype.drawInfo = function(x, y, width, height, segments)
{
	// Font size, type and colour
	m_kContext.font="15px Verdana";
	m_kContext.fillStyle = "black";
	
	y += 15;
	
	var _x = 0;
	
	_x = x + (width * segments[0]);
	_x += (width * 0.005);
	
	m_kContext.fillText(this.m_iDistance, _x, y);
	
	_x = x + (width * segments[1]);
	_x += (width * 0.005);
	
	m_kContext.fillText(this.m_kObject.m_eObjectType, _x, y);
}

SectorOverviewObject.prototype.drawSegments = function(x, y, width, height, segments)
{	
	// Save context!
	m_kContext.save();
	
	// Translate to center// Translate to center
	m_kContext.translate(x, y);
	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'white';
	m_kContext.lineWidth = 1;
	
	m_kContext.beginPath();
	
	for(var i = 0; i < segments.length; i++)
	{
		
		m_kContext.moveTo(width * segments[i], 0);
		m_kContext.lineTo(width * segments[i], height);
	}
	
	m_kContext.closePath();	
	m_kContext.stroke();
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}