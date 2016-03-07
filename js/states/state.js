function State()
{
	this.m_sDebug = "This is a state class.";
}

State.prototype.update = function()
{
	console.log("THIS IS WRONG");
}

State.prototype.draw = function()
{
	console.log("THIS IS WRONG");
}