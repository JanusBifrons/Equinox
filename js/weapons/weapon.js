function Weapon()
{
	// Ship this weapon is on
	this.m_kOwner;
	
	// Offset from owner
	this.m_liOffset = new Array();
	this.m_liOffset[0] = 0;
	this.m_liOffset[1] = 0;
	
	// Distance from owners origin
	this.m_iDistance = 0;
	
	// Offset angle from player
	this.m_iOffsetAngle = 0;
	
	// Position of this weapon
	this.m_liPos = new Array();
	this.m_liPos[0] = 0;
	this.m_liPos[1] = 0;
	
	// Set rotation to match ships
	this.m_iRotation = 0;
	this.m_iRotationOffset = 0;						// The rotation of this turret
	
	// Rotation angles for rotating turrets
	this.m_iRotationMin = 0;
	this.m_iRotationMax = 0;
	this.m_iRotationSpeed = 0;
	
	// Stats
	this.m_iRange = 0;
	this.m_iDrain = 0;
	this.m_iCooldown = 0;
	this.m_iCooldownTimer = 0;
	
	// Switches
	this.m_bCanFire = false;
	this.m_bIsFiring = false;
	this.m_bIsCoolingDown = false;
	
	this.m_cColour = 'white';
}

Weapon.prototype.initialize = function(owner, offsetX, offsetY, minRotation, maxRotation, rotationSpeed, range, drain, cooldown)
{
	// Ship this weapon is on
	this.m_kOwner = owner;
	
	// Offset from owner
	this.m_liOffset = new Array();
	this.m_liOffset[0] = offsetX;
	this.m_liOffset[1] = offsetY;
	
	// Distance from owners origin
	this.m_iDistance = calculateMagnitude(this.m_liOffset);
	
	// Offset angle from player
	this.m_iOffsetAngle = Math.atan2(this.m_liOffset[1], this.m_liOffset[0]);
	this.m_iOffsetAngle += this.m_kOwner.m_iRotation;
	
	// Position of this weapon
	this.m_liPos = new Array();
	this.m_liPos[0] = this.m_kOwner.m_liPos[0] + (this.m_iDistance * Math.cos(this.m_iOffsetAngle));
	this.m_liPos[1] = this.m_kOwner.m_liPos[1] + (this.m_iDistance * Math.sin(this.m_iOffsetAngle));
	
	// Set rotation to match ships
	this.m_iRotation = this.m_kOwner.m_iRotation;
	this.m_iRotationOffset = 0;						// The rotation of this turret
	
	// Rotation angles for rotating turrets
	this.m_iRotationMin = minRotation;
	this.m_iRotationMax = maxRotation;
	this.m_iRotationSpeed = rotationSpeed;
	
	// Stats
	this.m_iRange = range;
	this.m_iDrain = drain;
	this.m_iCooldown = (cooldown * 1000); // Convert from seconds into miliseconds
	this.m_iCooldownTimer = this.m_iCooldown;
	
	// Switches
	this.m_bCanFire = false;
	this.m_bIsFiring = false;
	this.m_bIsCoolingDown = false;
	
	// Set colour based on team
	this.setColour();
	
	// Concatinate colour
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
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
	
	// Update position and rotation offsets
	this.updateOffsets();
	
	// Create X/Y coords in world space for mouse position
	var _worldPos = m_kCamera.screenToWorld(m_iMouseX, m_iMouseY, _worldPos);

	var _targetIndex = this.selectBestTarget();
	
	if(_targetIndex >= 0)
	{
		var _x = this.m_kOwner.m_liTargets[_targetIndex].m_kTarget.m_liPos[0];
		var _y = this.m_kOwner.m_liTargets[_targetIndex].m_kTarget.m_liPos[1];
		
		var _turn = this.turnToTarget(_x, _y);
		
		// Check if you're within a reasonable angle to open fire
		if(_turn < (Math.PI / 6))
			if(_turn > -(Math.PI / 6))
				this.onFire();
	}
	else
	{
		// Rotate to middle of allowed angles
		this.rotateToDefault();
	}
	
	// Set collision box after moving!
	this.createCollision();
	
	return;

	// Check if target is within shooting angle
	if(this.checkTarget(_worldPos.x, _worldPos.y))
	{
		// Turn to face target
		var _turn = this.turnToTarget(_worldPos.x, _worldPos.y)
		
		// Check if you're within a reasonable angle to open fire
		if(_turn < (Math.PI / 6))
			if(_turn > -(Math.PI / 6))
				this.onFire();
	}
	else
	{
		// Rotate to middle of allowed angles
		this.rotateToDefault();
	}
	
	// Set collision box after moving!
	this.createCollision();
}

