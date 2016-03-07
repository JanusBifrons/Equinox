Repair.prototype = new Structure();
Repair.prototype.constructor = Repair;

function Repair(x, y)
{
	this.m_iType = 18;

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
	this.m_liShips = new Array();
	this.m_bIsPowering = false;
	this.m_bIsRepairing = false;
	
	console.log("Initialized Repair structure successfully.");
}

Repair.prototype.update = function()
{		
	// Call base update
	Structure.prototype.update.call(this);

	if(this.m_bIsPowering)
	{
		// Not enough power, attempt to store more!
		if(Structure.prototype.onRequest.call(this, new Request(this, 0, 200 * this.m_liShips.length)))
		{
			for(var i = 0 ; i < this.m_liShips.length; i++)
			{
				this.m_liShips[i].onRecharge(1);
				
				this.m_cColour = concatenate(255, 255, 0, 255);
			}
		}	
	}
	
	if(this.m_bIsRepairing)
	{
		// Not enough power, attempt to store more!
		if(Structure.prototype.onRequest.call(this, new Request(this, 1, 1 * this.m_liShips.length)))
		{
			for(var i = 0 ; i < this.m_liShips.length; i++)
			{
				this.m_liShips[i].onRepair(1);
				
				this.m_cColour = concatenate(255, 128, 0, 255);
			}
		}	
	}
	
	this.m_bIsPowering = false;
	this.m_bIsRepairing = false;
	this.m_liShips.length = 0;
}

Repair.prototype.draw = function()
{
	// Call base draw
	Structure.prototype.draw.call(this);
	
	// Alpha the structure if it isn't fully built!	
	var _alpha = 0.6 + (0.4 * (this.m_iMetalBuilt / this.m_iMetalRequired));
	m_kContext.globalAlpha = _alpha;
	
	// Draw Structure	
	m_kContext.fillStyle = this.m_cColour;
	m_kContext.strokeStyle = this.m_cColour;
	m_kContext.beginPath();
	m_kContext.arc(this.m_liPos[0], this.m_liPos[1], this.m_iRadius, 0, 2 * Math.PI);
	m_kContext.fill();
	m_kContext.closePath();
}

// This is fucking disgustingly bad code
// But for some reason onRequest is bugging out when used in this function
// It's succeeding but draining from god knows where...
Repair.prototype.onCollision = function(ship)
{	
	// If not constructed do nothing!
	if(!this.m_bIsConstructed)
		return;
	
	this.m_liShips.push(ship);
	
	// Check if we have enough power to teleport
	if(ship.m_iPowerStored < ship.m_iPowerCap)
	{
		this.m_bIsPowering = true;
	}
	
	if(ship.m_iHull < ship.m_iHullCap)
	{		
		this.m_bIsRepairing = true;
	}
	else if(ship.m_iArmour < ship.m_iArmourCap)
	{
		this.m_bIsRepairing = true;
	}
}