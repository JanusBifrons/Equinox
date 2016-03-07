BeamTurret.prototype = new Structure();
BeamTurret.prototype.constructor = BeamTurret;

function BeamTurret(x, y)
{
	this.m_iType = 66;
	
	this.m_liPos = new Array();
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	this.m_iRadius = 45;
	
	// ID
	this.m_iID = guid();
	this.m_bNeedsTeam = true;
	this.m_iTeam = 0;
	
	this.m_iPowerStored = 0;
	this.m_iPowerStoreMax = 1000;
	this.m_iMaxConnections = 1;
	
	this.m_liTargets = new Array();
	
	// Stats
	this.m_iShieldRegenCap = 120000; // 2 minutes
	this.m_iShieldCap = 500;
	this.m_iArmourCap = 1000;
	this.m_iArmourRegen = 0.06; // Should mean 10 minutes to regen fully
	this.m_iHullCap = 1000;
	this.m_iHullRegen = 0.06;
	
	// Collision Detection
	this.m_liShields = new Array();
	this.m_liComponents = new Array();
	
	// Construction
	this.m_iMetalRequired = 1000;
	
	// Local Variables
	var _beams = new Array();
	var _beam1 = new MediumBeam(this, 0, 0, 0, Math.PI * 2);
	_beams.push(_beam1);

	this.m_liWeapons = new Array();	
	this.m_liWeapons.push(_beams);
	
	// Components
	this.m_liComponents.push(new HexHull(this, 0, 0, 0.45));
	
	console.log("Initialized Cannon Turret structure successfully.");
}

BeamTurret.prototype.update = function()
{	
	// Call base update
	Structure.prototype.update.call(this);
	
	if(this.m_bIsConstructed)
	{
		if(this.m_iPowerStored < this.m_iPowerStoreMax)
		{
			// Get some power!
			if(Structure.prototype.onRequest.call(this, new Request(this, 0, 200)))
			{	
				this.m_iPowerStored += 200;
			}	
		}	
					
		// Populate list of targets in range
		this.setTargets();
	}
}

BeamTurret.prototype.draw = function()
{		
	// Call base draw
	Structure.prototype.draw.call(this);	
}

// EVENTS

BeamTurret.prototype.onFire = function()
{	
	for(var i = 0; i < this.m_liWeapons.length; i++)
	{	
		var _weapons = this.m_liWeapons[i];
	
		for(var j = 0; j < _weapons.length; j++)
		{		
			_weapons[j].onFire();
		}
	}
}

// HELPERS

BeamTurret.prototype.setTargets = function()
{
	// Fetch list of all potential targets
	var _targets = this.m_kSector.m_liShips;
	
	// Reset list
	this.m_liTargets.length = 0;
	
	for(var i = 0; i < _targets.length; i++)
	{	
		// If you aren't neutral and you aren't on my team
		if(_targets[i].m_iTeam != 0 && _targets[i].m_iTeam != this.m_iTeam)
		{
			// Target!
			this.m_liTargets.push(_targets[i]);
		}
	}
	
	// Fetch list of all potential targets
	var _targets = this.m_kSector.m_kStructureManager.m_liStructures;
	
	for(var i = 0; i < _targets.length; i++)
	{	
		// If you aren't neutral and you aren't on my team
		if(_targets[i].m_iTeam != 0 && _targets[i].m_iTeam != this.m_iTeam)
		{
			// Target!
			this.m_liTargets.push(_targets[i]);
		}
	}
}