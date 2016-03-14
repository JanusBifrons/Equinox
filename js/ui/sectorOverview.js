function SectorOverview(owner, sector)
{
	this.m_kOwner = owner;
	this.m_kSector = sector;
	
	this.m_liObjects = new Array();
	
	this.m_liButtons = new Array();
	
	this.m_liPos = new Array();
	this.m_liPos[0] = 0;
	this.m_liPos[1] = 0;
	
	this.m_iWidth = 0;
	this.m_iHeight = 0;
	this.m_iPadding = 0;
	
	this.m_liSegments = new Array();
	this.m_liSegments[0] = 0.1;
	this.m_liSegments[1] = 0.35;
	this.m_liSegments[2] = 0.75;
	
	// 0 = ASC 1 = DSC
	this.m_iSortDistance = 0;
	this.m_bSortType = false;
}

SectorOverview.prototype.update = function()
{
	this.populateObjects();
	
	this.m_liButtons.length = 0;
	
	var _x = this.m_liPos[0];
	_x += this.m_iPadding;
	
	var _y = this.m_liPos[1];
	_y += 25;
	
	var _width = this.m_iWidth * 0.9;
	var _adjustedWidth = 0;
	
	// Calculate adjusted width
	_adjustedWidth = _width * this.m_liSegments[0];
	
	// First segment button
	this.m_liButtons.push(new UIButton(this, -1, _x, _y, _adjustedWidth, 20, false, '', 255, 255, 255)); 
	
	// Create segment buttons
	for(var i = 0; i < this.m_liSegments.length; i++)
	{
		_x = this.m_liPos[0];
		_x += this.m_iPadding;
		
		// Calculate adjusted width
		_adjustedWidth = _width;
		_adjustedWidth -= (_width * this.m_liSegments[i]);
		
		if(i < this.m_liSegments.length - 1)
		{			
			_adjustedWidth -= (_width - (_width * this.m_liSegments[i + 1]));
		}
		
		this.m_liButtons.push(new UIButton(this, (i + 2) * -1, _x + (_width * this.m_liSegments[i]), _y, _adjustedWidth, 20, false, '', 255, 255, 255)); 
	}
	
	_x = this.m_liPos[0];
	_x += this.m_iPadding;
	
	// Create object buttons	
	for(var i = 0; i < this.m_liObjects.length; i++)
	{
		_y += 25;
		
		this.m_liButtons.push(new UIButton(this, i, _x, _y, _width, 20, false, '', 255, 255, 255)); 
	}
}

SectorOverview.prototype.draw = function(x, y, height, width, padding)
{	
	m_kContext.globalAlpha = 0.75;

	// This is required to create the buttons
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	this.m_iWidth = width;
	this.m_iHeight = 0;
	this.m_iPadding = padding;
	
	// Calculate dynamic height
	var _height = padding + (25 * (this.m_liObjects.length + 1)) + padding;
	
	// Draw border and background
	this.drawBackground(x, y, _height, width, padding);
		
	for(var i = 0; i < this.m_liButtons.length; i++)
		this.m_liButtons[i].draw();
	
	// Add padding to top and side
	x += padding;
	width *= 0.9;
	
	y += 25;
		
	this.drawSegmentTitles(x, y, width, 20, this.m_liSegments);
	
	// Draw all objects
	for(var i = 0; i < this.m_liObjects.length; i++)
	{
		y += 25;
		
		this.m_liObjects[i].draw(x, y, width, 20, this.m_liSegments);
	}
	
	m_kContext.globalAlpha = 1;
}

// EVENTS

SectorOverview.prototype.onMouseOver = function(mouse)
{
	for(var i = 0; i < this.m_liButtons.length; i++)
	{
		if(m_kCollisionManager.circlePolygonCollisionDetection(mouse, this.m_liButtons[i].m_cdCollision))
		{			
			this.m_liButtons[i].onMouseOver();
		}
	}
}

SectorOverview.prototype.onMouseClick = function(mouse)
{
	for(var i = 0; i < this.m_liButtons.length; i++)
	{
		if(m_kCollisionManager.circlePolygonCollisionDetection(mouse, this.m_liButtons[i].m_cdCollision))
		{			
			this.m_liButtons[i].onClick();
			
			return true;
		}
	}
}

