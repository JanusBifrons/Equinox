var m_arKeysDown;
var m_arKeysDownLast;
var m_bUpdatedInput;
var m_iMouseX, m_iMouseY;
var m_iMouseScreenSpaceX, m_iMouseScreenSpaceY;
var m_bIsMouseDown;
var m_bIsMouseDownLast;
var m_iScreenWidth;
var m_iScreenHeight;

function initInput()
{
	m_iMouseX = 0;
	m_iMouseY = 0;
	m_iMouseScreenSpaceX = 0;
	m_iMouseScreenSpaceY = 0;
	m_bIsMouseDown = false;
	m_bIsMouseDownLast = false;
	
	m_arKeysDown = new Array();
	m_arKeysDownLast = new Array();
	
	window.addEventListener('keydown', keyDown, true);
	window.addEventListener('keyup', keyUp, true);
	
	m_kCanvas.addEventListener("mousemove", mouseMoved);
	m_kCanvas.addEventListener("mousedown", mouseDown);
	
	m_bUpdatedInput = false;
	
	console.log("Keyboard input intiialised successfully.");
}

function mouseMoved(e) 
{
	m_iMouseX = e.clientX - (m_kCanvas.offsetLeft - window.pageXOffset);
	m_iMouseY = e.clientY - (m_kCanvas.offsetTop - window.pageYOffset);
	
	// Calculate top left offset
	var _x = -(m_kCanvas.width / 2);
	var _y = -(m_kCanvas.height / 2);
	
	// Add player position to offset
	_x += m_kPlayer.m_kShip.m_liPos[0];
	_y += m_kPlayer.m_kShip.m_liPos[1];
	
	// Calculate World Space position
	m_iMouseScreenSpaceX = _x + m_iMouseX;
	m_iMouseScreenSpaceY = _y + m_iMouseY;
}

function mouseDown(e) 
{
	m_iMouseX = e.clientX - (m_kCanvas.offsetLeft - window.pageXOffset);
	m_iMouseY = e.clientY - (m_kCanvas.offsetTop - window.pageYOffset);
	
	// Calculate top left offset
	var _x = -(m_iScreenWidth / 2);
	var _y = -(m_iScreenHeight / 2);
	
	// Add player position to offset
	_x += m_kPlayer.m_kShip.m_liPos[0];
	_y += m_kPlayer.m_kShip.m_liPos[1];
	
	// Calculate World Space position
	m_iMouseScreenSpaceX = _x + m_iMouseX;
	m_iMouseScreenSpaceY = _y + m_iMouseY;
	
	m_bIsMouseDown = true;
}

function inputUpdate()
{
	if(!m_bUpdatedInput)
	{
		m_arKeysDownLast = m_arKeysDown;
		m_bUpdatedInput = true;
	}
	
	m_bIsMouseDownLast = m_bIsMouseDown;
	
	m_bIsMouseDown = false;
}

function keyDown(event)
{	
	// Copy keys from last frame
	// You cannot simply use = because this acts like a pointer
	m_arKeysDownLast = m_arKeysDown.slice(0);
	
	// Check if this key stroke has already been registered
	if(m_arKeysDown.indexOf(event.keyCode) != -1)
	{
		// Duplicated detected, skip!
		return;
	}
	
	// No duplicate! Store!
	m_arKeysDown.push(event.keyCode);
	m_bUpdatedInput = false;
}

function keyUp(event)
{	
	// Find where this key press is in the array
	var i = m_arKeysDown.indexOf(event.keyCode);
	
	// Remove it!
	m_arKeysDown.splice(i, 1);
	
	// Update previous frame array
	m_arKeysDownLast = m_arKeysDown.slice(0);
}

function getChar()
{
	var character = "";

	for(var i = 0; i < m_arKeysDown.length; i++)
	{
		// Make sure it is A-Z
		if(m_arKeysDown[i] <= 90 && m_arKeysDown[i] >= 65)
		{
			// Make sure it isn't spammed
			if(!isKeyDown(m_arKeysDown[i], m_arKeysDownLast))
			{
				character = String.fromCharCode(m_arKeysDown[i]);
				return character;
			}
		}
	}
	
	return character;
}

// This function only returns if it was pressed this frame, but not last!
function isKeyPressed(keyCode)
{
	// If the ksy is down this frame
	if(isKeyDown(keyCode, m_arKeysDown))
	{		
		// But it wasn't last frame
		if(!isKeyDown(keyCode, m_arKeysDownLast))
		{
			// It's been pressed!
			return true;
		}
	}
	
	return false;
}

function isKeyDown(keyCode, array)
{	
	// No such element
	if(array.indexOf(keyCode) == -1)
	{
		return false;
	}
	
	// It exists!
	return true;
}

function isKeyDown(keyCode)
{	
	// No such element
	if(m_arKeysDown.indexOf(keyCode) == -1)
	{
		return false;
	}
	
	// It exists!
	return true;
}

function isMousePressed()
{
	if(m_bIsMouseDownLast == false && m_bIsMouseDown == true)
	{
		return true;
	}
	else
	{
		return false;
	}
}

// Returns the screen space X
function getMouseX()
{
	return m_iMouseScreenSpaceX;
}

// Returns the screen space Y
function getMouseY()
{
	return m_iMouseScreenSpaceY;
}

function isMouseDown()
{
	// NON FUNCTIONAL DO NOT USE
	//return m_bIsMouseDown;
}