Weapon.prototype.draw = function()
{
	this.drawCollisionBox();	
	
	this.drawWeapon();
	
	return;
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'white'
	m_kContext.lineWidth = 1;
	
	// Draw firing angle!
	m_kContext.beginPath();
	m_kContext.arc(this.m_liPos[0], this.m_liPos[1], this.m_iRange, this.m_kOwner.m_iRotation + this.m_iRotationMin, this.m_kOwner.m_iRotation + this.m_iRotationMax);
	m_kContext.stroke();
	m_kContext.closePath();
	
	var _x = this.m_liPos[0] + (this.m_iRange * Math.cos(this.m_kOwner.m_iRotation + this.m_iRotationMin));
	var _y = this.m_liPos[1] + (this.m_iRange * Math.sin(this.m_kOwner.m_iRotation + this.m_iRotationMin));

	m_kContext.beginPath();
	m_kContext.moveTo(this.m_liPos[0], this.m_liPos[1]);
	m_kContext.lineTo(_x, _y);	
	m_kContext.stroke();
	m_kContext.closePath();
	
	var _x = this.m_liPos[0] + (this.m_iRange * Math.cos(this.m_kOwner.m_iRotation + this.m_iRotationMax));
	var _y = this.m_liPos[1] + (this.m_iRange * Math.sin(this.m_kOwner.m_iRotation + this.m_iRotationMax));

	m_kContext.beginPath();
	m_kContext.moveTo(this.m_liPos[0], this.m_liPos[1]);
	m_kContext.lineTo(_x, _y);	
	m_kContext.stroke();
	m_kContext.closePath();
}

// OVERRIDERS

Weapon.prototype.onDrain = function()
{
	if(this.m_kOwner.m_iPowerStored >= this.m_iDrain)
	{
		this.m_kOwner.m_iPowerStored -= this.m_iDrain;
		
		return true;
	}
	
	return false;
}

Weapon.prototype.onHit = function(targetHit)
{
}

Weapon.prototype.createCollision = function()
{
	// Remove collision polygon
	this.m_cdCollisionPolygon = new P(new V(0, 0), [new V(this.m_liPos[0], this.m_liPos[1])]);
}

// EVENTS

Weapon.prototype.onFire = function()
{
	if(!this.m_bIsCoolingDown)
	{
		if(this.onDrain())
		{
			this.m_bCanFire = true;
		}
	}
	
	if(this.m_bCanFire)
	{
		// Fire
		this.m_bIsFiring = true;
		
		// Can no longer fire until cooldown is over!
		this.m_bCanFire = false;
		
		// Reset cooldown, if there is one
		if(this.m_iCooldown > 0)
		{
			this.m_bIsCoolingDown = true;
			this.m_iCooldownTimer = 0;
		}
	}
}

// HELPERS

Weapon.prototype.selectBestTarget = function()
{
	var _targets = this.m_kOwner.m_liTargets;
	var _closest = this.m_iRange;
	var _distance = 0;
	var _targetIndex = -1;
	
	// Determine closest target
	for(var i = 0; i < _targets.length; i++)
	{		
		if(this.checkTarget(_targets[i].m_kTarget.m_liPos[0], _targets[i].m_kTarget.m_liPos[1]))
		{
			_distance = calculateDistance(_targets[i].m_kTarget.m_liPos, this.m_liPos);
			
			if(_distance < _closest)
			{
				_closest = _distance;
				
				_targetIndex = i;
			}
		}
	}
	
	return _targetIndex;
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
	// Calculate vector to target
	var _x = x - this.m_liPos[0];
	var _y = y - this.m_liPos[1];
			
	// Calculate rotation to target based on vector
	var _desiredRotation = Math.atan2(_y, _x);
	
	// Make sure the desired angle takes into account the ships rotation
	_desiredRotation = wrapAngle(_desiredRotation - this.m_iRotation);
	
	// The desired rotation offset minus the actual
	var _turnAmount = _desiredRotation - this.m_iRotationOffset;
	
	// Unclamped turn amount for return value
	var _unclampedTurn = _turnAmount;
	
	// Clamp to the turning speed of this turret
	_turnAmount = clamp(_turnAmount, -this.m_iRotationSpeed, this.m_iRotationSpeed);
	
	// Turn the turret
	this.m_iRotationOffset += _turnAmount;
	
	// Keep rotation offset between -PI and +PI
	this.m_iRotationOffset = wrapAngle(this.m_iRotationOffset);
	
	// Cap rotation to min and max angles
	this.capRotation();
	
	// Add rotation offset to rotation
	this.m_iRotation += this.m_iRotationOffset;
	
	return _unclampedTurn;
}

Weapon.prototype.checkTarget = function(x, y)
{
	// Calculate vector to target
	var _x = x - this.m_liPos[0];
	var _y = y - this.m_liPos[1];
			
	// Calculate rotation to target based on vector
	var _desiredRotation = Math.atan2(_y, _x);
	
	// Make sure the desired angle takes into account the ships rotation
	_desiredRotation = wrapAngle(_desiredRotation - this.m_iRotation);
	
	if(_desiredRotation > this.m_iRotationMax)
		return false;
	
	if(_desiredRotation < this.m_iRotationMin)		
		return false;
	
	return true;
}

