function Structure()
{
	this.m_sDebug = "This is a structure class.";
	this.m_sName = "Structure (Mistake!)";
	
	// Stats
	this.m_liPos = new Array();
	this.m_liPos[0] = 0;
	this.m_liPos[1] = 0;
	this.m_iRadius = 10;
	this.m_iRotation = 0;
	
	// Level
	this.m_iLevel = 1;
	this.m_iExp = 0;
	
	// Stats
	this.m_iShieldRegenCap = 0;
	this.m_iShieldRegen = 0; // seconds (mili)
	this.m_iShieldCap = 0;
	this.m_iShields = 0;
	this.m_iArmourCap = 0;
	this.m_iArmour = 1;
	this.m_iArmourRegen = 0;
	this.m_iHullCap = 0;
	this.m_iHull = 1;
	this.m_iHullRegen = 0;
	
	// Switches
	this.m_bIsPlaced = false;
	this.m_bIsConstructed = false;
	this.m_bDrawStats = false;
	this.m_bIsAlive = true;
	this.m_bDelete = false;
	this.m_bIsSelected = false;
	
	// Placement switches
	this.m_bCollideShips = true;
	this.m_bCollideStructures = true;
	this.m_bCollideAsteroids = true;
	
	// References
	this.m_kSector;
	
	// ID
	this.m_iID = 0;
	this.m_iType = 0; // Debug
	this.m_bNeedsTeam = false;
	this.m_iTeam = 0; // Neutral
	this.m_iTeamCheckTimer = 0; // seconds (mili)
	this.m_iTeamCheckTimerMax = 5000; // seconds (mili)
	
	// Path finding
	this.m_kParent;
	this.m_kRequestResult = new RequestResult();
	this.m_liSiblings = new Array();
	this.m_liRoutes = new Array();
	this.m_liPowerPath = new Array();
	this.m_liMetalPath = new Array();	
	this.m_iCost = 0;
	this.m_iHeuristic = 0;
	this.m_iTotal = 0;
	this.m_iMaxConnections = 0;
	
	// Power
	this.m_iPowerStored = 0;
	this.m_iPowerStoreMax = 0;
	this.m_iPowerGenerated = 0;
	this.m_iPowerDrain = 0;
	this.m_bBattery = false;
	this.m_bPowerTransfering = false;
	
	// Metal
	this.m_iMetalStored = 0;
	this.m_iMetalStoredMax = 0;
	this.m_bMetalStore = false;
	
	// Construction
	this.m_iMetalRequired = 0;
	this.m_iMetalBuilt = 0;
	
	// Collision Detection
	this.m_liShields = new Array();
	this.m_liComponents = new Array();
	this.m_iTimeSinceLastHit = 5001;
	this.m_iMaxRange = 0;
	
	// Weapons
	this.m_liWeapons = new Array();
	this.m_liTargets = new Array();
	
	// Drawing
	this.m_iR = 128;
	this.m_iG = 128;
	this.m_iB = 128;
	this.m_iA = 255;
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
	
	console.log("Initialized structure successfully.");
}

