function Player(district, sector, x, y)
{	
	// Location
	this.m_kDistrict = district;
	this.m_kSector = sector;
	this.m_iHyperTarget = sector.m_iID;
	
	// Team
	this.m_iTeam = 1;
	
	// Structure
	this.m_kStructure = new Structure();
	this.m_iStructureIndex = 0;
	this.m_bPlacingStructure = false;
	
	// Level
	this.m_iLevel = 1;
	this.m_iExperience = 0;
	
	this.m_liLevels = new Array();
	this.m_liLevels[0] = 0;
	
	// Camera position
	this.m_liCamera = new Array();
	this.m_liCameraDesired = new Array();
	this.m_liCamera[0] = 0;
	this.m_liCamera[1] = 0;
	this.m_liCameraDesired[0] = 0;
	this.m_liCameraDesired[1] = 0;
	this.m_iCameraSpeed = 0.5;

	// Initialize players ship
	this.m_kShip = new Debug(x, y, 0, 0, this, this.m_kSector, this.m_iTeam);
	//this.m_kShip = new Asylum(x, y, 0, 0, this);
	//this.m_kShip = new Tyrant(x, y, 0, 0, this);
	//this.m_kShip = new Havok(x, y, 0, 0, this);
	
	// This is compensation for my terrible input code which is buggy
	this.m_iInteriaTimerMax = 1000;
	this.m_iInertiaTimer = this.m_iInteriaTimerMax;
	
	// User Interface
	this.m_kSelectedObject = new SelectedObject(this, this.m_kShip);
	this.m_kSectorOverview = new SectorOverview(this, this.m_kSector);
	
	// Input
	this.m_liKeys = new Array();
	this.m_liDragPos = new Array();
	this.m_bIsDragging = false;
	this.m_bObjectSelected = false;
	this.m_kDraggedObject;
	
	// Disabled indefinitely
	//this.m_kThrottleBar = new ThrottleBar(this);
	//this.m_kInertialButton = new InertialButton(this);
	
	console.log("Player initialised successfully.");
}


Player.prototype.bindControls = function(player)
{
	// Bind Controls
		
	// Bind a references
	var leftClick = (this.onLeftClick).bind(this);
	var onDrag = (this.onDrag).bind(this);
	var onDragEnd = (this.onDragEnd).bind(this);
	
	// Bind action to function call
	mouse.on('down', 'left', leftClick);
	
	mouse.on('drag', 'left', onDrag);
	mouse.on('drop', 'left', onDragEnd);
	
	return;
	
	this.bindKey("a");
	this.bindKey("d");
	this.bindKey("w");
	this.bindKey("s");
	
	this.bindKey("left");
	this.bindKey("right");
	this.bindKey("up");
	this.bindKey("down");
	
	this.bindKey("space");
	this.bindKey("shift");
	
	this.bindKey("del");
	this.bindKey("esc");
	
	this.bindKey('1');
	this.bindKey('2');
	this.bindKey('3');
}

Player.prototype.update = function()
{	
	// Update sector overview
	this.m_kSectorOverview.update();
	
	// Update selected
	this.m_kSelectedObject.update();

	// Update Camera Pos
	this.updateCameraPos();

	// Update input
	this.updateInput();
	
	// Updateing a structure if one is currently attempting to be placed
	this.updateStructurePlacement()
}


