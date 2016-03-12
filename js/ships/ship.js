function Ship()
{
	this.m_sDebug = "This is a ship class.";
	this.m_eObjectType = "Ship";
	
	this.m_kOwner;
	this.m_kSector;
	this.m_iID = 0;
	this.m_iTeam = 0; // Neutral
	
	// Life stats
	this.m_bIsAlive = true;
	
	// Construction
	this.m_bIsConstructed = true;	// Cannot construct ships at the moment!
	this.m_iMetalRequired = 1000; // DEBUG VALUE FOR DEFAULT! THIS IS NOT USED PRESENTLY
	
	// Movement Variables
	this.m_liPos = new Array();
	this.m_liMove = new Array();
	this.m_liPos[0] = 0;
	this.m_liPos[1] = 0;
	this.m_liMove[0] = 0;
	this.m_liMove[1] = 0;
	this.m_iRadius = 0;
	this.m_bIsAfterburning = false;
	
	// Rotation and Speed
	this.m_iRotation = 0;
	this.m_iRotationSpeed = 0;
	this.m_iSpeed = 0;
	this.m_iMaxSpeed = 0;
	this.m_iAccel = 0;
	this.m_bIsAccelerating = false;
	this.m_bInertialDampeners = true; // On by default
	
	// Stats
	this.m_iShieldRegenCap = 0;
	this.m_iShieldRegen = 0; // seconds (mili)
	this.m_iShieldCap = 0;
	this.m_iShields = 0;
	
	this.m_iArmourCap = 0;
	this.m_iArmour = 0;
	this.m_iArmourRegen = 0;
	
	this.m_iHullCap = 0;
	this.m_iHull = 0;
	this.m_iHullRegen = 0;
	
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
	
	// Ship Parts
	this.m_liComponents = new Array();
	
	// Ship cargo
	this.m_bDrawCargo = false;
	this.m_kCargoHold = new Cargo(this, 0);
	
	// Collision Detection
	this.m_iTimeSinceLastHit = 5001;
	this.m_liShields = new Array();
	this.m_liHull = new Array();
	
	// Drawing
	this.m_bIsSelected = false;
	this.m_bDrawUI = false;
	this.m_bDrawShield = false;
	this.m_iR = 0;
	this.m_iG = 0;
	this.m_iB = 0;
	this.m_iA = 255;
	
	console.log("Initialized ship successfully.");
}

Ship.prototype.update = function()
{	
	m_kLog.addStaticItem(this.m_iID);
	m_kLog.addStaticItem(this.m_liTargets.length);

	// Update targets
	for(var i = 0; i < this.m_liTargets.length; i++)
		this.m_liTargets[i].update();

	// Update team based on owner and set colour
	this.updateTeam();
	
	// Update shield draw timer
	this.updateTimer();

	// Regen stats
	this.regenStats();
		
	// Calculate length of the speed vector
	this.m_iSpeed = calculateMagnitude(this.m_liMove);
	
	// Check if magnitude is greater than maximum speed
	if(this.m_iSpeed > this.m_iMaxSpeed)
	{
		// Cap to max speed
		this.m_liMove[0] += (this.m_liMove[0] / this.m_iSpeed) * (this.m_iMaxSpeed - this.m_iSpeed);
		this.m_liMove[1] += (this.m_liMove[1] / this.m_iSpeed) * (this.m_iMaxSpeed - this.m_iSpeed);
	}
	
	if(this.m_bInertialDampeners && !this.m_bIsAccelerating)
	{					
		if(this.m_iSpeed < this.m_iAccel)
		{
			this.m_liMove[0] = 0;
			this.m_liMove[1] = 0;
		}
		else
		{
			var _direction = Math.atan2(this.m_liMove[1], this.m_liMove[0]);
			
			this.m_liMove[0] -= Math.cos(_direction) * this.m_iAccel;
			this.m_liMove[1] -= Math.sin(_direction) * this.m_iAccel;
		}
	}
	
	// Update position based on speed
	this.m_liPos[0] += this.m_liMove[0];
	this.m_liPos[1] += this.m_liMove[1];
	
	// Update collision position
	_shield = new C(new V(this.m_liPos[0], this.m_liPos[1]), this.m_iRadius);
	
	// Reset shield list
	this.m_liShields.length = 0;
	
	// Add updated shield
	this.m_liShields.push(_shield);		// THIS CAN BE OVERWRITTEN BY THE STRUCTURE IF REQUIRED!
	
	// Update components
	for(var i = 0; i < this.m_liComponents.length; i++)
		this.m_liComponents[i].update();
	
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
	
	// Reset accellerating
	this.m_bIsAccelerating = false;
}