Structure.prototype.update = function()
{	
	// Not all structures have or need a team!
	if(this.m_bNeedsTeam)
	{
		// Count down to checking which team we should be on
		if(this.m_iTeamCheckTimer > 0)
			this.m_iTeamCheckTimer -= m_fElapsedTime;
		
		// Update the team we belong to!
		if(this.m_iTeamCheckTimer <= 0)
		{		
			// Check for control towers and update team!
			this.updateTeam();
		}
	}

	// NOT PLACED
	if(!this.m_bIsPlaced)
	{
		// Cap position to a multiple of five
		this.m_liPos[0] = 25 * (Math.round(this.m_liPos[0] / 25));
		this.m_liPos[1] = 25 * (Math.round(this.m_liPos[1] / 25));
		
		// Reset arrays
		this.m_liSiblings = new Array();
		this.m_liRoutes = new Array();
		
		// Connect to all nearby buildings
		this.setConnectors();
		
		// Update collision position
		// This is set permanently on placement	
		_shield = new C(new V(this.m_liPos[0], this.m_liPos[1]), this.m_iRadius);
		
		// Reset shield list
		this.m_liShields.length = 0;
		
		// Add updated shield
		this.m_liShields.push(_shield);		// THIS CAN BE OVERWRITTEN BY THE STRUCTURE IF REQUIRED!
	}
	
	// PLACED BUT NOT CONSTRUCTED
	if(this.m_bIsPlaced && !this.m_bIsConstructed)
	{
		// Attempt to construct yourself from your siblings
		if(this.onRequest(new Request(this, 1, 1)))
		{
			this.onConstruct(1);
		}
	}
	
	// Update components
	for(var i = 0; i < this.m_liComponents.length; i++)
		this.m_liComponents[i].update();
					
	// Loop through all weapons
	for(var i = 0; i < this.m_liWeapons.length; i++)
	{	
		// To increase readability
		var _weapons = this.m_liWeapons[i];
	
		// Loop through weapon set
		for(var j = 0; j < _weapons.length; j++)
		{				
			// Update!
			_weapons[j].update();
		}
	}
	
	// Always draw stats if low health
	if(this.m_iHull < (this.m_iHullCap * 0.25))
	{
		this.m_bDrawStats = true;
	}
	
	// Reset switch
	this.m_bPowerTransfering = false;
	
	// Hides or draws the health stats
	this.updateDrawTimer();
	
	// Regenerates stats
	this.regenStats();
}

Structure.prototype.draw = function()
{		
	if(this.m_bIsSelected)
	{
		m_kContext.fillStyle = "white";
		m_kContext.strokeStyle = "white";
		m_kContext.lineWidth = 0.5;
		m_kContext.beginPath();
		m_kContext.arc(this.m_liPos[0], this.m_liPos[1], 100, 0, 2 * Math.PI);
		m_kContext.stroke();
		m_kContext.closePath();
	}

	// If this isn't placed draw a range circle
	if(!this.m_bIsPlaced)
	{
		m_kContext.fillStyle = "orange";
		m_kContext.strokeStyle = "orange";
		
		m_kContext.lineWidth = 0.5;
		m_kContext.beginPath();
		m_kContext.arc(this.m_liPos[0], this.m_liPos[1], 250 + this.m_iRadius, 0, 2 * Math.PI);
		m_kContext.stroke();
		m_kContext.closePath();
	}
	
	if(!this.m_bIsConstructed)
	{
		// If not constructed draw ring showing how much construction is left
		this.drawStatRing(this.m_iMetalBuilt, this.m_iMetalRequired, this.m_iRadius + 5, "orange");
	}
	
	if(this.m_iTimeSinceLastHit > 0)
	{
		_alpha = 1 - (this.m_iTimeSinceLastHit / 5000);
	}
	
	if(_alpha < 0)
		_alpha = 0;
	
	m_kContext.globalAlpha = _alpha;

	// Draw Structure Shield
	m_kContext.fillStyle = "blue";
	m_kContext.strokeStyle = "blue";

	// Draw shields if they're up/exist
	if(this.m_iShields > 0)
	{
		m_kContext.beginPath();
		m_kContext.arc(this.m_liPos[0], this.m_liPos[1], this.m_iRadius, 0, 2 * Math.PI);
		m_kContext.fill();
		m_kContext.closePath();
	}
	
	// Alpha the structure if it isn't fully built!	
	var _alpha = 0.6 + (0.4 * (this.m_iMetalBuilt / this.m_iMetalRequired));
	
	if(!this.m_bIsConstructed)
	{
		m_kContext.globalAlpha = _alpha;
	}
	else
	{
		m_kContext.globalAlpha = 1;
	}
	
		
	// Draw components
	for(var i = 0; i < this.m_liComponents.length; i++)
		this.m_liComponents[i].draw();
	
	// Loop through all weapons
	for(var i = 0; i < this.m_liWeapons.length; i++)
	{	
		// To increase readability
		var _weapons = this.m_liWeapons[i];
	
		// Loop through weapon set
		for(var j = 0; j < _weapons.length; j++)
		{				
			// Draw!
			_weapons[j].draw();
		}
	}
	
	if(this.m_bNeedsTeam)
	{		
		// Set colour based on team!
		switch(this.m_iTeam)
		{
			// Neutral
			case 0:
				m_kContext.fillStyle = "gray";
				break;
				
			case 1:
				m_kContext.fillStyle = "blue";
				break;
				
			case 2:
				m_kContext.fillStyle = "red";
				break;
		}
		
		m_kContext.globalAlpha = 1;
		m_kContext.beginPath();
		m_kContext.arc(this.m_liPos[0], this.m_liPos[1], 5, 0, 2 * Math.PI);
		m_kContext.fill();
		m_kContext.closePath();
	}
	
	if(this.m_iTimeSinceLastHit > 0)
		_alpha = 1 - (this.m_iTimeSinceLastHit / 5000);
	
	if(_alpha < 0)
		_alpha = 0;
	
	m_kContext.globalAlpha = _alpha;
	
	// Draw stat bars
	//this.drawStatRing(this.m_iPowerStored, this.m_iPowerStoreMax, this.m_iRadius + 5, "yellow", 1);
	//this.drawStatRing(this.m_iMetalStored, this.m_iMetalStoredMax, this.m_iRadius + 5, "orange", 1);
	
	if(this.m_bDrawStats)
	{		
		m_kContext.lineWidth = 0.0;
		this.drawStatRing(this.m_iHull, this.m_iHullCap, this.m_iRadius + 10, "darkgray", _alpha);
		this.drawStatRing(this.m_iArmour, this.m_iArmourCap, this.m_iRadius + 16, "gray", _alpha);
		this.drawStatRing(this.m_iShields, this.m_iShieldCap, this.m_iRadius + 22, "blue", _alpha);
	}
	
	// Reset alpha
	m_kContext.globalAlpha = 1.0;
	
	// Reset colours to default
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
}

