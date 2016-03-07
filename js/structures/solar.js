Solar.prototype = new Structure();
Solar.prototype.constructor = Solar;

function Solar(x, y)
{
	this.m_iType = 2;
	
	this.m_sName = "Solar";

	this.m_liPos = new Array();
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	this.m_iRadius = 75;
	
	this.m_iPowerStored = 0;
	this.m_iPowerStoreMax = 0;
	this.m_iPowerGenerated = 20;
	this.m_iPowerDrain = 0;
	this.m_iMaxConnections = 1;
	
	// Stats
	this.m_iShieldRegenCap = 120000; // 2 minutes
	this.m_iShieldCap = 100;
	this.m_iArmourCap = 250;
	this.m_iArmourRegen = 0.06;
	this.m_iHullCap = 250;
	this.m_iHullRegen = 0.06;
	
	// Construction
	this.m_iMetalRequired = 75;
	
	this.m_bNeedsTeam = false;
	
	// Collision Detection
	this.m_liShields = new Array();
	this.m_liComponents = new Array();
	
	// ID
	this.m_iID = guid();
	
	// Local variables
	this.m_iCurrentDrain = 0;
	
	// Components
	this.createComponents();
	
	console.log("Initialized Solar structure successfully.");
}

Solar.prototype.update = function()
{		
	// Call base update
	Structure.prototype.update.call(this);
}

Solar.prototype.draw = function()
{	
	// Call base draw
	Structure.prototype.draw.call(this);
}

// HELPERS

Solar.prototype.createComponents = function()
{
	this.m_liComponents = new Array();
	
	this.m_liComponents.push(new SolarPanelSmall(this, -50, -50, 0, 0.5));
	
	//this.m_liComponents.push(new EnergyBar(this, -50, 0, 2));
	//this.m_liComponents.push(new MetalBar(this, 50, 0, 2));
}