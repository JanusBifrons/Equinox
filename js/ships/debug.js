Debug.prototype = new Ship();
Debug.prototype.constructor = Debug;

function Debug(x, y, moveX, moveY, owner, sector, team)
{		
	// ID
	this.m_kOwner = owner;
	this.m_kSector = sector;
	this.m_iTeam = team;
	this.m_iID = guid();
	
	// These must be reinitialized
	// because Javascript is crazy...
	this.m_liWeapons = new Array();
	this.m_liShields = new Array();
	this.m_liTargets = new Array();
	
	// Movement Variables
	this.m_liPos = new Array();
	this.m_liMove = new Array();
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	this.m_liMove[0] = moveX;
	this.m_liMove[1] = moveY;
	this.m_iRadius = 60;
	
	// Rotation and Speed
	this.m_iRotation = 0;
	this.m_iRotationSpeed = 0.035;
	this.m_iMaxSpeed = 20;
	this.m_iAccel = 0.08;
	
	// Stats
	this.m_iShieldRegenCap = 20000;
	this.m_iShieldRegen = 20000; // seconds (mili)
	this.m_iShieldCap = 75;
	this.m_iShields = 75;
	//this.m_iShieldCap = 0;
	//this.m_iShields = 0;
	
	this.m_iArmourCap = 100;
	this.m_iArmour = 100;
	this.m_iArmourRegen = 0;
	
	this.m_iHullCap = 250;
	this.m_iHull = 250;
	this.m_iHullRegen = 2.5;
	
	//this.m_iPowerRegen = 7.5;
	this.m_iPowerRegen = 75;
	this.m_iPowerStored = 100;
	this.m_iPowerCap = 100;
	
	// Hyper Drive
	this.m_iHyperTarget = this.m_kSector.m_iID; // Default current sector
	this.m_bIsHypering = false;
	this.m_iHyperCharge = 0;
	this.m_iHyperChargeMax = 5000; // Milliseconds
	
	this.m_kCargoHold = new Cargo(this, 5);
	
	this.createWeapons();
	
	this.createComponents();
	
	console.log("Initialized Debug Ship successfully.");
}

Debug.prototype.update = function()
{
	// Call base update
	Ship.prototype.update.call(this);
}

Debug.prototype.draw = function()
{			
	// Call base draw
	Ship.prototype.draw.call(this);
}

Debug.prototype.createWeapons = function()
{
	var _beams = new Array();
	var _beam1 = new LightBeam(this, 0, -20, 0, 0);
	var _beam2 = new LightBeam(this, 0, 20, 0, 0);
	_beams.push(_beam1);
	_beams.push(_beam2);
	
	var _cannons = new Array();
	var _cannon1 = new LightCannon(this, -12, -18, 0, 0);
	var _cannon2 = new LightCannon(this, -12, 18, 0, 0);
	_cannons.push(_cannon1);
	_cannons.push(_cannon2);
	
	var _construction = new Array();
	var _construction1 = new Construction(this, 20, 0, 0, 0);
	_construction.push(_construction1);
	
	this.m_liWeapons.push(_beams);
	this.m_liWeapons.push(_cannons);
	this.m_liWeapons.push(_construction);
}

Debug.prototype.createComponents = function()
{
	// Ship components
	this.m_liComponents = new Array();	
	
	this.m_liComponents.push(new RearWing(this, -30, -12, 1, false));
	this.m_liComponents.push(new RearWing(this, -30, 12, 1, true));
	
	this.m_liComponents.push(new Wing(this, -10, -20, 1, false));
	this.m_liComponents.push(new Wing(this, -10, 20, 1, true));
	
	this.m_liComponents.push(new Cockpit(this, 40, 0, 1.5));
	
	this.m_liComponents.push(new Pad(this, 0, -8, 1.5, false));
	this.m_liComponents.push(new Pad(this, 0, 8, 1.5, true));
}
