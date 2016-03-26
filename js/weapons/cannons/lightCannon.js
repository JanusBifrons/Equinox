LightCannon.prototype = new Cannon();
LightCannon.prototype.constructor = LightCannon;

function LightCannon(owner, offsetX, offsetY, minRotation, maxRotation)
{
	// Call base initialize
	//Weapon.prototype.initialize.call(this, owner, offsetX, offsetY, minRotation, maxRotation, 0.015, 1500, 1, 0.2);
	Weapon.prototype.initialize.call(this, owner, offsetX, offsetY, minRotation, maxRotation, 0.015, 1500, 1, 1);
	
	console.log("Light Cannon initialised successfully.");
}

LightCannon.prototype.update = function()
{	
	// Call base update
	Cannon.prototype.update.call(this);
}

LightCannon.prototype.draw = function()
{			
	// Call base draw
	Cannon.prototype.draw.call(this);
}

// OVERRIDE EVENTS

LightCannon.prototype.onFire = function()
{
	// Call base fire
	Cannon.prototype.onFire.call(this);
	
	if(this.m_bIsFiring)
	{		
		m_kObjectFactory.createLightLaser(this);
	}
}