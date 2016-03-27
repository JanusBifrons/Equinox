TractorBeam.prototype = new Beam();
TractorBeam.prototype.constructor = TractorBeam;

function TractorBeam(owner, offsetX, offsetY, minRotation, maxRotation)
{
	// Call base initialize
	Weapon.prototype.initialize.call(this, owner, offsetX, offsetY, minRotation, maxRotation, 0.015, 2000, 0, 0);
	
	// Override colour
	this.m_cColour = 'lightgreen';
	
	console.log("Tractor Beam initialised successfully.");
}

TractorBeam.prototype.update = function()
{	
	// Call base update
	Weapon.prototype.update.call(this);
}

TractorBeam.prototype.draw = function()
{			
	// Call base draw
	Weapon.prototype.draw.call(this);
}

// OVERRIDES

TractorBeam.prototype.onHit = function(targetHit)
{
	targetHit.onTractor(this.m_liPos[0], this.m_liPos[1]);
}