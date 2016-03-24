Extractor.prototype = new Structure();
Extractor.prototype.constructor = Extractor;

function Extractor(x, y, sector)
{
		// Call base initialize
	GameObject.prototype.initialize.call(this, "Extractor", "Structure", 0, sector, x, y, 0, 0, 0, 0.035, 275, 20, 0);
	
	// Call base initialize stats
	GameObject.prototype.initializeStats.call(this, 120, 100, 250, 120, 250, 120);
	
	// Call base initialize resources
	Structure.prototype.initializeResources.call(this, 20, 0, false, 2);
	
	// Call base initialize flags
	Structure.prototype.initializeFlags.call(this, false, true, false, true);
	
	this.m_bCollideAsteroids = false;
	
	this.m_iMaxConnections = 1;
	
	// Construction
	this.m_iMetalRequired = 75;
	
	// Pathfinding
	this.m_liSiblings = new Array();
	this.m_liRoutes = new Array();
	
	// Local
	this.m_bHasAsteroid = false;
	this.m_kAsteroid;
	
	var _beams = new Array();
	var _beam1 = new ExtractorBeam(this, -50, -50, 0, Math.PI * 2);
	_beams.push(_beam1);

	this.m_liWeapons = new Array();	
	this.m_liWeapons.push(_beams);
	
	console.log("Initialized Extractor structure successfully.");
}

Extractor.prototype.update = function()
{		
	// Call base update
	Structure.prototype.update.call(this);
	
	var _asteroids = this.m_kSector.m_kAsteroidManager.m_liAsteroids;
	
	// ISNT PLACED
	if(!this.m_bIsPlaced)
	{
		this.m_iRadius = 25;
		this.m_bHasAsterroid = false;
		
		for(var i = 0; i < _asteroids.length; i++)
		{
			var _distance = calculateDistance(this.m_liPos, _asteroids[i].m_liPos);
			
			if(_distance < 100)
			{
				this.m_liPos[0] = _asteroids[i].m_liPos[0];
				this.m_liPos[1] = _asteroids[i].m_liPos[1];
				
				this.createComponents();
				
				//this.m_liComponents.length = 0;
				///this.m_liComponents.push(new HexHull(this, 0, 0, this.m_iRadius / 100));
				//this.m_liComponents[0].update();
				
				this.m_bHasAsterroid = true;
				this.m_kAsteroid = _asteroids[i];
			}				
		}
	}
	
	if(this.m_bIsConstructed)
	{		
		if(this.m_iPowerStored < this.m_iPowerStoreMax)
		{
			if(Structure.prototype.onRequest.call(this, new Request(this, 0, 4)))
			{
				this.m_iPowerStored += 4;
			}
		}
	}
}

Extractor.prototype.draw = function()
{	
	// Call base draw
	Structure.prototype.draw.call(this);
}

// HELPERS

Extractor.prototype.createComponents = function()
{
	this.m_liComponents = new Array();
	
	this.m_liComponents.push(new HexHull(this, 0, 0, 1));
	this.m_liComponents.push(new MetalBar(this, 75, 0, 1));
	this.m_liComponents.push(new EnergyBar(this, -75, 0, 1));
}

// EVENTS OVERRIDES

Extractor.prototype.onPlace = function()
{	
	// Check that this extractor has an asteroid to mine!
	if(!this.m_bHasAsterroid)
	{		
		// Display error
		m_kLog.addItem("Cannot place extractor here!", 2000, 255, 0, 0);
		m_kLog.addItem("Extrarctors MUST be placed on top of asteroids", 2000, 255, 255, 255);

		// Cannot place without a valid asteroid!
		return false;
	}
	
	this.onTarget(this.m_kAsteroid);
	
	// Call base draw
	return Structure.prototype.onPlace.call(this);
}