// Do the stuff the buttons are supposed to do
SectorOverview.prototype.onClick = function(id)
{		
	if(id >= 0)
	{
		this.m_kOwner.selectObject(this.m_liObjects[id].m_kObject);
	}
	else
	{
		switch(id)
		{
			// Sort by hostile status
			case 0:
				break;
			
			// Sort by distance
			case -2:
				if(this.m_iSortDistance == 0)
					this.m_iSortDistance = 1;
				else
					this.m_iSortDistance = 0;
				
				break;
			
			// Sort by Type
			case -3:
				if(this.m_bSortType == true)
					this.m_bSortType = false;
				else
					this.m_bSortType = true;
				break;
		}
	}
}

// HELPERS

SectorOverview.prototype.sortDistance = function()
{	
	if(this.m_iSortDistance == 0)
	{		
		this.m_liObjects.sort(function(obj1, obj2) 
		{
			if(obj1.m_iDistanceActual < obj2.m_iDistanceActual)
			{
				return -1;
			}
			else
			{
				return 1;
			}
			
			return 0;
		});
	}
	else
	{		
		this.m_liObjects.sort(function(obj1, obj2) 
		{
			if(obj1.m_iDistanceActual > obj2.m_iDistanceActual)
			{
				return -1;
			}
			else
			{
				return 1;
			}
			
			return 0;
		});
	}		
}

SectorOverview.prototype.sortType = function()
{
	this.m_liObjects.sort(function(obj1, obj2) 
	{
		if(obj1.m_kObject.m_eObjectType < obj2.m_kObject.m_eObjectType)
		{
			return -1;
		}
		else
		{
			return 1;
		}
		
		return 0;
	});
}

SectorOverview.prototype.populateObjects = function()
{
		// Reset list
	this.m_liObjects.length = 0;
	
	// Repopulate	
	for(var i = 0; i < this.m_kSector.m_liShips.length; i++)
	{
		var _item = new SectorOverviewObject(this.m_kOwner, this.m_kSector.m_liShips[i], 0);
		
		this.m_liObjects.push(_item);
	}
	
	// Repopulate	
	for(var i = 0; i < this.m_kSector.m_kStructureManager.m_liStructures.length; i++)
	{
		var _item = new SectorOverviewObject(this.m_kOwner, this.m_kSector.m_kStructureManager.m_liStructures[i], 1);
		
		this.m_liObjects.push(_item);
	}
	
	// Repopulate	
	for(var i = 0; i < this.m_kSector.m_liObjects.length; i++)
	{
		var _item = new SectorOverviewObject(this.m_kOwner,this.m_kSector.m_liObjects[i], 2);
		
		this.m_liObjects.push(_item);
	}
	
	// Repopulate	
	for(var i = 0; i < this.m_kSector.m_kAsteroidManager.m_liAsteroids.length; i++)
	{		
		var _item = new SectorOverviewObject(this.m_kOwner, this.m_kSector.m_kAsteroidManager.m_liAsteroids[i], 3);
		
		this.m_liObjects.push(_item);
	}
	
	// Sort objects
	this.sortDistance();
	
	if(this.m_bSortType)
		this.sortType();
}

SectorOverview.prototype.drawSegmentTitles = function(x, y, width, height, segments)
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
		
			// Font size, type and colour
		m_kContext.font="15px Verdana";
		m_kContext.fillStyle = "white";
	}
	
	m_kContext.closePath();	
	m_kContext.stroke();
	
	// Font size, type and colour
	m_kContext.font="bold 15px Verdana";
	m_kContext.fillStyle = "black";
	
	var _x = 0;
	
	_x = (width * segments[0]);
	_x += (width * 0.005);
	
	m_kContext.fillText("Distance", _x, 15);
	
	_x = (width * segments[1]);
	_x += (width * 0.005);
	
	m_kContext.fillText("Type", _x, 15);
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}

SectorOverview.prototype.createButton = function(x, y, height, width, padding)
{
	this.m_liButtons.push(new UIButton(this, 0, 100, 100, 100, 100, false)); 
}

SectorOverview.prototype.drawBackground = function(x, y, height, width)
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
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}