Player.prototype.draw = function()
{	
	// WORLD SPACE
	
	m_kCamera.begin();
	
	// If currently placing a structure
	if(this.m_bPlacingStructure)
	{	
		// Draw the connections UNDER the structure
		this.m_kStructure.drawConnections();

		// Draw the structure
		this.m_kStructure.draw();
	}
	
	m_kCamera.end();
	
	// WORLD SPACE END
	
	// SCREEN SPACE
	
	// Target targets, selected objects and overview
	this.drawUI();
	
	m_kContext.globalAlpha = 1;
	
	// Draw UI items from the ship
	this.m_kShip.drawStats();
	this.m_kShip.drawWeaponList();
	
	// Draw Cargo!
	if(this.m_kShip.m_bDrawCargo)
	{	
		var _padding = m_kCanvas.width * 0.01;
		var _width = m_kCanvas.width * 0.2;
		var _height = _width;
		
		var _x = _padding;
		var _y = (m_kCanvas.height - _padding) - _height;
		
		this.m_kShip.m_kCargoHold.draw(_x, _y, _width, _height);
	}
		
	if(this.m_bIsDragging && this.m_bObjectSelected)
	{		
		// This is bad and inefficient code 
		// but changing it would require a refactor of every
		// single 'drawBody' call to 'fix' it
		
		m_kContext.save();
		
		m_kContext.translate(m_iMouseX, m_iMouseY);
		m_kContext.translate(-(this.m_kDraggedObject.m_liPos[0]), -(this.m_kDraggedObject.m_liPos[1]));
		
		this.m_kDraggedObject.drawBody();
		
		m_kContext.restore();
	}
	
	// Draw Exp Bar
	//this.drawExpBar();
}

// EVENTS

Player.prototype.onDragEnd = function()
{	
	// Collision point for the mouse position IN SCREEN SPACE
	var _mouseCircle = new C(new V(m_iMouseX, m_iMouseY), 1);

	// Store in cargo hold
	if(this.m_kShip.m_kCargoHold.onMouseDrop(_mouseCircle) && this.m_bObjectSelected)
	{
		if(!this.m_kDraggedObject.m_bIsCargo)
		{			
			this.m_kShip.m_kCargoHold.onStore(this.m_kDraggedObject);
			
			// Remove object from the sector, it is now in a cargo hold!
			this.m_kSector.removeObject(this.m_kDraggedObject);
		}
	}
	else
	{
		if(this.m_kDraggedObject.m_bIsCargo && this.m_bObjectSelected)
		{
			// Create X/Y coords in world space for mouse position
			var _worldPos = m_kCamera.screenToWorld(m_iMouseX, m_iMouseY, _worldPos);		
			
			this.m_kDraggedObject.m_bIsCargo = false;
			
			this.m_kDraggedObject.m_liPos[0] = _worldPos.x;
			this.m_kDraggedObject.m_liPos[1] = _worldPos.y;
			
			this.m_kSector.m_liObjects.push(this.m_kDraggedObject);
			
			this.m_kShip.m_kCargoHold.onDrop(this.m_kDraggedObject);
		}
	}
	
	// Reset flags
	this.m_bObjectSelected = false;
	this.m_bIsDragging = false;
}

Player.prototype.onDrag = function()
{	
	this.m_liDragPos[0] = m_iMouseX;
	this.m_liDragPos[1] = m_iMouseY;
	
	this.m_bIsDragging = true;
}

Player.prototype.onStore = function(object)
{
	this.m_kShip.m_kCargoHold.onStore(object);
}

Player.prototype.onOpenCargo = function(object)
{
	m_kLog.addItem("This code hasn't been written yet!", 1000, 255, 0, 0);
}

Player.prototype.onShipChange = function(ship)
{
	this.m_kShip = ship;
}

