Debug.prototype = new Ship();
Debug.prototype.constructor = Debug;

function Debug(x, y, moveX, moveY, owner, sector, team)
{		
	// Copy owner
	this.m_kOwner = owner;

	// Call base initialize
	GameObject.prototype.initialize.call(this, "DebugShip", "Ship", team, sector, x, y, moveX, moveY, 0, 0.035, 60, 20, 0.08);
	
	// Call base initialize stats
	//GameObject.prototype.initializeStats.call(this, 60, 75, 100, 100, 250, 100);
	GameObject.prototype.initializeStats.call(this, 60, 0, 100, 100, 250, 100);
	
	this.m_liWeapons = new Array();
	this.m_liTargets = new Array();
	
	this.m_iPowerRegen = 7.5;
	//this.m_iPowerRegen = 75;
	this.m_iPowerStored = 100;
	this.m_iPowerCap = 100;
	
	// Hyper Drive
	//this.m_iHyperTarget = this.m_kSector.m_iID; // Default current sector
	this.m_bIsHypering = false;
	this.m_iHyperCharge = 0;
	this.m_iHyperChargeMax = 5000; // Milliseconds
	
	this.m_kCargoHold = new Cargo(this.m_iID, 5);
	
	this.createWeapons();
	
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
	//var _beam1 = new LightBeam(this, 0, -20, 0, 0);
	//var _beam2 = new LightBeam(this, 0, 20, 0, 0);
	var _beam1 = new LightBeam(this, 0, -20, -(Math.PI * 0.75), Math.PI * 0.05);
	var _beam2 = new LightBeam(this, 0, 20, -(Math.PI * 0.05), Math.PI * 0.75);
	_beams.push(_beam1);
	_beams.push(_beam2);
	
	var _cannons = new Array();
	//var _cannon1 = new LightCannon(this, 0, -20, 0, 0);
	//var _cannon2 = new LightCannon(this, 0, 20, 0, 0);
	var _cannon1 = new LightCannon(this, 0, -20,  -(Math.PI * 0.75), Math.PI * 0.05);
	var _cannon2 = new LightCannon(this, 0, 20, -(Math.PI * 0.05), Math.PI * 0.75);
	_cannons.push(_cannon1);
	_cannons.push(_cannon2);
	
	var _constructionBeams = new Array();
	var _constructionBeam = new ConstructionBeam(this, 20, 0, -(Math.PI * 0.5), Math.PI * 0.5);
	_constructionBeams.push(_constructionBeam);
	
	var _tractorBeams = new Array();
	var _tractorBeam = new TractorBeam(this, 20, 0, -(Math.PI * 0.5), Math.PI * 0.5);
	_tractorBeams.push(_tractorBeam);
	
	//this.m_liWeapons.push(_beams);
	this.m_liWeapons.push(_cannons);
	//this.m_liWeapons.push(_constructionBeams);
	//this.m_liWeapons.push(_tractorBeams);
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
