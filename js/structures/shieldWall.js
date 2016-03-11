ShieldWall.prototype = new Structure();
ShieldWall.prototype.constructor = ShieldWall;

function ShieldWall(x, y)
{
	this.m_iType = 420;
	
	// ID
	this.m_iID = guid();
	this.m_bNeedsTeam = false;
	this.m_iTeam = 0;

	this.m_liPos = new Array();
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	this.m_iRadius = 25;
	
	this.m_iMaxConnections = 3;
	
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
	this.m_iR = 255;
	this.m_iG = 255;
	this.m_iB = 255;
	this.m_iA = 255;
		
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
	
	// Components
	this.m_liComponents = new Array();
	this.m_liComponents.push(new HexHull(this, 0, 0, 0.15));
	
	console.log("Initialized ShieldWall structure successfully.");
}

ShieldWall.prototype.update = function()
{	
	// Call base update
	Structure.prototype.update.call(this);
}

ShieldWall.prototype.draw = function()
{	
	this.m_cPrimaryColour = concatenate(255, 0, 0, 255);

	// Call base draw
	Structure.prototype.draw.call(this);
}

ShieldWall.prototype.onPlace = function()
{
	// Call base function
	var _result = Structure.prototype.onPlace.call(this);
	
	// Loop through all siblings
	for(var i = 0; i < this.m_liSiblings.length; i++)
	{
		// If a sibling is also a shield wall...
		if(this.m_liSiblings[i].m_iType == 420)
		{			
			// Add a shield wall component stretching from yourself to the other wall
			this.m_liComponents.push(new ShieldLine(this, 0, 0, 1, this.m_liSiblings[i].m_liPos[0], this.m_liSiblings[i].m_liPos[1]));	
		}
	}
	
	return _result;
}

// HELPERS

ShieldWall.prototype.onRequest = function(request)
{	
	return Structure.prototype.onRequest.call(this, request);
}

ShieldWall.prototype.onHitDrain = function(damage)
{	
	if(Structure.prototype.onRequest.call(this, new Request(this, 0, 9)))
	{
	}
	else
	{
		m_kLog.addStaticItem("Not enough power!");	
		
		m_kLog.addStaticItem(m_kPathfinder.m_kRequestResult.m_iAmount);	
	}
}