Player.prototype.onLeftClick = function()
{	
	// Collision point for the mouse position IN SCREEN SPACE
	var _mouseCircle = new C(new V(m_iMouseX, m_iMouseY), 1);
	
	if(this.m_kShip.m_kCargoHold.onMouseClick(_mouseCircle))
		return;
	
	// Check if you're clicking the buttons on the overview
	if(this.m_kSectorOverview.onMouseClick(_mouseCircle))
		return;
	
	// Check for clicks on targets (setting them as primary target)
	for(var i = 0; i < this.m_kShip.m_liTargets.length; i++)
		if(this.m_kShip.m_liTargets[i].onMouseClick(_mouseCircle))
			return;
	
	// Check if you're clicking the buttons on the selected object
	if(this.m_kSelectedObject.onMouseClick(_mouseCircle))
	{		
		// Cancel structure
		this.m_bPlacingStructure = false;
		return;
	}
	
	// If you're currently placing a structure AND you've not selected something
	if(this.m_bPlacingStructure)
	{	
		// Check if structure CAN be placed
		if(this.m_kSector.structurePlacementCheck(this.m_kStructure))
		{		
			// Check this structure WANTS to be placed
			if(this.m_kStructure.onPlace())
			{			
				// Add structure to the sector
				this.m_kSector.addStructure(this.m_kStructure);
				
				// Reselect structure for multiple placement!
				this.m_kStructure = this.structureFromIndex(this.m_iStructureIndex);
			}	
		}
		else
		{
			m_kLog.addItem("Cannot place structure here!", 5000, 255, 0, 0);
		}
	}
	else
	{
		// Create X/Y coords in world space for mouse position
		var _worldPos = m_kCamera.screenToWorld(m_iMouseX, m_iMouseY, _worldPos);		
		var _quadTree = this.m_kSector.m_kQuadTree;

		// Check if mouse is over a game object and should select this ship
		m_kCollisionManager.checkMouse(_worldPos, true, _quadTree);	
	}
}

// HELPERS

Player.prototype.setDragObject = function(object)
{
	this.m_kDraggedObject = object;
	this.m_bObjectSelected = true;
}

Player.prototype.isKeyDown = function(key)
{
	if(m_liKeysDown.indexOf(key) >= 0)
		return true;
	else
		return false;
}

Player.prototype.bindKey = function(key)
{
	Mousetrap.bind(key, function(){
							if(m_liKeysDown.indexOf(key) < 0){
								m_liKeysDown.push(key);
							}}, 'keydown');
							
	Mousetrap.bind(key, function(){
									m_liKeysDown.splice(m_liKeysDown.indexOf(key), 1);
								}, 'keyup');
}

Player.prototype.selectObject = function(object)
{					
	if(object.m_eObjectType == "Object")
	{
		this.m_kDraggedObject = object;
		this.m_bObjectSelected = true;
	}
	else
	{
		this.m_bObjectSelected = false;
	}
	
	// Unselect old object
	this.m_kSelectedObject.m_kSelected.m_kTarget.m_bIsSelected = false;
	
	// Select new object
	this.m_kSelectedObject = new SelectedObject(this, object);
	this.m_kSelectedObject.m_kSelected.m_kTarget.m_bIsSelected = true;	// Dat nesting...
}

Player.prototype.drawUI = function()
{			
	var _width = m_kCanvas.width * 0.2;
	var _height = _width * 0.5;
	var _size = _height * 0.5;
	var _padding = _size * 0.2;
	
	var _x = m_kCanvas.width - (_width + _padding);
	var _y = _padding;
	
	this.m_kSelectedObject.draw(_x, _y, _height, _width, _padding, _size);
	
	var _adjustedY = _y + _height + _padding;
	
	this.m_kSectorOverview.draw(_x, _adjustedY, _height, _width, _padding);
	
	_x = m_kCanvas.width - (_width + _size + _padding + _padding);
	
	this.m_kShip.drawTargets(_x, _y, _size, _padding);
}

Player.prototype.updateCameraPos = function()
{		
	// Update camera position
	if(this.m_kShip.m_bIsAlive)
	{
		this.m_liCameraDesired[0] = this.m_kShip.m_liPos[0];
		this.m_liCameraDesired[1] = this.m_kShip.m_liPos[1];
		
		var _distance = calculateDistance(this.m_liCamera, this.m_liCameraDesired);
		
		if(_distance < 100)
		{
			if(this.m_iCameraSpeed < 0.5)
			{
				this.m_iCameraSpeed += 0.005;
			}
		}
		else
		{
			this.m_iCameraSpeed = 0.05;
		}
	}
	else
	{
		this.m_liCameraDesired[0] = 0;
		this.m_liCameraDesired[1] = 0;
		
		this.m_iCameraSpeed = 0.01;
	}
	
	var _x = this.m_liCamera[0] - this.m_liCameraDesired[0];
	var _y = this.m_liCamera[1] - this.m_liCameraDesired[1];
	
	this.m_liCamera[0] -= (_x * this.m_iCameraSpeed);
	this.m_liCamera[1] -= (_y * this.m_iCameraSpeed);
}

