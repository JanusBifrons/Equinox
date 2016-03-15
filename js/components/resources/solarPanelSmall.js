SolarPanelSmall.prototype = new Component();
SolarPanelSmall.prototype.constructor = SolarPanelSmall;

function SolarPanelSmall(owner, offsetX, offsetY, scale)
{
	// Call base initialize
	Component.prototype.initialize.call(this, owner, offsetX, offsetY, scale, false);
	
	// Local variables
	this.m_iCorner = 15;
	this.m_iHeight = 200;
	this.m_iWidth = 200;
}

SolarPanelSmall.prototype.update = function()
{
	// Call base update
	Component.prototype.update.call(this);
}

SolarPanelSmall.prototype.draw = function()
{		
	// Call base draw
	Component.prototype.draw.call(this);
	
	// Initialises the draw and rotates/scales/centers the view
	Component.prototype.startDraw.call(this);
	
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
	
	// Restores the context
	Component.prototype.endDraw.call(this);
}

SolarPanelSmall.prototype.createPoints = function()
{	
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
}