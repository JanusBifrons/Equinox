function GameObject()
{
	this.m_bIsAlive = true;
	
	// Very important flags
	this.m_sName = "Undefined. No, not that type. The type I did.";
	this.m_eObjectType = "Undefined. No, not that type. The type I did.";
	this.m_iID = 0;
	this.m_iTeam = 0;

	// World
	this.m_kSector;
	
	// Position and movement
	this.m_liPos = new Array();
	this.m_liMove = new Array();
	this.m_liPos[0] = 0;
	this.m_liPos[1] = 0;
	this.m_liMove[0] = 0;
	this.m_liMove[1] = 0;
	this.m_iRotation = 0;
	this.m_iRotationSpeed = 0;
	
	// Radius
	this.m_iRadius = 0;
	
	// Speed
	this.m_iSpeed = 0;
	this.m_iMaxSpeed = 0;
	this.m_iAccel = 0;
	
	// Stats
	this.m_iShieldRegenCap = 0;
	this.m_iShieldRegen = 0;
	this.m_iShieldCap = 0;
	this.m_iShields = 0;
	this.m_iArmourCap = 0;
	this.m_iArmour = 0;
	this.m_iArmourRegen = 0;
	this.m_iHullCap = 0;
	this.m_iHull = 0;
	this.m_iHullRegen = 0;
	
	// Components and shields
	this.m_iHitTimer = 0;
	this.m_liShields = new Array();
	this.m_liComponents = new Array();
	
	// Build costs
	this.m_bIsConstructed = true;
	this.m_iMetalRequired = 0;
	this.m_iMetalBuilt = 0;
	
	// Blueprint variables (I want to make this redundant...)
	this.m_iConstructionTime = 15000;
	this.m_iConstructionCost = 100;
	
	// Cargo
	this.m_kStoredBy;
	
	// Boolean flags
	this.m_bIsCargo = false;
	this.m_bIsAccelerating = false;
	this.m_bInertialDampeners = true; // On by default
	
	// UI
	this.m_bDrawUI = false;
	
	// Drawing
	this.m_iR = 0;
	this.m_iG = 0;
	this.m_iB = 0;
	this.m_iA = 255;
}

GameObject.prototype.initialize = function(name, objectType, team, sector, x, y, moveX, moveY, rotation, rotationSpeed, radius, maxSpeed, acceleration)
{
	// Set name and generate ID
	this.m_sName = name;
	this.m_eObjectType = objectType;
	this.m_iTeam = team
	this.m_iID = guid();
	
	this.m_kSector = sector;
	
	// Set position
	this.m_liPos = new Array();
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	
	// Set move
	this.m_liMove = new Array();
	this.m_liMove[0] = moveX;
	this.m_liMove[1] = moveY;
	
	// Set rotation
	this.m_iRotation = rotation;
	this.m_iRotationSpeed = rotationSpeed;
	
	// Set radius
	this.m_iRadius = radius;
	
	// Set speed
	this.m_iSpeed = 0;
	this.m_iMaxSpeed = maxSpeed;
	this.m_iAccel = acceleration;
	
	this.m_liShields = new Array();
	
	// Generate components (abstract class)
	this.createComponents();
}

GameObject.prototype.initializeStats = function(shieldRegen, shieldCap, armourCap, armourRegen, hullCap, hullRegen)
{
	// Set shields
	this.m_iShieldRegenCap = (shieldRegen * 1000);
	this.m_iShields = shieldCap;
	this.m_iShieldCap = shieldCap;
	
	// Set armour
	this.m_iArmour = armourCap;
	this.m_iArmourCap = armourCap;
	this.m_iArmourRegen = armourCap / armourRegen;
	
	// Set hull
	this.m_iHull = hullCap;
	this.m_iHullCap = hullCap;
	this.m_iHullRegen = hullCap / hullRegen;
	
	//m_kLog.addItem("Shields: " + this.m_iShields + " / " + this.m_iShieldCap, 5000, 255, 255, 255);
	//m_kLog.addItem("Armour: " + this.m_iArmour + " / " + this.m_iArmourCap, 5000, 255, 255, 255);
	//m_kLog.addItem("Hull: " + this.m_iHull + " / " + this.m_iHullCap, 5000, 255, 255, 255);
}

GameObject.prototype.update = function()
{	
	this.m_iHitTimer += m_fElapsedTime;

	// Update collision position
	_shield = new C(new V(this.m_liPos[0], this.m_liPos[1]), this.m_iRadius);
	
	// Reset shield list
	this.m_liShields.length = 0;
	
	// Add updated shield
	this.m_liShields.push(_shield);		// THIS CAN BE OVERWRITTEN IF REQUIRED!

	// Update components
	for(var i = 0; i < this.m_liComponents.length; i++)
		this.m_liComponents[i].update();

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
	
	// Reset accellerating
	this.m_bIsAccelerating = false;
}

GameObject.prototype.draw = function()
{
	if(this.m_bDrawUI || this.m_bIsSelected)
	{
		this.drawUI();
	}
	
	this.m_bDrawUI = false;
	
	this.drawBody();
}

// EVENTS

GameObject.prototype.onStored = function(cargoHold)
{
	this.m_kStoredBy = cargoHold;
	this.m_bIsCargo = true;
}

GameObject.prototype.onDrop = function(x, y, sector)
{
	// Set position
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	this.m_kSector = sector;
	
	// Unflag as stored
	this.m_bIsCargo = false;
}

