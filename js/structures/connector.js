Connector.prototype = new Structure();
Connector.prototype.constructor = Connector;

function Connector(x, y)
{
	this.m_iType = 1;
	
	// ID
	this.m_iID = guid();
	this.m_bNeedsTeam = false;
	this.m_iTeam = 0;

	this.m_liPos = new Array();
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	this.m_iRadius = 6;
	
	this.m_iMaxConnections = 6;
	
	// Stats
	this.m_iShieldRegenCap = 0;
	this.m_iShieldCap = 0;
	this.m_iArmourCap = 0;
	this.m_iArmourRegen = 0;
	this.m_iHullCap = 250;
	this.m_iHullRegen = 0;
	
	// Collision Detection
	this.m_liShields = new Array();
	
	// Construction
	this.m_iMetalRequired = 5;
	
	this.m_iID = guid();
	
	// Drawing
	this.m_iR = 128;
	this.m_iG = 128;
	this.m_iB = 128;
	this.m_iA = 255;
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
	
	// Components
	this.m_liComponents = new Array();
	this.m_liComponents.push(new HexHull(this, 0, 0, 0.1));
	
	console.log("Initialized Connector structure successfully.");
}

Connector.prototype.update = function()
{	
	// Call base update
	Structure.prototype.update.call(this);
}

Connector.prototype.draw = function()
{	
	// Call base draw
	Structure.prototype.draw.call(this);
}