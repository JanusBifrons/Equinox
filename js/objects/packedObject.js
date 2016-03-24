PackedObject.prototype = new GameObject();
PackedObject.prototype.constructor = PackedObject;

function PackedObject(x, y, sector, object)
{
	this.m_iScale = 1.5;
	this.m_iWidth = 90;
	//this.m_iHeight = 120;
	this.m_iHeight = 140;
	this.m_iPadding = 15;
	
	// Call base initialize
	GameObject.prototype.initialize.call(this, "Packed Object", "Item", 0, sector, x, y, 0, 0, 0, 0, 120, 5, 0.06);
	
	// Call base initialize stats
	GameObject.prototype.initializeStats.call(this, 0, 0, 0, 0, 250, 0);
	
	// Packed version of
	this.m_kObject = object;
	
	this.m_kObject.update();
	this.m_kObject.m_iShields = 0;
	
	// Reset name
	this.m_sName = "Packed " + this.m_kObject.m_sName;
	
	console.log("Initialized Packed Object successfully.");
}

PackedObject.prototype.update = function()
{	
	// Call base update
	GameObject.prototype.update.call(this);

}

PackedObject.prototype.draw = function()
{	
	// Call base draw
	GameObject.prototype.draw.call(this);
}

// HELPERS

PackedObject.prototype.createComponents = function()
{	
	this.m_liComponents = new Array();
	
	this.m_liComponents.push(new PackedHull(this, 0, 0, this.m_iScale, this.m_iWidth, this.m_iHeight, 5));
}