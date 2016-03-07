SolarPanelSmall.prototype = new StructureComponent();
SolarPanelSmall.prototype.constructor = SolarPanelSmall;

function SolarPanelSmall(owner, offsetX, offsetY, rotationOffset, scale)
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
	
	this.m_iRotationOffset = rotationOffset;
	this.m_iRotation = this.m_kOwner.m_iRotation + this.m_iRotationOffset;
	
	this.m_fScale = scale;
	
	// Local variables
	this.m_iCorner = 15;
	this.m_iHeight = 200;
	this.m_iWidth = 200;
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(0, this.m_iCorner));
	this.m_liPoints.push(new V(this.m_iCorner, 0));
	this.m_liPoints.push(new V((this.m_iWidth - this.m_iCorner), 0));
	this.m_liPoints.push(new V(this.m_iWidth, this.m_iCorner));
	this.m_liPoints.push(new V(this.m_iWidth, (this.m_iHeight - this.m_iCorner)));
	this.m_liPoints.push(new V((this.m_iWidth - this.m_iCorner),  this.m_iHeight));
	this.m_liPoints.push(new V(this.m_iCorner, this.m_iHeight));
	this.m_liPoints.push(new V(0, (this.m_iHeight - this.m_iCorner)));
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);
}

SolarPanelSmall.prototype.update = function()
{
	// Call base update
	StructureComponent.prototype.update.call(this);
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(0, this.m_iCorner));
	this.m_liPoints.push(new V(this.m_iCorner, 0));
	this.m_liPoints.push(new V((this.m_iWidth - this.m_iCorner), 0));
	this.m_liPoints.push(new V(this.m_iWidth, this.m_iCorner));
	this.m_liPoints.push(new V(this.m_iWidth, (this.m_iHeight - this.m_iCorner)));
	this.m_liPoints.push(new V((this.m_iWidth - this.m_iCorner),  this.m_iHeight));
	this.m_liPoints.push(new V(this.m_iCorner, this.m_iHeight));
	this.m_liPoints.push(new V(0, (this.m_iHeight - this.m_iCorner)));
	
	// Scale the points
	StructureComponent.prototype.scale.call(this);
	
	// Set collision bounds
	this.m_cdCollision = new P(new V(0, 0), this.m_liPoints);

	// Rotate and translate
	this.m_cdCollision.rotate(this.m_iRotation);
	this.m_cdCollision.translate(this.m_liPos[0], this.m_liPos[1]);
}

SolarPanelSmall.prototype.draw = function()
{
	// Overwrite primary colour!
	this.m_cPrimaryColour = 'grey';
	
	// Call base update
	StructureComponent.prototype.draw.call(this);
	
	// Save context!
	m_kContext.save();
	
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	// Rotate to players angle
	m_kContext.rotate(this.m_iRotation);
	
	// Scale
	m_kContext.scale(this.m_fScale, this.m_fScale);
	
	var _numberWide = 3;
	var _numberLong = 3;
	var _insetX = this.m_iWidth / (_numberWide + 1);
	var _insetY = this.m_iHeight / (_numberLong + 1);
	var _smallX = 0;
	var _smallY = 0;
	var _smallWidth = 40;
	var _smallCorner = 4;
	
	m_kContext.strokeStyle = 'blue';	
	m_kContext.fillStyle = 'blue';
	m_kContext.lineWidth = 5;
	
	for(var i = 0; i < _numberWide; i++)
	{		
		_smallX += _insetX;
		
		for(var j = 0; j < _numberLong; j++)
		{
			_smallY += _insetY;
			
			m_kContext.strokeStyle = concatenate(56, 89, 111, 255);
			m_kContext.fillStyle = concatenate(56, 89, 111, 255);
			m_kContext.lineWidth = 2;
			
			m_kContext.beginPath();
			// Top left
			m_kContext.moveTo(_smallX - (_smallWidth / 2), _smallY - ((_smallWidth / 2) - _smallCorner));
			m_kContext.lineTo(_smallX - ((_smallWidth / 2) - _smallCorner), _smallY - (_smallWidth / 2));
			
			// Top right
			m_kContext.lineTo(_smallX + ((_smallWidth / 2) - _smallCorner), _smallY - (_smallWidth / 2));
			m_kContext.lineTo(_smallX + (_smallWidth / 2), _smallY - ((_smallWidth / 2) - _smallCorner));
			
			// Bottom right
			m_kContext.lineTo(_smallX + (_smallWidth / 2), _smallY + ((_smallWidth / 2) - _smallCorner));
			m_kContext.lineTo(_smallX + ((_smallWidth / 2) - _smallCorner), _smallY + (_smallWidth / 2));
			
			// Bottom left
			m_kContext.lineTo(_smallX - ((_smallWidth / 2) - _smallCorner), _smallY + (_smallWidth / 2));
			m_kContext.lineTo(_smallX - (_smallWidth / 2), _smallY + ((_smallWidth / 2) - _smallCorner));
			
			m_kContext.closePath();	
			m_kContext.stroke();
			m_kContext.fill();	
		}
		
		m_kContext.strokeStyle = concatenate(115, 130, 140, 255);
		m_kContext.fillStyle = concatenate(115, 130, 140, 255);
		m_kContext.lineWidth = 2;
		
		// Score through this column
		m_kContext.beginPath();
		m_kContext.moveTo(_smallX - (_smallWidth * 0.25), 0);
		m_kContext.lineTo(_smallX - (_smallWidth * 0.25), this.m_iHeight);
		m_kContext.closePath();	
		m_kContext.stroke();
		m_kContext.fill();	
		
		m_kContext.beginPath();
		m_kContext.moveTo(_smallX + (_smallWidth * 0.25), 0);
		m_kContext.lineTo(_smallX + (_smallWidth * 0.25), this.m_iHeight);
		m_kContext.closePath();	
		m_kContext.stroke();
		m_kContext.fill();	
		
		_smallY = 0;
	}
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}