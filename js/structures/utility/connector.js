Connector.prototype = new Structure();
Connector.prototype.constructor = Connector;

function Connector(x, y, sector)
{
	// Call base initialize
	GameObject.prototype.initialize.call(this, "Connector", "Structure", 0, sector, x, y, 0, 0, 0, 0.035, 25, 20, 0);
	
	// Call base initialize stats
	GameObject.prototype.initializeStats.call(this, 0, 0, 0, 0, 250, 100);
	
	// Call base initialize resources
	Structure.prototype.initializeResources.call(this, 0, 0, false, 0);
	
	// Call base initialize flags
	Structure.prototype.initializeFlags.call(this, false, true, true);
	
	this.m_iMaxConnections = 6;
	
	// Construction
	this.m_iMetalRequired = 5;
	
	// Pathfinding
	this.m_liSiblings = new Array();
	this.m_liRoutes = new Array();
	
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


// HELPERS

Connector.prototype.createComponents = function()
{
	this.m_liComponents = new Array();
	
	// Components
	this.m_liComponents.push(new HexHull(this, 0, 0, 0.1));
}

