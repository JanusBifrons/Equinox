function CollisionManager()
{
	this.m_kResponse = new SAT.Response();
}

CollisionManager.prototype.checkMouse = function(mousePos, mouseClicked, quadTree)
{
	var _mousePos = {
		x: mousePos.x,
		y: mousePos.y, 
		width: 5,
		height: 5
	};
	
	// Collision circle for the mouse position in world space
	var _mouseCircle = new C(new V(mousePos.x, mousePos.y), 5);
	
	// Elements in this section of the quad tree
	var _elements = quadTree.retrieve(_mousePos);
	
	for(var i = 0; i < _elements.length; i++)
	{
		var _object = _elements[i].object;
		
		for(var j = 0; j < _object.m_liShields.length; j++)
		{
			if(this.circleCircleCollisionDetection(_object.m_liShields[j], _mouseCircle))
			{
				_object.m_bDrawUI = true;
				
				if(mouseClicked)
					m_kPlayer.selectObject(_object);
				
				return;
			}
		}
	}
}

CollisionManager.prototype.checkCollisions = function(quadTree, ships, structures, asteroids, objects)
{
	// THINGS WHICH MOVE VS EVERYTHING
	
	// Objects
	for(var i = 0; i < objects.length; i++)
	{		
		_objectPos = {
			x: objects[i].m_liPos[0] - 50, 
			y: objects[i].m_liPos[1] - 50,
			width: 100,
			height: 100
		};
			
		// Fetch elements
		var _elements = quadTree.retrieve(_objectPos);
		
		for(var k = 0; k < _elements.length; k++)
		{	
			// SHIP!
			if(_elements[k].type == 0)
				this.gameObjectToGameObject(objects[i], _elements[k].object);
			
			// STRUCTURE!
			if(_elements[k].type == 1)
				this.gameObjectToGameObject(objects[i], _elements[k].object);
			
			// ASTEROID!
			if(_elements[k].type == 2)
				this.gameObjectToGameObject(objects[i], _elements[k].object);
			
			// OBJECTS!
			if(_elements[k].type == 3)
				this.gameObjectToGameObject(objects[i], _elements[k].object);
		}
	}
	
	// Ships
	for(var i = 0; i < ships.length; i++)
	{		
		for(var j = 0; j < ships[i].m_liShields.length; j++)
		{
			var _shield = ships[i].m_liShields[j];
			
			_shipPos = {
				x: _shield.pos.x - _shield.r, 
				y: _shield.pos.y - _shield.r,
				width: _shield.r * 2,
				height: _shield.r * 2
			};
				
			// Fetch elements
			var _elements = quadTree.retrieve(_shipPos);
			
			for(var k = 0; k < _elements.length; k++)
			{	
				// SHIP!
				if(_elements[k].type == 0)
				{
					this.gameObjectToGameObject(ships[i], _elements[k].object);
					//this.shipToShip(ships[i], _elements[k].object);
				}
		
				// STRUCTURE!
				if(_elements[k].type == 1)
					this.gameObjectToGameObject(ships[i], _elements[k].object);
				
				// ASTEROID!
				if(_elements[k].type == 2)
					this.gameObjectToGameObject(ships[i], _elements[k].object);
				
				// OBJECT!
				if(_elements[k].type == 3)
					this.gameObjectToGameObject(ships[i], _elements[k].object);
			}
		}
	}
}

