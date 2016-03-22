Tyrant.prototype = new Ship();
Tyrant.prototype.constructor = Tyrant;

function Tyrant(x, y, moveX, moveY, owner)
{	
	this.m_kOwner = owner;
	
	this.m_kSector = this.m_kOwner.m_kSector;
	
	// Generate a new GUID
	this.m_iID = guid();
	
	// These must be reinitialized
	// because Javascript is crazy...
	this.m_liWeapons = new Array();
	
	// Movement Variables
	this.m_liPos = new Array();
	this.m_liMove = new Array();
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	this.m_liMove[0] = moveX;
	this.m_liMove[1] = moveY;
	this.m_iRadius = 160;
	
	// Rotation and Speed
	this.m_iRotation = 0;
	this.m_iRotationSpeed = 0.005;
	this.m_iMaxSpeed = 3;
	this.m_iAccel = 0.01;
	
	// Statsa
	this.m_iShieldRegenCap = 20000;
	this.m_iShieldRegen = 20000; // seconds (mili)
	this.m_iShieldCap = 750;
	this.m_iShields = 750;
	
	this.m_iArmourCap = 1000;
	this.m_iArmour = 1000;
	this.m_iArmourRegen = 0;
	
	this.m_iHullCap = 250;
	this.m_iHull = 250;
	this.m_iHullRegen = 4;
	
	this.m_iPowerRegen = 75;
	this.m_iPowerStored = 1000;
	this.m_iPowerCap = 1000;
	
	// Hyper Drive
	this.m_iHyperTarget = this.m_kSector.m_iID; // Default current sector
	this.m_bIsHypering = false;
	this.m_iHyperCharge = 0;
	this.m_iHyperChargeMax = 5000; // Milliseconds

	// PORT SIDE CANNONS
	var _portCannons = new Array();
	var _cannon1 = new LightBeam(this, -35, -75, Math.PI + 0.2, Math.PI * 2);
	var _cannon2 = new LightBeam(this, -95, -75, Math.PI, (Math.PI * 2) - 0.2);
	_portCannons.push(_cannon1);
	_portCannons.push(_cannon2);

	// STARBOARD SIDE CANNONS
	var _starboardCannons = new Array();
	var _cannon3 = new LightBeam(this, -35, 75, 0, Math.PI - 0.2);
	var _cannon4 = new LightBeam(this, -95, 75, 0.2, Math.PI);	
	_starboardCannons.push(_cannon3);
	_starboardCannons.push(_cannon4);
	
	// Add weapon sets to ship!
	this.m_liWeapons.push(_portCannons);
	this.m_liWeapons.push(_starboardCannons);
	
	//ID
	this.m_iTeam = this.m_kOwner.m_iTeam;
	
	console.log("Initialized Tyrant Ship successfully.");
}

Tyrant.prototype.update = function()
{	
	// Call base update
	Ship.prototype.update.call(this);
}

Tyrant.prototype.draw = function()
{			
	// Move screen to player location
	m_kContext.save();
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	// Rotate to players angle
	m_kContext.rotate(this.m_iRotation);
	
	// Draw the flame if you're accelerating
	this.drawFlame();
	
	// Draw ship
	this.drawShip();
	
	// Draw shield
	this.drawShield((this.m_iShields / this.m_iShieldCap) * 100);
	
	// Restore context back to default from relative to the ship
	m_kContext.restore();		
	
	// Call base draw
	Ship.prototype.draw.call(this);
}

Tyrant.prototype.drawShield = function(shieldPercent)
{
	if(this.m_iShields > 0)
	{	
		// Draw Shield
		m_kContext.strokeStyle = 'blue';	
		m_kContext.fillStyle = 'blue';
		m_kContext.lineWidth = (5 / 100) * shieldPercent;
		
		m_kContext.beginPath();
		m_kContext.arc(0, 0, this.m_iRadius, 0, 2 * Math.PI);
		m_kContext.stroke();
		m_kContext.closePath();	
	}
}

Tyrant.prototype.drawShip = function()
{
	// Draw Ship
	m_kContext.strokeStyle = 'gray';
	m_kContext.fillStyle = 'black';
	m_kContext.lineWidth = 3;
	
	// Body
	m_kContext.beginPath();
	
	// Middle to engine segment
	m_kContext.moveTo(0, -60);
	m_kContext.lineTo(-10, -60);
	m_kContext.lineTo(-30, -80);
	m_kContext.lineTo(-40, -80);
	m_kContext.lineTo(-60, -60);
	m_kContext.lineTo(-70, -60);
	m_kContext.lineTo(-90, -80);
	m_kContext.lineTo(-100, -80);
	
	// Engine Segment
	m_kContext.lineTo(-120, -60);
	m_kContext.lineTo(-140, -60);
	m_kContext.lineTo(-140, -50);
	m_kContext.lineTo(-120, -50);
	m_kContext.lineTo(-120, -40);
	m_kContext.lineTo(-140, -40);
	m_kContext.lineTo(-140, -30);
	m_kContext.lineTo(-120, -30);
	m_kContext.lineTo(-120, -20);
	m_kContext.lineTo(-140, -20);
	
	// Engine Segment	
	m_kContext.lineTo(-140, 20);
	m_kContext.lineTo(-120, 20);
	m_kContext.lineTo(-120, 30);
	m_kContext.lineTo(-140, 30);
	m_kContext.lineTo(-140, 40);
	m_kContext.lineTo(-120, 40);
	m_kContext.lineTo(-120, 50);
	m_kContext.lineTo(-140, 50);
	m_kContext.lineTo(-140, 60);
	m_kContext.lineTo(-120, 60);
	
	// Engine segment back to middle
	m_kContext.lineTo(-100, 80);
	m_kContext.lineTo(-90, 80);
	m_kContext.lineTo(-70, 60);
	m_kContext.lineTo(-60, 60);
	m_kContext.lineTo(-40, 80);
	m_kContext.lineTo(-30, 80);
	m_kContext.lineTo(-10, 60);
	m_kContext.lineTo(0, 60);
	
	// Front Neck
	m_kContext.lineTo(10, 50);
	m_kContext.lineTo(20, 50);
	m_kContext.lineTo(30, 40);
	m_kContext.lineTo(40, 40);
	
	// Front
	m_kContext.lineTo(120, 40);
	m_kContext.lineTo(130, 20);
	
	// Middle
	m_kContext.lineTo(140, 0);
	
	// Front
	m_kContext.lineTo(130, -20);
	m_kContext.lineTo(120, -40);
	
	// Front Neck
	m_kContext.lineTo(40, -40);
	m_kContext.lineTo(30, -40);
	m_kContext.lineTo(20, -50);
	m_kContext.lineTo(10, -50);
	
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	// COCKPIT
	
	// Draw Ship
	m_kContext.strokeStyle = 'gray';
	m_kContext.fillStyle = this.m_cColour;
	m_kContext.lineWidth = 3;
	
	// Body
	m_kContext.beginPath();
	m_kContext.moveTo(110, -30);
	m_kContext.lineTo(120, -20);
	m_kContext.lineTo(120, 20);
	m_kContext.lineTo(110, 30);
	m_kContext.lineTo(40, 30);
	m_kContext.lineTo(30, 20);
	m_kContext.lineTo(30, -20);
	m_kContext.lineTo(40, -30);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
}

Tyrant.prototype.drawFlame = function()
{
}