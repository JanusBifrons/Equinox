function Log()
{
	this.m_liLogItems = new Array();
	this.m_liStaticLogItems = new Array();
	this.m_liImportantLogItems = new Array();
	this.m_liObjectLogItems = new Array();
	
	console.log("Log successfully initialised.");
}

Log.prototype.update = function()
{
	// Item for log to delete
	var index = -1;
	
	// Update log items
	for (var i = 0; i < this.m_liLogItems.length; i++) 
	{
		this.m_liLogItems[i].update();
		
		// If due to delete, set index
		if(this.m_liLogItems[i].getDelete())
		{		
			index = i;
		}
	}
	
	if(index > -1)
	{		
		// Remove log item
		this.m_liLogItems.splice(index, 1);
	}
	
	// Update important log items
	for (var i = 0; i < this.m_liImportantLogItems.length; i++) 
	{
		this.m_liImportantLogItems[i].update();
		
		// If due to delete, set index
		if(this.m_liImportantLogItems[i].getDelete())
		{		
			index = i;
		}
	}
	
	if(index > -1)
	{		
		// Remove log item
		this.m_liImportantLogItems.splice(index, 1);
	}
}

Log.prototype.draw = function()
{
	// Variables
	var _x = window.innerHeight / 2;
	var _y = 20;
	var _logItem;
	
	// Font size and type
	m_kContext.font="12px Verdana";
	
	// Draw all regular log items
	for (var i = 0; i < this.m_liLogItems.length; i++)
	{
		_logItem = this.m_liLogItems[i];
		
		m_kContext.fillStyle = _logItem.getColour();
		m_kContext.fillText(_logItem.getText(), _x, _y);
		
		_y += 10;
	}
	
	// Reset variables
	_x = m_kCanvas.width / 2;
	_y = (m_kCanvas.height / 2) + (m_kCanvas.height / 10);
	
	// Font size and type
	m_kContext.font="64px Verdana";
	
	// Draw all important log items
	for (var i = 0; i < this.m_liImportantLogItems.length; i++)
	{
		_logItem = this.m_liImportantLogItems[i];
		
		var _text = _logItem.getText();
		
		_text = _text.toUpperCase();
		
		// Center this text!
		_x -= m_kContext.measureText(_text).width / 2;
		
		m_kContext.fillStyle = _logItem.getColour();
		m_kContext.fillText(_text, _x, _y);
		
		// Update X and Y
		_x = m_kCanvas.width / 2;
		_y += 70;
	}
	
	// Reset variables
	_x = m_kCanvas.width * 0.75;
	_y = 20;
	
	// Font size and type
	m_kContext.font="12px Verdana";
	
	// Static debug log
	for (var i = 0; i < this.m_liStaticLogItems.length; i++)
	{	
		_logItem = this.m_liStaticLogItems[i];
		
		m_kContext.fillStyle = _logItem.getColour();
		m_kContext.fillText(_logItem.getText(), _x, _y);
		
		_y += 10;
	}
	
	// Clear this list every frame	
	this.m_liStaticLogItems.length = 0;
	
	// Reset variables
	_x = 10;
	_y = 400;
	
	// Font size and type
	m_kContext.font="16px Verdana";
	
	//m_kContext.fillText("Objectives", _x, _y);
	
	_y += 15;
	
	//m_kContext.fillText("----------", _x, _y);
	
	_y += 15;
	
	// Font size and type
	m_kContext.font="12px Verdana";
	
	// Objective list
	for (var i = 0; i < this.m_liObjectLogItems.length; i++)
	{	
		_logItem = this.m_liObjectLogItems[i];
		
		m_kContext.fillStyle = _logItem.getColour();
		m_kContext.fillText((i + 1) + " - " + _logItem.getText(), _x, _y);
		
		_y += 10;
	}
	
	// Clear this list every frame	
	this.m_liObjectLogItems.length = 0;
}

Log.prototype.addImportantItem = function(text, fadeOut, r, g, b)
{
	var logItem = new LogItem(text, fadeOut, r, g, b);
	
	this.m_liImportantLogItems.push(logItem);
}

Log.prototype.addItem = function(text, fadeOut, r, g, b)
{
	var logItem = new LogItem(text, fadeOut, r, g, b);
	
	this.m_liLogItems.push(logItem);
}

Log.prototype.addStaticItem = function(text)
{
	var logItem = new LogItem(text, 1000, 255, 255, 255);
	
	this.m_liStaticLogItems.push(logItem);
}

Log.prototype.addObjectiveItem = function(text, r, g, b)
{
	var logItem = new LogItem(text, 1000, r, g, b);
	
	this.m_liObjectLogItems.push(logItem);
}