CollisionManager.prototype.checkWeapons = function(quadTree, ships, structures, asteroids, objects)
{	
	// THINGS WHICH HAVE WEAPONS (including anything which fires, such as mining lasers)

	// ! IMPORTANT! // 
	
	// NONE of this code takes into account the range of the weapons which might result
	// in weapons failing to hit targets they should because they cross a quad tree
	// boundary which isn't being checked...
	// The fix is checking based on the longest weapons range
	
	for(var i = 0; i < ships.length; i++)
	{		
		for(var j = 0; j < ships[i].m_liShields.length; j++)
		{
			var _shield = ships[i].m_liShields[j];
			
			_shipPos = {
				x: _shield.pos.x - _shield.r, 
				y: _shield.pos.y - _shield.r,
				width: _shield.r * 2,
				height: _shield.r * 2
			};
				
			// Fetch elements
			var _elements = quadTree.retrieve(_shipPos);
			
			for(var k = 0; k < _elements.length; k++)
			{	
				// SHIP!
				if(_elements[k].type == 0)
				{
					this.weaponsToGameObject(ships[i], _elements[k].object);
				}
		
				// STRUCTURE!
				if(_elements[k].type == 1)
					this.weaponsToGameObject(ships[i], _elements[k].object);
				
				// ASTEROID!
				if(_elements[k].type == 2)
				{
					this.weaponsToGameObject(ships[i], _elements[k].object);
				}
				
				// OBJECT!
				if(_elements[k].type == 3)
				{
					this.weaponsToGameObject(ships[i], _elements[k].object);
				}
			}
		}
	}
	
	for(var i = 0; i < structures.length; i++)
	{
		for(var j = 0; j < structures[i].m_liShields.length; j++)
		{
			var _weaponsRange = structures[i].m_iMaxRange;
			var _shield = structures[i].m_liShields[j];
			
			_structurePos = {
				x: _shield.pos.x - (_shield.r + _weaponsRange), 
				y: _shield.pos.y - (_shield.r + _weaponsRange),
				width: (_shield.r * 2) + _weaponsRange,
				height: (_shield.r * 2) + _weaponsRange
			};
				
			// Fetch elements
			var _elements = quadTree.retrieve(_structurePos);
			
			for(var k = 0; k < _elements.length; k++)
			{	
				// SHIP!
				if(_elements[k].type == 0)
				{
					this.weaponsToGameObject(structures[i], _elements[k].object);
				}
		
				// STRUCTURE!
				if(_elements[k].type == 1)
					this.weaponsToGameObject(structures[i], _elements[k].object);
				
				// ASTEROID!
				if(_elements[k].type == 2)
				{
					this.weaponsToGameObject(structures[i], _elements[k].object);
				}
				
				// OBJECT!
				if(_elements[k].type == 3)
				{
					this.weaponsToGameObject(structures[i], _elements[k].object);
				}
			}
		}
	}
}

CollisionManager.prototype.gameObjectToGameObject = function(gameObject, otherGameObject)
{
	// Dont hit yourself dummy...
	if(gameObject.m_iID == otherGameObject.m_iID)
		return;
	
	if(gameObject.m_iShields > 0 && otherGameObject.m_iShields > 0)
	{		
		for(var i = 0; i < gameObject.m_liShields.length; i++)
			for(var j = 0; j < otherGameObject.m_liShields.length; j++)
				if(this.circleCircleCollisionDetection(otherGameObject.m_liShields[j], gameObject.m_liShields[i]))
					return gameObject.onCollision(this.m_kResponse.overlapV);
	}
	
	if(gameObject.m_iShields > 0 && otherGameObject.m_iShields <= 0)
	{	
		for(var i = 0; i < gameObject.m_liShields.length; i++)
			for(var j = 0; j < otherGameObject.m_liComponents.length; j++)
				if(this.polygonCircleCollisionDetection(otherGameObject.m_liComponents[j].m_cdCollision, gameObject.m_liShields[i]))
					return gameObject.onCollision(this.m_kResponse.overlapV);
	}
	
	if(gameObject.m_iShields <= 0 && otherGameObject.m_iShields > 0)
	{		
		for(var i = 0; i < gameObject.m_liComponents.length; i++)
			for(var j = 0; j < otherGameObject.m_liShields.length; j++)
				if(this.circlePolygonCollisionDetection(otherGameObject.m_liShields[j], gameObject.m_liComponents[i].m_cdCollision))
					return gameObject.onCollision(this.m_kResponse.overlapV);
	}
	
	if(gameObject.m_iShields <= 0 && otherGameObject.m_iShields <= 0)
	{
		for(var i = 0; i < gameObject.m_liComponents.length; i++)
			for(var j = 0; j < otherGameObject.m_liComponents.length; j++)
				if(this.polygonPolygonCollisionDetection(otherGameObject.m_liComponents[j].m_cdCollision, gameObject.m_liComponents[i].m_cdCollision))
					return gameObject.onCollision(this.m_kResponse.overlapV);
	}
	
	// No collision!
	return false;
}

