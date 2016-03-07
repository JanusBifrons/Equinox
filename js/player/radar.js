function Radar(owner)
{	
	this.m_kPlayer = owner;

	this.m_iWidth = 300;
	this.m_iHeight = 300;

	this.m_liPos = new Array();
	this.m_liPos[0] = 5;
	this.m_liPos[1] = window.innerHeight - 15;
	
	this.m_liPos[0] += this.m_iWidth / 2;
	this.m_liPos[1] -= this.m_iHeight / 2;
	
	// Scale
	//this.m_fScale = 0.01;
	//this.m_fScale = 0.1;
	this.m_fScale = 0.05;
	
	this.m_liSignatures = new Array();
	this.m_liSignatures.length = 0;
	
	this.m_liHorazontal = new Array();
	this.m_liVertical = new Array();
	
	var _x = this.m_liPos[0] - (this.m_iWidth / 2);
	var _y = this.m_liPos[1] - (this.m_iHeight / 2);
	
	for(var i = 0; i < 6; i++)
	{
		//this.m_liHorazontal.push(_x);
		//this.m_liVertical.push(_y);
		
		_x += (this.m_iWidth / 6);
		_y += (this.m_iHeight / 6);
	}
}

Radar.prototype.update = function()
{
	this.m_liPos[0] = 5;
	this.m_liPos[1] = window.innerHeight - 15;
	
	this.m_liPos[0] += this.m_iWidth / 2;
	this.m_liPos[1] -= this.m_iHeight / 2;
	
	for(var i = 0; i < this.m_liSignatures.length; i++)
	{
		this.m_liSignatures[i].update(this.m_kPlayer.m_kShip);
	}
	
	// Signature index to delete
	var _index = -1;
	
	// Update Signature
	for(var i = 0; i < this.m_liSignatures.length; i++)
	{
		// Provides reference to ship so it can update locations relative to this
		this.m_liSignatures[i].update(this.m_kPlayer.m_kShip);
		
		// If marked to delete remove this
		if(this.m_liSignatures[i].m_bDelete)
		{		
			_index = i;
		}
	}
	
	if(_index > -1)
	{			
		// Remove signature
		this.m_liSignatures.splice(_index, 1);
	}
}

Radar.prototype.draw = function()
{	
	m_kContext.strokeStyle = "white";
	m_kContext.fillStyle = "black";
	m_kContext.lineWidth = 1;
	
	m_kContext.beginPath();
	m_kContext.moveTo(this.m_liPos[0] - (this.m_iWidth / 2), this.m_liPos[1] - (this.m_iHeight / 2));
	m_kContext.lineTo(this.m_liPos[0] + (this.m_iWidth / 2), this.m_liPos[1] - (this.m_iHeight / 2));
	m_kContext.lineTo(this.m_liPos[0] + (this.m_iWidth / 2), this.m_liPos[1] + (this.m_iHeight / 2));
	m_kContext.lineTo(this.m_liPos[0] - (this.m_iWidth / 2), this.m_liPos[1] + (this.m_iHeight / 2));
	m_kContext.closePath();
	m_kContext.stroke();
	m_kContext.fill();
	
	this.drawGrid();
	
	this.drawGridReference();
	
	// Move renderer relative to center of radar
	m_kContext.save();
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	for(var i = 0; i < this.m_liSignatures.length; i++)
	{
		this.m_liSignatures[i].draw();
	}
	
	// Restore context back to default from relative to the radar
	m_kContext.restore();	
}

// HELPERS

Radar.prototype.clear = function()
{
	// This is 1 not 0 because you always keep the first signature... yourself
	this.m_liSignatures.length = 1;
}

Radar.prototype.addSignature = function(signature)
{
	signature.m_iHeight = this.m_iHeight;
	signature.m_iWidth = this.m_iWidth;
	signature.m_fScale = this.m_fScale;
	
	this.m_liSignatures.push(signature);
}

// GRID DRAWING CODE

Radar.prototype.drawGrid = function()
{		
	var _offsetX = m_kPlayer.m_kShip.m_liPos[0] * 0.01;
	var _offsetY = m_kPlayer.m_kShip.m_liPos[1] * 0.01;
	
	m_kContext.strokeStyle = 'white';
	m_kContext.lineWidth = 0.25;
	
	// Draw first two lines
	m_kContext.beginPath();
	m_kContext.moveTo(_x, _y);
	m_kContext.lineTo(_x + this.m_iWidth, _y);
	m_kContext.moveTo(_x, _y);
	m_kContext.lineTo(_x, _y + this.m_iHeight);
	m_kContext.stroke();
	
	var _x = this.m_liPos[0] - (this.m_iWidth / 2);
	var _y = this.m_liPos[1] - (this.m_iHeight / 2);
	
	for(var i = 0; i < this.m_liHorazontal.length; i++)
	{			
		_x = this.m_liHorazontal[i];
		
		if(_x < this.m_liPos[0] - (this.m_iWidth / 2))
		{
			this.m_liHorazontal[i] = this.m_liPos[0] + (this.m_iWidth / 2);
		}
		
		if(_x > this.m_liPos[0] + (this.m_iWidth / 2))
		{
			this.m_liHorazontal[i] = this.m_liPos[0] - (this.m_iWidth / 2);
		}
		
		this.m_liHorazontal[i] -= m_kPlayer.m_kShip.m_liMove[0] * 0.01;
	
		m_kContext.beginPath();
		m_kContext.moveTo(_x, _y);
		m_kContext.lineTo(_x, _y + this.m_iHeight);
		m_kContext.stroke();
	}
	
	_x = this.m_liPos[0] - (this.m_iWidth / 2);
	_y = this.m_liPos[1] - (this.m_iHeight / 2);
	
	for(var i = 0; i < this.m_liVertical.length; i++)
	{			
		_y = this.m_liVertical[i];
		
		if(_y > this.m_liPos[1] + (this.m_iHeight / 2))
		{
			this.m_liVertical[i] = this.m_liPos[1] - (this.m_iHeight / 2);
		}
		
		if(_y < this.m_liPos[1] - (this.m_iHeight / 2))
		{
			this.m_liVertical[i] = this.m_liPos[1] + (this.m_iHeight / 2);
		}
		
		this.m_liVertical[i] -= m_kPlayer.m_kShip.m_liMove[1] * 0.01;
	
		m_kContext.beginPath();
		m_kContext.moveTo(_x, _y);
		m_kContext.lineTo(_x + this.m_iWidth, _y);
		m_kContext.stroke();
	}
	
	return;
}

Radar.prototype.drawGridReference = function()
{
	var _gridSize = 5000;

	// Get grid reference
	var x = Math.round(m_kPlayer.m_kShip.m_liPos[0]);
	var y = Math.round(m_kPlayer.m_kShip.m_liPos[1]);
	
	var gridX = Math.ceil(x / _gridSize) - 1;
	var gridY = Math.ceil(y / _gridSize) - 1;
	
	var positionText = "Grid: " + String(gridX) + ", " + String(gridY);
	
	m_kContext.fillStyle = 'white';
	m_kContext.font="10px Verdana";
	m_kContext.fillText(positionText, this.m_liPos[0] - (this.m_iWidth / 2), this.m_liPos[1] - (this.m_iHeight / 1.9));
}