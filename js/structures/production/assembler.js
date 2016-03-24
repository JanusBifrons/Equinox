Assembler.prototype = new Structure();
Assembler.prototype.constructor = Assembler;

function Assembler(x, y, sector)
{
		// Call base initialize
	GameObject.prototype.initialize.call(this, "Assembler", "Structure", 0, sector, x, y, 0, 0, 0, 0.035, 275, 20, 0);
	
	// Call base initialize stats
	GameObject.prototype.initializeStats.call(this, 1000, 60, 5000, 1000, 10000, 1000);
	
	// Call base initialize resources
	Structure.prototype.initializeResources.call(this, 100, 0, false, 1000);
	
	// Call base initialize flags
	Structure.prototype.initializeFlags.call(this, false, true, true, true);
	
	this.m_iMaxConnections = 1;
	
	// Construction
	this.m_iMetalRequired = 75;
	
	// Pathfinding
	this.m_liSiblings = new Array();
	this.m_liRoutes = new Array();
	
	// Local variables
	this.m_iDesiredMetal = 0;
	this.m_iDesiredMetalDrain = 0;
	this.m_bHasBlueprint = false;
	this.m_kBlueprint;	
	
	console.log("Initialized Assembler structure successfully.");
}

Assembler.prototype.update = function()
{		
	// Call base update
	Structure.prototype.update.call(this);
	
	if(this.m_iPowerStored < this.m_iPowerStoreMax)
	{
		// Get some Power!
		if(Structure.prototype.onRequest.call(this, new Request(this, 0, 1)))
		{	
			this.m_iPowerStored += 1;
		}		
	}
	
	if(this.m_iMetalStored < this.m_iDesiredMetal)
	{
		// Get some Metal!
		if(Structure.prototype.onRequest.call(this, new Request(this, 1, this.m_iDesiredMetalDrain)))
		{	
			this.m_iMetalStored += this.m_iDesiredMetalDrain;
		}		
	}
	
	this.blueprintCheck();
	
	if(this.m_bHasBlueprint)
	{
		this.onBuild();
	}
}

Assembler.prototype.draw = function()
{	
	// Call base draw
	Structure.prototype.draw.call(this);
}

// EVENTS

Assembler.prototype.onBuild = function()
{	
	var _time = this.m_kBlueprint.m_kObject.m_iConstructionTime;
	var _progress = this.m_kBlueprint.m_iConstructionTimer;
	
	// Check if you've finished producing!
	if(_progress >= _time)
	{				
		var _product = this.m_kBlueprint.onBuilt();
		
		this.m_kCargoHold.onStore(_product);
		
		return;
	}
	
	if(this.m_iMetalStored >= this.m_iDesiredMetalDrain)
	{
		this.m_iMetalStored -= this.m_iDesiredMetalDrain;
		this.m_kBlueprint.m_iConstructionTimer += m_fElapsedTime;
	}
}

// HELPERS

Assembler.prototype.blueprintCheck = function()
{
	this.m_iDesiredMetalDrain = 0;
	this.m_iDesiredMetal = 0;
	
	if(this.m_kCargoHold.m_liStored.length > 0)
	{
		this.m_kBlueprint = this.m_kCargoHold.m_liStored[0].m_kObject;
		
		if(this.m_kBlueprint.m_eObjectType == "Blueprint")
		{
			this.m_bHasBlueprint = true;
			
			var _cost = this.m_kBlueprint.m_kObject.m_iConstructionCost;
			var _time = this.m_kBlueprint.m_kObject.m_iConstructionTime;
			
			var _metalDeduction = _cost / _time;
			_metalDeduction *= m_fElapsedTime;
			
			this.m_iDesiredMetal = this.m_kBlueprint.m_kObject.m_iConstructionCost;
			this.m_iDesiredMetalDrain = _metalDeduction;
		}
		else
		{
			this.m_bHasBlueprint = false;
		}
	}
	else
	{
		this.m_bHasBlueprint = false;
	}
}

Assembler.prototype.createComponents = function()
{
	this.m_liComponents = new Array();
	
	this.m_liComponents.push(new RectHull(this, 0, 0, 1, 350, 400, 15));
	
	this.m_liComponents.push(new StatusBar(this, 50, -125, 0.75));
	this.m_liComponents.push(new EnergyBar(this, -125, 0, 1));
	this.m_liComponents.push(new MetalBar(this, 125, 0, 1));
	
	this.m_liComponents.push(new CargoWindow(this, 0, 0, 0.75));
}