CollisionManager.prototype.weaponsToGameObject = function(armedObject, gameObject)
{
	if(armedObject.m_iID == gameObject.m_iID)
		return;
	
	// Physical collisions are handled by the ships
	// Only need to handle weapons vs ships
	
	// Retreive list of all active weapons
	var _weapons = armedObject.activeWeapons();
	
	// If shields are up, hit check the shields, if not hit the hull
	if(gameObject.m_iShields > 0)
	{
		for(var i = 0; i < _weapons.length; i++)
			for(var j = 0; j < gameObject.m_liShields.length; j++)
				if(this.polygonCircleCollisionDetection(_weapons[i].m_cdCollisionPolygon, gameObject.m_liShields[j]))
					_weapons[i].onHit(gameObject);
	}
	else
	{
		for(var i = 0; i < _weapons.length; i++)
			for(var j = 0; j < gameObject.m_liComponents.length; j++)
				if(this.polygonPolygonCollisionDetection(_weapons[i].m_cdCollisionPolygon, gameObject.m_liComponents[j].m_cdCollision))
					_weapons[i].onHit(gameObject);
	}
}

CollisionManager.prototype.structureWeaponsToAsteroid = function(structure, asteroid)
{
	// Retreive list of all active weapons
	var _weapons = structure.activeWeapons();
	
	for(var i = 0; i < _weapons.length; i++)
		if(this.polygonPolygonCollisionDetection(asteroid.m_cdCollision, _weapons[i].m_cdCollisionPolygon))
			_weapons[i].onHit(asteroid);
}

CollisionManager.prototype.structureWeaponsToStructure = function(structure, otherStructure)
{
	// Don't shoot yourself dummy!
	if(structure.m_iID == otherStructure.m_iID)
		return;
	
	// Retreive list of all active weapons
	var _weapons = structure.activeWeapons();
	
	for(var i = 0; i < _weapons.length; i++)
		for(var j = 0; j < otherStructure.m_liShields.length; j++)
			if(this.polygonCircleCollisionDetection(_weapons[i].m_cdCollisionPolygon, otherStructure.m_liShields[j]))
				_weapons[i].onHit(otherStructure);
}

CollisionManager.prototype.structureWeaponsToShip = function(structure, ship)
{
	// Physical collisions are handled by the ships
	// Only need to handle weapons vs ships
	
	// Retreive list of all active weapons
	var _weapons = structure.activeWeapons();
	
	// If shields are up, hit check the shields, if not hit the hull
	if(ship.m_iShields > 0)
	{
		for(var i = 0; i < _weapons.length; i++)
			for(var j = 0; j < ship.m_liShields.length; j++)
				if(this.polygonCircleCollisionDetection(_weapons[i].m_cdCollisionPolygon, ship.m_liShields[j]))
					_weapons[i].onHit(ship);
	}
	else
	{
		for(var i = 0; i < _weapons.length; i++)
			for(var j = 0; j < ship.m_liComponents.length; j++)
				if(this.polygonPolygonCollisionDetection(_weapons[i].m_cdCollisionPolygon, ship.m_liComponents[j].m_cdCollision))
					_weapons[i].onHit(ship);
	}
}

