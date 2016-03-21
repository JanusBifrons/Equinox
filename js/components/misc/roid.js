Roid.prototype = new Component();
Roid.prototype.constructor = Roid;

function Roid(owner, offsetX, offsetY, scale)
{
	// Call base initialize
	Component.prototype.initialize.call(this, owner, offsetX, offsetY, scale, false);
	
	// Don't adjust center on Roids
	this.m_bAdjustCenter = false;
	
	this.m_liRoidPoints = new Array();
	
	var _numberOfVerts = (Math.random() * 6) + 10;
	var _randomPoints = new Array();

	for(var i = 0; i < _numberOfVerts; i++)
	{
		_randomPoints.push(Math.random() * (Math.PI * 2));
	}
	
	// Sort from lowest to highest
	_randomPoints.sort(function(a, b){return a-b});
	
	for(var i = 0; i < _randomPoints.length; i++)
	{
		var _x = ((owner.m_iRadius * 0.75) * Math.cos(_randomPoints[i]));
		var _y = ((owner.m_iRadius * 0.75) * Math.sin(_randomPoints[i]));
		
		//var _x = this.m_liPos[0] + ((owner.m_iRadius - 10) * Math.cos(_randomPoints[i]));
		//var _y = this.m_liPos[1] + ((owner.m_iRadius - 10) * Math.sin(_randomPoints[i]));
		
		this.m_liRoidPoints.push(new V(_x, _y));
	}
}

Roid.prototype.update = function()
{
	// Call base update
	Component.prototype.update.call(this);
}

Roid.prototype.draw = function()
{		
	// Call base draw
	Component.prototype.draw.call(this);
	
	// Initialises the draw and rotates/scales/centers the view
	Component.prototype.startDraw.call(this);
	
	
	// Restores the context
	Component.prototype.endDraw.call(this);
}

Roid.prototype.createPoints = function()
{
	// Collision Detection
	this.m_liPoints = new Array();
	
	for(var i = 0; i < this.m_liRoidPoints.length; i++)
	{
		this.m_liPoints.push(this.m_liRoidPoints[i]);
	}
}