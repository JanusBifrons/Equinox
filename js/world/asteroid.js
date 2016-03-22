Asteroid.prototype = new GameObject();
Asteroid.prototype.constructor = Asteroid;

function Asteroid(x, y, radius, sector)
{
	// Call base initialize
	GameObject.prototype.initialize.call(this, "Asteroid", "Asteroid", 0, sector, x, y, 0, 0, 0, 0, radius, 0, 1.06);
	
	// Call base initialize stats
	GameObject.prototype.initializeStats.call(this, 0, 0, 0, 0, 250000, 0);
	
	console.log("Initialized Asteroid successfully.");
}

Asteroid.prototype.update = function()
{	
	// Call base update
	GameObject.prototype.update.call(this);
}

Asteroid.prototype.draw = function()
{
	// Call base draw
	GameObject.prototype.draw.call(this);
}

// HELPERS

Asteroid.prototype.createComponents = function()
{	
	this.m_liComponents = new Array();
	
	// Components
	this.m_liComponents.push(new Roid(this, 0, 0, 1));
}














