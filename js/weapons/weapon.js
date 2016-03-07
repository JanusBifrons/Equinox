function Weapon()
{
	this.m_sDescription = "";
	
	// Ship this weapon is attached to
	this.m_kOwner;
	
	this.m_iType = 0;

	// Offsets from ship
	this.m_kOffset = new Array();
	this.m_kOffset[0] = 0;
	this.m_kOffset[1] = 0;
	this.m_iDistance = 0;
	
	// Location of weapon relative to the ship
	this.m_liPos = new Array();
	this.m_liPos[0] = 0;
	this.m_liPos[1] = 0;
	this.m_iPositionOffset = 0;
	
	// Rotation
	this.m_iRotation = 0;
	this.m_iRotationOffset = 0;
	this.m_iRotationMin = 0;
	this.m_iRotationMax = 0;
	this.m_bUnlimitedRotation = false;
	this.m_iRotationSpeed = 0;
	
	// Stats
	this.m_iRange = 0;
	this.m_iCooldown = 0;
	this.m_iCooldownTimer = 0;
	this.m_iDamage = 0;
	this.m_iDrain = 0;
	
	// Collision Detection
	this.m_cdCollisionPolygon;
	
	// Switches
	this.m_bIsFiring = false;
	this.m_bCanFire = false;
	this.m_bIsCoolingDown = false;
	
	// Drawing
	this.m_iR = 128;
	this.m_iG = 128;
	this.m_iB = 128;
	this.m_iA = 255;
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
	
	console.log("Weapon initialised successfully.");
}

Weapon.prototype.update = function()
{	
	// Update timer
	this.m_iCooldownTimer += m_fElapsedTime;
	
	if(this.m_iCooldownTimer < this.m_iCooldown)
		this.m_bIsCoolingDown = true;
	
	if(this.m_iCooldownTimer > this.m_iCooldown)
		this.m_bIsCoolingDown = false;
	
	// Reset switch each frame
	this.m_bIsFiring = false;
	
	this.updateOffsets();
	
	if(this.m_kOwner.m_liTargets.length > 0)
	{		
		this.fireOnTargets();
	}
	else
	{
		this.rotateToDefault();
	}
}

Weapon.prototype.draw = function()
{	
	return;
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'white'
	m_kContext.lineWidth = 1;
	
	// Draw firing angle!
	m_kContext.beginPath();
	m_kContext.arc(this.m_liPos[0], this.m_liPos[1], 250, this.m_kOwner.m_iRotation + this.m_iRotationMin, this.m_kOwner.m_iRotation + this.m_iRotationMax);
	m_kContext.stroke();
	m_kContext.closePath();
	
	var _x = this.m_liPos[0] + (250 * Math.cos(this.m_kOwner.m_iRotation + this.m_iRotationMin));
	var _y = this.m_liPos[1] + (250 * Math.sin(this.m_kOwner.m_iRotation + this.m_iRotationMin));

	m_kContext.beginPath();
	m_kContext.moveTo(this.m_liPos[0], this.m_liPos[1]);
	m_kContext.lineTo(_x, _y);	
	m_kContext.stroke();
	m_kContext.closePath();
	
	var _x = this.m_liPos[0] + (250 * Math.cos(this.m_kOwner.m_iRotation + this.m_iRotationMax));
	var _y = this.m_liPos[1] + (250 * Math.sin(this.m_kOwner.m_iRotation + this.m_iRotationMax));

	m_kContext.beginPath();
	m_kContext.moveTo(this.m_liPos[0], this.m_liPos[1]);
	m_kContext.lineTo(_x, _y);	
	m_kContext.stroke();
	m_kContext.closePath();
}

// EVENTS

Weapon.prototype.onFire = function()
{	
	// If the owner has enough power
	if(this.m_kOwner.m_iPowerStored >= this.m_iDrain)
	{
		// And you're not cooling down
		if(!this.m_bIsCoolingDown)
		{
			// You can fire
			this.m_bCanFire = true;
		}
	}

	// Is aimed closely enough and has no cooldown
	if(this.m_bCanFire)
	{
		// FIRE!
		this.m_bIsFiring = true;	
		
		this.m_bCanFire = false;
		
		this.m_kOwner.m_iPowerStored -= this.m_iDrain;

		// If this weapon has a cool down
		if(this.m_iCooldown > 0)
		{
			// Reset cooldown
			this.m_bIsCoolingDown = true;
			
			this.m_iCooldownTimer = 0;
		}
	}
}

Weapon.prototype.onHit = function(targetHit)
{
}

// HELPERS

