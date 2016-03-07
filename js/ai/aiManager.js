function AIManager(sector)
{		
	this.m_kSector = sector;

	this.m_liAI = new Array();
	
	this.m_iSpawnTimer = 0;
	this.m_iSpawnTimerMax = 150000; // 2.5 minutes
	
	//this.m_iSpawnTimerMax = 6000000000;
	this.m_iSpawnTimer = this.m_iSpawnTimerMax * 0.99;
	
	console.log("AI Manager initialised successfully.");
}

AIManager.prototype.update = function()
{		
	// Don't do anything if the player isnt in this sector!
	if(this.m_kSector.m_iID != m_kPlayer.m_kSector.m_iID)
		return;

	this.m_iSpawnTimer += m_fElapsedTime;
	
	var _secondsLeft = Math.floor((this.m_iSpawnTimerMax - this.m_iSpawnTimer) / 1000);
	
	if(_secondsLeft >= 60)
	{
		var _minutesLeft = Math.floor(_secondsLeft / 60);
		
		_secondsLeft -= (_minutesLeft * 60);
		
		m_kLog.addStaticItem("Incoming attack in " + _minutesLeft + " minutes and " + _secondsLeft + " seconds.", 255, 255, 255);
	}
	else
	{
		m_kLog.addStaticItem("Incoming attack in " + _secondsLeft + " seconds.", 255, 255, 255);
	}
	
	if(this.m_iSpawnTimer >= this.m_iSpawnTimerMax)
	{
		this.m_iSpawnTimer = 0;
		
		// Reset max!
		// This is because we want the first spawn to take longer
		//this.m_iSpawnTimerMax = 60000;
		
		var _randomRotation = Math.random() * (Math.PI * 2);
		var _distance = 10000 + (Math.random() * 15000);
		
		var _x = _distance * Math.cos(_randomRotation);
		var _y = _distance * Math.sin(_randomRotation);
		
		//this.spawnAttack(10000, 10000, 20, 3);
		
		//this.spawnAttack(_x, _y, 1000, 5);
		
		//this.spawnAttack(_x, _y, 100, 1);
		
		this.createAI(-2000, -1000, 2);	
	}

	// Update AI
	this.updateAI();
}

AIManager.prototype.draw = function()
{
}

// HELPERS

AIManager.prototype.updateAI = function()
{
	// AI index to delete
	var _index = -1;
	
	// Update AI
	for(var i = 0; i < this.m_liAI.length; i++)
	{
		this.m_liAI[i].update();
		
		// If destroyed, set index
		if(!this.m_liAI[i].m_kShip.m_bIsAlive)
		{		
			_index = i;
		}
	}
	
	if(_index > -1)
	{			
		// Remove ai
		this.m_liAI.splice(_index, 1);
	}
}

AIManager.prototype.createAI = function(x, y, shipType)
{
	// Create new AI
	var _AI = new AI(x, y, this.m_kSector, shipType);

	// Add to list!
	this.m_liAI.push(_AI);
	
	// Add ship to sector!
	this.m_kSector.addShip(_AI.m_kShip);
}

AIManager.prototype.spawnAttack = function(x, y, radius, size)
{
	var _x = x - radius;
	var _y = y - radius;
	
	for(var i = 0; i < size; i++)
	{
		var _shipType = Math.random();
		
		if(_shipType >= 1)
		{
			// Will never spawn a heavier ship
			_shipType = 1;
		}
		else
		{
			_shipType = 0;
		}
		
		this.createAI(_x + Math.random() * (radius * 2), _y + Math.random() * (radius * 2), _shipType);	
	}
	
	m_kLog.addImportantItem("Enemy fleet detected!", 5000, 255, 0, 0);
}