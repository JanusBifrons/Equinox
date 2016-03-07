Extractor.prototype = new Structure();
Extractor.prototype.constructor = Extractor;

function Extractor(x, y)
{
	this.m_iType = 6;
	
	this.m_liPos = new Array();
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	this.m_iRadius = 150;
	this.m_bIsSolid = true;
	
	this.m_iPowerStored = 0;
	this.m_iPowerStoreMax = 2;
	this.m_iMaxConnections = 1;
	
	// Stats
	this.m_iShieldRegenCap = 120000; // 2 minutes
	this.m_iShieldCap = 100;
	this.m_iArmourCap = 350;
	this.m_iArmourRegen = 0.06;
	this.m_iHullCap = 350;
	this.m_iHullRegen = 0.06;
	
	// Local Variables
	var _beams = new Array();
	var _beam1 = new ExtractorBeam(this, -50, -50, 0, Math.PI * 2);
	_beams.push(_beam1);

	this.m_liWeapons = new Array();	
	this.m_liWeapons.push(_beams);
	
	this.m_liTargets = new Array();
	
	// Metal
	this.m_iMetalStored = 0;
	this.m_iMetalStoredMax = 2;
	
	this.m_iID = guid();
	
	// Collision Detection
	this.m_liShields = new Array();
	this.m_liComponents = new Array();
	this.m_bCollideAsteroids = false;
	
	// Construction
	this.m_iMetalRequired = 36;
	
	// Drawing
	this.m_iR = 50;
	this.m_iG = 50;
	this.m_iB = 255;
	this.m_iA = 255;
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
	
	// Local
	this.m_bHasAsterroid = false;
	this.m_kAsteroid;
	
	// Components
	this.createComponents();
	
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
		this.m_bHasAsterroid = false;
		
		for(var i = 0; i < _asteroids.length; i++)
		{
			var _distance = calculateDistance(this.m_liPos, _asteroids[i].m_liPos);
			
			if(_distance < 100)
			{
				this.m_liPos[0] = _asteroids[i].m_liPos[0];
				this.m_liPos[1] = _asteroids[i].m_liPos[1];
				
				this.createComponents();

				for(var j = 0; j < this.m_liComponents.length; j++)
					this.m_liComponents[j].update();	
				
				this.m_bHasAsterroid = true;
				this.m_kAsteroid = _asteroids[i];
			}				
		}
	}
	
	if(this.m_bIsConstructed)
	{
		this.m_liTargets.length = 0;
	
		if(this.m_iMetalStored < this.m_iMetalStoredMax)
		{		
			this.m_liTargets.push(this.m_kAsteroid);
		}
		
		var _drain = (2 / 1000) * m_fElapsedTime;
		
		if(this.m_iPowerStored < this.m_iPowerStoreMax)
			if(Structure.prototype.onRequest.call(this, new Request(this, 0, 2)))
				this.m_iPowerStored += 2;
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
	
	this.m_liComponents.push(new RectHull(this, 75, 50, Math.PI / 3, 0.25));
}

// EVENTS

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
	
	// Call base draw
	return Structure.prototype.onPlace.call(this);
}