WeaponTestState.prototype = new State();
WeaponTestState.prototype.constructor = WeaponTestState;

function WeaponTestState()
{	
	// Create sectors
	this.m_kDebugSector = new Sector("Debug Sector", 0, 0, m_kDistrict, false);
	
	// Add sectors to district
	m_kDistrict.addSector(this.m_kDebugSector);
	
	// Initialise local player
	m_kPlayer = new Player(m_kDistrict, this.m_kDebugSector, -1000, 0);
	m_kPlayer.bindControls(m_kPlayer);
	
	// Add ships to the sector and spawn it
	this.m_kDebugSector.addShip(m_kPlayer.m_kShip);
	
	this.m_kDebugSector.addShip(new Debug(-500, 0, 0, 0, null, this.m_kDebugSector, 1));
}

WeaponTestState.prototype.update = function()
{	
	m_kDistrict.update();
	
	m_kPlayer.update();
}

WeaponTestState.prototype.draw = function()
{	
	// Move camera
	m_kCamera.moveTo(m_kPlayer.m_liCamera[0], m_kPlayer.m_liCamera[1]);

	// Calculate appropriate zoom level
	this.calculateZoom();
	
	// Zoom to appropriate level
	m_kCamera.zoomTo(m_iZoom);

	// Draw game objects
	m_kDistrict.draw();
	
	// Draw player (mostly UI)
	m_kPlayer.draw();
}

WeaponTestState.prototype.calculateZoom = function()
{	
	// ADD KEY
	if(isKeyDown(107))
	{
		m_iZoom += 5000 * m_fDeltaTime;
	}
	
	// SUBTRACT KEY
	if(isKeyDown(109))
	{
		m_iZoom -= 5000 * m_fDeltaTime;
	}
	
	// Cap zoom
	if(m_iZoom > 3000)
	{
		//m_iZoom = 3000;
	}
	
	if(m_iZoom < 250)
	{
		//m_iZoom = 250;
	}
}