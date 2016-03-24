var m_fTimer = new Date;
var m_fTimerPrevious = m_fTimer;
var m_fElapsedTime = 0;
var m_fDeltaTime = 0;
var m_liDeltaAvg = new Array();

function timer()
{	
	m_fTimerPrevious = m_fTimer;
	m_fTimer = new Date;
	
	m_fElapsedTime = m_fTimer - m_fTimerPrevious;
	
	m_liDeltaAvg.push(m_fElapsedTime / 1000);
	
	if(m_liDeltaAvg.length > 50)
	{
		m_liDeltaAvg.length = 50;
	}
	
	m_fDeltaTime = 0;
	
	for(var i = 0; i < m_liDeltaAvg.length; i++)
	{
		m_fDeltaTime += m_liDeltaAvg[i];
	}
	
	m_fDeltaTime = m_fDeltaTime / m_liDeltaAvg.length;
}

function sectorName()
{
	var _name = "";
	var _charNumber = 0;
	var _char = '';
	var _random = 0;
	var _randomInset = _charNumber = Math.floor(Math.random() * 3) + 1;  
	
	for(var i = 0; i < 5; i++)
	{	
		if(i == _randomInset)
			_name += "-";

		_random = Math.random();

		// Add a letter to the name
		if(_random < 0.7)
		{
			_charNumber = Math.floor(Math.random() * 25) + 1;  
			
			_char = String.fromCharCode(65 + _charNumber);
			
			_name += _char;
		}
		else
		{
			// Add a number
			_name += Math.floor(Math.random() * 9);
		}
	}
	
	return _name;
}

function guid()
{
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	//return s4();
}

function s4() 
{
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
}

function concatenate(r, g, b, a)
{	
	return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
}

function findClosest(object, objects, maxRange)
{
	var _closest = maxRange;
	var _distance = 0;
	var _closestIndex = -1;
	
	// Determine closest target
	for(var i = 0; i < objects.length; i++)
	{		
		// Determine distance between this object and the original object
		_distance = calculateDistance(objects[i].m_liPos, object.m_liPos);
		
		// If this distance is shorter than the closest
		if(_distance < _closest)
		{
			// Set a new closest to be this one
			_closest = _distance;
			
			// Set the index for this object
			_closestIndex = i;
		}
	}
	
	return _closestIndex;
}

function calculateMagnitude(vector)
{
	return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
}

function calculateDistance(vector1, vector2)
{
	var _x = (vector1[0] - vector2[0]) * (vector1[0] - vector2[0]);
	var _y = (vector1[1] - vector2[1]) * (vector1[1] - vector2[1]);
	
	var _added = _x + _y;
	
	var _total = Math.sqrt(_added);
	
	return Math.sqrt(_x + _y);
}

function turnToFace(fromX, fromY, toX, toY, rotation, maxRotation)
{
	var x = toX - fromX;
	var y = toY - fromY;
	
	var desiredRotation = Math.atan2(y, x);
	
	var diff = wrapAngle(desiredRotation - rotation);
	
	diff = clamp(diff, -maxRotation, maxRotation);
	
	return rotation + diff;
}

function wrapAngleOld(angle)
{
	while(angle < 0)
	{
		angle += (Math.PI * 2);
	}
	
	while(angle > Math.PI * 2)
	{
		angle -= (Math.PI * 2);
	}
	
	return angle;
}

function wrapAngle(angle)
{
	while(angle < -Math.PI)
	{
		angle += (Math.PI * 2);
	}
	
	while(angle > Math.PI)
	{
		angle -= (Math.PI * 2);
	}
	
	return angle;
}

function clamp(number, min, max)
{
	if(number > max)
	{	
		return max;
	}
	
	if(number < min)
	{	
		return min;
	}
	
	return number;
}

function unitVector(vector)
{
	var _length = calculateMagnitude(vector);
	
	vector[0] = vector[0] / _length;
	vector[1] = vector[1] / _length;
	
	return vector;
}

function isEven(n) 
{
   return isNumber(n) && (n % 2 == 0);
}

function isOdd(n)
{
   return isNumber(n) && (Math.abs(n) % 2 == 1);
}

function isNumber(n)
{
   return n == parseFloat(n);
}

function mostFrequent(arr) {
    var uniqs = {};

    for(var i = 0; i < arr.length; i++) {
        uniqs[arr[i]] = (uniqs[arr[i]] || 0) + 1;
    }

    var max = { val: arr[0], count: 1 };
    for(var u in uniqs) {
        if(max.count < uniqs[u]) { max = { val: u, count: uniqs[u] }; }
    }

    return max.val;
}

function multipleOf(number, multiple)
{
	var _remainder = (number % multiple) / 100;

	if (_remainder === 0) 
	{
	   return true;
	}
	
	return false;
}

function drawGrid()
{
	var _size = 5000;
	var _gridSize = 10;
	var _smallGridSize = 10;
	var _thick = 1.0;
	var _thin = 0.5;

	var x = (Math.round(m_kPlayer.m_liCamera[0] / _size) * _size) - (_size * (_gridSize / 2));
	var y = (Math.round(m_kPlayer.m_liCamera[1] / _size) * _size) - (_size * (_gridSize / 2));
	var smallX = 0;
	var smallY = 0;
	
	m_kContext.strokeStyle = 'darkgray';
	
	// Draw first two lines
	m_kCamera.begin();
	m_kContext.beginPath();
	m_kContext.lineWidth = _thick;
	m_kContext.moveTo(x, y);
	m_kContext.lineTo(x + (_size * _gridSize), y);
	m_kContext.moveTo(x, y);
	m_kContext.lineTo(x, y + (_size * _gridSize));
	m_kContext.stroke();
	m_kCamera.end();

	for(var i = 0; i < _gridSize; i++)
	{		
		smallX = x;
		smallY = y;
		
		m_kCamera.begin();
		
		for(var j = 0; j < _smallGridSize; j++)
		{			
			m_kContext.beginPath();
			m_kContext.lineWidth = _thin;
			m_kContext.moveTo(smallX, smallY);
			m_kContext.lineTo(smallX + (_size * _gridSize), smallY);
			m_kContext.stroke();	
			
			smallY += (_size / _smallGridSize);
		}
	
		y += _size;
	
		m_kContext.beginPath();
		m_kContext.lineWidth = _thick;
		m_kContext.moveTo(x, y);
		m_kContext.lineTo(x + (_size * _gridSize), y);
		m_kContext.stroke();
		
		m_kCamera.end();
	}
	
	x = (Math.round(m_kPlayer.m_liCamera[0] / _size) * _size) - (_size * (_gridSize / 2));
	y = (Math.round(m_kPlayer.m_liCamera[1] / _size) * _size) - (_size * (_gridSize / 2));
	
	for(var i = 0; i < _gridSize; i++)
	{		
		smallX = x;
		smallY = y;
		
		m_kCamera.begin();
		
		for(var j = 0; j < _smallGridSize; j++)
		{			
			m_kContext.beginPath();
			m_kContext.lineWidth = _thin;
			m_kContext.moveTo(smallX, smallY);
			m_kContext.lineTo(smallX, smallY + (_size * _gridSize));
			m_kContext.stroke();	
			
			smallX += (_size / _smallGridSize);
		}
	
		x += _size;
	
		m_kContext.beginPath();
		m_kContext.lineWidth = _thick;
		m_kContext.moveTo(x, y);
		m_kContext.lineTo(x, y + (_size * _gridSize));
		m_kContext.stroke();
		
		m_kCamera.end();
	}
}