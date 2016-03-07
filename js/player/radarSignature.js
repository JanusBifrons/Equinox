function RadarSignature(ship, type, radarObject)
{
	this.m_kShip = ship;
	this.m_iType = type;
	this.m_kObject = radarObject;
	
	this.m_liPos = new Array();
	this.m_liPos[0] = radarObject.m_liPos[0] * 0.01;
	this.m_liPos[1] = radarObject.m_liPos[1] * 0.01;
	
	// Set remotely by Radar
	this.m_iWidth = 0;
	this.m_iHeight = 0;
	this.m_fScale = 0;
	
	this.m_bDelete = false;
}

RadarSignature.prototype.update = function()
{	
	this.m_liPos[0] = (this.m_kObject.m_liPos[0] - this.m_kShip.m_liPos[0]) * this.m_fScale;
	this.m_liPos[1] = (this.m_kObject.m_liPos[1] - this.m_kShip.m_liPos[1]) * this.m_fScale;
	
	if(this.m_iType != 2)
	{
		if(!this.m_kObject.m_bIsAlive)
		{
			this.m_bDelete = true;
		}
	}
}

RadarSignature.prototype.draw = function()
{
	switch(this.m_iType)
	{
		// YOU!
		case 0:
			m_kContext.lineWidth = 1;	
			m_kContext.strokeStyle = "green";
			m_kContext.fillStyle = "green";
			
			if(this.boundsCheck(this.m_liPos[0], this.m_liPos[1]))
			{
				m_kContext.beginPath();
				m_kContext.arc(this.m_liPos[0], this.m_liPos[1], 1, 0, Math.PI * 2);
				m_kContext.stroke();
				m_kContext.closePath();
			}
			break;
			
		// Building
		case 1:
			m_kContext.lineWidth = 1;	
			m_kContext.strokeStyle = "orange";
			m_kContext.fillStyle = "orange";
			
			if(this.boundsCheck(this.m_liPos[0], this.m_liPos[1]))
			{
				m_kContext.beginPath();
				m_kContext.arc(this.m_liPos[0], this.m_liPos[1], 1 * (this.m_kObject.m_iRadius * this.m_fScale), 0, Math.PI * 2);
				m_kContext.stroke();
				m_kContext.fill();
				m_kContext.closePath();
			}
			break;
			
		// Asteroid
		case 2:
			m_kContext.lineWidth = 5;	
		
			m_kContext.strokeStyle = "white";
			m_kContext.fillStyle = "white";
			
			m_kContext.beginPath();
			
			var _x = 0;
			var _y = 0;
			var _points = this.m_kObject.m_cdCollision.points;
			
			var _newPoint = new Array();
			_newPoint[0] = 0;
			_newPoint[1] = 0;
	
			// Draw Asteroid
			for(var i = 0; i < _points.length; i++)
			{
				_x = (_points[i].x - this.m_kShip.m_liPos[0]) * this.m_fScale;
				_y = (_points[i].y - this.m_kShip.m_liPos[1]) * this.m_fScale;
				
				if(this.boundsCheck(_x, _y))
				{
					m_kContext.lineTo(_x, _y);	
				}
				else
				{	
					continue;
			
					// This is broken...
					
					// There are lots of unforseen special cases which need to be handled
					
					// At the moment it only works for the NEXT line and only off the X right hand side...
			
					if(!this.boundsCheckX(_x))
					{
						var _edge = 0;
						
						if(_x < 0)
						{
							_edge = _x + (this.m_iWidth / 2);
						}
						
						if(_x > 0)
						{
							_edge = _x - (this.m_iWidth / 2);
						}
						
						var _differenceX = 0;
						var _differenceY = 0;
						var _distance = 0;
						var _dX = 0;
						var _dY = 0;
						
						// Calculate to NEXT point
						if(i == _points.length - 1)
						{
							_dX = (_points[0].x - this.m_kShip.m_liPos[0]) * this.m_fScale;			
							_dY = (_points[0].y - this.m_kShip.m_liPos[1]) * this.m_fScale;						
						
							_differenceX = _x - _dX;
							_differenceY = _y - _dY;
						}
						else
						{
							_dX = (_points[i + 1].x - this.m_kShip.m_liPos[0]) * this.m_fScale;			
							_dY = (_points[i + 1].y - this.m_kShip.m_liPos[1]) * this.m_fScale;						
							
							_differenceX = _x - _dX;
							_differenceY = _y - _dY;
						}
						
						var _scalerX = _edge / _differenceX;
						
						_newPoint[0] = _x - _edge;
						_newPoint[1] = _y - (_differenceY * _scalerX);
						
						m_kContext.lineTo(_newPoint[0], _newPoint[1]);		
										
					}
				}
			}
			
			m_kContext.closePath();
			m_kContext.fill();	
			
			break;		

		case 3:
			m_kContext.lineWidth = 1;	
			m_kContext.strokeStyle = "red";
			m_kContext.fillStyle = "red";
			
			if(this.boundsCheck(this.m_liPos[0], this.m_liPos[1]))
			{
				m_kContext.beginPath();
				m_kContext.arc(this.m_liPos[0], this.m_liPos[1], 1, 0, Math.PI * 2);
				m_kContext.stroke();
				m_kContext.closePath();
			}
			break;
	}
}

RadarSignature.prototype.boundsCheck = function(x, y)
{
	if(x > this.m_iWidth / 2)
	{
		return false;
	}
	
	if(x < -this.m_iWidth / 2)
	{
		return false;
	}
	
	if(y > this.m_iHeight / 2)
	{
		return false;
	}
	
	if(y < -this.m_iHeight / 2)
	{
		return false;
	}
	
	return true;
}

RadarSignature.prototype.boundsCheckX = function(x)
{
	if(x > this.m_iWidth / 2)
	{
		return false;
	}
	
	if(x < -this.m_iWidth / 2)
	{
		return false;
	}
	
	return true;
}

RadarSignature.prototype.boundsCheckY = function(y)
{
	if(y > this.m_iHeight / 2)
	{
		return false;
	}
	
	if(y < -this.m_iHeight / 2)
	{
		return false;
	}
	
	return true;
}