Structure.prototype.drawConnections = function()
{
	// Draw power lines
	for(var i = 0; i < this.m_liRoutes.length; i++)
	{
		var _structure = this.m_liRoutes[i].getNode();
	
		var _parentX = _structure.m_liPos[0];
		var _parentY = _structure.m_liPos[1];
		
		if(this.m_liRoutes[i].getTransfer())
		{
			m_kContext.lineWidth = 5;			
		}
		else
		{					
			m_kContext.lineWidth = 2;	
		}
		
		m_kContext.strokeStyle = this.m_liRoutes[i].getColour();
		m_kContext.beginPath();
		m_kContext.moveTo(this.m_liPos[0], this.m_liPos[1]);
		m_kContext.lineTo(_parentX, _parentY);
		m_kContext.stroke();
		m_kContext.closePath();		
	}	
}

Structure.prototype.drawStatRing = function(stat, statMax, radius, colour, alpha)
{
	var _percent = stat / statMax;
	
	m_kContext.strokeStyle = colour;
	m_kContext.globalAlpha = alpha;
	m_kContext.lineWidth = 5;
	m_kContext.beginPath();
	m_kContext.arc(this.m_liPos[0], this.m_liPos[1], radius, 0, (Math.PI * 2) * _percent);
	m_kContext.stroke();	
	m_kContext.closePath();

	// Reset alpha
	m_kContext.globalAlpha = 1.0;
}

// EVENTS

Structure.prototype.onCollectMetal = function(metal)
{
	// Collect metal
	if(this.m_iMetalStored < (this.m_iMetalStoredMax + metal))
	{
		this.m_iMetalStored += metal;
		
		return true;
	}
	
	return false;
}

Structure.prototype.onTractor = function(x, y)
{
	// Move towards point!
}

Structure.prototype.onRepair = function(metal)
{
	// Reset hit timer!
	this.m_iTimeSinceLastHit = 0;
	
	// Work out what percentage of the whole this bit was
	var _percent = (metal / this.m_iMetalRequired);
	
	// If the hull isnt full, add that percentage to it
	if(this.m_iHull < this.m_iHullCap)
	{		
		this.m_iHull += (this.m_iHullCap * _percent);
	}
	else if(this.m_iArmour < this.m_iArmourCap)
	{
		// If the armour isnt full, add that percentage to it
		this.m_iArmour += (this.m_iArmourCap * _percent);
	}
	else
	{
		// Nothing needs repairing!
		return false;
	}
	
	// Successfully added metal to repair!
	return true;
}

