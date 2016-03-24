function Cargo(name, capacity)
{
	this.m_sName = name;
	this.m_iCapacity = capacity;
	
	this.m_liStored = new Array();
	
	this.m_liPos = new Array();
	this.m_liPos[0] = 0;
	this.m_liPos[1] = 0;
	this.m_iWidth = 1;
	this.m_iHeight = 1;
	
	this.m_kCargoArea;
}

Cargo.prototype.update = function()
{
	this.m_kCargoArea = new UIButton(this, 0, this.m_liPos[0], this.m_liPos[1], this.m_iWidth, this.m_iHeight, false);
	
	for(var i = 0; i < this.m_liStored.length; i++)
	{
		this.m_liStored[i].update();
	}
}

// This draws the contents to the SCREEN
Cargo.prototype.draw = function(x, y, width, height)
{	
	this.m_liPos = new Array();
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	
	this.m_iWidth = width;
	this.m_iHeight = height;
	
	m_kContext.globalAlpha = 0.75;
	
	this.drawBackgroundBorder(x, y, width, height);
	
	this.drawHeader(x, y, width, height * 0.1);
	
	y += (height * 0.1);
	
	this.drawCapacityBar(x, y, width, height * 0.075);
	
	y += (height * 0.075);
	
	this.drawContents(x, y, width, height, height * 0.01);
	
	m_kContext.globalAlpha = 1;
}

// EVENTS

Cargo.prototype.onMouseDrop = function(mouse)
{	
	if(m_kCollisionManager.circlePolygonCollisionDetection(mouse, this.m_kCargoArea.m_cdCollision))
	{
		return true;
	}
	
	return false;
}

Cargo.prototype.onMouseClick = function(mouse)
{	
	for(var i = 0; i < this.m_liStored.length; i++)
	{
		if(this.m_liStored[i].onMouseClick(mouse))
		{
			return true;
		}
	}
	
	return false;
}

Cargo.prototype.onStore = function(object)
{	
	for(var i = 0; i < this.m_liStored.length; i++)
	{
		if(this.m_liStored[i].m_kObject.m_iID == object.m_iID)
		{
			m_kLog.addItem("Cargo Hold already contains this object!", 5000, 255, 0, 0);
			return false;
		}
	}

	if(this.m_liStored.length < this.m_iCapacity)
	{	
		if(object.m_bIsCargo)
		{
			object.m_kStoredBy.onDrop(object);
		}

		object.m_bIsCargo = true;
		object.m_kStoredBy = this;

		this.m_liStored.push(new CargoObject(object));
		
		return true;	
	}
	else
	{
		m_kLog.addItem("Cargo Hold is full!", 5000, 255, 0, 0);
		
		return false;
	}
}

Cargo.prototype.onDrop = function(object)
{
	// Item to delete
	var _index = -1;
	
	// Find ship
	for (var i = 0; i < this.m_liStored.length; i++) 
	{
		// Set index
		if(this.m_liStored[i].m_kObject == object)
		{			
			_index = i;
		}
	}
	
	if(_index > -1)
	{		
		// Remove item
		this.m_liStored.splice(_index, 1);
	}
}


// HELPERS

Cargo.prototype.drawBackground = function(x, y, size)
{	
	// Save context!
	m_kContext.save();
	
	// Translate to center// Translate to center
	m_kContext.translate(x, y);
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'black';
	m_kContext.lineWidth = 1;
	
	// Background
	m_kContext.fillRect(0, 0, size, size);
	m_kContext.beginPath();
	m_kContext.rect(0, 0, size, size);
	m_kContext.closePath();
	m_kContext.stroke();
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}

Cargo.prototype.drawContents = function(x, y, width, height, padding)
{	
	var _x = x + padding;
	var _y = y + padding;
	var _cols = 5;
	var _width = (width - (padding * (_cols + 1))) / _cols;
	
	for(var i = 0; i < this.m_liStored.length; i++)
	{		
		this.m_liStored[i].draw(_x, _y, _width, padding);
		
		_x += padding;
		_x += _width;
		
		if(_x > width)
		{
			_x = x + padding;
			_y += padding;
			_y += _width;
		}
	}
}

