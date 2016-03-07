function District(id)
{	
	// Sector variables
	this.m_iID = id;
	
	this.m_liSectors = new Array();
	this.m_liSectorHex = new Array();
	
	// Drawing variables
	this.m_iRadius = 50;	
	this.m_iHexHeight = Math.sqrt(3) * this.m_iRadius;
	this.m_iHexWidth = 2 * this.m_iRadius;
	this.m_iHexSide = (3 / 2) * this.m_iRadius;
	
	console.log("New District successfully initialised!");
}

District.prototype.update = function()
{
	// Update Sectors
	for(var i = 0; i < this.m_liSectors.length; i++)
	{
		this.m_liSectors[i].update();
	}
	
	if(this.m_bDrawDistrict && isMousePressed())
	{
		this.checkBox();
	}
	
	// M KEY
	if(isKeyDown(77))
	{
		this.m_bDrawDistrict = true;
	}
	else
	{
		this.m_bDrawDistrict = false;
	}
}

District.prototype.onHyper = function(ship)
{
	// Cycle through all sectors
	for(var i = 0; i < this.m_liSectors.length; i++)
	{
		// Find sector which matches target
		if(this.m_liSectors[i].m_iID == ship.m_iHyperTarget)
		{
			// Add ship to this sector
			this.m_liSectors[i].addShip(ship);

			// Change sector of the ship
			ship.onHyperEnd(this.m_liSectors[i]);
			
			// Reset switches
			this.m_liSectors[i].setTarget(false);
			this.m_liSectors[i].setSelected(false);
			
			// Recentre map
			this.buildMap(this.m_liSectors[i].m_liPos[0], this.m_liSectors[i].m_liPos[1]);
		}
	}
}

District.prototype.draw = function()
{
	// Only draw the sector the player is in!
	var _playerSector = m_kPlayer.m_kSector;
	
	_playerSector.draw();
	
	// Draw Sector Layout
	if(this.m_bDrawDistrict)
	{
		this.drawHex();
	}
}

District.prototype.addSector = function(sector)
{
	this.m_liSectors.push(sector);
	
	this.buildMap(0, 0);
}

District.prototype.drawHex = function()
{
	m_kContext.globalAlpha = 0.5;
	
	var _sectorIndex = 0;

	for(var i = 0; i < this.m_liSectorHex.length; i += 12)
	{
		var _positions = this.m_liSectorHex;
		var _sector = this.m_liSectors[_sectorIndex];
	
		m_kContext.beginPath();
	
		m_kContext.moveTo(_positions[i], _positions[i + 1]);
		m_kContext.lineTo(_positions[i + 2], _positions[i + 3]);
		m_kContext.lineTo(_positions[i + 4], _positions[i + 5]);
		m_kContext.lineTo(_positions[i + 6], _positions[i + 7]);
		m_kContext.lineTo(_positions[i + 8], _positions[i + 9]);
		m_kContext.lineTo(_positions[i + 10], _positions[i + 11]);
		
		m_kContext.closePath();
		
		m_kContext.fillStyle = 'white';
		m_kContext.font="10px Verdana";
		var width = m_kContext.measureText(_sector.m_iID).width / 2;
		m_kContext.fillText(_sector.m_iID, (_positions[i] + 25) - width, _positions[i + 1] + 25);	
		
		if(_sector.m_iTeam == 0)
		{
			m_kContext.fillStyle = "grey";	
		}
		
		if(_sector.m_iTeam == 1)
		{
			m_kContext.fillStyle = "blue";	
		}
		
		if(_sector.m_iTeam == 2)
		{
			m_kContext.fillStyle = "red";	
		}
		
		if(_sector.m_bIsSelected)
		{
			m_kContext.fillStyle = "orange";	
		}
		
		if(_sector.m_bIsTarget)
		{
			m_kContext.fillStyle = "Purple";	
		}
		
		m_kContext.strokeStyle = "white";
		
		m_kContext.fill();
		m_kContext.stroke();
		
		_sectorIndex += 1;
	}
	
	m_kContext.globalAlpha = 1;
}