Structure.prototype.onConstruct = function(metal)
{
	// Check if this structure needs more construction!
	if(this.m_iMetalBuilt < this.m_iMetalRequired)
	{
		// Construct using metal
		this.m_iMetalBuilt += metal;

		// Work out what percentage of the whole this bit was
		var _percent = (metal / this.m_iMetalRequired);
		
		// If the hull isnt full, add that percentage to it
		if(this.m_iHull < this.m_iHullCap)
		{		
			this.m_iHull += (this.m_iHullCap * _percent);
		}
		
		// If the armour isnt full, add that percentage to it
		if(this.m_iArmour < this.m_iArmourCap)
		{
			this.m_iArmour += (this.m_iArmourCap * _percent);
		}
		
		// Successfully added metal to construction!
		return true;
	}
	else
	{	
		// Constructed!
		this.m_bIsConstructed = true;
		
		// Metal not needed!
		return false;
	}
	
	// Metal not needed!
	return false;
}

Structure.prototype.onHit = function(damage)
{	
	// Reset hit timer!
	this.m_iTimeSinceLastHit = 0;

	// Check if hit is on shields or player	
	if(this.m_iShields > 0)
	{
		// Impacts on shields
		this.m_iShields -= damage;	
		
		// Reset shield regen timer
		this.m_iShieldRegen = this.m_iShieldRegenCap;
	}
	else if(this.m_iArmour - damage > 0)
	{
		// Impact on the armour
		this.m_iArmour -= damage;
		
		// Reset shield regen timer
		this.m_iShieldRegen = this.m_iShieldRegenCap;
	}
	else
	{
		// Impact on the health
		this.m_iHull -= damage;
		
		// Reset shield regen timer
		this.m_iShieldRegen = this.m_iShieldRegenCap;
		
		// Check if structure is alive!
		if(this.m_iHull <= 0)
		{
			// Destroy structure
			this.m_bIsAlive = false;
			this.m_bDelete = true;
			
			this.onDestroy();
		
			return true; // Structure died!
		}
	}
	
	return false; // Structure lives on
}

Structure.prototype.onDestroy = function()
{
	// Cause an explosion!
	m_kCollisionManager.onExplosion(this, this.m_kSector.m_liShips);
	
	var _node;
	
	// Tell all of your routes to disconnect from you
	for(var i = 0; i < this.m_liRoutes.length; i++)
	{
		_node = this.m_liRoutes[i].getNode();
		
		_node.removeRoute(this);
	}
}

Structure.prototype.onCollision = function(ship)
{
	this.m_iTimeSinceLastHit = 0;
	
	ship.onCollision(m_kCollisionManager.m_kResponse.overlapV);
}

Structure.prototype.onRequest = function(request)
{	
	// Make the request
	m_kPathfinder.makeRequest(request);
	
	// Return the result!
	return m_kPathfinder.m_kRequestResult.m_bRequestCompleted;
}

Structure.prototype.onPlace = function()
{
	for(var i = 0; i < this.m_liSiblings.length; i++)
	{		
		// Add all current siblings to your sibling list!
		this.m_liSiblings[i].addSiblingAbsolute(this);
	}
	
	// Reset shields
	this.m_liShields.length = 0;
	
	_shield = new C(new V(this.m_liPos[0], this.m_liPos[1]), this.m_iRadius);	
	
	// Set shield!
	this.m_liShields.push(_shield);		// THIS CAN BE OVERWRITTEN BY THE STRUCTURE IF REQUIRED!
	
	// Switch to placed
	this.m_bIsPlaced = true;
	
	// If you need a team, assign one instantly
	if(this.m_bNeedsTeam)
	{
		this.updateTeam();
	}
	
	return true;
}

