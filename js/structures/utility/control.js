Control.prototype = new Structure();
Control.prototype.constructor = Control;

function Control(x, y, team, sector)
{
	// Call base initialize
	GameObject.prototype.initialize.call(this, "Control Tower", "Structure", team, sector, x, y, 0, 0, 0, 0.035, 300, 20, 0);
	
	// Call base initialize stats
	GameObject.prototype.initializeStats.call(this, 120, 75, 100, 100, 250, 100);
	
	// Call base initialize resources
	Structure.prototype.initializeResources.call(this, 0, 10, true, 650);
	
	// Fill metal
	this.m_iMetalStored = 650;
	
	// Call base initialize flags
	Structure.prototype.initializeFlags.call(this, false, true, true);
	
	this.m_iMaxConnections = 25;
	
	// Construction
	this.m_iMetalRequired = 1000;
	
	// Pathfinding
	this.m_liSiblings = new Array();
	this.m_liRoutes = new Array();
	
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

// HELPERS

Control.prototype.createComponents = function()
{
	this.m_liComponents = new Array();
	
	// Components
	this.m_liComponents.push(new HexHull(this, 0, 0, 2.5));
	this.m_liComponents.push(new EnergyBar(this, -50, 0, 2));
	this.m_liComponents.push(new MetalBar(this, 50, 0, 2));
}















