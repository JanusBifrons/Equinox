function AsteroidManager(sector)
{
	this.m_kSector = sector;
	
	this.m_liAsteroids = new Array();
}

AsteroidManager.prototype.update = function()
{
	for(var i = 0; i < this.m_liAsteroids.length; i++)
	{
		this.m_liAsteroids[i].update();
	}
}

AsteroidManager.prototype.draw = function()
{
	for(var i = 0; i < this.m_liAsteroids.length; i++)
	{
		this.m_liAsteroids[i].draw();
	}
}

AsteroidManager.prototype.generateAsteroidField = function(x, y, radius, size)
{
	var _randomX = 0;
	var _randomY = 0;
	var _randomSize = 0;
	
	// References
	var _ships = this.m_kSector.m_liShips;
	var _structures = this.m_kSector.m_kStructureManager.m_liStructures;
	
	for(var i = 0; i < size; i++)
	{
		_randomX = x + (-radius + Math.random() * (radius * 2));
		_randomY = y + (-radius + Math.random() * (radius * 2));
		_randomSize = (Math.random() * 150) + 50;
		
		var _newAsteroid = new Asteroid(_randomX, _randomY, _randomSize);
		
		if(m_kCollisionManager.asteroidPlacementCheck(_newAsteroid, _ships, _structures, this.m_liAsteroids))
		{
			// Unoccupied location!
			this.m_liAsteroids.push(_newAsteroid);	
		}
	}
}

AsteroidManager.prototype.fillSector = function(asteroidFields)
{
	var _randomX = 0;
	var _randomY = 0;
	
	for(var i = 0; i < asteroidFields; i++)
	{
		_randomX = -10000 + (Math.random() * 20000);
		_randomY = -10000 + (Math.random() * 20000);
	
		this.generateAsteroidField(_randomX, _randomY, 2500, 10);
	}
}