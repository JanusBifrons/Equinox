Ship.prototype = new GameObject();
Ship.prototype.constructor = Ship;

function Ship()
{
	this.m_sDebug = "This is a ship class.";
	this.m_eObjectType = "Ship";
	
	this.m_kOwner;
	
	// Construction
	this.m_bIsConstructed = true;	// Cannot construct ships at the moment!
	this.m_iMetalRequired = 1000; // DEBUG VALUE FOR DEFAULT! THIS IS NOT USED PRESENTLY
	
	// Movement Variables
	this.m_bIsAfterburning = false;
	
	// Resource
	this.m_iPowerRegen = 0;
	this.m_iPowerStored = 0;
	this.m_iPowerCap = 0;
	
	// Weapons
	this.m_liWeapons = new Array();
	this.m_liTargets = new Array();
	this.m_iWeaponSelected = 0;
	
	// Hyper Drive
	this.m_iHyperTarget = 0;
	this.m_bIsHypering = false;
	this.m_iHyperCharge = 0;
	this.m_iHyperChargeMax = 0; // Milliseconds
	
	// Ship cargo
	this.m_bDrawCargo = false;
	this.m_kCargoHold = new Cargo(0);
	
	// Drawing
	this.m_bIsSelected = false;
	this.m_bDrawShield = false;
	
	console.log("Initialized ship successfully.");
}

Ship.prototype.update = function()
{	
	this.m_kCargoHold.update();

	// Update targets
	this.updateTargets();
	
	// Update shield draw timer
	this.updateTimer();
	
	// Loop through all weapons
	for(var i = 0; i < this.m_liWeapons.length; i++)
	{	
		// To increase readability
		var _weapons = this.m_liWeapons[i];
	
		// Loop through weapon set
		for(var j = 0; j < _weapons.length; j++)
		{				
			// Update!
			_weapons[j].update();
		}
	}
	
	// Check if charging Hyper Drive
	if(this.m_bIsHypering)
	{
		// Charge Hyper Drive
		this.m_iHyperCharge += m_fElapsedTime;
		
		// Jump if charged!
		if(this.m_iHyperCharge >= this.m_iHyperChargeMax)
		{
			// Jump!
			this.onHyper();
		}
	}
	
	// Call base update
	GameObject.prototype.update.call(this);
}

Ship.prototype.draw = function()
{
	// Call base draw
	GameObject.prototype.draw.call(this);
	
	// Loop through all weapons
	for(var i = 0; i < this.m_liWeapons.length; i++)
	{	
		// To increase readability
		var _weapons = this.m_liWeapons[i];
	
		// Loop through weapon set
		for(var j = 0; j < _weapons.length; j++)
		{				
			// Draw!
			_weapons[j].draw();
		}
	}
	
	this.drawBody();
}

// OVERRRIDE EVENTS


Ship.prototype.onHit = function(damage)
{
	if(GameObject.prototype.onHit.call(this, damage))
	{		
		this.onDestroy(0);
	}
}

// EVENTS

Ship.prototype.onTarget = function(object)
{
	// Check to see if object is already a target!
	for(var i = 0; i < this.m_liTargets.length; i++)
	{
		if(this.m_liTargets[i].m_kTarget.m_iID == object.m_iID)
		{
			return;
		}
	}
	
	this.m_liTargets.push(new TargetObject(this, object, false));
}

Ship.prototype.onRecharge = function(power)
{
	this.m_iPowerStored += power;
}

Ship.prototype.onTeleport = function(x, y)
{
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
}

Ship.prototype.onFire = function()
{
	// Do nothing if ship is destroyed
	if(!this.m_bIsAlive)
		return;
	
	// Retreive selected weapon set
	var _weapons = this.m_liWeapons[this.m_iWeaponSelected];
	
	// Loop through all weapons in set
	for(var j = 0; j < _weapons.length; j++)
	{
		// FIRE!!
		_weapons[j].onFire();
	}
}

Ship.prototype.onHyperCharge = function()
{
	this.m_bIsHypering = true;
}

Ship.prototype.onHyper = function()
{
	// Reset charge
	this.m_iHyperCharge = 0;
	
	// Remove ship from the sector they just left
	this.m_kSector.removeShip(this);
			
	// Let the district handle informing the new sector
	this.m_kSector.m_kDistrict.onHyper(this);
	
	// Set hypering to false so we know we aren't charging
	this.m_bIsHypering = false;
}

Ship.prototype.onHyperEnd = function(sector)
{
	this.m_kSector = sector;
}