Player.prototype.updateStructurePlacement = function()
{
	if(this.m_bPlacingStructure)
	{
		// Set structures sector
		this.m_kStructure.m_kSector = this.m_kSector;
		
		// Create X/Y coords in world space for mouse position
		var _worldPos = m_kCamera.screenToWorld(m_iMouseX, m_iMouseY, _worldPos);
		
		// Set structures position to their corresponding world space position
		this.m_kStructure.m_liPos[0] = _worldPos.x;
		this.m_kStructure.m_liPos[1] = _worldPos.y;
		
		// Update the structure to make sure it has all of its connections and stats
		this.m_kStructure.update();
		
		// Check if this structure can legally be placed in the location it currently occupies
		this.m_kSector.structurePlacementCheck(this.m_kStructure);
	}
}

Player.prototype.drawExpBar = function()
{		
	var _prevLevel = this.m_liLevels[this.m_iLevel];
	var _nextLevel = this.m_liLevels[this.m_iLevel + 1] - _prevLevel;
	var _expDiff = this.m_iExperience - _prevLevel;
	var _expPerc = _expDiff / _nextLevel;
	
	var x = -1;
	var y = m_kCanvas.height - 5;

	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'black';

	m_kContext.lineWidth = 2;

	// STAT BAR //
	m_kContext.fillStyle = 'white';	
	m_kContext.fillRect(x, y, m_kCanvas.width, 5);
	
	m_kContext.fillStyle = 'green';
	m_kContext.fillRect(x, y, _expPerc * m_kCanvas.width, 5);
	
	m_kContext.strokeStyle = 'black';
	m_kContext.rect(x, y, m_kCanvas.width, 5);
	
	m_kContext.beginPath();
	m_kContext.moveTo(x + _expPerc, y);
	m_kContext.lineTo(x + _expPerc, y + 5);
	m_kContext.closePath();
	m_kContext.stroke();
	m_kContext.fill();
}

Player.prototype.setHyperTarget = function(target)
{
	this.m_kShip.m_iHyperTarget = target;
}

Player.prototype.newUpdate = function()
{
	// Create X/Y coords in world space for mouse position
	var _worldPos = m_kCamera.screenToWorld(m_iMouseX, m_iMouseY, _worldPos);		
	var _quadTree = this.m_kSector.m_kQuadTree;

	// Check if mouse is over a game object
	m_kCollisionManager.checkMouse(_worldPos, false, _quadTree);
	
	// Collision point for the mouse position IN SCREEN SPACE
	var _mouseCircle = new C(new V(m_iMouseX, m_iMouseY), 1);
	
	// Handle mouse overs
	this.m_kSectorOverview.onMouseOver(_mouseCircle);
	this.m_kSelectedObject.onMouseOver(_mouseCircle);
	for(var i = 0; i < this.m_kShip.m_liTargets.length; i++)
		_shipTargets[i].onMouseOver(_mouseCircle);
	
	if(this.isKeyDown("left") || this.isKeyDown("a"))
		this.m_kShip.rotateLeft();
	
	if(this.isKeyDown("right") || this.isKeyDown("d"))
		this.m_kShip.rotateRight();
	
	if(this.isKeyDown("up") || this.isKeyDown("w"))
		this.m_kShip.accellerate();
	
	if(this.isKeyDown("down") || this.isKeyDown("s"))
		this.m_kShip.accellerate();
	
	if(this.isKeyDown("space"))
		this.m_kShip.onFire();
	
	if(this.isKeyDown("shift"))
		this.m_kShip.afterBurner();
	
	if(this.isKeyDown('1'))
		this.m_kShip.selectWeapon(0);
	
	if(this.isKeyDown('2'))
		this.m_kShip.selectWeapon(1);
	
	if(this.isKeyDown('3'))
		this.m_kShip.selectWeapon(2);
	
	if(this.isKeyDown("del"))
		this.m_kShip.onDestroy();
	
	if(this.isKeyDown("esc"))
		this.m_bPlacingStructure = false;
	
	if(this.isKeyDown("x"))
		if(this.m_iTeam == 1)
			this.m_iTeam = 2;
		else
			this.m_iTeam = 1;
}

