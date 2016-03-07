Beacon.prototype = new Structure();
Beacon.prototype.constructor = Beacon;

function Beacon(x, y)
{
	this.m_iType = 99;
	
	// ID
	this.m_iID = guid();
	this.m_bNeedsTeam = false;

	this.m_liPos = new Array();
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	this.m_iRadius = 100;
	
	this.m_iPowerStored = 0;
	this.m_iPowerStoreMax = 1000;
	this.m_iPowerGenerated = 0;
	this.m_iPowerDrain = 0;
	
	this.m_iMaxConnections = 1;
	
	// Stats
	this.m_iShieldRegenCap = 120000; // 2 minutes
	this.m_iShieldCap = 500;
	this.m_iArmourCap = 10000;
	this.m_iArmourRegen = 0.06; // Should mean 10 minutes to regen fully
	this.m_iHullCap = 10000;
	this.m_iHullRegen = 0.06;
	
	this.m_iTeam = 0;
	
	// Construction
	this.m_iMetalRequired = 1;
	
	console.log("Initialized Beacon structure successfully.");
}

Beacon.prototype.update = function()
{	
	// Call base update
	Structure.prototype.update.call(this);
	
	if(this.m_bIsConstructed)
	{	
		if(this.m_iPowerStored < this.m_iPowerStoreMax)
		{
			if(Structure.prototype.onRequest.call(this, new Request(this, 0, 1)))
			{
				this.m_iPowerStored += (200 * m_fDeltaTime);
			}
			
			// Neutral if not fully powered
			this.m_iTeam = 0;
		}
		else
		{
			if(m_kPathfinder.makeRequest(new Request(this, 2, 0)))
			{
				this.m_iTeam = m_kPathfinder.m_kRequestResult.m_kStructure.m_iTeam;	
			}
			else
			{
				// No team
				this.m_iTeam = 0;
			}
		}
	}
	
	// Change colour based on team
	// This code is usually automatically done within the base class
	// But because this structure operates uniquely that is not possible!
	if(this.m_iTeam == 0)
	{
		this.m_iR = 100;
		this.m_iG = 100;
		this.m_iB = 100;
	}
	
	if(this.m_iTeam == 1)
	{
		this.m_iR = 0;
		this.m_iG = 0;
		this.m_iB = 255;
	}
	
	if(this.m_iTeam == 2)
	{
		this.m_iR = 255;
		this.m_iG = 0;
		this.m_iB = 0;
	}
		
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
}

Beacon.prototype.draw = function()
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