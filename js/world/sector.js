function Sector(id, row, col, district, isSpawn)
{	
	// Sector variables
	this.m_iID = id;
	this.m_iTeam = 0;
	this.m_kDistrict = district;
	
	// Switches
	this.m_bIsTarget = false;
	this.m_bIsSelected = false;
	
	// Column
	this.m_liPos = new Array();
	this.m_liPos[0] = row;
	this.m_liPos[1] = col;
	
	// Sector Objects
	this.m_liShips = new Array();
	this.m_liObjects = new Array();
	
	// Managers
	this.m_kStructureManager = new StructureManager();
	this.m_kAsteroidManager = new AsteroidManager(this);
	this.m_kAIManager = new AIManager(this);
	
	// If this sector is where the player spawns
	if(isSpawn)
	{
		this.createHomeSector();
	}
	else
	{
		this.m_kAsteroidManager.fillSector(5);
	}
	
	//this.m_kAsteroidManager.fillSector(5);
	
	// This function is really shit...
	//this.m_kAsteroidManager.generateAsteroidField(0, 0, 2500, 50);
	//this.m_kAsteroidManager.generateAsteroidField(100, 100, 1000, 1);
	//this.m_kAsteroidManager.generateAsteroidField(1000, 1000, 2500, 10);
	//this.m_kAsteroidManager.generateAsteroidField(10000, 10000, 10000, 50);
	
	// Helper list
	this.m_liRespawningShips = new Array();
	this.m_iRespawnCheck = 0;
	this.m_iRespawnCheckMax = 1000;
	
	// Quad Tree 
	this.m_kQuadTree = new Quadtree({
		x: -10000,
		y: -10000,
		width: 10000,
		height: 10000
	}, 10, 50);
	
	console.log("New Sector successfully initialised!");
}

Sector.prototype.update = function()
{		
	// Populate this sectors quad tree!
	this.populateQuadTree(this.m_liShips, this.m_kStructureManager.m_liStructures, this.m_kAsteroidManager.m_liAsteroids, this.m_liObjects);
	
		
	// Check all collisions for this sector!
	m_kCollisionManager.checkCollisions(this.m_kQuadTree, this.m_liShips, this.m_kStructureManager.m_liStructures, this.m_kAsteroidManager.m_liAsteroids, this.m_liObjects);
	
	this.m_kStructureManager.resetStructures();
		
	// Check all collisions for this sector!
	m_kCollisionManager.checkWeapons(this.m_kQuadTree, this.m_liShips, this.m_kStructureManager.m_liStructures, this.m_kAsteroidManager.m_liAsteroids, this.m_liObjects);
	
	
	// Update all of the asteroids in the sector
	this.m_kAsteroidManager.update();	
	
	// Update all of the structures in the sector
	this.m_kStructureManager.update();	
	
	// Update all of the ships in the sector
	this.updateShips();
	
	// Update all of the AI in this sector
	//this.m_kAIManager.update();
	
	// Update all lasers, mines, missiles and scrap
	this.updateObjects();
	
	// Update who controls this sector!
	this.updateTeam();
	
	// Update the respawn list to check if players are waiting to respawn and can respawn
	this.updateRespawn();
	
	// Run some debug code
	// - Remove all projectiles
	// - Calculate all metal
	if(m_kPlayer.m_kShip.m_kSector.m_iID == this.m_iID)
		this.debug();
}

Sector.prototype.draw = function()
{	
	m_kCamera.begin();

	// Draw projectiles under everything
	for(var i = 0; i < this.m_liObjects.length; i++)
	{
		this.m_liObjects[i].draw();
	}

	this.m_kAsteroidManager.draw();
	
	this.m_kStructureManager.draw();

	for(var i = 0; i < this.m_liShips.length; i++)
	{
		this.m_liShips[i].draw();
	}
	
	m_kCamera.end();
	
	this.drawSectorInfo();
	
	this.drawQuad();
}

// HELPERS

