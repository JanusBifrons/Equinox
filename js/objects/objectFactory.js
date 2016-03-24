function ObjectFactory()
{
	
}

ObjectFactory.prototype.createLightLaser = function(weapon)
{
	var _sector = weapon.m_kOwner.m_kSector;
	var _rotation = weapon.m_iRotation;
	
	var _newLaser = new Laser(weapon.m_kOwner, weapon.m_liPos[0], weapon.m_liPos[1], weapon.m_iRotation, _sector);
	
	_sector.addObject(_newLaser);
}