LightBeam.prototype = new Beam();
LightBeam.prototype.constructor = LightBeam;

function LightBeam(owner, offsetX, offsetY, minRotation, maxRotation)
{
	// Call base initialize
	Weapon.prototype.initialize.call(this, owner, offsetX, offsetY, minRotation, maxRotation, 0.015, 500, 15, 0);
	
	console.log("Beam initialised successfully.");
}

LightBeam.prototype.update = function()
{	
	// Call base update
	Beam.prototype.update.call(this);
}

LightBeam.prototype.draw = function()
{			
	// Call base draw
	Beam.prototype.draw.call(this);
}

// OVERRIDES

LightBeam.prototype.onHit = function(targetHit)
{
	var _damage = (150 / 1000) * m_fElapsedTime;
	
	targetHit.onHit(_damage);
}