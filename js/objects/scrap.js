Scrap.prototype = new GameObject();
Scrap.prototype.constructor = Scrap;

function Scrap(component, moveX, moveY)
{
	this.m_kComponent = component;
	
	var _sector = this.m_kComponent.m_kOwner.m_kSector;
	var _x = this.m_kComponent.m_kOwner.m_liPos[0] + this.m_kComponent.m_liOffset[0];
	var _y = this.m_kComponent.m_kOwner.m_liPos[1] + this.m_kComponent.m_liOffset[1];
	var _team = this.m_kComponent.m_kOwner.m_iTeam;
	
	// Reinitialize component
	this.m_kComponent.initialize(this, 0, 0, this.m_kComponent.m_fScale, this.m_kComponent.m_bMirror);
	
	// Call base initialize
	GameObject.prototype.initialize.call(this, "Scrap", "Scrap", _team, _sector, _x, _y, moveX, moveY, 0, 0, 50, 5, 0.009);
	
	// Call base initialize stats
	GameObject.prototype.initializeStats.call(this, 0, 0, 0, 0, 10, 0);
	
	console.log("Initialized Asteroid successfully.");
}

Scrap.prototype.update = function()
{	
	// Call base update
	GameObject.prototype.update.call(this);
	
	this.m_kComponent.update();
}

Scrap.prototype.draw = function()
{
	// Call base draw
	GameObject.prototype.draw.call(this);
}

// EVENT OVERRIDE

Scrap.prototype.onHit = function(damage)
{
	// Call base onHit
	if(GameObject.prototype.onHit.call(this, damage))
	{
		this.m_bIsAlive = false;
	}
}

// HELPERS

Scrap.prototype.createComponents = function()
{
	this.m_liComponents = new Array();
	
	this.m_liComponents.push(this.m_kComponent);
}