Sector.prototype.drawQuad = function()
{	
	return;

	if(this.m_kQuadTree.objects.length > 0)
	{
		//m_kLog.addStaticItem("X: " + this.m_kQuadTree.objects[0].x, 255, 255, 255);
		//m_kLog.addStaticItem("Y: " + this.m_kQuadTree.objects[0].y, 255, 255, 255);	
	}
	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = this.m_cPrimaryColour;
	m_kContext.lineWidth = 1;
	
	m_kContext.beginPath();
	
	// Draw Hull from collision points (this makes sure bugs are highly visible)
	for(var i = 0; i < this.m_kQuadTree.nodes.length; i++)
	{
		//m_kContext.lineTo(this.m_kQuadTree.nodes[i].x, this.m_kQuadTree.nodes[i].y);
		
		m_kLog.addStaticItem("Node X: " + this.m_kQuadTree.nodes[i].x, 255, 255, 255);
		m_kLog.addStaticItem("Node Y: " + this.m_kQuadTree.nodes[i].y, 255, 255, 255);
		m_kLog.addStaticItem("Node Width: " + this.m_kQuadTree.nodes[i].width, 255, 255, 255);
		m_kLog.addStaticItem("Node Height: " + this.m_kQuadTree.nodes[i].height, 255, 255, 255);
		m_kLog.addStaticItem("Node Max Objects: " + this.m_kQuadTree.nodes[i].height, 255, 255, 255);
	}
	
	m_kContext.closePath();
	m_kContext.stroke();	
	m_kContext.fill();
}

Sector.prototype.populateQuadTree = function(ships, structures, asteroids, objects)
{	
	this.m_kQuadTree.clear();

	// Quad Tree 
	this.m_kQuadTree = new Quadtree({
		x: -10000,
		y: -10000,
		width: 10000,
		height: 10000
	}, 10, 50);
	
	// Add Ships
	for(var i = 0; i < ships.length; i++)
	{
		// Ignore ship if it is dead!
		if(!ships[i].m_bIsAlive)
			continue;
		
		for(var j = 0; j < ships[i].m_liShields.length; j++)
		{
			_shield = ships[i].m_liShields[j];
			_pos = _shield.pos;
			_radius = _shield.r;
			
			// Add element
			this.m_kQuadTree.insert({
				x: _pos.x - _radius,
				y: _pos.y - _radius,
				width: _radius * 2,
				height: _radius * 2,
				object: ships[i],
				type: 0
			});
		}
	}
	
	// ! IMPORTANT !
	// If you are here because objects arent
	// being collided properly its probably because
	// the box is being drawn too small!
	for(var i = 0; i < objects.length; i++)
	{		
		// Add element
		this.m_kQuadTree.insert({
			x: objects[i].m_liPos[0] - 50,
			y: objects[i].m_liPos[1] - 50,
			width: 100,
			height: 100,
			object: objects[i],
			type: 3
		});
	}
	
	for(var i = 0; i < structures.length; i++)
	{
		for(var j = 0; j < structures[i].m_liShields.length; j++)
		{
			_shield = structures[i].m_liShields[j];
			_pos = _shield.pos;
			_radius = _shield.r;
			
			// Add element
			this.m_kQuadTree.insert({
				x: _pos.x - _radius,
				y: _pos.y - _radius,
				width: _radius * 2,
				height: _radius * 2,
				object: structures[i],
				type: 1
			});
		}
	}
	
	for(var i = 0; i < asteroids.length; i++)
	{		
		// Add element
		this.m_kQuadTree.insert({
			x: asteroids[i].m_liPos[0] - asteroids[i].m_iRadius,
			x: asteroids[i].m_liPos[1] - asteroids[i].m_iRadius,
			width: asteroids[i].m_iRadius * 2,
			height: asteroids[i].m_iRadius * 2,
			object: asteroids[i],
			type: 2
		});
	}
}

Sector.prototype.createHomeSector = function()
{
	// Spawn control tower
	var _control = new Control(0, 0, 1, this);
	_control.m_kSector = this;
	_control.onPlace();
	_control.onConstruct(1000);
	_control.onConstruct(1000);
	this.addStructure(_control);		
	
	// Spawn connector for assembler
	var _connector = new Connector(-350, -350, this);
	_connector.m_kSector = this;
	_connector.update();
	_connector.onPlace();
	_connector.onConstruct(1000);
	_connector.onConstruct(1000);
	this.addStructure(_connector);
	
	// Spawn assembler
	var _assembler = new Assembler(-1000, -350, this);
	_assembler.m_kSector = this;
	_assembler.update();
	_assembler.onPlace();
	_assembler.onConstruct(1000);
	_assembler.onConstruct(1000);
	this.addStructure(_assembler);	
	
	this.m_kAsteroidManager.generateAsteroidField(1200, 1200, 1000, 8);
}