// HELPER FUNCTIONS

Structure.prototype.setConnectors = function()
{	
	var _distance = 0;
	var _closest = 999999;
	var _vector = new Array();
	var _closestID = -1;
	
	var _structures = this.m_kSector.m_kStructureManager.m_liStructures;

	for(var i = 0; i < _structures.length; i++)
	{
		// Check to see if this building is available to connect to
		if(!_structures[i].canConnect())
		{
			continue;
		}
		
		// Don't allow two "leaves" to connect to each other!
		if(_structures[i].m_iMaxConnections == 1 && this.m_iMaxConnections == 1)
		{
			continue;
		}
	
		_vector[0] = _structures[i].m_liPos[0];
		_vector[1] = _structures[i].m_liPos[1];
	
		_distance = calculateDistance(this.m_liPos, _vector);
		
		if(_distance < (this.m_iRadius + 250) + _structures[i].m_iRadius)
		{
			if(this.m_liSiblings.length < this.m_iMaxConnections)
			{
				this.addSibling(_structures[i]);
			}
			else
			{
				_vector[0] = this.m_liSiblings[0].m_liPos[0];
				_vector[1] = this.m_liSiblings[0].m_liPos[1];
			
				var _otherDistance = calculateDistance(this.m_liPos, _vector);
			
				if(_distance < _otherDistance)
				{				
					this.m_liSiblings.length = 0;
					this.m_liRoutes.length = 0;
					
					this.addSibling(_structures[i]);
				}
			}
		}
	}
}

Structure.prototype.checkRequest = function(request)
{		
	if(!this.m_bIsConstructed)
	{
		// Unconstructed buildings cannot transfer resources!
		return false;
	}	

	switch(request.m_iType)
	{
		// POWER
		case 0:
			// Don't transfer from battery to battery!
			if(!request.m_kStructure.m_bBattery)
			{
				if(this.checkBattery(request.m_iAmount))
				{
					// Enough in battery!
					return true;
				}
				else
				{
					// Check generator
					return this.checkGenerator(request.m_iAmount);
				}
			}
			else
			{
				// Check generator
				return this.checkGenerator(request.m_iAmount);
			}
			break;
			
		// METAL
		case 1:
			if(!request.m_kStructure.m_bMetalStore)
			{
				return this.checkMetal(request.m_iAmount);
			}
			else
			{
				// Only collect from extractors!
				if(this.m_iType == 6)
				{
					return this.checkMetal(request.m_iAmount);
				}
			}
			break;
			
		// CONTROL
		case 2:			
			if(this.m_iType == 0)
			{
				return true;
			}
			else
			{
				return false;
			}
			break;
	}
	
	return false;
}

Structure.prototype.updateDrawTimer = function()
{
	if(this.m_iTimeSinceLastHit < 5000)
	{
		this.m_iTimeSinceLastHit += m_fElapsedTime;
		
		this.m_bDrawStats = true;
	}
	else
	{
		this.m_bDrawStats = false;
	}
}

Structure.prototype.resetVariables = function()
{
	// Reset variables
	this.m_iPowerDrain = 0;
	this.m_bPowerTransfering = false;
	
	for(var i = 0; i < this.m_liRoutes.length; i++)
	{
		this.m_liRoutes[i].setTransfer(false, 0);
	}
}

