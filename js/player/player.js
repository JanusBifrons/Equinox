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
	this.m_kSelectedStructure = new Structure();
	this.m_bSelectedStructure = false;
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

	// Initialize players ship
	this.m_kShip = new Debug(x, y, 0, 0, this);
	//this.m_kShip = new Asylum(x, y, 0, 0, this);
	//this.m_kShip = new Tyrant(x, y, 0, 0, this);
	////this.m_kShip = new Havok(x, y, 0, 0, this);
	
	// This is compensation for my terrible input code which is buggy
	this.m_iInteriaTimerMax = 1000;
	this.m_iInertiaTimer = this.m_iInteriaTimerMax;
	
	// User Interface
	this.m_liUI = new Array();
	this.m_liSelectedObjects = new Array();
	
	//this.createUI();
	
	console.log("Player initialised successfully.");
}

Player.prototype.update = function()
{	
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
	
	// Draw UI elements
	for(var i = 0; i < this.m_liUI.length; i++)
		this.m_liUI[i].draw();
	
	this.drawSelected();
	
	// Draw UI items from the ship
	this.m_kShip.drawStats();
	this.m_kShip.drawWeaponList();
	
	// Draw Cargo!
	if(this.m_kShip.m_bDrawCargo)
	{
		this.m_kShip.m_kCargoHold.draw();
	}
	
	// Draw Exp Bar
	//this.drawExpBar();
}

// EVENTS

Player.prototype.onObjectDeath = function(id)
{
	var _index = -1;
	
	for(var i = 0; i < this.m_liSelectedObjects.length; i++)
	{
		if(this.m_liSelectedObjects[i].m_iID == id)
		{
			_index = i;
		}
	}
	
	if(_index > -1)
		this.m_liSelectedObjects.splice(_index, 1);
}