CollisionManager.prototype.shipWeaponsToShip = function(ship, otherShip)
{	
	// Dont hit yourself dummy...
	if(ship.m_iID == otherShip.m_iID)
		return;

	// Retreive list of all active weapons
	var _weapons = ship.activeWeapons();
	
	if(otherShip.m_iShields > 0)
	{
		for(var i = 0; i < _weapons.length; i++)
			for(var j = 0; j < otherShip.m_liShields.length; j++)
				if(this.polygonCircleCollisionDetection(_weapons[i].m_cdCollisionPolygon, otherShip.m_liShields[j]))
					_weapons[i].onHit(otherShip);
	}
	else
	{
		for(var i = 0; i < _weapons.length; i++)
			for(var j = 0; j < otherShip.m_liComponents.length; j++)
				if(this.polygonPolygonCollisionDetection(_weapons[i].m_cdCollisionPolygon, otherShip.m_liComponents[j].m_cdCollision))
					_weapons[i].onHit(otherShip);
	}
}

CollisionManager.prototype.shipWeaponsToStructure = function(ship, structure)
{
	// Retreive list of all active weapons
	var _weapons = ship.activeWeapons();
	
	if(structure.m_iShields > 0)
	{
		for(var i = 0; i < _weapons.length; i++)
			for(var j = 0; j < structure.m_liShields.length; j++)
				if(this.polygonCircleCollisionDetection(_weapons[i].m_cdCollisionPolygon, structure.m_liShields[j]))
					_weapons[i].onHit(structure.m_liComponents[j]);
	}
	else
	{
		for(var i = 0; i < _weapons.length; i++)
			for(var j = 0; j < structure.m_liComponents.length; j++)
				if(this.polygonPolygonCollisionDetection(_weapons[i].m_cdCollisionPolygon, structure.m_liComponents[j].m_cdCollision))
					_weapons[i].onHit(structure.m_liComponents[j]);
	}
}

// MISC

CollisionManager.prototype.routeCrossCheck = function(route, structures)
{	
	// Loop through all structures
	for(var i = 0; i < structures.length; i++)
	{		
		// Skip if this structure is the target structure!
		if(structures[i].m_iID == route.m_kNode.m_iID)
			continue;
		
		var _routes = structures[i].m_liRoutes;
		
		// Loop through all routes
		for(var j = 0; j < _routes.length; j++)
		{			
			if(_routes[j].m_kNode.m_iID == route.m_kNode.m_iID)
				continue;
			
			// Check route against source route
			if(this.polygonPolygonCollisionDetection(route.m_cdCollisionPolygon, _routes[j].m_cdCollisionPolygon))
				return true;
		}
	}
	
	// No collisions!
	return false;
}

CollisionManager.prototype.onExplosion = function(source, ships)
{
	// Loop through all of the ships
	for(var i = 0; i < ships.length; i++)
	{
		// Trigger their explosion code
		// Ships automatically determine the results
		ships[i].onExplosion(source.m_liPos[0], source.m_liPos[1], source.m_iRadius * 5);
	}
}

// This function is for weapons to cast a ray between the firing point and the target
// in order to avoid shooting friendly structures or hitting asteroids and wasting power
// RETURNS TRUE IF CLEAR
// RETURN FALSE IF BLOCKED
CollisionManager.prototype.checkRay = function(source, target, ray, structures, asteroids)
{	
	return true;

	// Asteroids
	for(var i = 0; i < asteroids.length; i++)
	{		
		// Skip if this asteroid is the target!
		if(asteroids[i].m_iID == target.m_iID)
			continue;
		
		// Check for collision
		if(this.polygonPolygonCollisionDetection(asteroids[i].m_cdCollision, ray))
			return false;
	}
	
	// Structures
	for(var i = 0; i < structures.length; i++)
	{
		// Skip if this structure is the source!
		if(structures[i].m_iID == source.m_kOwner.m_iID)
			continue;
		
		// Skip if this structure is the target!
		if(structures[i].m_iID == target.m_iID)
			continue;
		
		// Check against shields if they exist/are up
		// Check against hull if they're not
		if(structures[i].m_iShields > 0)
			for(var j = 0; j < structures[i].m_liShields.length; j++)
				if(this.polygonCircleCollisionDetection(ray, structures[i].m_liShields[j]))
					return false;
		else
			for(var j = 0; j < structures[i].m_liComponents.length; j++)
				if(this.polygonPolygonCollisionDetection(ray, structures[i].m_liComponents[j].m_cdCollision))
					return false;
	}
	
	// No obstructions, clear to fire!
	return true;
}

