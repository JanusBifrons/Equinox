Respawn.prototype = new Structure();
Respawn.prototype.constructor = Respawn;

function Respawn(x, y)
{
	this.m_iType = 5;
	
	this.m_liPos = new Array();
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	this.m_iRadius = 50;
	
	this.m_iPowerStored = 0;
	this.m_iPowerStoreMax = 0;
	this.m_iMaxConnections = 1;
	
	// Stats
	this.m_iShieldRegenCap = 0;
	this.m_iShieldCap = 0;
	this.m_iArmourCap = 0;
	this.m_iArmourRegen = 0;
	this.m_iHullCap = 100;
	this.m_iHullRegen = 0;
	
	// Collision Detection
	this.m_liShields = new Array();
	this.m_liComponents = new Array();
	
	// ID
	this.m_iID = guid();
	this.m_bNeedsTeam = true;
	
	// Construction
	this.m_iMetalRequired = 1;
	
	// Drawing
	this.m_iR;
	this.m_iG;
	this.m_iB;
	this.m_iA = 255;
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
	
	// Local Variables
	this.m_bIsRespawning = false;
	this.m_iSpawnProgress = 0;
	this.m_iSpawnProgressMax = 1000;
	this.m_kRespawnShip;
	
	console.log("Initialized Respawn Pad structure successfully.");
}

Respawn.prototype.update = function()
{	
	// Call base update
	Structure.prototype.update.call(this);
	
	if(this.m_bIsConstructed)
	{
		if(this.m_bIsRespawning)
		{				
			// REQUEST POWER!
			if(Structure.prototype.onRequest.call(this, new Request(this, 0, 10)))
			{			
				// Has power!
				this.m_iSpawnProgress += m_fElapsedTime;
				
				this.m_cColour = concatenate(0, 255, 0, 255);
			}
			
			if(this.m_iSpawnProgress >= this.m_iSpawnProgressMax)
			{
				// Respawn successful!
				this.onRespawn();
			}
		}
	}
}

Respawn.prototype.draw = function()
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
		
	if(this.m_bIsRespawning)
	{
		var _percent = this.m_iSpawnProgress / this.m_iSpawnProgressMax;	
		
		m_kContext.strokeStyle = "green";
		m_kContext.fillStyle = "green";
		m_kContext.lineWidth = 5;
		m_kContext.beginPath();
		m_kContext.arc(this.m_liPos[0], this.m_liPos[1], this.m_iRadius * _percent, 0, 2 * Math.PI);
		m_kContext.fill();
		m_kContext.stroke();	
		m_kContext.closePath();
	}
}

Respawn.prototype.onCollision = function(ship)
{
	// Override and block base so you don't collide
}

Respawn.prototype.onRespawn = function()
{
	this.m_iSpawnProgress = 0;	
	this.m_bIsRespawning = false;

	this.m_kRespawnShip.onRespawn(this.m_liPos[0], this.m_liPos[1]);
	
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
}

Respawn.prototype.setRespawn = function(ship)
{
	// Flag ship as respawning
	ship.m_bIsRespawning = true;
	
	// Save ship
	this.m_kRespawnShip = ship;
	
	// Flag this structure as respawning
	this.m_bIsRespawning = true;
}