Player.prototype.onLeftClick = function()
{
	// Collision point for the mouse position IN SCREEN SPACE
	var _mouseCircle = new C(new V(m_iMouseX, m_iMouseY), 5);
	
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
Player.prototype.drawSelected = function(object)
{
	//var _size = 100;
	var _size = 125;
	var _padding = 20;
	var _step = 100;
	
	// Set start X and Y
	var _x = m_kCanvas.width - (_size + _padding);
	var _y = _padding;
	
	// Draw selected objects
	for(var i = 0; i < this.m_liSelectedObjects.length; i++)
	{
		// Make rows so the targets dont fall off the bottom of the screen
		if(_y > (m_kCanvas.height * 0.9))
		{
			_x -= _size + _padding;
			_y = _padding;
		}
		
		// Reference to object for readability
		var _object = this.m_liSelectedObjects[i];
		
		// Draw background and border
		this.drawUIBox(_x, _y, _size, _object, i);
		
		// Draw object itself
		this.drawObject(_x, _y, _size / 2, _object, 10);	// Size is halved as it is compared to radius which is obviously doubled to get the width
		
		// Add the height so the next target isn't overlapping
		_y += _size;
		
		// Add a little padding so the stats aren't touching the preview
		_y += _padding * 0.5;
		
		// Draw shield 
		this.drawObjectStat(_x, _y, _size, _object.m_iShields, _object.m_iShieldCap, 'blue');
		
		// Add a little padding so the stats aren't touching each other
		_y += _padding * 0.7;
		
		// Draw armour
		this.drawObjectStat(_x, _y, _size, _object.m_iArmour, _object.m_iArmourCap, 'grey');
		
		// Add a little padding so the stats aren't touching each other
		_y += _padding * 0.7;
		
		// Draw hull
		this.drawObjectStat(_x, _y, _size, _object.m_iHull, _object.m_iHullCap, 'brown');
		
		// Add a little padding to the stats dont touch the distance
		_y += _padding * 1.4;
		
		// Draw the distance to this target
		this.drawDistance(_x, _y, _object);
		
		// Add padding to next target!
		_y += _padding * 0.5;
	}
}

Player.prototype.drawDistance = function(x, y, object)
{
	var _distance = calculateDistance(this.m_kShip.m_liPos, object.m_liPos);
	_distance = Math.floor(_distance);
	
	if(_distance > 4999)
	{
		_distance = Math.floor(_distance / 1000);
		_distance = _distance.toString() + " KM";
	}
	else
	{
		_distance = _distance.toString() + " M";
	}
	
	// Font size, type and colour
	m_kContext.font="15px Verdana";
	m_kContext.fillStyle = "white";
	
	m_kContext.fillText(_distance, x, y);
}

Player.prototype.drawObject = function(x, y, size, object, padding)
{
	var _scale = (size - padding) / object.m_iRadius;
	
	// Save context!
	m_kContext.save();
	
	x += padding;
	y += padding;
	
	x += object.m_iRadius * _scale;
	y += object.m_iRadius * _scale;
	
	// Translate to center// Translate to center
	m_kContext.translate(x, y);
	m_kContext.translate(-(object.m_liPos[0] * _scale), -(object.m_liPos[1] * _scale));
	m_kContext.scale(_scale, _scale);
	
	object.drawBody();
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}

Player.prototype.drawObjectStat = function(x, y, size, current, total, colour)
{
	var _percent = current / total;
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'black';
	m_kContext.lineWidth = 1;
	
	// Border and background
	m_kContext.fillRect(x, y, size, 10);
	
	m_kContext.beginPath();
	m_kContext.rect(x, y, size, 10);
	m_kContext.closePath();
	m_kContext.stroke();
	
	m_kContext.fillStyle = colour;
	
	// Percent
	m_kContext.fillRect(x, y, size * _percent, 10);
}

Player.prototype.drawUIBox = function(x, y, size, object)
{	
	// Save context!
	m_kContext.save();
	
	// Translate to center// Translate to center
	m_kContext.translate(x, y);
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'black';
	m_kContext.lineWidth = 1;
	
	// Background
	m_kContext.fillRect(0, 0, size, size);
	m_kContext.beginPath();
	m_kContext.rect(0, 0, size, size);
	m_kContext.closePath();
	m_kContext.stroke();
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}

Player.prototype.updateCameraPos = function()
{
	var _speed = 1;
	var _distance = calculateDistance(this.m_liCamera, this.m_liCameraDesired);
	
	// Update camera position
	if(this.m_kShip.m_bIsAlive)
	{
		this.m_liCameraDesired[0] = this.m_kShip.m_liPos[0];
		this.m_liCameraDesired[1] = this.m_kShip.m_liPos[1];
		
		if(_distance < 100)
		{
			_speed = 0.5;
		}
		else
		{
			_speed = 0.1;
		}
	}
	else
	{
		this.m_liCameraDesired[0] = 0;
		this.m_liCameraDesired[1] = 0;
		
		_speed = 0.01;
	}
	
	var _x = this.m_liCamera[0] - this.m_liCameraDesired[0];
	var _y = this.m_liCamera[1] - this.m_liCameraDesired[1];
	
	this.m_liCamera[0] -= (_x * _speed);
	this.m_liCamera[1] -= (_y * _speed);
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

Player.prototype.updateInput = function()
{		
	this.m_iInertiaTimer -= m_fElapsedTime;
	
	// Create X/Y coords in world space for mouse position
	var _worldPos = m_kCamera.screenToWorld(m_iMouseX, m_iMouseY, _worldPos);		
	var _quadTree = this.m_kSector.m_kQuadTree;

	// Check if mouse is over a game object
	m_kCollisionManager.checkMouse(_worldPos, false, _quadTree);

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
		this.m_kShip.onDeath();
	}
	
	// ESCAPE
	if(isKeyDown(27))
	{
		this.m_bPlacingStructure = false;
		this.m_bSelectedStructure = false;
		
		// Unselect all objects
		for(var i = 0; i < this.m_liSelectedObjects.length; i++)
		{
			this.m_liSelectedObjects[i].m_bIsSelected = false;
		}
		
		this.m_liSelectedObjects.length = 0;
	}
	
	// MOUSE CLICK
	if(isMousePressed())
	{	
		this.onLeftClick();
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
	
	// Temporarily disable all other structures
	return;
	
	// 3 KEY
	if(isKeyDown(51))
	{
		this.m_bPlacingStructure = true;
		this.m_kStructure = new Extractor(getMouseX(), getMouseY());
		this.m_iStructureIndex = 2;
	}
	
	// 4 KEY
	if(isKeyDown(52))
	{
		this.m_bPlacingStructure = true;
		this.m_kStructure = new Respawn(getMouseX(), getMouseY());
		this.m_iStructureIndex = 3
	}
	
	// 5 KEY
	if(isKeyDown(53))
	{
		this.m_bPlacingStructure = true;
		this.m_kStructure = new Teleporter(getMouseX(), getMouseY());
		this.m_iStructureIndex = 4;
	}
	
	// 6 KEY
	if(isKeyDown(54))
	{
		this.m_bPlacingStructure = true;
		this.m_kStructure = new Battery(getMouseX(), getMouseY());
		this.m_iStructureIndex = 5;
	}
	
	// 7 KEY
	if(isKeyDown(55))
	{
		this.m_bPlacingStructure = true;
		this.m_kStructure = new BeamTurret(getMouseX(), getMouseY());
		this.m_iStructureIndex = 6;
	}
	
	// 8 KEY
	if(isKeyDown(56))
	{
		this.m_bPlacingStructure = true;
		this.m_kStructure = new CannonTurret(getMouseX(), getMouseY());
		this.m_iStructureIndex = 7;
	}
	
	// 9 KEY
	if(isKeyDown(57))
	{
		this.m_bPlacingStructure = true;
		this.m_kStructure = new TractorTurret(getMouseX(), getMouseY());
		this.m_iStructureIndex = 8;
	}
	
	// - KEY
	if(isKeyDown(189))
	{
		this.m_bPlacingStructure = true;
		this.m_kStructure = new Repair(getMouseX(), getMouseY());
		this.m_iStructureIndex = 9;
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