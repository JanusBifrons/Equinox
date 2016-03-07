Cockpit.prototype = new ShipComponent();
Cockpit.prototype.constructor = Cockpit;

function Cockpit(owner, offsetX, offsetY, scale)
{
	this.m_kOwner = owner;
	
	this.m_liOffset = new Array();
	this.m_liOffset[0] = offsetX;
	this.m_liOffset[1] = offsetY;
	this.m_iDistance = calculateMagnitude(this.m_liOffset);
	
	this.m_iPositionOffset = Math.atan2(-this.m_liOffset[1], -this.m_liOffset[0]) + Math.PI;
	this.m_iPositionOffset += this.m_kOwner.m_iRotation;
	
	this.m_liPos = new Array();
	this.m_liPos[0] = this.m_kOwner.m_liPos[0] + (this.m_iDistance * Math.cos(this.m_iPositionOffset));
	this.m_liPos[1] = this.m_kOwner.m_liPos[1] + (this.m_iDistance * Math.sin(this.m_iPositionOffset));
	
	this.m_iRotation = this.m_kOwner.m_iRotation;
	
	this.m_fScale = scale;
	
	// Collision Detection
	//this.m_liPoints = new Array();
	//this.m_liPoints.push(new V(-5, -32));
	//this.m_liPoints.push(new V(0, -30));
	//this.m_liPoints.push(new V(20, -15));
	//this.m_liPoints.push(new V(30, -5));
	//this.m_liPoints.push(new V(30, 0));
	//this.m_liPoints.push(new V(0, 0));
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(-1, 1));
	this.m_liPoints.push(new V(-3, 2));
	this.m_liPoints.push(new V(-5, 3));
	this.m_liPoints.push(new V(-7, 4));
	this.m_liPoints.push(new V(-15, 4));
	this.m_liPoints.push(new V(-18, 6));
	this.m_liPoints.push(new V(-25, 8));
	this.m_liPoints.push(new V(-25, -8));
	this.m_liPoints.push(new V(-18, -6));
	this.m_liPoints.push(new V(-15, -4));
	this.m_liPoints.push(new V(-7, -4));
	this.m_liPoints.push(new V(-5, -3));
	this.m_liPoints.push(new V(-3, -2));
	this.m_liPoints.push(new V(-1, -1));
	this.m_liPoints.push(new V(0, 0));
	
	//this.m_liPoints.push([0, 0]);
	//this.m_liPoints.push([-1, -1]);
	//this.m_liPoints.push([-3, -2]);
	//this.m_liPoints.push([-5, -3]);
	//this.m_liPoints.push([-7, -4]);
	//this.m_liPoints.push([-15, -4]);
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);
}

Cockpit.prototype.update = function()
{
	// Call base update
	ShipComponent.prototype.update.call(this);
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(-1, 1));
	this.m_liPoints.push(new V(-3, 2));
	this.m_liPoints.push(new V(-5, 3));
	this.m_liPoints.push(new V(-7, 4));
	this.m_liPoints.push(new V(-15, 4));
	this.m_liPoints.push(new V(-18, 6));
	this.m_liPoints.push(new V(-25, 8));
	this.m_liPoints.push(new V(-25, -8));
	this.m_liPoints.push(new V(-18, -6));
	this.m_liPoints.push(new V(-15, -4));
	this.m_liPoints.push(new V(-7, -4));
	this.m_liPoints.push(new V(-5, -3));
	this.m_liPoints.push(new V(-3, -2));
	this.m_liPoints.push(new V(-1, -1));
	this.m_liPoints.push(new V(0, 0));
	
	// Scale the points
	ShipComponent.prototype.scale.call(this);
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);

	// Rotate and translate
	this.m_cdCollision.rotate(this.m_iRotation);
	this.m_cdCollision.translate(this.m_liPos[0], this.m_liPos[1]);
}

Cockpit.prototype.draw = function()
{
	// Call base update
	ShipComponent.prototype.draw.call(this);
	
	// Save context!
	m_kContext.save();
	
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	// Rotate to players angle
	m_kContext.rotate(this.m_iRotation);
	
	// Scale
	m_kContext.scale(this.m_fScale, this.m_fScale);
	
	m_kContext.fillStyle = this.m_cSecondaryColour;
	
	// Tip Highlight
	m_kContext.beginPath();
	m_kContext.moveTo(0, 0);
	m_kContext.lineTo(-1, -1);
	m_kContext.lineTo(-3, -2);
	m_kContext.lineTo(-5, -3);
	m_kContext.lineTo(-7, -4);
	m_kContext.lineTo(-9, -4);
	m_kContext.lineTo(-9, 4);
	m_kContext.lineTo(-7, 4);
	m_kContext.lineTo(-5, 3);
	m_kContext.lineTo(-3, 2);
	m_kContext.lineTo(-1, 1);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	m_kContext.strokeStyle = 'black';	
	
	// Tip Highlight Strip
	m_kContext.beginPath();
	m_kContext.moveTo(-11, -4);
	m_kContext.lineTo(-11, 4);
	m_kContext.lineTo(-12, 4);
	m_kContext.lineTo(-12, -4);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
		
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'green';
	
	// Actual Cockpit
	m_kContext.save();
	m_kContext.scale(1.75, 1);
	m_kContext.beginPath();
	m_kContext.arc(-14, 0, 5, 0, Math.PI * 2);
	m_kContext.stroke();
	m_kContext.fill();
	m_kContext.closePath();
	m_kContext.restore();
	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = this.m_cSecondaryColour;
	
	// Actual Cockpit Tail Strips
	m_kContext.beginPath();
	m_kContext.moveTo(-25, -5);
	m_kContext.lineTo(-30, 0);
	m_kContext.lineTo(-25, 5);
	m_kContext.lineTo(-27, 5);
	m_kContext.lineTo(-35, 0);
	m_kContext.lineTo(-27, -5);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}