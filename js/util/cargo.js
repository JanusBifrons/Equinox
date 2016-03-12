function Cargo(owner, capacity)
{
	this.m_kOwner = owner;
	this.m_iCapacity = capacity;
	
	this.m_liStored = new Array();
}

Cargo.prototype.store = function(item)
{
	this.m_liStored.push(item);
}

// This draws the contents to the SCREEN
Cargo.prototype.draw = function()
{
	m_kLog.addStaticItem("Drawing Cargo!");
	
	var _padding = m_kCanvas.width * 0.01;
	var _width = m_kCanvas.width * 0.2;
	var _height = _width;
	
	var _x = _padding;
	var _y = (m_kCanvas.height - _padding) - _height;
	
	this.drawBackgroundBorder(_x, _y, _width, _height);
	
	this.drawHeader(_x, _y, _width, _height * 0.1);
	
	_y += (_height * 0.1);
	
	this.drawCapacityBar(_x, _y, _width, _height * 0.075);
}

// HELPERS

Cargo.prototype.drawContents = function(x, y, width, height)
{
	
}

Cargo.prototype.drawCapacityBar = function(x, y, width, height)
{
	var _percentage = this.m_liStored.length / this.m_iCapacity;
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'black';
	m_kContext.lineWidth = 1;
	
	// Background
	m_kContext.fillRect(x, y, width, height);
	
	m_kContext.fillStyle = 'green';
	
	// Filled amount
	m_kContext.fillRect(x, y, width * _percentage, height);
	
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
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'black';
	m_kContext.lineWidth = 1;
	
	// Background
	m_kContext.fillRect(x, y, width, height);
	
	// Border
	m_kContext.beginPath();
	m_kContext.rect(x, y, width, height);
	m_kContext.closePath();
	m_kContext.stroke();
	
	// Font size, type and colour
	m_kContext.font="15px Verdana";
	m_kContext.fillStyle = "white";
	
	var _title = this.m_kOwner.m_iID;
	var _titleWidth = m_kContext.measureText(_title).width;
	var _titleHeight = 22;
	
	m_kContext.fillText(_title, x + (x * 0.2), y + _titleHeight);
}

Cargo.prototype.drawBackgroundBorder = function(x, y, width, height)
{
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'black';
	m_kContext.lineWidth = 1;
	
	// Background
	m_kContext.fillRect(x, y, width, height);
	
	// Border
	m_kContext.beginPath();
	m_kContext.rect(x, y, width, height);
	m_kContext.closePath();
	m_kContext.stroke();
}