District.prototype.buildMap = function(originRow, originCol)
{
	var _index = 0;
	var _x = 0;
	var _y = 0;
	
	this.m_liSectorHex.length = 0;

	for(var i = 0; i < (this.m_liSectors.length * 12); i += 12)
	{	
		var _row = this.m_liSectors[_index].m_liPos[0] - originRow;
		var _col = this.m_liSectors[_index].m_liPos[1] - originCol;
		
		_index += 1;
	
		_x = (m_kCanvas.width / 2) - (this.m_iHexWidth / 2);
		_y = (m_kCanvas.height / 2) - (this.m_iHexHeight / 2);
		
		_x += (_col * (this.m_iRadius * 1.5));
		_y += (_row * (this.m_iHexHeight));
		
		if(_col < 0)
		{
			_col *= -1;
		}
		
		if(isEven(originCol))
		{
			if(isOdd(_col))
			{			
				_y -= (_col * (this.m_iHexHeight / 2));
			}	
		}
		else
		{
			if(isOdd(_col))
			{
				_y += (_col * (this.m_iHexHeight / 2));
			}	
		}
			
		this.m_liSectorHex[i] 		= _x + this.m_iHexWidth - this.m_iHexSide;
		this.m_liSectorHex[i + 1] 	= _y;	 
		
		this.m_liSectorHex[i + 2] 	= _x + this.m_iHexSide;	 
		this.m_liSectorHex[i + 3] 	= _y;	 
		
		this.m_liSectorHex[i + 4] 	= _x + this.m_iHexWidth;	 
		this.m_liSectorHex[i + 5] 	= _y + (this.m_iHexHeight / 2);
		
		this.m_liSectorHex[i + 6] 	= _x + this.m_iHexSide;	 
		this.m_liSectorHex[i + 7] 	= _y + this.m_iHexHeight;
		
		this.m_liSectorHex[i + 8] 	= _x + this.m_iHexWidth - this.m_iHexSide;	 
		this.m_liSectorHex[i + 9] 	= _y + this.m_iHexHeight;
		
		this.m_liSectorHex[i + 10] 	= _x;	 
		this.m_liSectorHex[i + 11] 	= _y + (this.m_iHexHeight / 2);
	}
}

District.prototype.checkBox = function()
{							
	var _sectorIndex = 0;
					
	for(var i = 0; i < this.m_liSectorHex.length; i += 12)
	{
		var _positions = this.m_liSectorHex;
		var _target = this.m_liSectors[_sectorIndex];
		
		var _sectorPoly = new P(new V(0, 0), [new V(_positions[i], _positions[i + 1]), new V(_positions[i + 2], _positions[i + 3]), new V(_positions[i + 4], _positions[i + 5]), new V(_positions[i + 6], _positions[i + 7]), new V(_positions[i + 8], _positions[i + 9]), new V(_positions[i + 10], _positions[i + 11])]);	

		if(SAT.pointInPolygon(new V(m_iMouseX, m_iMouseY), _sectorPoly))
		{
			var _targetRowDist = _target.m_liPos[0] - m_kPlayer.m_kSector.m_liPos[0];
			var _targetColDist = _target.m_liPos[1] - m_kPlayer.m_kSector.m_liPos[1];
			
			if(_targetRowDist < 0)
			{
				_targetRowDist *= -1;
			}
			
			if(_targetColDist < 0)
			{
				_targetColDist *= -1;
			}
		
			if(_targetRowDist <= 1 && _targetColDist <= 1)
			{
				if(_targetRowDist == 0 && _targetColDist == 0)
				{
					// Can't set the sector you're currently in!
				}
				else
				{
					m_kPlayer.setHyperTarget(_target.m_iID);
			
					_target.setTarget(true);
				}
			}
			
			_target.setSelected(true);
		}
		else
		{
			_target.setTarget(false);
			_target.setSelected(false);
		}
		
		_sectorIndex += 1;
	}
}