Cargo.prototype.drawCapacityBar = function(x, y, width, height)
{
	var _percentage = this.m_liStored.length / this.m_iCapacity;
	
	m_kContext.strokeStyle = 'azure';	
	m_kContext.fillStyle = 'black';
	m_kContext.lineWidth = 1;
	
	// Background
	m_kContext.fillRect(x, y, width, height);
	
	m_kContext.fillStyle = 'green';
	
	// Filled amount
	m_kContext.fillRect(x, y, width * _percentage, height);
	
	var _grd = m_kContext.createLinearGradient(x, y, x + width, y + height);
	_grd.addColorStop(0, "black");
	_grd.addColorStop(0.5, "grey");
	_grd.addColorStop(1, "white");
	
	m_kContext.strokeStyle = _grd;	
	
	// Border
	m_kContext.beginPath();
	m_kContext.rect(x, y, width, height);
	m_kContext.closePath();
	m_kContext.stroke();
	
	// Font size, type and colour
	m_kContext.font="15px Verdana";
	m_kContext.fillStyle = "white";
	m_kContext.strokeStyle = 'white';
	
	var _text = this.m_liStored.length.toString() + " / " + this.m_iCapacity.toString() + " M" + "\u00B3";
	var _textWidth = m_kContext.measureText(_text).width;
	var _textHeight = 20;
	
	m_kContext.fillText(_text, (x + (width / 2)) - (_textWidth / 2), y + _textHeight);
}

Cargo.prototype.drawHeader = function(x, y, width, height)
{
	m_kContext.strokeStyle = 'azure';	
	m_kContext.fillStyle = 'black';
	m_kContext.lineWidth = 1;
	
	// Background
	m_kContext.fillRect(x, y, width, height);
	
	var _grd = m_kContext.createLinearGradient(x, y, x + width, y + height);
	_grd.addColorStop(0, "black");
	_grd.addColorStop(0.5, "grey");
	_grd.addColorStop(1, "white");
	
	m_kContext.strokeStyle = _grd;	
	
	// Border
	m_kContext.beginPath();
	m_kContext.strokeRect(x, y, width, height);
	m_kContext.closePath();
	m_kContext.stroke();
	
	// Font size, type and colour
	m_kContext.font="15px Verdana";
	m_kContext.fillStyle = "white";
	
	var _titleWidth = m_kContext.measureText(this.m_sName).width;
	var _titleHeight = 22;
	
	m_kContext.fillText(this.m_sName, x + (width * 0.1), y + _titleHeight);
}

Cargo.prototype.drawBackgroundBorder = function(x, y, width, height)
{
	m_kContext.strokeStyle = 'azure';	
	m_kContext.fillStyle = 'black';
	m_kContext.lineWidth = 1;
	
	// Background
	m_kContext.fillRect(x, y, width, height);
	
	var _grd = m_kContext.createLinearGradient(x, y, x + width, y + height);
	_grd.addColorStop(0, "black");
	_grd.addColorStop(0.5, "grey");
	_grd.addColorStop(1, "white");
	
	m_kContext.strokeStyle = _grd;	
	
	// Border
	m_kContext.beginPath();
	m_kContext.rect(x, y, width, height);
	m_kContext.closePath();
	m_kContext.stroke();
	
	return;
	
	var _x = x;
	var _y = y;
	var _step = width / 10;
	

	m_kContext.strokeStyle = 'azure';	
	
	m_kContext.beginPath();
	
	for(var i = 0; i < 9; i++)
	{
		_x += _step;
		
		m_kContext.moveTo(_x, _y);
		m_kContext.lineTo(_x, _y + height);
	}
	
	_x = x;
	_y = y;
	
	for(var i = 0; i < 9; i++)
	{
		_y += _step;
		
		m_kContext.moveTo(_x, _y);
		m_kContext.lineTo(_x + width, _y);
	}

	m_kContext.closePath();
	m_kContext.stroke();
}