CargoWindow.prototype = new Component();
CargoWindow.prototype.constructor = CargoWindow;

function CargoWindow(owner, offsetX, offsetY, scale)
{
	// Call base initialize
	Component.prototype.initialize.call(this, owner, offsetX, offsetY, scale, false);
	
	this.m_bCanScrap = false;
}

CargoWindow.prototype.update = function()
{
	// Call base update
	Component.prototype.update.call(this);
}

CargoWindow.prototype.draw = function()
{		
	// Call base draw
	Component.prototype.draw.call(this);
	
	// Initialises the draw and rotates/scales/centers the view
	Component.prototype.startDraw.call(this);
	
	var _cargo = this.m_kOwner.m_kCargoHold.m_liStored;
	
	// DRAW FIRST THING IN THE CARGO HOLD... IF THERE IS SOMETHING!
	if(_cargo.length > 0)
	{
		m_kContext.translate(-_cargo[0].m_kObject.m_liPos[0], -_cargo[0].m_kObject.m_liPos[1]);
		
		_cargo[0].draw();
	}
	
	
	// Restores the context
	Component.prototype.endDraw.call(this);
}

CargoWindow.prototype.createPoints = function()
{
	// Drawing variables
	var _hexHeight = Math.sqrt(3) * 100;
	var _hexWidth = 2 * 100;
	var _hexSide = (3 / 2) * 100;
	
	// Collision Detection
	this.m_liPoints = new Array();
	this.m_liPoints.push(new V(-(_hexWidth / 2), 0));
	this.m_liPoints.push(new V(-(_hexWidth - _hexSide), (_hexHeight / 2)));
	this.m_liPoints.push(new V((_hexWidth - _hexSide), (_hexHeight / 2)));
	this.m_liPoints.push(new V((_hexWidth / 2), 0));
	this.m_liPoints.push(new V((_hexWidth - _hexSide), -(_hexHeight / 2)));
	this.m_liPoints.push(new V(-(_hexWidth - _hexSide), -(_hexHeight / 2)));
}