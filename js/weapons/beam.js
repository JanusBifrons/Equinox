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
	
	this.m_liHitLocation = new Array();
	this.m_liHitLocation[0] = 0;
	this.m_liHitLocation[1] = 0;
	
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

		
		if(this.m_liHitLocation[0] == 0 && this.m_liHitLocation[1] == 0)
		{
			
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
		else
		{
			
			var _x = this.m_cdCollisionPolygon.points[0].x;
			var _y = this.m_cdCollisionPolygon.points[0].y;
			
			m_kContext.beginPath();
			m_kContext.moveTo(_x, _y);	
			m_kContext.lineTo(this.m_liHitLocation[0], this.m_liHitLocation[1]);
			m_kContext.closePath();
			m_kContext.fill();	
			m_kContext.stroke();	
			
			m_kContext.beginPath();
			m_kContext.arc(this.m_liHitLocation[0], this.m_liHitLocation[1], 5, 0, 2 * Math.PI);
			m_kContext.closePath();
			m_kContext.fill();	
			m_kContext.stroke();	
		}
	}
		
	this.m_liHitLocation[0] = 0;
	this.m_liHitLocation[1] = 0;
	
	// Call base draw
	Weapon.prototype.draw.call(this);
}

// DRAWING HELPERS
Beam.prototype.drawBeam = function(x1, y1, x2, y2)
{
	for(var i = 0; i < 0; i++)
	{
		m_kContext.globalAlpha = i / 500;
		m_kContext.lineWidth = 35 - i;

		m_kContext.beginPath();
		m_kContext.moveTo(x1, y1);
		m_kContext.lineTo(x2, y2);
		m_kContext.closePath();	

		m_kContext.stroke();
		m_kContext.fill();
	}
	
	m_kContext.globalAlpha = 1;
	m_kContext.lineWidth = 2;
		
	m_kContext.beginPath();
	m_kContext.moveTo(x1, y1);
	m_kContext.lineTo(x2, y2);
	m_kContext.closePath();	

	m_kContext.stroke();
	m_kContext.fill();
}

// EVENTS

Beam.prototype.onHit = function(targetHit, componentHit)
{	
	Weapon.prototype.onHit.call(this);
	
	var _damage = (this.m_iDamage / 1000) * m_fElapsedTime;
	
	targetHit.onHit(_damage);
	
	var _x1 = this.m_cdCollisionPolygon.points[0].x;
	var _y1 = this.m_cdCollisionPolygon.points[0].y;
	
	var _x2 = this.m_cdCollisionPolygon.points[1].x;
	var _y2 = this.m_cdCollisionPolygon.points[1].y;
	
	for(var i = 0; i < componentHit.m_liPoints.length; i++)
	{
		var _x3 = componentHit.m_liPoints[i].x;
		var _y3 = componentHit.m_liPoints[i].y;
		
		if((i + 1) < componentHit.m_liPoints.length)
		{			
			var _x4 = componentHit.m_liPoints[i + 1].x;
			var _y4 = componentHit.m_liPoints[i + 1].y;
		}
		else if(i == componentHit.m_liPoints.length - 1)
		{
			var _x4 = componentHit.m_liPoints[0].x;
			var _y4 = componentHit.m_liPoints[0].y;
		}
							
		var _intersection = m_kCollisionManager.calculateIntersectionPoint(_x1, _y1, _x2, _y2, _x3, _y3, _x4, _y4);	
		
		if(_intersection.getType()== Line2D.LineIntersection.Type.INTERSECTING)
		{
			this.m_liHitLocation[0] = _intersection.getPos().x;
			this.m_liHitLocation[1] = _intersection.getPos().y; 
		}
	}
	
	return;
	
	// Calculate hit location
	var _intersection = m_kCollisionManager.calculateIntersectionPoint(90, 10, 10, 90, 10, 10, 90, 90);
	
	if(_intersection.getType()== Line2D.LineIntersection.Type.INTERSECTING)
	{
		m_kLog.addStaticItem(_intersection.getPos().x); 
		m_kLog.addStaticItem(_intersection.getPos().y);
		
		this.m_liHitLocation[0] = _intersection.getPos().x;
		this.m_liHitLocation[1] = _intersection.getPos().y; 
	}
	else
	{
		this.m_liHitLocation[0] = 0;
		this.m_liHitLocation[1] = 0;
	}
}




