Weapon.prototype.updateOffsets = function()
{
	// Update the position relative to the main ship 
	this.m_iPositionOffset = Math.atan2(this.m_kOffset[1], this.m_kOffset[0]);	
	this.m_iPositionOffset += this.m_kOwner.m_iRotation;
	
	// Update weapons actual position relative to ship
	this.m_liPos[0] = (this.m_kOwner.m_liPos[0]) + (this.m_iDistance * Math.cos(this.m_iPositionOffset));
	this.m_liPos[1] = (this.m_kOwner.m_liPos[1]) + (this.m_iDistance * Math.sin(this.m_iPositionOffset));
	
	// Reset rotation
	this.m_iRotation = this.m_kOwner.m_iRotation;
}

Weapon.prototype.fireOnTargets = function()
{	
	var _targets = this.m_kOwner.m_liTargets;
	var _closest = this.m_iRange;
	var _distance = 0;
	var _targetIndex = -1;
	
	// Determine closest target
	for(var i = 0; i < _targets.length; i++)
	{		
		if(this.checkTarget(_targets[i].m_liPos))
		{
			_distance = calculateDistance(_targets[i].m_liPos, this.m_liPos);
			
			if(_distance < _closest)
			{
				_closest = _distance;
				
				_targetIndex = i;
			}
		}
	}
		
	// If target found, fire on it!
	if(_targetIndex >= 0)
	{
		// Turn to face your target!
		var _turnAmount = this.turnToTarget(_targets[_targetIndex].m_liPos[0], _targets[_targetIndex].m_liPos[1]);
		
		if(_turnAmount < (Math.PI / 4))
			if(_turnAmount > -(Math.PI / 4))
				if(this.checkRay(_targets[_targetIndex]))
					this.onFire();
	}
	else
	{
		this.rotateToDefault();
	}
}

Weapon.prototype.checkRay = function(target)
{
	var _distanceToTarget = calculateDistance(this.m_liPos, target.m_liPos);
		
	// Only needs to be clear 99% of the way
	_distanceToTarget *= 0.99; 
	
	var _rayStart = new Array();
	_rayStart[0] = this.m_liPos[0] + (10 * Math.cos(this.m_iRotation));
	_rayStart[1] = this.m_liPos[1] + (10 * Math.sin(this.m_iRotation));
	
	var _rayEnd = new Array();
	_rayEnd[0] = this.m_liPos[0] + (_distanceToTarget * Math.cos(this.m_iRotation));
	_rayEnd[1] = this.m_liPos[1] + (_distanceToTarget * Math.sin(this.m_iRotation));
	
	// Create a ray between the weapon and the target
	var _ray = new P(new V(0, 0), [new V(_rayStart[0], _rayStart[1]), new V(_rayEnd[0], _rayEnd[1])]);
	
	if(m_kCollisionManager.checkRay(this, target, _ray, this.m_kOwner.m_kSector.m_kStructureManager.m_liStructures, this.m_kOwner.m_kSector.m_kAsteroidManager.m_liAsteroids))
	{	
		return true;
	}
	else
	{
		return false;
	}
}

Weapon.prototype.rotateToDefault = function()
{
	var _desiredRotation = this.m_iRotationMin + ((this.m_iRotationMax - this.m_iRotationMin) / 2);
	
	// Calculate the difference so we know how much to turn!
	var _turnAmount = _desiredRotation - this.m_iRotationOffset;
	
	// Cap turn to turn speed!
	_turnAmount = clamp(_turnAmount, -this.m_iRotationSpeed, this.m_iRotationSpeed);
	
	this.m_iRotationOffset += _turnAmount;
	this.m_iRotationOffset = wrapAngle(this.m_iRotationOffset);
	
	// Add the offset to the rotation!
	this.m_iRotation += this.m_iRotationOffset;
}

