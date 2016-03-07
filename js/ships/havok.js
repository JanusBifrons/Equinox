Havok.prototype = new Ship();
Havok.prototype.constructor = Havok;

function Havok(x, y, moveX, moveY, owner)
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
	this.m_iRadius = 30;
	
	// Rotation and Speed
	this.m_iRotation = 0;
	this.m_iRotationSpeed = 0.035;
	this.m_iMaxSpeed = 5;
	this.m_iAccel = 0.08;
	
	// Stats
	this.m_iShieldRegenCap = 20000;
	this.m_iShieldRegen = 20000; // seconds (mili)
	this.m_iShieldCap = 75;
	this.m_iShields = 75;
	
	this.m_iArmourCap = 100;
	this.m_iArmour = 100;
	this.m_iArmourRegen = 0;
	
	this.m_iHullCap = 50;
	this.m_iHull = 50;
	this.m_iHullRegen = 2.5;
	
	this.m_iPowerRegen = 7.5;
	this.m_iPowerStored = 100;
	this.m_iPowerCap = 100;
	
	// Hyper Drive
	this.m_iHyperTarget = this.m_kSector.m_iID; // Default current sector
	this.m_bIsHypering = false;
	this.m_iHyperCharge = 0;
	this.m_iHyperChargeMax = 5000; // Milliseconds
	
	var _beams = new Array();
	var _beam1 = new LightBeam(this, 20, 0, 0, 0);
	_beams.push(_beam1);
	
	this.m_liWeapons.push(_beams);
	
	//ID
	this.m_iTeam = this.m_kOwner.m_iTeam;
	
	console.log("Initialized Havok Ship successfully.");
}

Havok.prototype.update = function()
{	
	// Call base update
	Ship.prototype.update.call(this);
}

Havok.prototype.draw = function()
{			
	// Move screen to player location
	m_kContext.save();
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	// Rotate to players angle
	m_kContext.rotate(this.m_iRotation);
	
	m_kContext.globalAlpha = 1;
	
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

Havok.prototype.drawShield = function(shieldPercent)
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

Havok.prototype.drawShip = function()
{
	// Draw Ship
	m_kContext.strokeStyle = 'gray';
	m_kContext.fillStyle = 'black';
	m_kContext.lineWidth = 3;
	
	// Body
	m_kContext.beginPath();
	m_kContext.moveTo(8, -6);
	m_kContext.lineTo(-10, -20);
	m_kContext.lineTo(-15, -20);
	m_kContext.lineTo(-15, 20);
	m_kContext.lineTo(-10, 20);
	m_kContext.lineTo(8, 6);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	m_kContext.fillStyle = this.m_cColour;
	
	// Cockpit
	m_kContext.beginPath();
	m_kContext.moveTo(20, -2.5);
	m_kContext.lineTo(15, -5);
	m_kContext.lineTo(5, -5);
	m_kContext.lineTo(0, -2.5);
	m_kContext.lineTo(0, 2.5);
	m_kContext.lineTo(5, 5);
	m_kContext.lineTo(15, 5);
	m_kContext.lineTo(20, 2.5);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
}

Havok.prototype.drawFlame = function()
{
	// Draw flame is accelerating
	if(this.m_bIsAccelerating)
	{
		m_kContext.strokeStyle = 'red';	
		m_kContext.fillStyle = 'red';	
		
		m_kContext.beginPath();
		m_kContext.moveTo(-10, -20);
		m_kContext.lineTo(-50, 0);
		m_kContext.lineTo(-10, 20);
		m_kContext.lineTo(8, 6);
		m_kContext.closePath();	
		m_kContext.stroke();
		m_kContext.fill();
	}
}