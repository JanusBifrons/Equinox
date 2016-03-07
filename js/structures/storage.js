Storage.prototype = new Structure();
Storage.prototype.constructor = Storage;

function Storage(x, y)
{
	this.m_iType = 14;
	
	this.m_liPos = new Array();
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	this.m_iRadius = 95;
	
	this.m_iPowerStored = 0;
	this.m_iPowerStoreMax = 0;
	this.m_iMaxConnections = 1;
	
	// Stats
	this.m_iShieldRegenCap = 0;
	this.m_iShieldCap = 0;
	this.m_iArmourCap = 1000;
	this.m_iArmourRegen = 0;
	this.m_iHullCap = 1000;
	this.m_iHullRegen = 0;
	
	// Construction
	this.m_iMetalRequired = 1000;
	
	// Metal
	this.m_iMetalStored = 0;
	this.m_iMetalStoredMax = 5000;
	this.m_bMetalStore = true;
	
	this.m_iID = guid();
	
	console.log("Initialized Storage structure successfully.");
}

Storage.prototype.update = function()
{	
	// Call base update
	Structure.prototype.update.call(this);
	
	if(this.m_bIsConstructed)
	{
		if(this.m_iMetalStored < this.m_iMetalStoredMax)
		{
			// REQUEST POWER!
			if(Structure.prototype.onRequest.call(this, new Request(this, 1, 1)))
			{
				this.m_iMetalStored += 1
			}
		}
	}
}

Storage.prototype.draw = function()
{
	// Call base draw
	Structure.prototype.draw.call(this);
	
	// Alpha the structure if it isn't fully built!	
	var _alpha = 0.6 + (0.4 * (this.m_iMetalBuilt / this.m_iMetalRequired));
	m_kContext.globalAlpha = _alpha;

	// Move screen to player location
	m_kContext.save();
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	// Rotate to players angle
	m_kContext.rotate(this.m_iRotation);
	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'silver';
	m_kContext.lineWidth = 5;
	
	var _x = -80;
	var _y = 40;
	var _width = 160;
	var _height = 80;	
	
	// Body
	m_kContext.beginPath();
	m_kContext.moveTo(_x, _y);
	m_kContext.lineTo(_x + _width, _y);
	m_kContext.lineTo(_x + _width, _y - _height);
	m_kContext.lineTo(_x, _y - _height);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'silver';
	m_kContext.lineWidth = 2.5;
	
	var _smallX = _x;
	var _smallY = _y - 10;
	var _smallWidth = 30;
	var _smallHeight = 60;
	
	var _inset = _width / 5;
	
	var _fillPercent = this.m_iMetalStored / this.m_iMetalStoredMax;
	var _percentStep = 0.25;
	
	for(var i = 0; i < 4; i++)
	{
		_smallX += _inset;
		
		m_kContext.fillStyle = 'silver';
		
		m_kContext.beginPath();
		m_kContext.moveTo(_smallX - (_smallWidth / 2), _smallY);
		m_kContext.lineTo(_smallX + (_smallWidth / 2), _smallY);
		m_kContext.lineTo(_smallX + (_smallWidth / 2), _smallY - _smallHeight);
		m_kContext.lineTo(_smallX - (_smallWidth / 2), _smallY - _smallHeight);
		m_kContext.closePath();	
		m_kContext.stroke();
		m_kContext.fill();
		
		var _drawPercent = 0;		
		var _thisStep = _percentStep * (i + 1);
		
		if(_fillPercent >= _thisStep)
		{
			_drawPercent = 1;
		}
		else
		{			
			var _difference = _fillPercent - (_percentStep * i);
			
			_drawPercent = _difference / _percentStep;
			
			if(_drawPercent < 0)
				_drawPercent = 0;
		}
	
		
		m_kContext.fillStyle = 'orange';
		
		m_kContext.beginPath();
		m_kContext.moveTo(_smallX - (_smallWidth / 2), _smallY);
		m_kContext.lineTo(_smallX + (_smallWidth / 2), _smallY);
		m_kContext.lineTo(_smallX + (_smallWidth / 2), _smallY - _smallHeight * _drawPercent);
		m_kContext.lineTo(_smallX - (_smallWidth / 2), _smallY - _smallHeight * _drawPercent);
		m_kContext.closePath();	
		m_kContext.stroke();
		m_kContext.fill();
	}
	
	// Restore context back to default from relative to the ship
	m_kContext.restore();	
}