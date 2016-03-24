Cannon.prototype = new Weapon();
Cannon.prototype.constructor = Cannon;

function Cannon(owner, offsetX, offsetY, minRotation, maxRotation)
{	
	console.log("Cannon initialised successfully.");
}

Cannon.prototype.update = function()
{	
	// Call base update
	Weapon.prototype.update.call(this);
}

Cannon.prototype.draw = function()
{			
	// Call base draw
	Weapon.prototype.draw.call(this);
}

// EVENT OVERRIDES

Cannon.prototype.onFire = function()
{
	// Call base fire
	Weapon.prototype.onFire.call(this);
}

Cannon.prototype.onHit = function(targetHit)
{
	m_kLog.addItem("Cannon base class being called... this should never happen!", 5000, 255, 255, 255);
}

