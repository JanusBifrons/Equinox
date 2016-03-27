LightMissile.prototype = new GameObject();
LightMissile.prototype.constructor = LightMissile;

function LightMissile(owner, x, y, rotation, sector)
{	
	// Call base initialize
	//GameObject.prototype.initialize.call(this, "Missile", "Weapon", 0, sector, x, y, 0, 0, rotation, 1, 5, 5, 1);
	GameObject.prototype.initialize.call(this, "Missile", "Weapon", 0, sector, x, y, 0, 0, rotation, 0.035, 60, 15, 1);
	//GameObject.prototype.initialize.call(this, "Missile", "Weapon", 0, sector, x, y, 0, 0, rotation, 0.035, 60, 8, 0.015);
	
	// Call base initialize stats
	GameObject.prototype.initializeStats.call(this, 0, 0, 0, 0, 250, 0);
	
	this.m_kOwner = owner;
	
	// Move in the direction we're facing!
	this.m_liMove[0] = Math.cos(this.m_iRotation) * (this.m_iMaxSpeed * 1.5);
	this.m_liMove[1] = Math.sin(this.m_iRotation) * (this.m_iMaxSpeed * 1.5);
	
	this.m_bInertialDampeners = false;
	
	this.m_iLife = 3000;
	this.m_iLifeTimer = 0;
}

LightMissile.prototype.update = function()
{	
	// Call base update
	GameObject.prototype.update.call(this);
	
	this.m_iLifeTimer += m_fElapsedTime;
	
	if(this.m_iLifeTimer > this.m_iLife)
		this.m_bIsAlive = false;
	
	if(this.m_kOwner.m_liTargets.length > 0)
	{
		var _target = this.m_kOwner.m_liTargets[0].m_kTarget;
	
		var _x = _target.m_liPos[0] - this.m_liPos[0];
		var _y =  _target.m_liPos[1] - this.m_liPos[1];
	
		var _rotation = Math.atan2(_y, _x);
		
		this.m_iRotation = turnToFace(this.m_liPos[0], this.m_liPos[1], _target.m_liPos[0], _target.m_liPos[1], this.m_iRotation, this.m_iRotationSpeed);
	
		//this.m_iRotation = _rotation;
	}
		
	
	this.accellerate();
}

LightMissile.prototype.draw = function()
{
	// Call base draw
	GameObject.prototype.draw.call(this);
}

// OVERRIDE EVENTS

LightMissile.prototype.onCollision = function(vector, otherObject)
{
	// Don't hit the ship this came from!
	if(this.m_kOwner.m_iID == otherObject.m_iID)
		return;
	
	if(!this.m_bIsAlive)
		return;
	
	otherObject.onHit(200);
	
	this.m_bIsAlive = false;
}

// OVERRIDE HELPERS

LightMissile.prototype.createComponents = function()
{	
	this.m_liComponents = new Array();
	
	this.m_liComponents.push(new RectHull(this, 0, 0, 1, 50, 10, 0));
	//this.m_liComponents.push(new ShortPillar(this, 0, 0, 1));
}