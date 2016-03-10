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
	
	// Draw Exp Bar
	this.drawExpBar();
}

// EVENTS

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
	// Draw selected objects
	for(var i = 0; i < this.m_liSelectedObjects.length; i++)
	{
		var _object = this.m_liSelectedObjects[i];
		
		var _scale = 0.25;
		var _scale = 50 / _object.m_iRadius;
		var _padding = (m_kCanvas.width * 0.01) * _scale;
		
		var _transX = (m_kCanvas.width - _object.m_iRadius) * _scale;
		var _transY = _object.m_iRadius * _scale;
		
		_transX -= _object.m_liPos[0] * _scale;
		_transY -= _object.m_liPos[1] * _scale;
		
		// Save context!
		m_kContext.save();
		
		// Translate to center// Translate to center
		m_kContext.translate(m_kCanvas.width - ((_object.m_iRadius * _scale) + 10), 10 + (_object.m_iRadius * _scale) + (110 * i));
		m_kContext.translate(-(_object.m_liPos[0] * _scale), -(_object.m_liPos[1] * _scale));
		m_kContext.scale(_scale, _scale);
		
		_object.draw();
		
		// Restore the context back to how it was before!
		m_kContext.restore();
	}
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