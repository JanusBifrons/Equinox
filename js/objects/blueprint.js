Blueprint.prototype = new GameObject();
Blueprint.prototype.constructor = Blueprint;

function Blueprint(x, y, sector)
{
	// Call base initialize
	GameObject.prototype.initialize.call(this, "Blueprint", "Blueprint", 0, sector, x, y, 0, 0, 0, 0, 50, 5, 0.06);
	
	// Call base initialize stats
	GameObject.prototype.initializeStats.call(this, 0, 0, 0, 0, 250, 0);
	
	console.log("Initialized Blueprint successfully.");
}

Blueprint.prototype.update = function()
{	
	// Call base update
	GameObject.prototype.update.call(this);
}

Blueprint.prototype.draw = function()
{
	// Call base draw
	GameObject.prototype.draw.call(this);
}

// HELPERS

Blueprint.prototype.createComponents = function()
{
	this.m_liComponents = new Array();
	
}