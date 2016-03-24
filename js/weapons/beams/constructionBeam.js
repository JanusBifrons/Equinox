ConstructionBeam.prototype = new Beam();
ConstructionBeam.prototype.constructor = ConstructionBeam;

function ConstructionBeam(owner, offsetX, offsetY, minRotation, maxRotation)
{
	// Call base initialize
	Weapon.prototype.initialize.call(this, owner, offsetX, offsetY, minRotation, maxRotation, 0.015, 500, 0);
	
	// Override colour
	this.m_cColour = 'brown';
	
	console.log("Construction Beam initialised successfully.");
}

ConstructionBeam.prototype.update = function()
{	
	// Call base update
	Weapon.prototype.update.call(this);
}

ConstructionBeam.prototype.draw = function()
{			
	// Call base draw
	Weapon.prototype.draw.call(this);
}

// OVERRIDES

ConstructionBeam.prototype.onHit = function(targetHit)
{
	targetHit.onRepair(0.0001);
}