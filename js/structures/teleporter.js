Teleporter.prototype = new Structure();
Teleporter.prototype.constructor = Teleporter;

function Teleporter(x, y)
{
	this.m_iType = 4;

	this.m_liPos = new Array();
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	this.m_iRadius = 100;
	
	this.m_iPowerStored = 0;
	this.m_iPowerStoreMax = 50000;
	this.m_iPowerGenerated = 0;
	this.m_iPowerDrain = 0;
	this.m_iMaxConnections = 1;
	
	// Stats
	this.m_iShieldRegenCap = 0;
	this.m_iShieldCap = 0;
	this.m_iArmourCap = 0;
	this.m_iArmourRegen = 0;
	this.m_iHullCap = 100;
	this.m_iHullRegen = 0;
	
	// Construction
	this.m_iMetalRequired = 1;
	
	// ID
	this.m_iID = guid();
	this.m_bNeedsTeam = true;
	
	// Local variables
	this.m_iTeleportTarget = -1;
	this.m_bIsTeleporting = false;
	this.m_bDrawArrows = false;
	
	console.log("Initialized Teleporter structure successfully.");
}

Teleporter.prototype.update = function()
{	
	if(this.m_bIsConstructed)
	{
		// Drain power if no target selected!
		if(this.m_iTeleportTarget < 0)
		{
			this.m_iPowerStored -= 200;
		}
		
		if(this.m_bIsTeleporting)
		{
			var _request = new Request(this, 0, 200);
			
			// Not enough power, attempt to store more!
			if(Structure.prototype.onRequest.call(this, _request))
			{			
				// Add more to the store!
				this.m_iPowerStored += 200;
			}
		}
		
		this.m_bIsTeleporting = false;		
	}
	
		// Call base update
	Structure.prototype.update.call(this);
}

Teleporter.prototype.draw = function()
{
	// Call base draw
	Structure.prototype.draw.call(this);
	
	// Alpha the structure if it isn't fully built!	
	var _alpha = 0.6 + (0.4 * (this.m_iMetalBuilt / this.m_iMetalRequired));
	m_kContext.globalAlpha = _alpha;
	
	// Draw Structure	
	m_kContext.fillStyle = this.m_cColour;
	m_kContext.strokeStyle = this.m_cColour;
	m_kContext.globalAlpha = _alpha;
	m_kContext.beginPath();
	m_kContext.arc(this.m_liPos[0], this.m_liPos[1], this.m_iRadius, 0, 2 * Math.PI);
	m_kContext.fill();
	m_kContext.closePath();
	
	if(this.m_bDrawArrows)
	{
		this.drawArrows();
		
		// Reset drawing!
		this.m_bDrawArrows = false;
			
		// Reset target!
		this.m_iTeleportTarget = -1;
	}
}

Teleporter.prototype.setTarget = function(ship)
{
	var _teleporters = this.m_kSector.m_kStructureManager.requestTeleporters();
	var _x = 0;
	var _y = 0;
	
	for(var i = 0; i < _teleporters.length; i++)
	{
		// Skip if not constructed
		if(!_teleporters[i].m_bIsConstructed)
			continue;
		
		if(_teleporters[i].m_iID != this.m_iID)
		{
			_x = _teleporters[i].m_liPos[0] - this.m_liPos[0];
			_y = _teleporters[i].m_liPos[1] - this.m_liPos[1];
			
			var _direction = Math.atan2(_y, _x);
			
			_direction = wrapAngle(_direction);
			
			var _diff = _direction - ship.m_iRotation;
		
			if(_diff < 0.1 && _diff > -0.1)
			{
				this.m_iTeleportTarget = i;
			}	
		}
	}
}

Teleporter.prototype.drawArrows = function()
{
	var _teleporters = this.m_kSector.m_kStructureManager.requestTeleporters();
	var _x = 0;
	var _y = 0;
	
	var _drawX = 0;
	var _drawY = 0;
				
	m_kContext.lineWidth = 1;
	m_kContext.strokeStyle = 'white';
	m_kContext.fillStyle = 'white';
	
	for(var i = 0; i < _teleporters.length; i++)
	{
		// Skip if not constructed
		if(!_teleporters[i].m_bIsConstructed)
			continue;
		
		if(_teleporters[i].m_iID != this.m_iID)
		{
			_x = _teleporters[i].m_liPos[0] - this.m_liPos[0];
			_y = _teleporters[i].m_liPos[1] - this.m_liPos[1];
			
			var _direction = Math.atan2(_y, _x);
			var _distance = calculateDistance(this.m_liPos, _teleporters[i].m_liPos);

			_drawX = this.m_liPos[0] + (this.m_iRadius + 15) * Math.cos(_direction);
			_drawY = this.m_liPos[1] + (this.m_iRadius + 15) * Math.sin(_direction);
			
			if(this.m_iTeleportTarget == i)
			{
				m_kContext.fillStyle = 'red';
			}
			else
			{
				m_kContext.fillStyle = 'white';
			}
			
			m_kContext.beginPath();
			m_kContext.arc(_drawX, _drawY, 5, 0, Math.PI * 2);
			m_kContext.stroke();
			m_kContext.fill();
			m_kContext.closePath();
		}
	}
}

Teleporter.prototype.onCollision = function(ship)
{	
	// If not constructed do nothing!
	if(!this.m_bIsConstructed)
		return;
	
	// Draw the arrows whilst player is on teleporter
	this.m_bDrawArrows = true;
	
	// Attempt to set a target based on player direction
	this.setTarget(ship);
	
	// If target is less than 0 there is no target
	if(this.m_iTeleportTarget < 0)
		return;
	
	// Check if we have enough power to teleport
	if(this.m_iPowerStored < this.m_iPowerStoreMax)
	{
		this.m_bIsTeleporting = true;
	}
	else
	{
		// Reset the store
		this.m_iPowerStored = 0;

		// Retreive list of all teleporters!
		var _teleporters = this.m_kSector.m_kStructureManager.requestTeleporters();
		
		// Teleport to target!
		_teleporters[this.m_iTeleportTarget].onTeleport(ship);
	}
}

Teleporter.prototype.onTeleport = function(ship)
{
	ship.onTeleport(this.m_liPos[0], this.m_liPos[1]);
}