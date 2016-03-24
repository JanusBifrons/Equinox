Blueprint.prototype = new GameObject();
Blueprint.prototype.constructor = Blueprint;

function Blueprint(x, y, sector, object)
{
	this.m_iScale = 1.5;
	this.m_iWidth = 90;
	//this.m_iHeight = 120;
	this.m_iHeight = 140;
	this.m_iPadding = 15;
	
	// Call base initialize
	GameObject.prototype.initialize.call(this, "Blueprint", "Blueprint", 0, sector, x, y, 0, 0, 0, 0, 120, 5, 0.06);
	
	// Call base initialize stats
	GameObject.prototype.initializeStats.call(this, 0, 0, 0, 0, 250, 0);
	
	// Blueprint type
	this.m_eBlueprintType = "BPO";
	this.m_eBlueprintType = "BPC";
	
	// Blueprint of
	//this.m_kObject = new Debug(0, 0, 0, 0, null, sector, 0);
	this.m_kObject = object;
	
	this.m_kObject.update();
	this.m_kObject.m_iShields = 0;
	
	// Reset name
	this.m_sName = this.m_kObject.m_sName + " " + this.m_eBlueprintType;
	
	// If copy, runs
	this.m_iRuns = 180;
	
	// Construction progress
	this.m_iConstructionTimer = 0;
	
	// Research
	this.m_fReosurceEfficiency = 0;
	
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
}

// HELPERS

Blueprint.prototype.onBuilt = function()
{
	// Reset construction variables
	this.m_iConstructionTimer = 0;
	this.m_iRuns -= 1;
	
	var _objectCopy;
	
	switch(this.m_kObject.m_sName)
	{
		case "DebugShip":
			_objectCopy = new Debug(0, 0, 0, 0, null, this.m_kSector, 0);
			break;
			
		case "Asylum":
			_objectCopy = new Asylum(0, 0, 0, 0, null, this.m_kSector, 0);
			break;
	}
	
	_objectCopy.update();
	_objectCopy.m_iShields = 0;
	
	var _newPackedObject = new PackedObject(0, 0, this.m_kSector, _objectCopy);
	_newPackedObject.update();
	
	return _newPackedObject;
}

// OVERRIDE HELPERS

Blueprint.prototype.createComponents = function()
{	
	this.m_liComponents = new Array();
	
	this.m_liComponents.push(new BlueprintHull(this, 0, 0, this.m_iScale, this.m_iWidth, this.m_iHeight, 5));
}