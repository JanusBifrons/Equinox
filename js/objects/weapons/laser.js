Laser.prototype = new GameObject();
Laser.prototype.constructor = Laser;

function Laser(owner, x, y, rotation, sector)
{	
	// Call base initialize
	GameObject.prototype.initialize.call(this, "Laser", "Weapon", 0, sector, x, y, 0, 0, rotation, 0, 120, 50, 1);
	
	// Call base initialize stats
	GameObject.prototype.initializeStats.call(this, 0, 0, 0, 0, 250, 0);
	
	this.m_kOwner = owner;
	
	// Move in the direction we're facing!
	this.m_liMove[0] = Math.cos(this.m_iRotation) * this.m_iMaxSpeed;
	this.m_liMove[1] = Math.sin(this.m_iRotation) * this.m_iMaxSpeed;
}

Laser.prototype.update = function()
{	
	// Call base update
	GameObject.prototype.update.call(this);
	
	// Move in the direction we're facing!
	this.m_liMove[0] = Math.cos(this.m_iRotation) * this.m_iMaxSpeed;
	this.m_liMove[1] = Math.sin(this.m_iRotation) * this.m_iMaxSpeed;
}

Laser.prototype.draw = function()
{
	// Call base draw
	GameObject.prototype.draw.call(this);
}

// OVERRIDE EVENTS

Laser.prototype.onCollision = function(vector, otherObject)
{
	// Don't hit the ship this came from!
	if(this.m_kOwner.m_iID == otherObject.m_iID)
		return;
	
	if(!this.m_bIsAlive)
		return;
	
	var _damage = (150 / 1000) * m_fElapsedTime;
	
	otherObject.onHit(5);
	
	this.m_bIsAlive = false;
}

// OVERRIDE HELPERS

Laser.prototype.createComponents = function()
{	
	this.m_liComponents = new Array();
	
	this.m_liComponents.push(new RectHull(this, 0, 0, 0.25, 100, 10, 0));
}