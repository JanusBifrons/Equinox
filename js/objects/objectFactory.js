function ObjectFactory()
{
	
}

ObjectFactory.prototype.createLightLaser = function(weapon)
{
	var _sector = weapon.m_kOwner.m_kSector;
	var _rotation = weapon.m_iRotation;
	
	var _newLaser = new LightLaser(weapon.m_kOwner, weapon.m_liPos[0], weapon.m_liPos[1], weapon.m_iRotation, _sector);
	
	_sector.addObject(_newLaser);
}

ObjectFactory.prototype.createMediumLaser = function(weapon)
{
	var _sector = weapon.m_kOwner.m_kSector;
	var _rotation = weapon.m_iRotation;
	
	var _newLaser = new MediumLaser(weapon.m_kOwner, weapon.m_liPos[0], weapon.m_liPos[1], weapon.m_iRotation, _sector);
	
	_sector.addObject(_newLaser);
}

ObjectFactory.prototype.createLightMissile = function(weapon, target)
{
	var _sector = weapon.m_kOwner.m_kSector;
	var _rotation = weapon.m_iRotation;
	
	var _newLightMissile = new LightMissile(weapon.m_kOwner, weapon.m_liPos[0], weapon.m_liPos[1], weapon.m_iRotation, _sector, target);
	
	_sector.addObject(_newLightMissile);
}