
function StateManager()
{
	this.m_liStates = new Array();
}

StateManager.prototype.update = function()
{
	for (var i = 0; i < this.m_liStates.length; i++) 
	{
		this.m_liStates[i].update();
	}
}

StateManager.prototype.draw = function()
{
	for (var i = 0; i < this.m_liStates.length; i++) 
	{
		this.m_liStates[i].draw();
	}
}

StateManager.prototype.addState = function(state)
{
	this.m_liStates.push(state);
}