Player.prototype.updateInput = function()
{	
	// Rotate ship to face direction
	
	this.m_iInertiaTimer -= m_fElapsedTime;
	
	// Create X/Y coords in world space for mouse position
	var _worldPos = m_kCamera.screenToWorld(m_iMouseX, m_iMouseY, _worldPos);		
	var _quadTree = this.m_kSector.m_kQuadTree;

	// Check if mouse is over a game object
	m_kCollisionManager.checkMouse(_worldPos, false, _quadTree);
	
	// Collision point for the mouse position IN SCREEN SPACE
	var _mouseCircle = new C(new V(m_iMouseX, m_iMouseY), 1);
		
	// MOUSE CLICK
	if(isMousePressed())
	{	
		//this.onLeftClick();
	}
	else
	{
		this.m_kSectorOverview.onMouseOver(_mouseCircle);
		
		this.m_kSelectedObject.onMouseOver(_mouseCircle);
	
		var _shipTargets = this.m_kShip.m_liTargets;
	
		for(var i = 0; i < _shipTargets.length; i++)
		{
			_shipTargets[i].onMouseOver(_mouseCircle);
		}
	}

	// RIGHT ARROW
	if(isKeyDown(39) || isKeyDown(68))
	{
		this.m_kShip.rotateRight();
	}
	
	// LEFT ARROW
	if(isKeyDown(37) || isKeyDown(65))
	{
		this.m_kShip.rotateLeft();
	}
	
	// UP ARROW
	if(isKeyDown(38) || isKeyDown(87))
	{
		//this.m_kShip.throttleUp();
		this.m_kShip.accellerate();
	}
	
	// DOWN ARROW
	if(isKeyDown(40) || isKeyDown(83))
	{
		this.m_kShip.deccellerate();
	}
	
	// Z KEY
	if(isKeyDown(90))
	{
		if(this.m_iInertiaTimer <= 0)
		{
			this.m_kShip.toggleDampeners();
			
			// Reset timer
			this.m_iInertiaTimer = this.m_iInteriaTimerMax;
		}
	}
	
	// SPACE BAR
	if(isKeyDown(32))
	{
		this.m_kShip.onFire();
	}
	
	// SHIFT
	if(isKeyDown(16))
	{
		this.m_kShip.afterBurner();
	}
	
	// NUMPAD 1
	if(isKeyDown(97))
	{
		this.m_kShip.selectWeapon(0);
	}
	
	// NUMPAD 2
	if(isKeyDown(98))
	{
		this.m_kShip.selectWeapon(1);
	}
	
	// NUMPAD 3
	if(isKeyDown(99))
	{
		this.m_kShip.selectWeapon(2);
	}
	
	// NUMPAD 4
	if(isKeyDown(100))
	{
		this.m_kShip.selectWeapon(3);
	}
	
	// F KEY
	if(isKeyDown(70))
	{
		if(this.m_kShip.m_iHyperTarget != this.m_kSector.m_iID)
		{		
			this.m_kShip.onHyperCharge();
		}
	}
	
	// DELETE
	if(isKeyDown(46) && this.m_kShip.m_bIsAlive)
	{
		this.m_kShip.onDestroy();
	}
	
	// ESCAPE
	if(isKeyDown(27))
	{
		this.m_bPlacingStructure = false;
		this.m_bSelectedStructure = false;
	}
	
	// X Key
	if(isKeyDown(88))
	{
		if(this.m_iInertiaTimer <= 0)
		{
			if(this.m_iTeam == 1)
			{
				this.m_iTeam = 2;
			} 
			else if(this.m_iTeam == 2)
			{
				this.m_iTeam = 1;
			}
			
			// Reset timer
			this.m_iInertiaTimer = this.m_iInteriaTimerMax;
		}
	}
	
	// Q KEY
	if(isKeyDown(81) && this.m_bPlacingStructure)
	{
		this.m_kStructure.m_iRotation += 0.1;
		
		this.m_kStructure.m_iRotation = wrapAngle(this.m_kStructure.m_iRotation);
	}
	
	// E KEY
	if(isKeyDown(69) && this.m_bPlacingStructure)
	{
		this.m_kStructure.m_iRotation -= 0.1
		
		this.m_kStructure.m_iRotation = wrapAngle(this.m_kStructure.m_iRotation);
	}
	
	// C KEY
	if(isKeyDown(67))
	{
		if(this.m_iInertiaTimer <= 0)
		{
			if(!this.m_kShip.m_bDrawCargo)
			{
				this.m_kShip.m_bDrawCargo = true;
				
				// This should be a generic variable
				this.m_iInertiaTimer = this.m_iInteriaTimerMax;
			}
			else
			{
				this.m_kShip.m_bDrawCargo = false;
				
				// This should be a generic variable
				this.m_iInertiaTimer = this.m_iInteriaTimerMax;
			}	
		}
	}
	
	// 0 KEY
	if(isKeyDown(48))
	{
		this.m_bPlacingStructure = true;
		this.m_kStructure = new Control(getMouseX(), getMouseY(), this.m_iTeam);		
	}
	
	// 1 KEY
	if(isKeyDown(49))
	{
		this.m_bPlacingStructure = true;
		this.m_kStructure = new Connector(getMouseX(), getMouseY());
		this.m_iStructureIndex = 0;
	}
	
	// 2 KEY
	if(isKeyDown(50))
	{
		this.m_bPlacingStructure = true;
		this.m_kStructure = new Solar(getMouseX(), getMouseY());
		this.m_iStructureIndex = 1;		
	}
	
	// 3 KEY
	if(isKeyDown(51))
	{
		this.m_bPlacingStructure = true;
		this.m_kStructure = new ShieldWall(getMouseX(), getMouseY());
		this.m_iStructureIndex = 2;
	}
	
	// 4 KEY
	if(isKeyDown(52))
	{
		this.m_bPlacingStructure = true;
		this.m_kStructure = new Assembler(getMouseX(), getMouseY());
		
		//this.m_kStructure = new Respawn(getMouseX(), getMouseY());
		//this.m_iStructureIndex = 3
	}
}

Player.prototype.structureFromIndex = function(index)
{
	switch(index)
	{
		case 0:
			return new Connector(0, 0);
			break;
			
		case 1:
			return new Solar(0, 0);
			break;
			
		case 2:
			//return new Extractor(0, 0);
			return new ShieldWall(0, 0);
			break;
			
		case 3:
			return new Respawn(0, 0);
			break;
			
		case 4:
			return new Teleporter(0, 0);
			break;
			
		case 5:
			return new Battery(0, 0);
			break;
			
		case 6:
			return new BeamTurret(0, 0);
			break;
			
		case 7:
			return new CannonTurret(0, 0);
			break;
			
		case 8:
			return new TractorTurret(0, 0);
			break;
			
		case 9:
			return new Repair(0, 0);
			break;
			
		case 10:
			return new Storage(0, 0);
			break;
			
		case 11:
			return new Beacon(0, 0);
			break;		
	}
	
	return new Structure();
}