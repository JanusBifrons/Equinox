MediumLaser.prototype = new GameObject();
MediumLaser.prototype.constructor = MediumLaser;

function MediumLaser(owner, x, y, rotation, sector)
{	
	// Call base initialize
	GameObject.prototype.initialize.call(this, "Laser", "Weapon", 0, sector, x, y, 0, 0, rotation, 0, 120, 30, 1);
	
	// Call base initialize stats
	GameObject.prototype.initializeStats.call(this, 0, 0, 0, 0, 250, 0);
	
	this.m_kOwner = owner;
	
	// Move in the direction we're facing!
	this.m_liMove[0] = Math.cos(this.m_iRotation) * this.m_iMaxSpeed;
	this.m_liMove[1] = Math.sin(this.m_iRotation) * this.m_iMaxSpeed;
}

MediumLaser.prototype.update = function()
{	
	// Call base update
	GameObject.prototype.update.call(this);
	
	// Move in the direction we're facing!
	this.m_liMove[0] = Math.cos(this.m_iRotation) * this.m_iMaxSpeed;
	this.m_liMove[1] = Math.sin(this.m_iRotation) * this.m_iMaxSpeed;
}

MediumLaser.prototype.draw = function()
{
	// Call base draw
	GameObject.prototype.draw.call(this);
}

// OVERRIDE EVENTS

MediumLaser.prototype.onCollision = function(vector, otherObject)
{
	// Don't hit the ship this came from!
	if(this.m_kOwner.m_iID == otherObject.m_iID)
		return;
	
	if(!this.m_bIsAlive)
		return;
	
	otherObject.onHit(150);
	
	this.m_bIsAlive = false;
	
	m_kLog.addItem("Laser hit " + otherObject.m_iID, 1000, 255, 255, 255);
}

// OVERRIDE HELPERS

MediumLaser.prototype.createComponents = function()
{	
	this.m_liComponents = new Array();
	
	this.m_liComponents.push(new RectHull(this, 0, 0, 1, 100, 10, 0));
}