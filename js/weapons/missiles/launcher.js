Launcher.prototype = new Weapon();
Launcher.prototype.constructor = Launcher;

function Launcher(owner, offsetX, offsetY, minRotation, maxRotation)
{	
	console.log("Launcher initialised successfully.");
}

Launcher.prototype.update = function()
{	
	// Call base update
	Weapon.prototype.update.call(this);
}

Launcher.prototype.draw = function()
{			
	// Call base draw
	Weapon.prototype.draw.call(this);
}

// EVENT OVERRIDES

Launcher.prototype.onFire = function()
{
	// Call base fire
	Weapon.prototype.onFire.call(this);
}

Launcher.prototype.onHit = function(targetHit)
{
	m_kLog.addItem("Launcher base class being called... this should never happen!", 5000, 255, 255, 255);
}

