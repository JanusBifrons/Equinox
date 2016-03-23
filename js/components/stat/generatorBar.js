GeneratorBar.prototype = new Component();
GeneratorBar.prototype.constructor = GeneratorBar;

function GeneratorBar(owner, offsetX, offsetY, scale)
{
	// Call base initialize
	Component.prototype.initialize.call(this, owner, offsetX, offsetY, scale, false);
	
	this.m_bCanScrap = false;
}

GeneratorBar.prototype.update = function()
{
	// Call base update
	Component.prototype.update.call(this);
}

GeneratorBar.prototype.draw = function()
{		
	// Call base draw
	Component.prototype.draw.call(this);
	
	// Initialises the draw and rotates/scales/centers the view
	Component.prototype.startDraw.call(this);
	
	// Variables required for drawing
	if(this.m_kOwner.m_iCurrentDrain != this.m_kOwner.m_iPowerDrain)
	{		
		var _difference = this.m_kOwner.m_iPowerDrain - this.m_kOwner.m_iCurrentDrain;
		this.m_kOwner.m_iCurrentDrain += (_difference / 1000) * m_fElapsedTime;
	}
	
	var _power = 0;
	
	if(this.m_kOwner.m_iCurrentDrain > 0 && this.m_kOwner.m_iPowerGenerated > 0)
	{
		_power = (this.m_kOwner.m_iCurrentDrain / this.m_kOwner.m_iPowerGenerated) * 100;	
		_power = Math.round(_power);
	}
	
	// Set drawing parameters
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'yellow';
	m_kContext.lineWidth = 5;
	
	// Bar background
	m_kContext.beginPath();
	
	m_kContext.moveTo(-10, -50);	
	m_kContext.lineTo(10, -50);	
	m_kContext.lineTo(10, 50);	
	m_kContext.lineTo(-10, 50);	
	
	m_kContext.closePath();
	m_kContext.stroke();	
	m_kContext.fill();
	
	// Set drawing parameters
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'red';
	
	// Bar contents
	m_kContext.beginPath();
	
	m_kContext.moveTo(-10, 50);	
	m_kContext.lineTo(10, 50);	
	m_kContext.lineTo(10, 50 - (100 * (_power / 100)));	
	m_kContext.lineTo(-10, 50- (100 * (_power / 100)));
	
	m_kContext.closePath();
	m_kContext.stroke();	
	m_kContext.fill();
	
	// Restores the context
	Component.prototype.endDraw.call(this);
}

GeneratorBar.prototype.createPoints = function()
{
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(-10, -50));
	this.m_liPoints.push(new V(10, -50));
	this.m_liPoints.push(new V(10, 50));
	this.m_liPoints.push(new V(-10, 50));
}