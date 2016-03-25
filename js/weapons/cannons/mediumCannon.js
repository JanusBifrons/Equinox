MediumCannon.prototype = new Cannon();
MediumCannon.prototype.constructor = MediumCannon;

function MediumCannon(owner, offsetX, offsetY, minRotation, maxRotation)
{
	// Call base initialize
	Weapon.prototype.initialize.call(this, owner, offsetX, offsetY, minRotation, maxRotation, 0.015, 5000, 1, 1);
	
	console.log("Medium Cannon initialised successfully.");
}

MediumCannon.prototype.update = function()
{	
	// Call base update
	Cannon.prototype.update.call(this);
}

MediumCannon.prototype.draw = function()
{			
	// Call base draw
	Cannon.prototype.draw.call(this);
}

// OVERRIDE EVENTS

MediumCannon.prototype.onFire = function()
{
	// Call base fire
	Cannon.prototype.onFire.call(this);
	
	if(this.m_bIsFiring)
	{		
		m_kObjectFactory.createMediumLaser(this);
	}
}

MediumCannon.prototype.drawWeapon = function()
{
	var _percent = 0;
	
	if(this.m_iCooldownTimer > 0)
	{
		_percent = this.m_iCooldownTimer / this.m_iCooldown;	
	}
	
	if(_percent > 1)
		_percent = 1;
	
	// Move screen to weapon location
	m_kContext.save();
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	// Rotate to players angle
	m_kContext.rotate(this.m_iRotation);
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'white';
	m_kContext.lineWidth = 1;
	
	// Base
	m_kContext.beginPath();
	m_kContext.arc(0, 0, 15, 0, 2 * Math.PI);
	m_kContext.closePath();
	m_kContext.fill();
	m_kContext.stroke();
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'black';
	m_kContext.lineWidth = 1;
	
	// Barrel
	m_kContext.beginPath();
	m_kContext.moveTo(0, -2.5);
	m_kContext.lineTo(0, 2.5);
	m_kContext.lineTo(10 + (40 * _percent), 2.5);
	m_kContext.lineTo(10 + (40 * _percent), -2.5);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	// Restore context back to default from relative to the ship
	m_kContext.restore();	
}