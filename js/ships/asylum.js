Asylum.prototype = new Ship();
Asylum.prototype.constructor = Asylum;

function Asylum(x, y, moveX, moveY, owner, sector, team)
{		
	// Copy owner
	this.m_kOwner = owner;

	// Call base initialize
	GameObject.prototype.initialize.call(this, "Asylum", "Ship", team, sector, x, y, moveX, moveY, 0, 0.0035, 1600, 1.5, 0.05);
	
	// Call base initialize stats
	GameObject.prototype.initializeStats.call(this, 10, 1, 100, 100, 250, 100);
	
	this.m_liWeapons = new Array();
	this.m_liTargets = new Array();
	
	this.m_iPowerRegen = 75;
	this.m_iPowerStored = 100;
	this.m_iPowerCap = 100;
	
	// Hyper Drive
	this.m_iHyperTarget = this.m_kSector.m_iID; // Default current sector
	this.m_bIsHypering = false;
	this.m_iHyperCharge = 0;
	this.m_iHyperChargeMax = 5000; // Milliseconds
	
	this.m_kCargoHold = new Cargo(this.m_iID, 5);
	
	this.createWeapons();
	
	console.log("Initialized Asylum Ship successfully.");
}

Asylum.prototype.update = function()
{
	// Call base update
	Ship.prototype.update.call(this);
}

Asylum.prototype.draw = function()
{			
	// Call base draw
	Ship.prototype.draw.call(this);
}

Asylum.prototype.createWeapons = function()
{
	// PORT SIDE CANNONS
	var _portCannons = new Array();
	var _cannon1 = new MediumCannon(this, -35, -100, -Math.PI, 0);
	var _cannon2 = new MediumCannon(this, -95, -100, -Math.PI, 0);
	_portCannons.push(_cannon1);
	_portCannons.push(_cannon2);

	// STARBOARD SIDE CANNONS
	var _starboardCannons = new Array();
	var _cannon3 = new MediumCannon(this, -35, 100, 0, Math.PI);
	var _cannon4 = new MediumCannon(this, -95, 100, 0, Math.PI);	
	_starboardCannons.push(_cannon3);
	_starboardCannons.push(_cannon4);
	
	this.m_liWeapons.push(_portCannons);
	this.m_liWeapons.push(_starboardCannons);
}

Asylum.prototype.createComponents = function()
{
	// Ship components
	this.m_liComponents = new Array();	
	
	//this.m_liComponents.push(new RectHull(this, -125, 50, 1, 250, 100, 10));
	//this.m_liComponents.push(new RectHull(this, -125, -50, 1, 250, 100, 10));
	//this.m_liComponents.push(new RectHull(this, 125, 50, 1, 250, 100, 10));
	//this.m_liComponents.push(new RectHull(this, 125, -50, 1, 250, 100, 10));
	
	this.m_liComponents.push(new RectHull(this, 0, 0, 1, 2500, 2500, 250));
}
