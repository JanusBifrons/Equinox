LightLauncher.prototype = new Launcher();
LightLauncher.prototype.constructor = LightLauncher;

function LightLauncher(owner, offsetX, offsetY, minRotation, maxRotation)
{
	// Call base initialize
	//Weapon.prototype.initialize.call(this, owner, offsetX, offsetY, minRotation, maxRotation, 0.015, 1500, 1, 0.2);
	Weapon.prototype.initialize.call(this, owner, offsetX, offsetY, minRotation, maxRotation, 0.0005, 1500, 5, 0.5);
	
	console.log("Light Launcher initialised successfully.");
}

LightLauncher.prototype.update = function()
{	
	// Call base update
	Launcher.prototype.update.call(this);
}

LightLauncher.prototype.draw = function()
{			
	// Call base draw
	Launcher.prototype.draw.call(this);
}

// OVERRIDE EVENTS

LightLauncher.prototype.onFire = function()
{
	// Call base fire
	Launcher.prototype.onFire.call(this);
	
	if(this.m_bIsFiring)
	{		
		if(this.m_kOwner.m_liTargets.length > 0)
		{
			m_kObjectFactory.createLightMissile(this);
		}
	}
}