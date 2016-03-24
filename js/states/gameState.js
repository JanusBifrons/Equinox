GameState.prototype = new State();
GameState.prototype.constructor = GameState;

function GameState()
{	
	// Create sectors
	this.m_kSectorA = new Sector(sectorName(), 0, 0, m_kDistrict, true);
	this.m_kSectorB = new Sector(sectorName(), 1, 0, m_kDistrict, false);
	this.m_kSectorC = new Sector(sectorName(), 0, 1, m_kDistrict, false);
	this.m_kSectorD = new Sector(sectorName(), 1, 1, m_kDistrict, false);
	this.m_kSectorE = new Sector(sectorName(), 0, 2, m_kDistrict, false);	
	this.m_kSectorF = new Sector(sectorName(), 1, 2, m_kDistrict, false);	
	this.m_kSectorG = new Sector(sectorName(), 2, 1, m_kDistrict, false);
	
	// Add sectors to district
	m_kDistrict.addSector(this.m_kSectorA);
	m_kDistrict.addSector(this.m_kSectorB);
	m_kDistrict.addSector(this.m_kSectorC);
	m_kDistrict.addSector(this.m_kSectorD);
	m_kDistrict.addSector(this.m_kSectorE);
	m_kDistrict.addSector(this.m_kSectorF);
	m_kDistrict.addSector(this.m_kSectorG);
	
	// Initialise local player
	m_kPlayer = new Player(m_kDistrict, this.m_kSectorA, -1000, 0);
	m_kPlayer.bindControls(m_kPlayer);
	
	// Add ships to the sector and spawn it
	this.m_kSectorA.addShip(m_kPlayer.m_kShip);
	
	this.m_kSectorA.addShip(new Debug(-500, 0, 0, 0, null, this.m_kSectorA, 1));
	this.m_kSectorA.addShip(new Debug(-5000 * Math.random(), 0, 0, 0, null, this.m_kSectorA, 2));
	this.m_kSectorA.addShip(new Debug(-5000 * Math.random(), 0, 0, 0, null, this.m_kSectorA, 3));
	this.m_kSectorA.addShip(new Debug(-5000 * Math.random(), 0, 0, 0, null, this.m_kSectorA, 4));
	this.m_kSectorA.addShip(new Debug(-5000 * Math.random(), 0, 0, 0, null, this.m_kSectorA, 5));
	
	this.m_kSectorA.m_liObjects.push(new Blueprint(-1000, 1000, this.m_kSectorA, new Debug(0, 0, 0, 0, null, this.m_kSectorA, 0)));
	this.m_kSectorA.m_liObjects.push(new Blueprint(-1500, 1000, this.m_kSectorA, new Asylum(0, 0, 0, 0, null, this.m_kSectorA, 0)));
	
	this.m_kSectorA.m_liObjects.push(new PackedObject(-500, 200, this.m_kSectorA, new Debug(0, 0, 0, 0, null, this.m_kSectorA, 0)));
}

GameState.prototype.update = function()
{	
	m_kDistrict.update();
	
	m_kPlayer.update();
	
	//m_kLog.addObjectiveItem("Build an extractor.", 255, 255, 255);
	//m_kLog.addObjectiveItem("Connect extractor to control tower.", 255, 255, 255);
	//m_kLog.addObjectiveItem("Construct a turret.", 255, 255, 255);
	//m_kLog.addObjectiveItem("Survive the incoming attack.", 255, 255, 255);
	//m_kLog.addObjectiveItem("Construct a TCU and capture the sector.", 255, 255, 255);
	//m_kLog.addObjectiveItem("Capture all of the sectors.", 255, 255, 255);
}

GameState.prototype.draw = function()
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

GameState.prototype.calculateZoom = function()
{	
	// ADD KEY
	if(isKeyDown(107))
	{
		m_iZoom += 500 * m_fDeltaTime;
	}
	
	// SUBTRACT KEY
	if(isKeyDown(109))
	{
		m_iZoom -= 500 * m_fDeltaTime;
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