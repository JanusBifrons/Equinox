CannonTurret.prototype = new Structure();
CannonTurret.prototype.constructor = CannonTurret;

function CannonTurret(x, y)
{
	this.m_iType = 66;
	
	this.m_liPos = new Array();
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	this.m_iRadius = 100;
	//this.m_iRotation = Math.PI / 2;
	
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
	this.m_iShieldCap = 100;
	this.m_iArmourCap = 1000;
	this.m_iArmourRegen = 0.06; // Should mean 10 minutes to regen fully
	this.m_iHullCap = 1000;
	this.m_iHullRegen = 0.06;
	
	// Construction
	this.m_iMetalRequired = 3000;
	
	// Local Variables	
	var _cannons = new Array();
	var _cannon1 = new MediumCannon(this, 0, 0, 0, Math.PI * 2);
	_cannons.push(_cannon1);
	
	//var _cannon1 = new MediumCannon(this, -60, 0, Math.PI * 1.3, Math.PI * 1.7);
	//var _cannon2 = new MediumCannon(this, -20, 0, Math.PI * 1.3, Math.PI * 1.7);
	//var _cannon3 = new MediumCannon(this, 20, 0, Math.PI * 1.3, Math.PI * 1.7);
	//var _cannon4 = new MediumCannon(this, 60, 0, Math.PI * 1.3, Math.PI * 1.7);
	//_cannons.push(_cannon1);
	//_cannons.push(_cannon2);
	//_cannons.push(_cannon3);
	//_cannons.push(_cannon4);

	this.m_liWeapons = new Array();	
	this.m_liWeapons.push(_cannons);
	
	console.log("Initialized Cannon Turret structure successfully.");
}

CannonTurret.prototype.update = function()
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
				this.m_iPowerStored += (200 / 1000) * m_fElapsedTime;
			}	
		}	
					
		// Populate list of targets in range
		this.setTargets();
	}
}

CannonTurret.prototype.draw = function()
{	
	// Alpha the structure if it isn't fully built!	
	var _alpha = 0.6 + (0.4 * (this.m_iMetalBuilt / this.m_iMetalRequired));
	m_kContext.globalAlpha = _alpha;

	// Drawing variables
	var _hexHeight = Math.sqrt(3) * (this.m_iRadius * 0.9);
	var _hexWidth = 2 * (this.m_iRadius * 0.9);
	var _hexSide = (3 / 2) * (this.m_iRadius * 0.9);
	
	// Move screen to structure location
	m_kContext.save();
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	// Rotate to structures rotation
	m_kContext.rotate(this.m_iRotation);
	
	var _x = this.m_liPos[0];
	var _y = this.m_liPos[1];
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = this.m_cColour;
	m_kContext.lineWidth = 1;
	
	m_kContext.beginPath();
	m_kContext.moveTo(-(_hexWidth - _hexSide), -(_hexHeight / 2));
	m_kContext.lineTo((_hexWidth - _hexSide), -(_hexHeight / 2));
	m_kContext.lineTo((_hexWidth / 2), 0);
	m_kContext.lineTo((_hexWidth - _hexSide), (_hexHeight / 2));
	m_kContext.lineTo(-(_hexWidth - _hexSide), (_hexHeight / 2));
	m_kContext.lineTo(-(_hexWidth / 2), 0);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	// Restore context back to default from relative to the structure
	m_kContext.restore();	
	
	// Call base draw
	Structure.prototype.draw.call(this);	
}

// EVENTS

CannonTurret.prototype.onFire = function()
{	
	// REDUNDANT FUNCTION!
	
	// WEAPONS FIRE AUTOMATICALLY!

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

CannonTurret.prototype.setTargets = function()
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