Guardian.prototype = new Structure();
Guardian.prototype.constructor = Guardian;

function Guardian(x, y, team, sector)
{
	// Call base initialize
	GameObject.prototype.initialize.call(this, "Guardian", "Structure", team, sector, x, y, 0, 0, 0, 0.035, 50, 20, 0.06);
	
	// Call base initialize stats
	GameObject.prototype.initializeStats.call(this, 120, 75, 100, 100, 250, 100);
	
	// Call base initialize resources
	Structure.prototype.initializeResources.call(this, 1000, 0, false, 650);
	
	// Fill metal
	this.m_iMetalStored = 650;
	
	// Call base initialize flags
	Structure.prototype.initializeFlags.call(this, true, true, false);
	
	this.m_iMaxConnections = 1;
	
	// Construction
	this.m_iMetalRequired = 50;
	
	// Pathfinding
	this.m_liSiblings = new Array();
	this.m_liRoutes = new Array();
	
	// Local Variables
	var _beams = new Array();
	var _beam1 = new MediumBeam(this, 0, 0, 0, Math.PI * 2);
	_beams.push(_beam1);
	
	this.m_liWeapons = new Array();
	this.m_liWeapons.push(_beams);
	
	console.log("Initialized Guardian structure successfully.");
}

Guardian.prototype.update = function()
{	
	// Call base update
	Structure.prototype.update.call(this);
	
	this.setTargets();
	
	if(this.m_iPowerStored < this.m_iPowerStoreMax)
	{
		// Get some metal!
		if(Structure.prototype.onRequest.call(this, new Request(this, 0, 1)))
		{	
			this.m_iPowerStored += 1;
		}	
	}	
	

}

Guardian.prototype.draw = function()
{
	// Call base draw
	Structure.prototype.draw.call(this);
}

// HELPERS

Guardian.prototype.createComponents = function()
{
	this.m_liComponents = new Array();
	
	// Components
	this.m_liComponents.push(new HexHull(this, 0, 0, 0.25));
}

Guardian.prototype.setTargets = function()
{
	this.m_liTargets = new Array();
	
	for(var i = 0; i < this.m_kSector.m_liShips.length; i++)
	{
		var _ship = this.m_kSector.m_liShips[i];
		
		if(_ship.m_iTeam != this.m_iTeam)
		{
			this.onTarget(_ship);
		}
	}
}