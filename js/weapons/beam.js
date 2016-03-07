Beam.prototype = new Weapon();
Beam.prototype.constructor = Beam;

function Beam()
{
	this.m_sDescription = "Beam";
	
	this.m_iType = 1;

	this.m_kOwner;

	this.m_kOwner;

	this.m_kOffset = new Array();
	this.m_kOffset[0] = 0;
	this.m_kOffset[1] = 0;
	this.m_iDistance = 0;
	
	this.m_iPositionOffset = 0;
	
	this.m_liPos = new Array();
	this.m_liPos[0] = 0;
	this.m_liPos[1] = 0;
	
	this.m_iRotation = 0;
	
	this.m_iRotationMin = 0;
	this.m_iRotationMax = 0;
	this.m_bUnlimitedRotation = false;
	this.m_iRotationSpeed = 0;
	
	this.m_iRotationOffset = 0;
	
	// Stats
	this.m_iRange = 0;
	this.m_iCooldown = 0;
	this.m_iDamage = 0;
	this.m_iDrain = 0;
	
	// Local variables	
	this.m_iBeamDistance = 0;
	this.m_liBeam = new Array();
	this.m_liBeam[0] = 0;
	this.m_liBeam[1] = 0;
	
	// Initialise collision detection polygon
	//this.m_cdCollisionPolygon = new P(new V(0, 0), [new V(this.m_liPos[0], this.m_liPos[1]), new V(this.m_liBeam[0], this.m_liBeam[1])]);
	
	this.m_iR = 255;
	this.m_iG = 0;
	this.m_iB = 0;
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
	
	console.log("Missile Launcher initialised successfully.");
}

Beam.prototype.update = function()
{	
	// Call base update
	Weapon.prototype.update.call(this);

	// Update beam position
	this.m_liBeam[0] = this.m_liPos[0] + (this.m_iBeamDistance * Math.cos(this.m_iRotation));
	this.m_liBeam[1] = this.m_liPos[1] + (this.m_iBeamDistance * Math.sin(this.m_iRotation));
	
	// Update collision polygon
	this.m_cdCollisionPolygon = new P(new V(0, 0), [new V(this.m_liPos[0], this.m_liPos[1]), new V(this.m_liBeam[0], this.m_liBeam[1])]);
}

Beam.prototype.draw = function()
{		
	if(this.m_bIsFiring)
	{		
		m_kContext.strokeStyle = this.m_cColour;	
		m_kContext.fillStyle = this.m_cColour;	
		
		m_kContext.globalAlpha = 1;
		m_kContext.lineWidth = 3;
		
		m_kContext.beginPath();
		
		for(var i = 0; i < this.m_cdCollisionPolygon.points.length; i++)
		{
			_x = this.m_cdCollisionPolygon.points[i].x;
			_y = this.m_cdCollisionPolygon.points[i].y;
			
			m_kContext.lineTo(_x, _y);	
		}
		
		m_kContext.closePath();
		m_kContext.fill();	
		m_kContext.stroke();	
	}
	
	// Call base draw
	Weapon.prototype.draw.call(this);
}

// EVENTS

Beam.prototype.onHit = function(targetHit)
{
	Weapon.prototype.onHit.call(this);
	
	var _damage = (this.m_iDamage / 1000) * m_fElapsedTime;
	
	targetHit.onHit(_damage);
}