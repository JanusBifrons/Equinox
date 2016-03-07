function StructureManager()
{	
	// Container for structures
	this.m_liStructures = new Array();
	
	console.log("Initialized structure manager successfully.");
}

StructureManager.prototype.update = function()
{
	// Structure for manager to delete
	var _index = -1;
	
	// Reset structures
	for(var i = 0; i < this.m_liStructures.length; i++)
	{
		this.m_liStructures[i].resetVariables();
	}
	
	// Update structures
	for(var i = 0; i < this.m_liStructures.length; i++)
	{	
		this.m_liStructures[i].update();
		
		// If destroyed, set index
		if(this.m_liStructures[i].m_bDelete)
		{		
			_index = i;
		}
	}
	
	if(_index > -1)
	{			
		// Remove structure item
		this.m_liStructures.splice(_index, 1);
	}
}

StructureManager.prototype.draw = function()
{		
	// Draw connections
	for(var i = 0; i < this.m_liStructures.length; i++)
	{
		this.m_liStructures[i].drawConnections();
	}

	// Draw structures
	for(var i = 0; i < this.m_liStructures.length; i++)
	{
		this.m_liStructures[i].draw();
	}
}

// HELPERS

StructureManager.prototype.requestRespawn = function(ship)
{
	for(var i = 0; i < this.m_liStructures.length; i++)
	{
		// Ensure structure is constructed!
		if(!this.m_liStructures[i].m_bIsConstructed)
			continue;
		
		// Ensure structure is on the same team!
		if(this.m_liStructures[i].m_iTeam != ship.m_iTeam)
			continue;
		
		// Locate a respawn pad!
		if(this.m_liStructures[i].m_iType == 5)
		{
			// Check if it is already respawning somebody else
			if(!this.m_liStructures[i].m_bIsRespawning)
			{				
				this.m_liStructures[i].setRespawn(ship);
				
				// Don't accidentally set to ALL respawn pads!
				return true;
			}
		}
	}
	
	return false;
}

StructureManager.prototype.addStructure = function(structure)
{
	this.m_liStructures.push(structure);
}

StructureManager.prototype.sectorOwner = function()
{
	// Array to hold all of the control beacon teams
	var _team = new Array();
	
	// Cycle through all structures
	for(var i = 0; i < this.m_liStructures.length; i++)
	{
		// Beacon
		if(this.m_liStructures[i].m_iType == 99)
		{
			_team.push(this.m_liStructures[i].m_iTeam);
		}
	}
	
	if(_team.length > 0)
	{
		return mostFrequent(_team);
	}
	else
	{
		// Neutral
		return 0;
	}
}

StructureManager.prototype.requestTeleporters = function()
{
	// Array to hold all of the teleporters
	var _teleporters = new Array();
	
	// Cycle through all structures
	for(var i = 0; i < this.m_liStructures.length; i++)
	{
		// Teleporter
		if(this.m_liStructures[i].m_iType == 4)
		{
			_teleporters.push(this.m_liStructures[i]);
		}
	}
	
	return _teleporters;
}