Structure.prototype.regenStats = function()
{
	// Count Down Shield Regen Timer
	if(this.m_iShieldRegen > 0)
		this.m_iShieldRegen -= m_fElapsedTime;

	// Calculate how much to regen by this frame
	var _hullRegenAmount = (this.m_iHullRegen / 1000) * m_fElapsedTime;	
	var _armourRegenAmount = (this.m_iArmourRegen / 1000) * m_fElapsedTime;	
	var _energyRegenAmount = (this.m_iEnergyRegen / 1000) * m_fElapsedTime;	
	
	// Regen energy
	if(this.m_iEnergy < this.m_iEnergyCap)
		this.m_iEnergy += _energyRegenAmount;
		
	// Regen armour
	if(this.m_iArmour < this.m_iArmourCap)
		this.m_iArmour += _armourRegenAmount;
		
	// Regen hull
	if(this.m_iHull < this.m_iHullCap)
		this.m_iHull += _hullRegenAmount;
		
	// Check if shields should regen
	if(this.m_iShieldRegen <= 0 && this.m_iShields < this.m_iShieldCap)
	{
		// Regen shields
		this.m_iShields += (this.m_iShieldCap / 1000) * m_fElapsedTime; // Regen in 1 second
		
		// Make sure shields dont overflow
		if(this.m_iShields > this.m_iShieldCap)
			this.m_iShields = this.m_iShieldCap;
	}
	
	// Just to be safe...
	if(this.m_iEnergy < 0)
		this.m_iEnergy = 0;

	// Just to be safe...
	if(this.m_iEnergy > this.m_iEnergyCap)
		this.m_iEnergy = this.m_iEnergyCap;		
	
	// Just to be safe...
	if(this.m_iShields < 0)
		this.m_iShields = 0;
		
	// Just to be safe...
	if(this.m_iShields > this.m_iShieldCap)
		this.m_iShields = this.m_iShieldCap;
		
	// Just to be safe...
	if(this.m_iArmour < 0)
		this.m_iArmour = 0;
		
	// Just to be safe...
	if(this.m_iArmour > this.m_iArmourCap)
		this.m_iArmour = this.m_iArmourCap;
		
	// Just to be safe...
	if(this.m_iHull < 0)
		this.m_iHull = 0;
		
	// Just to be safe...
	if(this.m_iHull > this.m_iHullCap)
		this.m_iHull = this.m_iHullCap;
		
	// Just to be safe...
	if(this.m_iPowerStored < 0)
		this.m_iPowerStored = 0;
		
	// Just to be safe...
	if(this.m_iPowerStored > this.m_iPowerStoreMax)
		this.m_iPowerStored = this.m_iPowerStoreMax;
}	

Structure.prototype.checkGenerator = function(power)
{	
	// Check if this building generates power
	if(this.m_iPowerGenerated <= 0)
	{		
		// No power available
		return false;
	}	
	
	// Find out how much the aggregate generation is
	var _generation = this.m_iPowerGenerated - this.m_iPowerDrain;
	
	// Check if we have enough to power this structure
	if(_generation >= power)
	{
		// Power available!
		this.m_iPowerDrain += power;
		this.m_bPowerTransfering = true;
		
		return true;
	}
	else
	{		
		return false;
	}
}

Structure.prototype.checkBattery = function(power)
{	
	if(!this.m_bBattery)
	{
		// Not a battery
		return false;
	}

	// Check if you have the power in store
	if(this.m_iPowerStored >= power)
	{
		// If you do, transfer
		this.m_iPowerStored -= power / 100;
		this.m_bPowerTransfering = true;
		
		// Let them know you've transferred it
		return true;
	}
	
	// Not enough in store!
	return false;
}

Structure.prototype.checkMetal = function(metal)
{
	// Check if we have enough resources
	if(this.m_iMetalStored > metal)
	{
		this.m_iMetalStored -= metal;
		return true;
	}
	
	// Not enough metal
	return false;
}

Structure.prototype.updateTeam = function()
{	
	// Reset timer
	this.m_iTeamCheckTimer = this.m_iTeamCheckTimerMax;
	
	// Check for control tower!
	if(this.onRequest(new Request(this, 2, 0)))
	{		
		// Found one!
		this.m_iTeam = m_kPathfinder.m_kRequestResult.m_kStructure.m_iTeam;
	}
	else
	{		
		// No tower! Set team to neutral!
		this.m_iTeam = 0;
	}		
	
	//this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
}

// This is to be used by external calls because not as many checks need to be performed
Structure.prototype.addSiblingAbsolute = function(structure)
{
	this.m_liSiblings.push(structure);
	
	this.addRouteAbsolute(structure);
}

