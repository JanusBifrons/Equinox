Control.prototype = new Structure();
Control.prototype.constructor = Control;

function Control(x, y, team)
{
	this.m_iType = 0;
	
	this.m_sName = "Control";
		
	this.m_iID = guid();
	
	this.m_liPos = new Array();
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	this.m_iRadius = 300;
	
	this.m_iPowerStored = 0;
	this.m_iPowerStoreMax = 0;
	this.m_iPowerGenerated = 10;
	this.m_iMaxConnections = 25;
	
	this.m_liSiblings = new Array();
	this.m_liRoutes = new Array();
	
	// Stats
	this.m_iShieldRegenCap = 120000; // 2 minutes
	this.m_iShieldCap = 500;
	this.m_iArmourCap = 1000;
	this.m_iArmourRegen = 0.06; // Should mean 10 minutes to regen fully
	this.m_iHullCap = 5000;
	this.m_iHullRegen = 0.06;
	
	// Collision Detection
	this.m_liShields = new Array();
	this.m_liComponents = new Array();
	
	// Construction
	this.m_iMetalRequired = 1000;
	
	// Metal
	this.m_iMetalStored = 650;
	this.m_iMetalStoredMax = 650;
	this.m_bMetalStore = true;
	
	// Local variables
	this.m_iTeam = team;
	
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
	
	// Components
	this.m_liComponents.push(new HexHull(this, 0, 0, 2.5));
	this.m_liComponents.push(new EnergyBar(this, -50, 0, 2));
	this.m_liComponents.push(new MetalBar(this, 50, 0, 2));
	
	
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
	
	// Local variables
	this.m_iCurrentDrain = 0;
	
	console.log("Initialized Control structure successfully.");
}

Control.prototype.update = function()
{	
	// Call base update
	Structure.prototype.update.call(this);

	if(this.m_iMetalStored < this.m_iMetalStoredMax)
	{
		// Get some metal!
		if(Structure.prototype.onRequest.call(this, new Request(this, 1, 1)))
		{	
			this.m_iMetalStored += 1;
		}	
	}	
}

Control.prototype.draw = function()
{
	// Call base draw
	Structure.prototype.draw.call(this);
}