Ship.prototype.onDestroy = function(reason)
{			

	// If you remove this then onDestroy is called a million times
	// and bad stuff happens
	if(!this.m_bIsAlive)
		return;

	// Destroy player
	this.m_bIsAlive = false;
	
	// Ask for respawn
	//this.m_kSector.requestRespawn(this);
	
	this.m_kSector.createScrap(this);
	
	// Cause an explosion!
	m_kCollisionManager.onExplosion(this, this.m_kSector.m_liShips);
	
	// Announce to console why you died
	switch(reason)
	{
		case 0:
			m_kLog.addItem("Ship was destroyed by weapons fire!", 2500, 255, 255, 255);
			break;
	}
}

// ABSTRACT

Ship.prototype.createComponents = function()
{
}

// HELPERS

Ship.prototype.updateTargets = function()
{
	var _index = -1;
	
	// Update targets
	for(var i = 0; i < this.m_liTargets.length; i++)
	{
		this.m_liTargets[i].update();
		
		if(!this.m_liTargets[i].m_kTarget.m_bIsAlive)
		{
			_index = i;
		}
	}
	
	if(_index > -1)
		this.m_liTargets.splice(_index, 1);
}

Ship.prototype.setPrimaryTarget = function(target)
{
	this.m_kOwner.selectObject(target.m_kTarget);
	
	var _targets = this.m_liTargets;
	
	for(var i = 0; i < _targets.length; i++)
		if(_targets[i].m_kTarget.m_iID == target.m_kTarget.m_iID)
			_targets[i].m_bIsPrimary = true;
		else
			_targets[i].m_bIsPrimary = false;
}

Ship.prototype.drawTargets = function(x, y, size, padding)
{
	for(var i = 0; i < this.m_liTargets.length; i++)
	{
		// Make rows so the targets dont fall off the bottom of the screen
		if(y > (m_kCanvas.height * 0.9))
		{
			x -= size + padding;
			y = padding;
		}
		
		y = this.m_liTargets[i].draw(x, y, size, padding);
	}
}

// This function is called by the player and not this class!
Ship.prototype.drawStats = function()
{
	// Used for drawing
	var _shieldPercent = (this.m_iShields / this.m_iShieldCap) * 100;
	var _armourPercent = (this.m_iArmour / this.m_iArmourCap) * 100;
	var _hullPercent = (this.m_iHull / this.m_iHullCap) * 100;
	var _powerPercent = (this.m_iPowerStored / this.m_iPowerCap) * 100;
	
	// Hyper Bar
	if(this.m_bIsHypering)
	{
		var _hyperPercent = (this.m_iHyperCharge / this.m_iHyperChargeMax) * 100;
	
		this.drawNewStatBar(_hyperPercent, 100, 'purple');
	}

	// Draw the stat bars
	this.drawNewStatBar(_shieldPercent, 80, 'blue');
	this.drawNewStatBar(_armourPercent, 60, 'grey');
	this.drawNewStatBar(_hullPercent, 40, 'brown');       
	this.drawNewStatBar(_powerPercent, 20, 'yellow');
	
	var _x = (m_kCanvas.width / 2) - 100;
	var _y = m_kCanvas.height - 30;
	var _speedPercent = this.m_iSpeed / this.m_iMaxSpeed;
	
	// Draw the speed
	m_kContext.lineWidth = 2;
	m_kContext.fillStyle = 'white';
	
	// Border and Background
	m_kContext.fillStyle = 'white';
	m_kContext.fillRect(_x, _y, 200, 25);
	
	m_kContext.fillStyle = 'black';
	m_kContext.fillRect(_x + 2, _y + 2, 194, 21);
	
	m_kContext.fillStyle = 'purple';
	m_kContext.fillRect(_x + 2, _y + 2, 194 * _speedPercent, 21);
	
	var _roundedSpeed = Math.round(this.m_iSpeed * 100) / 100;
	
	m_kContext.fillStyle = 'white';
	m_kContext.font="10px Verdana";
	m_kContext.fillText(_roundedSpeed + " M/S", _x + 90, _y + 15);			
}

Ship.prototype.drawNewStatBar = function(percent, radius, colour)
{
	var _x = m_kCanvas.width / 2;
	var _y = m_kCanvas.height - 30;
	
	m_kContext.lineWidth = 23;
	m_kContext.strokeStyle = 'white';
	
	// Border
	m_kContext.beginPath();
	m_kContext.arc(_x, _y, radius, Math.PI, Math.PI * 2);
	m_kContext.stroke();
	m_kContext.closePath();
	
	m_kContext.lineWidth = 20;
	m_kContext.strokeStyle = 'black';
	
	// Background
	m_kContext.beginPath();
	m_kContext.arc(_x, _y, radius, Math.PI, Math.PI * 2);
	m_kContext.stroke();
	m_kContext.closePath();
	
	// Stat
	m_kContext.lineWidth = 20;
	m_kContext.strokeStyle = colour;
	m_kContext.beginPath();
	m_kContext.arc(_x, _y, radius, Math.PI, Math.PI + (Math.PI * (percent / 100)));
	m_kContext.stroke();
	m_kContext.closePath();
}