Structure.prototype.addRouteAbsolute = function(structure)
{	
	if(structure.m_kSector.m_iID != this.m_kSector.m_iID)
	{
		return;
	}

	var _structurePos = new Array();
	_structurePos[0] = structure.m_liPos[0];
	_structurePos[1] = structure.m_liPos[1];
	
	var _distance = calculateDistance(this.m_liPos, _structurePos);

	var _newRoute = new Route(structure, _distance, this);
	
	this.m_liRoutes.push(_newRoute);
}

Structure.prototype.addSibling = function(structure)
{
	if(this.addRoute(structure))
	{
		this.m_liSiblings.push(structure);
	}
	
	//this.m_liSiblings.push(structure);
	
	//this.addRoute(structure);
}

Structure.prototype.removeSibling = function(structure)
{	
	// Find sibling
	for(var i = 0; i < this.m_liSiblings.length; i++)
	{
		
		// If destroyed, set index
		if(this.m_liSiblings[i].m_iID == structure.m_iID)
		{		
			_index = i;
		}
	}
	
	if(_index > -1)
	{			
		// Remove structure item
		this.m_liSiblings.splice(_index, 1);
	}
}

Structure.prototype.addRoute = function(structure)
{	
	if(structure.m_kSector.m_iID != this.m_kSector.m_iID)
	{
		return;
	}

	var _structurePos = new Array();
	_structurePos[0] = structure.m_liPos[0];
	_structurePos[1] = structure.m_liPos[1];
	
	var _distance = calculateDistance(this.m_liPos, _structurePos);

	var _newRoute = new Route(structure, _distance, this);
	
	if(!m_kCollisionManager.routeCrossCheck(_newRoute, this.m_kSector.m_kStructureManager.m_liStructures))
	{
		this.m_liRoutes.push(_newRoute);
		
		return true;
	}
	
	return false;
}

Structure.prototype.removeRoute = function(structure)
{
	var _node;
	var _index = -1;

	for(var i = 0; i < this.m_liRoutes.length; i++)
	{
		_node = this.m_liRoutes[i].getNode();
	
		if(_node.m_iID == structure.m_iID)
		{
			_index = i;
		}
	}
	
	if(_index > -1)
	{		
		// Remove log item
		this.m_liRoutes.splice(_index, 1);
	}
	
	_index = -1;
	
	for(var i = 0; i < this.m_liSiblings.length; i++)
	{
		_node = this.m_liSiblings[i];
	
		if(_node.m_iID == structure.m_iID)
		{
			_index = i;
		}
	}
	
	if(_index > -1)
	{		
		// Remove log item
		this.m_liSiblings.splice(_index, 1);
	}
}

Structure.prototype.canConnect = function()
{
	if(this.m_liSiblings.length < this.m_iMaxConnections)
	{		
		return true;
	}
	else
	{	
		return false;
	}
}

Structure.prototype.setTransfer = function(sibling)
{
	for(var i = 0; i < this.m_liRoutes.length; i++)
	{
		if(sibling.m_iID == this.m_liRoutes[i].getNode().m_iID)
		{
			this.m_liRoutes[i].setTransfer(true, m_kPathfinder.m_kRequestResult.m_kRequest.m_iType);
			this.m_bPowerTransfering = true;
		}
	}
}

// Returns a list of all currently firing weapons
// for collision detection
Structure.prototype.activeWeapons = function()
{
	var _activeWeapons = new Array();
	this.m_iMaxRange = 0;
	
	// Loop through all weapons
	for(var i = 0; i < this.m_liWeapons.length; i++)
	{	
		// To increase readability
		var _weapons = this.m_liWeapons[i];
	
		// Loop through weapon set
		for(var j = 0; j < _weapons.length; j++)
		{
			// Only certain types of weapons!
			if(_weapons[j].m_iType == 1 || _weapons[j].m_iType == 2)
			{					
				// Has to be currently firing!
				if(_weapons[j].m_bIsFiring)
				{
					// Add to list!
					_activeWeapons.push(_weapons[j]);
						
					if(_weapons[j].m_iRange > this.m_iMaxRange)
					{
						this.m_iMaxRange = _weapons.m_iRange;
					}
				}
			}
		}
	}
	
	return _activeWeapons;
}