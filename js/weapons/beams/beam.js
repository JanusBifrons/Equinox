Beam.prototype = new Weapon();
Beam.prototype.constructor = Beam;

function Beam(owner, offsetX, offsetY, minRotation, maxRotation)
{	
	console.log("Beam initialised successfully.");
}

Beam.prototype.update = function()
{	
	// Call base update
	Weapon.prototype.update.call(this);
}

Beam.prototype.draw = function()
{			
	// Call base draw
	Weapon.prototype.draw.call(this);
}

// OVERRIDES

Beam.prototype.onDrain = function()
{
	var _drain = (this.m_iDrain / 1000) * m_fElapsedTime;
	
	if(this.m_kOwner.m_iPowerStored >= _drain)
	{
		this.m_kOwner.m_iPowerStored -= _drain;
		
		return true;
	}
	
	return false;
}

Beam.prototype.createCollision = function()
{
	var _x = this.m_liPos[0] + (this.m_iRange * Math.cos(this.m_iRotation));
	var _y = this.m_liPos[1] + (this.m_iRange * Math.sin(this.m_iRotation));
	
	// Collision Detection
	this.m_cdCollisionPolygon = new P(new V(0, 0), [new V(this.m_liPos[0], this.m_liPos[1]), new V(_x, _y)]);
}

// EVENTS

Beam.prototype.onHit = function(targetHit)
{
	m_kLog.addItem("Beam base class being called....", 5000, 255, 255, 255);
	
	//var _damage = (150 / 1000) * m_fElapsedTime;
	
	//targetHit.onHit(_damage);
}