Weapon.prototype.setColour = function()
{	
	this.m_iR = 0;
	this.m_iG = 0;
	this.m_iB = 0;
	this.m_iA = 255;

	if(this.m_kOwner.m_iTeam == 1)
	{
		this.m_iB = 255;
	}
	else if(this.m_kOwner.m_iTeam == 2)
	{
		this.m_iR = 255;
	}
	else if(this.m_kOwner.m_iTeam == 3)
	{
		this.m_iG = 255;
	}
	else if(this.m_kOwner.m_iTeam == 4)
	{
		this.m_iR = 128;
		this.m_iB = 128;
	}
	else if(this.m_kOwner.m_iTeam == 5)
	{
		this.m_iR = 255;
		this.m_iG = 215;
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
	// Calculate vector to target
	var _x = x - this.m_liPos[0];
	var _y = y - this.m_liPos[1];
			
	// Calculate rotation to target based on vector
	var _desiredRotation = Math.atan2(_y, _x);
	
	// Make sure the desired angle takes into account the ships rotation
	_desiredRotation = wrapAngle(_desiredRotation - this.m_iRotation);
	
	// The desired rotation offset minus the actual
	var _turnAmount = _desiredRotation - this.m_iRotationOffset;
	
	// Unclamped turn amount for return value
	var _unclampedTurn = _turnAmount;
	
	// Clamp to the turning speed of this turret
	_turnAmount = clamp(_turnAmount, -this.m_iRotationSpeed, this.m_iRotationSpeed);
	
	// Turn the turret
	this.m_iRotationOffset += _turnAmount;
	
	// Keep rotation offset between -PI and +PI
	this.m_iRotationOffset = wrapAngle(this.m_iRotationOffset);
	
	// Cap rotation to min and max angles
	this.capRotation();
	
	// Add rotation offset to rotation
	this.m_iRotation += this.m_iRotationOffset;
	
	return _unclampedTurn;
}

Weapon.prototype.checkTarget = function(x, y)
{
	// Calculate vector to target
	var _x = x - this.m_liPos[0];
	var _y = y - this.m_liPos[1];
			
	// Calculate rotation to target based on vector
	var _desiredRotation = Math.atan2(_y, _x);
	
	// Make sure the desired angle takes into account the ships rotation
	_desiredRotation = wrapAngle(_desiredRotation - this.m_iRotation);
	
	if(_desiredRotation > this.m_iRotationMax)
		return false;
	
	if(_desiredRotation < this.m_iRotationMin)
		return false;
	
	return true;
}

Weapon.prototype.capRotation = function()
{		
	if(this.m_iRotationOffset < this.m_iRotationMin)
		this.m_iRotationOffset = this.m_iRotationMin;
	
	if(this.m_iRotationOffset > this.m_iRotationMax)
		this.m_iRotationOffset = this.m_iRotationMax;
}

Weapon.prototype.updateOffsets = function()
{
	// Update the position relative to the main ship 
	this.m_iOffsetAngle = Math.atan2(this.m_liOffset[1], this.m_liOffset[0]);	
	this.m_iOffsetAngle += this.m_kOwner.m_iRotation;
	
	// Update weapons actual position relative to ship
	this.m_liPos[0] = (this.m_kOwner.m_liPos[0]) + (this.m_iDistance * Math.cos(this.m_iOffsetAngle));
	this.m_liPos[1] = (this.m_kOwner.m_liPos[1]) + (this.m_iDistance * Math.sin(this.m_iOffsetAngle));
	
	// Reset rotation
	this.m_iRotation = this.m_kOwner.m_iRotation;
}

// DRAW HELPERS

Weapon.prototype.drawWeapon = function()
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
	m_kContext.arc(0, 0, 3, 0, 2 * Math.PI);
	m_kContext.closePath();
	m_kContext.fill();
	m_kContext.stroke();
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'black';
	m_kContext.lineWidth = 1;
	
	// Barrel
	m_kContext.beginPath();
	m_kContext.moveTo(0, -1);
	m_kContext.lineTo(0, 1);
	m_kContext.lineTo(2 + (8 * _percent), 1);
	m_kContext.lineTo(2 + (8 * _percent), -1);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	// Restore context back to default from relative to the ship
	m_kContext.restore();	
}

// Weapons without a beam simply have no collision polygon
Weapon.prototype.drawCollisionBox = function()
{
	if(this.m_bIsFiring)
	{		
		m_kContext.strokeStyle = this.m_cColour;	
		m_kContext.fillStyle = this.m_cColour;	
		
		m_kContext.globalAlpha = 1;
		m_kContext.lineWidth = 3;
		
		m_kContext.beginPath();
		
		for(var i = 0; i < this.m_cdCollisionPolygon.points.length; i++)
		{
			_x = this.m_cdCollisionPolygon.points[i].x;
			_y = this.m_cdCollisionPolygon.points[i].y;
			
			m_kContext.lineTo(_x, _y);	
		}
		
		m_kContext.closePath();
		m_kContext.fill();	
		m_kContext.stroke();	
	}
}