GameObject.prototype.onCollision = function(vector, otherObject)
{	
	this.m_liPos[0] += (vector.x);
	this.m_liPos[1] += (vector.y);
	
	this.m_liMove[0] += (vector.x * 0.75);
	this.m_liMove[1] += (vector.y * 0.75);
}

GameObject.prototype.onHit = function(damage)
{	
	this.m_iHitTimer = 0;

	// Check if hit is on shields	
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
		
		// Check if object is alive!
		if(this.m_iHull <= 0)
		{				
		
			return true; // Object died!
		}
	}
	
	return false; // Player lives on
}

GameObject.prototype.onExplosion = function(x, y, size)
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

GameObject.prototype.onRepair = function(metal)
{	
	if(!this.m_bIsConstructed)
	{
		this.onConstruct(metal);
		
		return;
	}

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

GameObject.prototype.onTractor = function(x, y)
{
	this.m_liMove[0] *= 0.99;
	this.m_liMove[1] *= 0.99;

	var _x = this.m_liPos[0] - x;
	var _y = this.m_liPos[1] - y;
	
	var _direction = Math.atan2(_y, _x);
	
	this.m_liMove[0] -= Math.cos(_direction) * (this.m_iAccel * 2);
	this.m_liMove[1] -= Math.sin(_direction) * (this.m_iAccel * 2);
}

GameObject.prototype.onConstruct = function(metal)
{
	// Check if this structure needs more construction!
	if(this.m_iMetalBuilt < this.m_iMetalRequired)
	{
		// Construct using metal
		this.m_iMetalBuilt += metal;

		// Work out what percentage of the whole this bit was
		var _percent = (metal / this.m_iMetalRequired);
		
		// If the hull isnt full, add that percentage to it
		if(this.m_iHull < this.m_iHullCap)
			this.m_iHull += (this.m_iHullCap * _percent);
		
		// If the armour isnt full, add that percentage to it
		if(this.m_iArmour < this.m_iArmourCap)
			this.m_iArmour += (this.m_iArmourCap * _percent);
		
		// Successfully added metal to construction!
		return true;
	}
	else
	{	
		// Constructed!
		this.m_bIsConstructed = true;
		
		// Metal not needed!
		return false;
	}
	
	// Metal not needed!
	return false;
}

// DRAW HELPERS

GameObject.prototype.drawBody = function()
{
	var _shieldPercent = (this.m_iShields / this.m_iShieldCap) * 100;
	
	// Draw shields
	for(var i = 0; i < this.m_liShields.length; i++)
	{		
		// Alpha the shields
		m_kContext.globalAlpha = 0.25;
		
		if(this.m_iShields <= 0)
			continue;
		
		// Draw Shield
		
		if(this.m_iTeam == 0)
		{
			m_kContext.strokeStyle = 'grey';	
			m_kContext.fillStyle = 'grey';
		}
		
		if(this.m_iTeam == 1)
		{
			m_kContext.strokeStyle = 'blue';	
			m_kContext.fillStyle = 'blue';
		}
		
		if(this.m_iTeam == 2)
		{
			m_kContext.strokeStyle = 'red';	
			m_kContext.fillStyle = 'red';
		}
		
		if(this.m_iTeam == 3)
		{
			m_kContext.strokeStyle = 'green';	
			m_kContext.fillStyle = 'green';
		}
		
		if(this.m_iTeam == 4)
		{
			m_kContext.strokeStyle = 'purple';	
			m_kContext.fillStyle = 'purple';
		}
		
		if(this.m_iTeam == 5)
		{
			m_kContext.strokeStyle = 'gold';	
			m_kContext.fillStyle = 'gold';
		}
		
		m_kContext.lineWidth = (15 / 100) * _shieldPercent;
		
		m_kContext.beginPath();
		m_kContext.arc(this.m_liShields[i].pos.x, this.m_liShields[i].pos.y, this.m_liShields[i].r, 0, 2 * Math.PI);
		m_kContext.fill();
		m_kContext.stroke();
		m_kContext.closePath();	
	}
	
	// Set colour
	m_kContext.strokeStyle = 'grey';	
	m_kContext.fillStyle = 'grey';
	
	// Reset alpha
	m_kContext.globalAlpha = 1;
	
	// Draw components
	for(var i = 0; i < this.m_liComponents.length; i++)
	{
		this.m_liComponents[i].draw();
	}
}

GameObject.prototype.drawUI = function()
{
	// Save context!
	m_kContext.save();
	
	// Translate to center
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	var _drawDistance = this.m_iRadius * 1;
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'white';
	m_kContext.lineWidth = 1;
	
	// Font size, type and colour
	m_kContext.font="15px Verdana";
	
	m_kContext.fillText(this.m_sName, -_drawDistance, -_drawDistance - 12);
	m_kContext.fillText(this.m_eObjectType, -_drawDistance, -_drawDistance);
	
	
	m_kContext.fillText(this.m_iShields, -_drawDistance, _drawDistance + 10);
	m_kContext.fillText(this.m_iArmour, -_drawDistance, _drawDistance + 20);
	m_kContext.fillText(this.m_iHull, -_drawDistance, _drawDistance + 30);
	
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
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}

// HELPERS

GameObject.prototype.regenStats = function()
{
	// If you've been hit in the last 10th of a second dont regen yet
	if(this.m_iHitTimer < 1000)
		return;
	
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

// ABSTRACT

GameObject.prototype.createComponents = function(){}