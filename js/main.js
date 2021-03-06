
// Graphics
var m_kCanvas;
var m_kContext;
var m_kCamera;
var m_iZoom;
var m_iZoomDefault;

// Graphics helper
var m_kShipParts;

// States
var m_kStateManager
var m_kGameState;
var m_kWeaponTestState;

// Player
var m_kPlayer;

// World
var m_kDistrict;

// Log
var m_kLog;

// Object Factory
var m_kObjectFactory;

// Collision Detection (External)
var C;
var V;
var P;

var Vec2D;
var Line2D;

// Keyboard Input
var m_liKeysDown;

// Collision Detection 
var m_kCollisionManager;

// Resource Pathfinder
var m_kPathfinder;

// Game Stats
var m_kGameStats;

function initMain()
{	
	// Disable right click menu
	document.oncontextmenu = function(e){return false;}
	
	m_liKeysDown = new Array();

	// SAT Short-cuts
	C = SAT.Circle;
	V = SAT.Vector;
	P = SAT.Polygon;
	
	Vec2D = toxi.geom.Vec2D;
	Line2D = toxi.geom.Line2D;
	
	// Basic rendering initialization 
	m_kCanvas = document.getElementById("canvas");
	m_kCanvas.height = window.innerHeight;
	m_kCanvas.width = window.innerWidth;
	m_kContext = m_kCanvas.getContext("2d");
	m_kCamera = new Camera(m_kContext);				// External Lib
	
	m_kCanvas.style.cursor = 'crosshair';
	
	// Object Factory
	m_kObjectFactory = new ObjectFactory();
	
	// Collision Detection
	m_kCollisionManager = new CollisionManager();
	
	// Log / Console
	m_kLog = new Log();
	
	// Stats
	m_kGameStats = new GameStats();
	
	// Resource Pathfinder
	m_kPathfinder = new Pathfinder();
	
	// Create the map
	m_kDistrict = new District("Omicron");
	
	// Initialize States
	m_kStateManager = new StateManager();
	m_kGameState = new GameState();
	//m_kWeaponTestState = new WeaponTestState();
	
	// Add initial state
	m_kStateManager.addState(m_kGameState);
	//m_kStateManager.addState(m_kWeaponTestState);
	
	// Zoom
	//m_iZoomDefault = 30000;
	m_iZoomDefault = 3000;
	//m_iZoomDefault = 700;
	//m_iZoomDefault = 500;
	m_iZoom = m_iZoomDefault;
	m_kCamera.zoomTo(m_iZoom);
}

function update()
{	
	// Update the states
	m_kStateManager.update();
	
	m_kLog.update();
	
	m_kGameStats.update();
}

function draw()
{	
	// Resize
	m_kCanvas.height = window.innerHeight;
	m_kCanvas.width = window.innerWidth;

	// Clear background
	m_kContext.fillStyle = "black";
	m_kContext.fillRect(0, 0, m_kCanvas.width, m_kCanvas.height);
	
	// Draw
	m_kContext.stroke();

	drawGrid();
	
	// Draw the states
	m_kStateManager.draw();
	
	m_kLog.addStaticItem("Elapsed Time: " + m_fElapsedTime);
	
	// Draw log on top of everything
	m_kLog.draw();
}