Sector.prototype.debug = function()
{
	// ESCAPE
	if(isKeyDown(27))
	{
		// Reset all projectiles!
		//this.m_liObjects.length = 0;
	}
	
	var _structures = this.m_kStructureManager.m_liStructures;
	var _metal = 0;
	var _metalStorage = 0;
	var _powerGenerated = 0;
	var _powerDrarined = 0;
	
	// Add up all of the metal stored in this sector!
	for(var i = 0; i < _structures.length; i++)
	{
		if(_structures[i].m_bMetalStore)
		{
			_metal += _structures[i].m_iMetalStored;
			_metalStorage += _structures[i].m_iMetalStoredMax;
		}
		
		_powerGenerated += _structures[i].m_iPowerGenerated;
		_powerDrarined += _structures[i].m_iPowerDrain;
	}
	
	// Print it to the screen!
	//m_kLog.addStaticItem("Metal: " + _metal, 255, 165, 0);
	m_kLog.addStaticItem("Power: (+" + _powerGenerated + "/ -" + _powerDrarined + ")", 255, 255, 50);
	
	// Print it to the screen!
	//m_kLog.addStaticItem("Objects: " + this.m_liObjects.length, 255, 255, 255);
}

Sector.prototype.drawSectorInfo = function()
{
	// LOCATION AREA
	
	// Font size, type and colour
	m_kContext.font="10px Verdana";
	m_kContext.fillStyle = "white";
	
	// Positioning
	var _x = 10;
	var _y = 35;
	
	// Current Sector Title
	m_kContext.fillText("Current Sector:", _x, _y);
	
	// Adjust down
	_y += 30;
	
	// Change size
	m_kContext.font="24px Verdana";
	
	// Actual current sector	
	m_kContext.fillText("> " + this.m_iID, _x, _y);
	
	// OTHER STATS TITLES
	
	// Adjust down
	_y += 20;
	
	// Change size
	m_kContext.font="10px Verdana";
	
	// Draw title
	m_kContext.fillText("Sovereignty", _x, _y);
	
	// Adjust down
	_y += 12;
	
	// Draw title
	m_kContext.fillText("District", _x, _y);
	
	// Reset for actual info
	_y -= 12;
	
	// Inset the X
	_x += 100;
	
	// Text and indent
	m_kContext.fillStyle = "white";
	m_kContext.fillText(">", _x - 25, _y);	
	
	// Draw the sovereignty text
	if(this.m_iTeam == 0)
	{		
		m_kContext.fillStyle = "red";
		m_kContext.fillText("Neutral", _x, _y);	
	}
	
	if(this.m_iTeam == 1)
	{
		m_kContext.fillStyle = "blue";
		m_kContext.font="bold 12px Verdana";
		m_kContext.fillText("Blue", _x, _y);	
	}
	
	// Adjust down
	_y += 12;
	
	// Reset colour and style
	m_kContext.fillStyle = "white";	
	m_kContext.font="10px Verdana";
	
	// Inset
	m_kContext.fillText(">", _x - 25, _y);	
	
	// District
	m_kContext.fillText(this.m_kDistrict.m_iID, _x, _y);
	
	
	return;
	
	// Create the text for the soverienty
	if(this.m_iTeam == 0)
	{
		m_kContext.fillStyle = "red";
		m_kContext.fillText("Neutral", _x + _sovWidth, _y);	
	}
	
	// Adjust down
	_y += 12;
	
	m_kContext.fillStyle = "white";	
	m_kContext.fillText("District: " + this.m_kDistrict.m_iID, _x, _y);
}

Sector.prototype.updateRespawn = function()
{	
	// Ship index to delete
	var _index = -1;

	for(var i = 0; i < this.m_liRespawningShips.length; i++)
	{
		// If youre not already respawning
		if(!this.m_liRespawningShips[i].m_bIsRespawning)
		{
			// Attempt to respawn!
			this.m_kStructureManager.requestRespawn(this.m_liRespawningShips[i]);
		}
		else
		{
			// Already respawning, get off this list!
			_index = i;
		}
	}
	
	if(_index > -1)
	{			
		// Remove ship
		this.m_liRespawningShips.splice(_index, 1);
	}
}

Sector.prototype.requestRespawn = function(ship)
{
	this.m_liRespawningShips.push(ship);
}

Sector.prototype.updateTeam = function()
{
	var _team = this.m_kStructureManager.sectorOwner();
	
	if(_team != this.m_iTeam)
	{
		if(_team == 0)
		{
			m_kLog.addImportantItem(this.m_iID + "is now uncontested", 5000, 255, 255, 255); 
		}
		
		var _sTeam = "Neutral";
		var _r = 0;
		var _g = 0;
		var _b = 0;
		
		if(_team == 1)
		{
			_sTeam = "Blue";
			
			_b = 255;
			
			var _newName = prompt("What would you like this sector to be called?", this.m_iID);
			
			if (_newName != null) 
			{
				this.m_iID = _newName;
			}
		}
		
		if(_team == 2)
		{
			_sTeam = "Red";
			
			_r = 255;
		}
		
		m_kLog.addImportantItem(_sTeam + " captured " + this.m_iID, 10000, _r, _g, _b); 
	}
	
	// Calculates who controls the sector
	this.m_iTeam = this.m_kStructureManager.sectorOwner();
}