Weapon.prototype.turnToTarget = function(x, y)
{		
	// IMPORTANT!!
	
	// If youve come here to fix the crossing over 0 bug...
	// It might be in the AI turn to face code.
	
	// Just in case I've deleted it or written over it since then and now...
	
		//var _desiredRotation = Math.atan2(this.m_liDesiredLocation[1], this.m_liDesiredLocation[0]);
	
	//_desiredRotation = wrapAngle(_desiredRotation);
	
	//var _diff = _desiredRotation - this.m_kShip.m_iRotation;
	
	//if(_diff > 0)
	//{
		//if(_diff > Math.PI)
		//{
			//this.m_kShip.rotateLeft();
		//}
		//else
		//{
			//this.m_kShip.rotateRight();
		//}
	//}
	//else if(_diff < 0)
	//{
		//if(_diff < -Math.PI)
		//{
			//this.m_kShip.rotateRight();
		//}
		//else
		//{
			//this.m_kShip.rotateLeft();
		//}
	//}
	
	// Essentially I think it comes down to just capping the turn amount to positive or negative with the same
	// logic as above...


	// Calculate vector to target
	var _x = x - this.m_liPos[0];
	var _y = y - this.m_liPos[1];
			
	// Calculate rotation to target based on vector
	var _desiredRotation = Math.atan2(-_y, -_x) + Math.PI;	// Fiddled so that it's from 0-2PI rather than -PI to +PI
	
	// Wrap to ensure its between 0-2PI
	_desiredRotation = wrapAngle(_desiredRotation - this.m_iRotation);
	
	// Calculate the difference so we know how much to turn!
	var _turnAmount = _desiredRotation - this.m_iRotationOffset;
	
	// Caps to 2 decimal places
	_turnAmount = Math.round(_turnAmount * 100) / 100;
	
	// Used to determine if the weapon is turning and by how much
	var _uncappedTurnAmount = _turnAmount;

	// Cap turn to turn speed!
	_turnAmount = clamp(_turnAmount, -this.m_iRotationSpeed, this.m_iRotationSpeed);
	
	this.m_iRotationOffset += _turnAmount;
	this.m_iRotationOffset = wrapAngle(this.m_iRotationOffset);
	
	// Check if this weapon has free rotation!
	if(!this.m_bUnlimitedRotation)
	{
		// Cap rotation to min and max
		this.capRotation();
	}
	else
	{
		// This is a hacky solution to the problem
		// Once youve fixed the "cross zero" bug
		// This is probably highly redundant, or needs adjusting
		
		// !IMPORTANT!
		// This function is empty because I can't be bothered right now, but the code is above to fix it rotating the wrong way!
		this.rotationCorrection();
	}
	
	// Add the offset to the rotation!
	this.m_iRotation += this.m_iRotationOffset;
	
	// Return the desired rotation so we can tell if it is aiming at its target or not
	//return _desiredRotation;
	return _uncappedTurnAmount;
}

Weapon.prototype.rotationCorrection = function()
{
	
}

Weapon.prototype.capRotation = function()
{	
	var _newDiff = this.m_iRotationOffset;
	
	if(_newDiff < this.m_iRotationMin)
	{
		this.m_iRotationOffset = this.m_iRotationMin;
		//m_kLog.addItem("Below Min! Capping to Minimum!", 2000, 255, 255, 255);
	}
	
	if(_newDiff > this.m_iRotationMax)
	{		
		this.m_iRotationOffset = this.m_iRotationMax;
		//m_kLog.addItem("Above Max! Capping to Maximum!", 2000, 255, 255, 255);
	}
}

Weapon.prototype.checkTarget = function(position)
{	
	// Rotation of parent ship
	var _rot = this.m_kOwner.m_iRotation;

	// Calculate relative position
	var _x = position[0] - this.m_liPos[0];
	var _y = position[1] - this.m_liPos[1];
	
	// Calculate absolute rotation desired
	var _desiredRotation = Math.atan2(-_y, -_x) + Math.PI;

	// Calculate adjusted minimum and maximumrotation
	var _rotMin = this.m_iRotationMin + _rot;
	var _rotMax = this.m_iRotationMax + _rot;
	
	// Flags for if it's passing the rotation checks
	var _passed1 = false;
	var _passed2 = false;
	
	// Flags for if it has to adjust the upper or lower rotation for a boundary
	var _adjustedMin = false;
	var _adjustedMax = false;
	
	// Cap between 0 and 2 PI
	if(_rotMin > (Math.PI * 2))
	{
		_rotMin = _rotMin - (Math.PI * 2);
		_adjustedMin = true;
	}
	
	// Cap between 0 and 2 PI
	if(_rotMax > (Math.PI * 2))
	{
		_rotMax = _rotMax - (Math.PI * 2);
		_adjustedMax = true;
	}
	
	// Check if more than minimum
	if(_desiredRotation > _rotMin)
	{
		_passed1 = true;
	}
	
	// Check if less than maximum
	if(_desiredRotation < _rotMax)
	{
		_passed2 = true;
	}
	
	// If both have been changed
	if(_adjustedMax && _adjustedMin)
	{
		// Both have to pass
		if(_passed1 && _passed2)
		{
			// Target found!
			return true;
		}
		else
		{
			// Both haven't passed, no target!
			return false;
		}
	}
	
	// If only max has been adjusted
	if(_adjustedMax)
	{
		// One or the other need to pass
		if(_passed1 || _passed2)
		{
			// Target found!
			return true;
		}
		else
		{
			// No target!
			return false;
		}
	}
	
	// If neither have been adjusted
	// Last ditch effort if both have passed
	if(_passed1 && _passed2)
	{
		// Target found!
		return true;
	}
	else
	{
		// No target!
		return false;
	}
	
	// No target!
	return false;
}