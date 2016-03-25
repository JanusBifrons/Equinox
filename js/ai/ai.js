function AI(x, y, sector, shipType)
{		
	// Map
	this.m_kSector = sector;
	
	// ID
	this.m_iID = guid();
	
	// Targets
	this.m_liTargets = new Array();
	this.m_iTargetIndex = 0;
	this.m_bHasTarget = false;
	
	this.m_iDistance = 0;
	
	// Desired location
	this.m_liDesiredLocation = new Array();
	this.m_liDesiredLocation[0] = 0;
	this.m_liDesiredLocation[1] = 0;
	
	// Target Location
	this.m_liTargetLocation = new Array();
	this.m_liTargetLocation[0] = 0;
	this.m_liTargetLocation[1] = 0;
	
	this.m_bManualFire = false;
	
	// Orbit
	this.m_iOrbit = 0;
	
	// Team
	this.m_iTeam = 2;
	
	switch(shipType)
	{
		case 0:
			this.m_kShip = new Debug(x, y, 0, 0, this, sector, 2);
			this.m_iOrbit = 100;
			this.m_bManualFire = true;
			break;		
	}
	
	console.log("AI initialised successfully.");
}

AI.prototype.update = function()
{		
	this.m_liTargetLocation[0] = m_kPlayer.m_kShip.m_liPos[0];
	this.m_liTargetLocation[1] = m_kPlayer.m_kShip.m_liPos[1];

	var _relativeRotation = Math.atan2(this.m_kShip.m_liPos[1] - this.m_liTargetLocation[1], this.m_kShip.m_liPos[0] - this.m_liTargetLocation[0]);
	
	this.m_liDesiredLocation[0] = this.m_liTargetLocation[0] + (this.m_iOrbit * Math.cos(_relativeRotation));
	this.m_liDesiredLocation[1] = this.m_liTargetLocation[1] + (this.m_iOrbit * Math.sin(_relativeRotation));
	
	this.m_iDistance = calculateDistance(this.m_liDesiredLocation, this.m_kShip.m_liPos);
		
	if(this.m_iDistance < 100)
	{	
		this.turnToFaceTarget();
	}
	else
	{
		this.turnToFaceTarget();
		
		this.m_kShip.accellerate();
	}
	
	this.m_kShip.m_liTargets.length = 0;
	
	// Fetch list of all potential targets
	var _targets = this.m_kSector.m_liShips;

	for(var i = 0; i < _targets.length; i++)
	{	
		if(_targets[i].m_iID != this.m_kShip.m_iID)
		{
			if(_targets[i].m_iTeam != this.m_kShip.m_iTeam)
			{
				this.m_kShip.onTarget(_targets[i]);
			}
		}
	}

	return;

	this.setTargets();
	
	this.m_kShip.m_liTargets = this.m_liTargets;

	var _closestIndex = findClosest(this.m_kShip, this.m_liTargets, 99999999);
		
	if(_closestIndex > -1)
	{
		this.m_iTargetIndex = _closestIndex;
		
		this.m_liTargetLocation[0] = this.m_liTargets[_closestIndex].m_liPos[0];
		this.m_liTargetLocation[1] = this.m_liTargets[_closestIndex].m_liPos[1];
	}
	else
	{
		this.m_liTargetLocation[0] = m_kPlayer.m_kShip.m_liPos[0];
		this.m_liTargetLocation[1] = m_kPlayer.m_kShip.m_liPos[1];
	}

	var _relativeRotation = Math.atan2(this.m_kShip.m_liPos[1] - this.m_liTargetLocation[1], this.m_kShip.m_liPos[0] - this.m_liTargetLocation[0]);
	
	this.m_liDesiredLocation[0] = this.m_liTargetLocation[0] + (this.m_iOrbit * Math.cos(_relativeRotation));
	this.m_liDesiredLocation[1] = this.m_liTargetLocation[1] + (this.m_iOrbit * Math.sin(_relativeRotation));
	
	this.m_iDistance = calculateDistance(this.m_liDesiredLocation, this.m_kShip.m_liPos);
		
	if(this.m_iDistance < 100)
	{	
		this.turnToFaceTarget();
	}
	else
	{
		this.turnToFaceTarget();
		
		this.m_kShip.accellerate();
	}
}	