// This function is designed to be used only on attempted placement of an asteroid
// Returns true or false if you can place it in this position or not
CollisionManager.prototype.asteroidPlacementCheck = function(asteroid, ships, structures, asteroids)
{	
	return true;

	// Ships
	for(var i = 0; i < ships.length; i++)
		for(var j = 0; j < ships[i].m_liShields.length; j++)
			if(this.polygonCircleCollisionDetection(asteroid.m_cdCollision, ships[i].m_liShields[j]))
				return false;
	
	// Structures
	for(var i = 0; i < structures.length; i++)
		for(var j = 0; j < structures[i].m_liShields.length; j++)
			if(this.polygonCircleCollisionDetection(asteroid.m_cdCollision, structures[i].m_liShields[j]))
				return false;
	
	// Asteroids
	for(var i = 0; i < asteroids.length; i++)
	{
		// Ignore yourself!
		if(asteroids[i].m_iID == asteroid.m_iID)
			continue;
		
		// Check for collision
		if(this.polygonPolygonCollisionDetection(asteroids[i].m_cdCollision, asteroid.m_cdCollision))
			return false;
	}
	
	// Space clear!
	return true;
}

// This function is designed to be used only on attempted placement of a structure
// Returns true or false if you can place it in this position or not
CollisionManager.prototype.structurePlacementCheck = function(structure, ships, structures, asteroids)
{	
	for(var i = 0; i < structure.m_liShields.length; i++)
	{
		// Ships
		if(structure.m_bCollideShips)
			for(var j = 0; j < ships.length; j++)
				for(var k = 0; k < ships[j].m_liShields.length; k++)
					if(this.circleCircleCollisionDetection(structure.m_liShields[i], ships[j].m_liShields[k]))
						return false;	
					
		// Structures
		if(structure.m_bCollideStructures)
			for(var j = 0; j < structures.length; j++)
				for(var k = 0; k < structures[j].m_liShields.length; k++)
					if(this.circleCircleCollisionDetection(structure.m_liShields[i], structures[j].m_liShields[k]))
						return false;	
					
		// Asteroids
		if(structure.m_bCollideAsteroids)
			for(var j = 0; j < structures.length; j++)
				for(var k = 0; k < structures[j].m_liShields.length; k++)
					if(this.circleCircleCollisionDetection(structure.m_liShields[i], structures[j].m_liShields[k]))
						return false;
	}
	
	// Space clear!
	return true;
}


// COLLISION TESTS

// Returns TRUE or FALSE
CollisionManager.prototype.circleCircleCollisionDetection = function(circle1, circle2)
{
	this.m_kResponse.clear();
	
	var _collision = SAT.testCircleCircle(circle1, circle2, this.m_kResponse);
	
	return _collision;
}

// Returns TRUE or FALSE
CollisionManager.prototype.polygonCircleCollisionDetection = function(polygon, circle)
{	
	this.m_kResponse.clear();
	
	var _collision = SAT.testPolygonCircle(polygon, circle, this.m_kResponse);
	
	return _collision;
}

// Returns TRUE or FALSE
CollisionManager.prototype.circlePolygonCollisionDetection = function(circle, polygon)
{	
	this.m_kResponse.clear();
	
	var _collision = SAT.testCirclePolygon(circle, polygon, this.m_kResponse);
	
	return _collision;
}

// Returns TRUE or FALSE
CollisionManager.prototype.polygonPolygonCollisionDetection = function(polygon1, polygon2)
{	
	this.m_kResponse.clear();
	
	var _collision = SAT.testPolygonPolygon(polygon1, polygon2, this.m_kResponse);
	
	return _collision;
}














