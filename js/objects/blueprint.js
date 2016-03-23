Blueprint.prototype = new GameObject();
Blueprint.prototype.constructor = Blueprint;

function Blueprint(x, y, sector)
{
	this.m_iScale = 1.5;
	this.m_iWidth = 90;
	this.m_iHeight = 120;
	this.m_iPadding = 15;
	
	// Call base initialize
	GameObject.prototype.initialize.call(this, "Item", "Blueprint", 0, sector, x, y, 0, 0, 0, 0, 100, 5, 0.06);
	
	// Call base initialize stats
	GameObject.prototype.initializeStats.call(this, 0, 0, 0, 0, 250, 0);
	
	console.log("Initialized Blueprint successfully.");
}

Blueprint.prototype.update = function()
{	
	// Call base update
	GameObject.prototype.update.call(this);
}

Blueprint.prototype.draw = function()
{	
	// Call base draw
	GameObject.prototype.draw.call(this);
	
	// Save context
	m_kContext.save();
	
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	// Font size, type and colour
	m_kContext.font="32px Verdana";
	m_kContext.fillStyle = "black";
	
	var _title = "BPO";
	
	var _x = -(m_kContext.measureText(_title).width / 2);
	var _y = -(this.m_iHeight / 2);
	
	//_x += this.m_iPadding;
	_y += this.m_iPadding * 2;
	
	//_x = _x * this.m_iScale;
	_y = _y * this.m_iScale;
	
	m_kContext.fillText("BPO", _x, _y);
	m_kContext.fillText("Havok", _x, _y + 64);
	//m_kContext.fillText("BPO", 0, 0);
	
	// Restore context
	m_kContext.restore();
}

// HELPERS

Blueprint.prototype.createComponents = function()
{	
	this.m_liComponents = new Array();
	
	this.m_liComponents.push(new RectHull(this, 0, 0, this.m_iScale, this.m_iWidth, this.m_iHeight, 5));
	//this.m_liComponents.push(new RectHull(this, 0, 0, 10, 60, 80, 5));
}