// This function is called by the player and not this class!
Ship.prototype.drawWeaponList = function()
{
	var _x = m_kCanvas.width - (m_kCanvas.width * 0.2);
	var _y = m_kCanvas.height - 100;
	var _text = "";
	
	m_kContext.font = "14px Verdana";

	for(var i = 0; i < this.m_liWeapons.length; i++)
	{
		if(this.m_iWeaponSelected == i)
		{
			m_kContext.fillStyle = 'green';
		}
		else
		{
			m_kContext.fillStyle = 'red';
		}
	
		var _weapons = this.m_liWeapons[i];
	
		_text = (i + 1) + ": ";
		_text += _weapons.length + " x ";
	
		for(var j = 0; j < 1; j++)
		{
			_text += _weapons[j].m_sDescription;
		
			m_kContext.fillText(_text, _x, _y);			
		}
		
		_y += 20;
	}
	
	m_kContext.font = "8px Verdana";
}

Ship.prototype.createComponents = function()
{
	// This is a holder and is always overwritten!
}

Ship.prototype.updateTimer = function()
{
	if(this.m_iTimeSinceLastHit < 5000)
	{
		this.m_iTimeSinceLastHit += m_fElapsedTime;
		
		this.m_bDrawShield = true;
	}
	else
	{
		this.m_bDrawShield = false;
	}
}



// Returns a list of all currently firing weapons
// for collision detection
Ship.prototype.activeWeapons = function()
{
	var _activeWeapons = new Array();
	
	// Loop through all weapons
	for(var i = 0; i < this.m_liWeapons.length; i++)
	{	
		// To increase readability
		var _weapons = this.m_liWeapons[i];
	
		// Loop through weapon set
		for(var j = 0; j < _weapons.length; j++)
		{
			// Only certain types of weapons!
			if(_weapons[j].m_iType == 1 || _weapons[j].m_iType == 2)
			{					
				// Has to be currently firing!
				if(_weapons[j].m_bIsFiring)
				{
					// Add to list!
					_activeWeapons.push(_weapons[j]);
				}
			}
		}
	}
	
	return _activeWeapons;
}

// INPUT ACCESSORS

Ship.prototype.accellerate = function()
{
	this.m_liMove[0] += Math.cos(this.m_iRotation) * this.m_iAccel;
	this.m_liMove[1] += Math.sin(this.m_iRotation) * this.m_iAccel;
		
	this.m_bIsAccelerating = true;
}

Ship.prototype.deccellerate = function()
{
	this.m_liMove[0] -= Math.cos(this.m_iRotation) * this.m_iAccel;
	this.m_liMove[1] -= Math.sin(this.m_iRotation) * this.m_iAccel;
}

Ship.prototype.rotateLeft = function()
{
	this.m_iRotation = wrapAngle(this.m_iRotation - this.m_iRotationSpeed);
	
	return false;
}

Ship.prototype.rotateRight = function()
{
	this.m_iRotation = wrapAngle(this.m_iRotation + this.m_iRotationSpeed);
}


// This is mostly for the AI to prevent reversing
Ship.prototype.stop = function()
{
	m_kLog.addItem("STOPPING", 255, 255, 255);
	
	if(Math.abs(this.m_liMove[0]) > 0)
	{
		this.m_liMove[0] -= Math.cos(this.m_iRotation) * this.m_iAccel;
	}
	
	if(Math.abs(this.m_liMove[1]) > 0)
	{
		this.m_liMove[1] -= Math.sin(this.m_iRotation) * this.m_iAccel;
	}
}

Ship.prototype.selectWeapon = function(weapon)
{
	this.m_iWeaponSelected = weapon;
}

Ship.prototype.toggleDampeners = function()
{
	if(this.m_bInertialDampeners)
	{
		this.m_bInertialDampeners = false;
		
		m_kLog.addItem("Inertial Dampeners are now OFF.", 2000, 255, 0, 0);
		
		return;
	}
	
	if(!this.m_bInertialDampeners)
	{
		this.m_bInertialDampeners = true;
		m_kLog.addItem("Inertial Dampeners are now ON.", 2000, 0, 255, 0);
		
		return;
	}
}

Ship.prototype.setDampeners = function(dampeners)
{
	this.m_bInertialDampeners = dampeners;
}