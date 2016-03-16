Assembler.prototype = new Structure();
Assembler.prototype.constructor = Assembler;

function Assembler(x, y)
{
	// Call base initialize
	Structure.prototype.initialize.call(this, 52, "Assembler", x, y, 300);
	
	// Call base initialize stats
	Structure.prototype.initializeStats.call(this, 120, 100, 250, 120, 250, 120);
	
	// Call base initialize resources
	Structure.prototype.initializeResources.call(this, 10, 0);
	
	// Call base initialize flags
	Structure.prototype.initializeFlags.call(this, false, true, true);
	
	// Build cost
	this.m_iMetalRequired = 75;
	
	// Number of connections
	this.m_iMaxConnections = 1;
	
	console.log("Initialized Assembler structure successfully.");
}

Assembler.prototype.update = function()
{		
	// Call base update
	Structure.prototype.update.call(this);
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
}