AI.prototype.draw = function()
{
	// No need to draw anything as far as I know.
	
	// Just note... if you do try to draw something the manager isnt even calling this so you might 
	// want to hook that up too...
}

// HELPERS

AI.prototype.turnToFaceTarget = function()
{		
	var _desiredRotation = Math.atan2(this.m_liTargetLocation[1] - this.m_liDesiredLocation[1], this.m_liTargetLocation[0] - this.m_liDesiredLocation[0]);
	
	_desiredRotation = wrapAngle(_desiredRotation);
	
	var _diff = _desiredRotation - this.m_kShip.m_iRotation;
	
	if(this.m_iDistance < 500)
	{
		if(_diff < 0.1 && _diff > -0.1)
		{		
			if(this.m_bManualFire)
			{
				// Only required if ship have fixed turrets!
				this.m_kShip.onFire();
			}
		}
	}
	
	if(_diff < 0.01 && _diff > -0.01)
	{
		return;
	}
	
	if(_diff > 0)
	{
		if(_diff > Math.PI)
		{
			this.m_kShip.rotateLeft();
		}
		else
		{
			this.m_kShip.rotateRight();
		}
	}
	else if(_diff < 0)
	{
		if(_diff < -Math.PI)
		{
			this.m_kShip.rotateRight();
		}
		else
		{
			this.m_kShip.rotateLeft();
		}
	}
}

AI.prototype.headToTarget = function()
{
	var _distance = calculateDistance(this.m_liDesiredLocation, this.m_kShip.m_liPos);
	var _framesToStop = 0;
	var _timeToStop = 0;
	
	if(this.m_kShip.m_iSpeed > 0)
	{
		_framesToStop = this.m_kShip.m_iSpeed / this.m_kShip.m_iAccel;
		_timeToStop = this.m_kShip.m_iSpeed / 2; // Average speed
	}
	
	var _distanceToStop = _framesToStop * _timeToStop;
	
	if(_distanceToStop > _distance)
	{		
		this.stopMoving();
	}
	else
	{
		if(_distance > this.m_iOrbit)
		{
			this.m_kShip.accellerate();
		}
	}
}

AI.prototype.stopMoving = function()
{
	var _moveRotation = Math.atan2(this.m_kShip.m_liMove[1], this.m_kShip.m_liMove[0]);
	
	_moveRotation = wrapAngle(_moveRotation);
	
	var _diff = _moveRotation - this.m_kShip.m_iRotation;
	
	if(_diff > 0)
	{
		if(_diff > Math.PI)
		{
			this.m_kShip.rotateLeft();
		}
		else
		{
			this.m_kShip.rotateRight();
		}
	}
	else if(_diff < 0)
	{
		if(_diff < -Math.PI)
		{
			this.m_kShip.rotateRight();
		}
		else
		{
			this.m_kShip.rotateLeft();
		}
	}
	
	if(_diff < 0.1 && _diff > -0.1)
	{			
		// Stopping
		this.m_kShip.stop();
	}
}

AI.prototype.setTargets = function()
{	
	// Reset list
	this.m_liTargets.length = 0;
	
	// Fetch list of all potential targets
	var _targets = this.m_kSector.m_kStructureManager.m_liStructures;
	
	for(var i = 0; i < _targets.length; i++)
	{	
		// Target!
		this.m_liTargets.push(_targets[i]);
	}
	
	// AI completely ignores player until there are no structures left!
	if(this.m_liTargets.length == 0)
	{	
		// Fetch list of all potential targets
		var _targets = this.m_kSector.m_liShips;

		for(var i = 0; i < _targets.length; i++)
		{	
			if(_targets[i].m_iID != this.m_kShip.m_iID)
			{
				if(_targets[i].m_iTeam != this.m_kShip.m_iTeam)
				{
					// Target!
					this.m_liTargets.push(_targets[i]);	
				}
			}
		}
	}
}