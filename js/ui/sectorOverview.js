function SectorOverview(owner, sector)
{
	this.m_kOwner = owner;
	this.m_kSector = sector;
	
	this.m_liObjects = new Array();
	
	this.m_liButtons = new Array();
}

SectorOverview.prototype.update = function()
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
}

SectorOverview.prototype.draw = function(x, y, height, width, padding)
{	
	var _height = padding + (25 * this.m_liObjects.length) + padding;
	
	this.drawBackground(x, y, _height, width, padding);
	
	x += padding;
	width *= 0.9;
	
	for(var i = 0; i < this.m_liObjects.length; i++)
	{
		y += 25;
		
		this.m_liObjects[i].draw(x, y, width, 20);
		this.m_liButtons.push(new UIButton(this, i, x, y, width, 25, false)); 
	}
	
	//for(var i = 0; i < this.m_liButtons.length; i++)
		//this.m_liButtons[i].draw();
}

// EVENTS

SectorOverview.prototype.onMouseClick = function(mouse)
{
	for(var i = 0; i < this.m_liButtons.length; i++)
	{
		if(m_kCollisionManager.circlePolygonCollisionDetection(mouse, this.m_liButtons[i].m_cdCollision))
		{			
			this.onClick(this.m_liButtons[i].m_iID);
			
			return true;
		}
	}
}

// Do the stuff the buttons are supposed to do
SectorOverview.prototype.onClick = function(id)
{		
	this.m_kOwner.selectObject(this.m_liObjects[id].m_kObject);
}

// HELPERS

SectorOverview.prototype.createButton = function(x, y, height, width, padding)
{
	this.m_liButtons.push(new UIButton(this, 0, 100, 100, 100, 100, false)); 
}

SectorOverview.prototype.drawObjects = function(x, y, height, width, padding)
{	
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