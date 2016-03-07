function ObjectFactory()
{
	
}

ObjectFactory.prototype.createLightLaser = function(weapon)
{
	// Reference to the sector
	var _sector = weapon.m_kOwner.m_kSector;
	
	var _newLaser = new LightLaser(weapon.m_kOwner, weapon.m_liPos[0], weapon.m_liPos[1], weapon.m_iRotation);
	
	_sector.m_liProjectiles.push(_newLaser);
}

ObjectFactory.prototype.createMediumLaser = function(weapon)
{
	// Reference to the sector
	var _sector = weapon.m_kOwner.m_kSector;
	
	var _newLaser = new MediumLaser(weapon.m_kOwner, weapon.m_liPos[0], weapon.m_liPos[1], weapon.m_iRotation);
	
	_sector.m_liProjectiles.push(_newLaser);
}

ObjectFactory.prototype.createMissile = function(weapon)
{
	// Reference to the sector
	var _sector = weapon.m_kOwner.m_kSector;
	
	var _newMissile = new Missile(weapon.m_kOwner, weapon.m_liPos[0], weapon.m_liPos[1], weapon.m_iRotation);
	
	_sector.m_liProjectiles.push(_newMissile);
}