Ship.prototype.draw = function()
{			
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
	
	if(this.m_bDrawUI || this.m_bIsSelected)
	{
		this.drawUI();
	}
	
	this.m_bDrawUI = false;
	
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

Ship.prototype.onTractor = function(x, y)
{	
	this.m_liMove[0] *= 0.99;
	this.m_liMove[1] *= 0.99;

	var _x = this.m_liPos[0] - x;
	var _y = this.m_liPos[1] - y;
	
	var _direction = Math.atan2(-_y, -_x) + Math.PI;
	
	this.m_liMove[0] -= Math.cos(_direction) * (this.m_iAccel * 2);
	this.m_liMove[1] -= Math.sin(_direction) * (this.m_iAccel * 2);
}

Ship.prototype.onRepair = function(metal)
{	
	// Work out what percentage of the whole this bit was
	var _percent = (metal / this.m_iMetalRequired);
	
	// If the hull isnt full, add that percentage to it
	if(this.m_iHull < this.m_iHullCap)
	{		
		this.m_iHull += (this.m_iHullCap * _percent);
	}
	else if(this.m_iArmour < this.m_iArmourCap)
	{
		// If the armour isnt full, add that percentage to it
		this.m_iArmour += (this.m_iArmourCap * _percent);
	}
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

Ship.prototype.onExplosion = function(x, y, size)
{	
	var _x = this.m_liPos[0] - x;
	var _y = this.m_liPos[1] - y;
	
	var _push = new Array();
	_push[0] = _x;
	_push[1] = _y;
	
	var _distance = calculateMagnitude(_push);
	_push = unitVector(_push);
	_push[0] *= size / 50;
	_push[1] *= size / 50;
	
	var _power = 1;
	
	if(_distance < size)
	{
		_power = 1 - (_distance / size);
		
		_push[0] *= _power;
		_push[1] *= _power;
	
		this.m_liMove[0] += _push[0];
		this.m_liMove[1] += _push[1];
	}
}

Ship.prototype.onHit = function(damage)
{	
	// Check if hit is on shields or player	
	if(this.m_iShields > 0)
	{
		// Impacts on shields
		this.m_iShields -= damage;	
		
		// Reset shield regen timer
		this.m_iShieldRegen = this.m_iShieldRegenCap;
	}
	else if(this.m_iArmour > 0)
	{
		// Impact on the armour
		this.m_iArmour -= damage;
		
		// Reset shield regen timer
		this.m_iShieldRegen = this.m_iShieldRegenCap;
	}
	else
	{
		// Impact on the health
		this.m_iHull -= damage;
		
		// Reset shield regen timer
		this.m_iShieldRegen = this.m_iShieldRegenCap;
		
		// Check if player is alive!
		if(this.m_iHull <= 0)
		{
			this.onDeath(0);
		
			return true; // Player died!
		}
	}
	
	return false; // Player lives on
}

Ship.prototype.onConstruct = function()
{
	// HOLDER FUNCTION UNTIL LATER!
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

Ship.prototype.onEnterSector = function(structures, asteroids)
{	
}

Ship.prototype.onCollision = function(vector)
{	
	this.m_iTimeSinceLastHit = 0;

	this.m_liPos[0] += (vector.x);
	this.m_liPos[1] += (vector.y);
	
	this.m_liMove[0] += (vector.x * 1.5);
	this.m_liMove[1] += (vector.y * 1.5);
}

Ship.prototype.onDeath = function(reason)
{	
	// Edge case - player already dead!
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
	
	// Notify player in case this ship was targetted by the player!
	m_kPlayer.onObjectDeath(this.m_iID);
}

Ship.prototype.onRespawn = function(x, y)
{
	m_kLog.addItem("Attempting to respawn ship!", 1000, 255, 255, 255);
	
	this.createComponents();
	
	// Respawn at a random position on the map
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	this.m_liMove[0] = 0;
	this.m_liMove[1] = 0;
	this.m_iRotation = 0;
	
	// Set to alive
	this.m_bIsAlive = true;
	this.m_bIsRespawning = false;
	
	// Reset all stats
	this.m_iHull = this.m_iHullCap;
	this.m_iArmour = this.m_iArmourCap;
	this.m_iShields = this.m_iShieldCap;
	this.m_iPowerStored = this.m_iPowerCap;
	this.m_iShieldRegen = this.m_iShieldRegenCap;
	
	// Add yourself back to the sector!
	this.m_kSector.m_liShips.push(this);
}

// HELPERS

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

Ship.prototype.drawBody = function()
{
	var _shieldPercent = (this.m_iShields / this.m_iShieldCap) * 100;
	
	// Draw shields
	for(var i = 0; i < this.m_liShields.length; i++)
	{
		if(!this.m_bDrawShield)
			continue;
		
		if(this.m_iShields <= 0)
			continue;
		
		// Draw Shield
		m_kContext.strokeStyle = 'lightblue';	
		m_kContext.fillStyle = 'blue';
		m_kContext.lineWidth = (5 / 100) * _shieldPercent;
		
		if(this.m_iTimeSinceLastHit > 0)
		_alpha = 1 - (this.m_iTimeSinceLastHit / 5000);
	
		if(_alpha < 0)
			_alpha = 0;
		
		m_kContext.globalAlpha = _alpha;
		
		m_kContext.beginPath();
		m_kContext.arc(this.m_liShields[i].pos.x, this.m_liShields[i].pos.y, this.m_liShields[i].r, 0, 2 * Math.PI);
		m_kContext.fill();
		m_kContext.stroke();
		m_kContext.closePath();	
	}
	
	m_kContext.globalAlpha = 1;
	
	// Draw components
	for(var i = 0; i < this.m_liComponents.length; i++)
		this.m_liComponents[i].draw();
}

// I hate this name, but nevermind... drawStats is already taken!
Ship.prototype.drawUI = function()
{
	// Save context!
	m_kContext.save();
	
	// Translate to center
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	var _drawDistance = this.m_iRadius * 1.2;
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'white';
	m_kContext.lineWidth = 1;
	
	// Top Left
	m_kContext.beginPath();
	m_kContext.moveTo(-_drawDistance, -_drawDistance);
	m_kContext.lineTo(-_drawDistance + (_drawDistance * 0.5), -_drawDistance);
	m_kContext.moveTo(-_drawDistance, -_drawDistance);
	m_kContext.lineTo(-_drawDistance, -_drawDistance  + (_drawDistance * 0.5));
	m_kContext.closePath();	
	m_kContext.stroke();
	
	// Top Right
	m_kContext.beginPath();
	m_kContext.moveTo(_drawDistance, -_drawDistance);
	m_kContext.lineTo(_drawDistance - (_drawDistance * 0.5), -_drawDistance);
	m_kContext.moveTo(_drawDistance, -_drawDistance);
	m_kContext.lineTo(_drawDistance, -_drawDistance  + (_drawDistance * 0.5));
	m_kContext.closePath();	
	m_kContext.stroke();
	
	// Bottom Left
	m_kContext.beginPath();
	m_kContext.moveTo(-_drawDistance, _drawDistance);
	m_kContext.lineTo(-_drawDistance + (_drawDistance * 0.5), _drawDistance);
	m_kContext.moveTo(-_drawDistance, _drawDistance);
	m_kContext.lineTo(-_drawDistance, _drawDistance - (_drawDistance * 0.5));
	m_kContext.closePath();	
	m_kContext.stroke();
	
	// Bottom Right
	m_kContext.beginPath();
	m_kContext.moveTo(_drawDistance, _drawDistance);
	m_kContext.lineTo(_drawDistance - (_drawDistance * 0.5), _drawDistance);
	m_kContext.moveTo(_drawDistance, _drawDistance);
	m_kContext.lineTo(_drawDistance, _drawDistance - (_drawDistance * 0.5));
	m_kContext.closePath();	
	m_kContext.stroke();
	
	// Percents
	var _shieldPercent = (this.m_iShields / this.m_iShieldCap);
	var _armourPercent = (this.m_iArmour / this.m_iArmourCap);
	var _hullPercent = (this.m_iHull / this.m_iHullCap);
	
	if(!this.m_bIsSelected)
	{
		this.drawStatBar(_drawDistance, _hullPercent, 0, 'brown', true);
		this.drawStatBar(_drawDistance, _armourPercent, 0, 'grey', false);
		this.drawStatBar(_drawDistance, _shieldPercent, 0, 'blue', false);
	}
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}

Ship.prototype.drawStatBar = function(drawDistance, percent, offset, colour, background)
{
	var _x = -drawDistance;
	var _y = drawDistance;
	var _width = drawDistance * 2;
	var _height = drawDistance * 0.2;
	
	_y += offset;
	
	m_kContext.lineWidth = 0.1;
	
	if(background)
	{
		// Border and Background
		m_kContext.fillStyle = concatenate(255, 255, 255, 127);;
		m_kContext.fillRect(_x, _y, _width, _height);
	
		m_kContext.fillStyle = 'black';
		m_kContext.fillRect(_x * 0.99, _y + (_y * 0.01), _width * 0.99, _height - (_y * 0.02));	
	}
	
	m_kContext.fillStyle = colour;
	m_kContext.fillRect(_x * 0.99, _y + (_y * 0.01), (_width * 0.99) * percent, _height - (_y * 0.02));
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

Ship.prototype.updateTeam = function()
{
	// Set team based on team the owner is!
	this.m_iTeam = this.m_iTeam;

	// Set colour based on team
	if(this.m_iTeam == 1)
	{
		this.m_iR = 0;
		this.m_iG = 0;
		this.m_iB = 255;
	}
	
	if(this.m_iTeam == 2)
	{
		this.m_iR = 255;
		this.m_iG = 0;
		this.m_iB = 0;
	}
	
	// Concatinate colour into single variable
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
}

Ship.prototype.regenStats = function()
{
	// Count Down Shield Regen Timer
	if(this.m_iShieldRegen > 0)
		this.m_iShieldRegen -= m_fElapsedTime;

	// Calculate how much to regen by this frame
	var _hullRegenAmount = (this.m_iHullRegen / 1000) * m_fElapsedTime;	
	var _armourRegenAmount = (this.m_iArmourRegen / 1000) * m_fElapsedTime;	
	var _powerRegenAmount = (this.m_iPowerRegen / 1000) * m_fElapsedTime;	
	
	// Regen energy
	if(this.m_iPowerStored < this.m_iPowerCap)
		this.m_iPowerStored += _powerRegenAmount;
		
	// Regen armour
	if(this.m_iArmour < this.m_iArmourCap)
		this.m_iArmour += _armourRegenAmount;
		
	// Regen hull
	if(this.m_iHull < this.m_iHullCap)
		this.m_iHull += _hullRegenAmount;
		
	// Check if shields should regen
	if(this.m_iShieldRegen <= 0 && this.m_iShields < this.m_iShieldCap)
	{
		// Regen shields
		this.m_iShields += (this.m_iShieldCap / 1000) * m_fElapsedTime; // Regen in 1 second
		
		// Make sure shields dont overflow
		if(this.m_iShields > this.m_iShieldCap)
			this.m_iShields = this.m_iShieldCap;
	}
	
	// Just to be safe...
	if(this.m_iPowerStored < 0)
		this.m_iPowerStored = 0;

	// Just to be safe...
	if(this.m_iPowerStored > this.m_iPowerCap)
		this.m_iPowerStored = this.m_iPowerCap;		
	
	// Just to be safe...
	if(this.m_iShields < 0)
		this.m_iShields = 0;
		
	// Just to be safe...
	if(this.m_iShields > this.m_iShieldCap)
		this.m_iShields = this.m_iShieldCap;
		
	// Just to be safe...
	if(this.m_iArmour < 0)
		this.m_iArmour = 0;
		
	// Just to be safe...
	if(this.m_iArmour > this.m_iArmourCap)
		this.m_iArmour = this.m_iArmourCap;
		
	// Just to be safe...
	if(this.m_iHull < 0)
		this.m_iHull = 0;
		
	// Just to be safe...
	if(this.m_iHull > this.m_iHullCap)
		this.m_iHull = this.m_iHullCap;
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

Ship.prototype.afterBurner = function()
{
	// If not currently using the afterburner
	if(!this.m_bIsAfterburning)
	{	
		// And energy is above 10% of empty
		if(this.m_iPowerStored > (this.m_iPowerCap * 0.1))
		{
			// Activate afterburner!
			this.m_bIsAfterburning = true;
		}
		else
		{
			this.m_bIsAfterburning = false;
		}
	}
	
	if(this.m_bIsAfterburning)
	{
		this.m_bIsAccelerating = true;

		// Afterburn!
		this.m_liMove[0] += Math.cos(this.m_iRotation) * (this.m_iAccel * 2);
		this.m_liMove[1] += Math.sin(this.m_iRotation) * (this.m_iAccel * 2);
		
		var _drain = (25 / 1000) * m_fElapsedTime;
		
		if(this.m_iPowerStored >= _drain)
		{
			this.m_iPowerStored -= _drain;
		}
		else
		{
			this.m_bIsAfterburning = false;
		}
	}
}

Ship.prototype.rotateLeft = function()
{
	this.m_iRotation = wrapAngle(this.m_iRotation - this.m_iRotationSpeed);
}

Ship.prototype.rotateRight = function()
{
	this.m_iRotation = wrapAngle(this.m_iRotation + this.m_iRotationSpeed);
}

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