Sector.prototype.updateObjects = function()
{
	// Projectile index to delete
	var _index = -1;
	
	// Update ships
	for(var i = 0; i < this.m_liObjects.length; i++)
	{
		this.m_liObjects[i].update();
		
		// If destroyed, set index
		if(this.m_liObjects[i].m_bDelete)
		{		
			_index = i;
		}
	}
	
	if(_index > -1)
	{			
		// Remove projectile
		this.m_liObjects.splice(_index, 1);
	}
}

Sector.prototype.updateShips = function()
{
	// Ship index to delete
	var _index = -1;
	
	// Update ships
	for(var i = 0; i < this.m_liShips.length; i++)
	{
		// If destroyed, set index
		if(!this.m_liShips[i].m_bIsAlive)
		{		
			_index = i;
		}
		
		this.m_liShips[i].update();
	}
	
	if(_index > -1)
	{			
		// Remove ship
		this.m_liShips.splice(_index, 1);
	}
}

Sector.prototype.structurePlacementCheck = function(structure)
{
	return m_kCollisionManager.structurePlacementCheck(structure, this.m_liShips, this.m_kStructureManager.m_liStructures, this.m_kAsteroidManager.m_liAsteroids);
}

Sector.prototype.addShip = function(ship)
{	
	this.m_liShips.push(ship);
	
	// If this isn't the player, notify them somebody has entered the sector!
	if(ship.m_iID != m_kPlayer.m_kShip.m_iID)
		m_kLog.addItem("An unknown ship has entered the sector.", 2500, 255, 0, 0);
}

Sector.prototype.removeShip = function(ship)
{	
	// Item to delete
	var _index = -1;
	
	// Find ship
	for (var i = 0; i < this.m_liShips.length; i++) 
	{
		// Set index
		if(this.m_liShips[i] == ship)
		{		
			_index = i;
		}
	}
	
	if(_index > -1)
	{		
		// Remove item
		this.m_liShips.splice(_index, 1);
	}
}

Sector.prototype.removeObject = function(object)
{
	// Item to delete
	var _index = -1;
	
	// Find ship
	for (var i = 0; i < this.m_liObjects.length; i++) 
	{
		// Set index
		if(this.m_liObjects[i] == object)
		{		
			_index = i;
		}
	}
	
	if(_index > -1)
	{		
		// Remove item
		this.m_liObjects.splice(_index, 1);
	}
}

Sector.prototype.addStructure = function(structure)
{
	this.m_kStructureManager.addStructure(structure);
}

Sector.prototype.createScrap = function(object)
{	
	var _move = this.generateDrift();
	
	//m_kLog.addItem("Move X: " + _move[0], 10000, 255, 255, 255);
	//m_kLog.addItem("Move Y: " + _move[1], 10000, 255, 255, 255);
	
	//m_kLog.addItem("Player Move X: " + object.m_liMove[0], 10000, 255, 255, 255);
	//m_kLog.addItem("Player Move Y: " + object.m_liMove[0], 10000, 255, 255, 255);
	
	//m_kLog.addItem("Final Move X: " + (object.m_liMove[0] + _move[0]), 10000, 255, 255, 255);
	//m_kLog.addItem("Final Move Y: " + (object.m_liMove[1] + _move[1]), 10000, 255, 255, 255);

	// Don't know if this is a structure or a ship, shouldn't matter!
	for(var i = 0; i < object.m_liComponents.length; i++)
	{
		if(!object.m_liComponents[i].m_bCanScrap)
			continue;
		
		var _move = this.generateDrift();
		
		this.m_liObjects.push(new Scrap(this, object.m_liComponents[i], object.m_liMove[0] + _move[0], object.m_liMove[1] + _move[1]));
	}
}

Sector.prototype.generateDrift = function()
{
	var _move = new Array();
	
	_move[0] = -1 + (Math.random() * 2);
	_move[1] = -1 + (Math.random() * 2);
	
	return _move;
}

// For hypering and drawing purposes

Sector.prototype.setSelected = function(isSelected)
{
	this.m_bIsSelected = isSelected;
}

Sector.prototype.setTarget = function(isTarget)
{
	this.m_bIsTarget = isTarget;
}