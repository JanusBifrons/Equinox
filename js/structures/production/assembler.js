Assembler.prototype = new Structure();
Assembler.prototype.constructor = Assembler;

function Assembler(x, y, sector)
{
		// Call base initialize
	GameObject.prototype.initialize.call(this, "Assembler", "Structure", 0, sector, x, y, 0, 0, 0, 0.035, 275, 20, 0);
	
	// Call base initialize stats
	GameObject.prototype.initializeStats.call(this, 120, 100, 250, 120, 250, 120);
	
	// Call base initialize resources
	Structure.prototype.initializeResources.call(this, 1000, 0, false, 0);
	
	// Call base initialize flags
	Structure.prototype.initializeFlags.call(this, false, true, true);
	
	this.m_iMaxConnections = 1;
	
	// Construction
	this.m_iMetalRequired = 75;
	
	// Pathfinding
	this.m_liSiblings = new Array();
	this.m_liRoutes = new Array();
	
	// Local variables
	this.m_iCurrentDrain = 0;
	
	//this.m_kCargoHold.onStore(new Scrap(new RearWing(this, -30, -12, 1, false), 0, 0));
	
	console.log("Initialized Assembler structure successfully.");
}

Assembler.prototype.update = function()
{		
	// Call base update
	Structure.prototype.update.call(this);
	
	if(this.m_iPowerStored < this.m_iPowerStoreMax)
	{
		// Get some metal!
		if(Structure.prototype.onRequest.call(this, new Request(this, 0, 1)))
		{	
			this.m_iPowerStored += 1;
		}	
	}	
}

Assembler.prototype.draw = function()
{	
	// Call base draw
	Structure.prototype.draw.call(this);
}

// HELPERS

Assembler.prototype.createComponents = function()
{
	this.m_liComponents = new Array();
	
	this.m_liComponents.push(new RectHull(this, 0, 0, 1, 350, 400, 15));
	this.m_liComponents.push(new StatusBar(this, 50, -125, 0.75));
	
	this.m_liComponents.push(new CargoWindow(this, 0, 0, 1));
}