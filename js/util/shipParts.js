function ShipParts()
{
}

ShipParts.prototype.leftWing = function()
{	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'red';
	m_kContext.lineWidth = 1;

	// Main Part
	m_kContext.beginPath();
	m_kContext.moveTo(0, 0);
	m_kContext.lineTo(30, 0);
	m_kContext.lineTo(30, -5);
	m_kContext.lineTo(20, -15);
	m_kContext.lineTo(0, -30);
	m_kContext.lineTo(-5, -32);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'white';
	m_kContext.lineWidth = 1;
	
	// Highlight Line
	m_kContext.beginPath();
	m_kContext.moveTo(30, -3);
	m_kContext.lineTo(20, -13);
	m_kContext.lineTo(0, -28);
	m_kContext.lineTo(-5, -30);
	m_kContext.lineTo(-5, -32);
	m_kContext.lineTo(0, -30);
	m_kContext.lineTo(20, -15);
	m_kContext.lineTo(30, -5);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	m_kContext.fillStyle = 'white';
	m_kContext.strokeStyle = 'black';
	
	// Larger Circle
	m_kContext.beginPath();
	m_kContext.arc(5, -6, 5, 0, 2 * Math.PI);
	m_kContext.fill();
	m_kContext.stroke();
	m_kContext.closePath();	
	
	// Smaller Circle
	m_kContext.beginPath();
	m_kContext.arc(5, -6, 3, 0, 2 * Math.PI);
	m_kContext.fill();
	m_kContext.stroke();
	m_kContext.closePath();	
}

ShipParts.prototype.rightWing = function()
{	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'red';
	m_kContext.lineWidth = 1;

	// Main Part
	m_kContext.beginPath();
	m_kContext.moveTo(0, 0);
	m_kContext.lineTo(30, 0);
	m_kContext.lineTo(30, 5);
	m_kContext.lineTo(20, 15);
	m_kContext.lineTo(0, 30);
	m_kContext.lineTo(-5, 32);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'white';
	m_kContext.lineWidth = 1;
	
	// Highlight Line
	m_kContext.beginPath();
	m_kContext.moveTo(30, 3);
	m_kContext.lineTo(20, 13);
	m_kContext.lineTo(0, 28);
	m_kContext.lineTo(-5, 30);
	m_kContext.lineTo(-5, 32);
	m_kContext.lineTo(0, 30);
	m_kContext.lineTo(20, 15);
	m_kContext.lineTo(30, 5);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	m_kContext.fillStyle = 'white';
	m_kContext.strokeStyle = 'black';
	
	// Larger Circle
	m_kContext.beginPath();
	m_kContext.arc(5, 6, 5, 0, 2 * Math.PI);
	m_kContext.fill();
	m_kContext.stroke();
	m_kContext.closePath();	
	
	// Smaller Circle
	m_kContext.beginPath();
	m_kContext.arc(5, 6, 3, 0, 2 * Math.PI);
	m_kContext.fill();
	m_kContext.stroke();
	m_kContext.closePath();	
}

ShipParts.prototype.leftPad = function()
{	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'red';
	m_kContext.lineWidth = 1;

	// Main Part
	m_kContext.beginPath();
	m_kContext.moveTo(0, 0);
	m_kContext.lineTo(20, 0);
	m_kContext.lineTo(27, -5);
	m_kContext.lineTo(25, -10);
	m_kContext.lineTo(20, -12);
	m_kContext.lineTo(10, -7);
	m_kContext.lineTo(2, -5);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'white';
	m_kContext.lineWidth = 1;
	
	// Highlight
	m_kContext.beginPath();
	m_kContext.moveTo(10, 0);
	m_kContext.lineTo(23, -11);
	m_kContext.lineTo(20, -12);
	m_kContext.lineTo(10, -7);
	m_kContext.lineTo(2, -5);
	m_kContext.lineTo(0, 0);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
}

ShipParts.prototype.rightPad = function()
{	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'red';
	m_kContext.lineWidth = 1;

	// Main Part
	m_kContext.beginPath();
	m_kContext.moveTo(0, 0);
	m_kContext.lineTo(20, 0);
	m_kContext.lineTo(27, 5);
	m_kContext.lineTo(25, 10);
	m_kContext.lineTo(20, 12);
	m_kContext.lineTo(10, 7);
	m_kContext.lineTo(2, 5);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'white';
	
	// Highlight
	m_kContext.beginPath();
	m_kContext.moveTo(10, 0);
	m_kContext.lineTo(23, 11);
	m_kContext.lineTo(20, 12);
	m_kContext.lineTo(10, 7);
	m_kContext.lineTo(2, 5);
	m_kContext.lineTo(0, 0);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
}

ShipParts.prototype.cockpit = function()
{	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'red';
	m_kContext.lineWidth = 1;
	
	// STARTS AT THE TIP OF THE NOSE!

	// Main Part
	m_kContext.beginPath();
	m_kContext.moveTo(0, 0);
	m_kContext.lineTo(-1, -1);
	m_kContext.lineTo(-3, -2);
	m_kContext.lineTo(-5, -3);
	m_kContext.lineTo(-7, -4);
	m_kContext.lineTo(-15, -4);
	m_kContext.lineTo(-18, -6);
	m_kContext.lineTo(-25, -8);
	m_kContext.lineTo(-25, 8);
	m_kContext.lineTo(-18, 6);
	m_kContext.lineTo(-15, 4);
	m_kContext.lineTo(-7, 4);
	m_kContext.lineTo(-5, 3);
	m_kContext.lineTo(-3, 2);
	m_kContext.lineTo(-1, 1);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	m_kContext.fillStyle = 'white';
	
	// Tip Highlight
	m_kContext.beginPath();
	m_kContext.moveTo(0, 0);
	m_kContext.lineTo(-1, -1);
	m_kContext.lineTo(-3, -2);
	m_kContext.lineTo(-5, -3);
	m_kContext.lineTo(-7, -4);
	m_kContext.lineTo(-9, -4);
	m_kContext.lineTo(-9, 4);
	m_kContext.lineTo(-7, 4);
	m_kContext.lineTo(-5, 3);
	m_kContext.lineTo(-3, 2);
	m_kContext.lineTo(-1, 1);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
	
	m_kContext.strokeStyle = 'black';	
	
	// Tip Highlight Strip
	m_kContext.beginPath();
	m_kContext.moveTo(-11, -4);
	m_kContext.lineTo(-11, 4);
	m_kContext.lineTo(-12, 4);
	m_kContext.lineTo(-12, -4);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
		
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'green';
	
	// Actual Cockpit
	m_kContext.save();
	m_kContext.scale(1.75, 1);
	m_kContext.beginPath();
	m_kContext.arc(-14, 0, 5, 0, Math.PI * 2);
	m_kContext.stroke();
	m_kContext.fill();
	m_kContext.closePath();
	m_kContext.restore();
	
	m_kContext.strokeStyle = 'black';	
	m_kContext.fillStyle = 'white';
	
	// Actual Cockpit Tail Strips
	m_kContext.beginPath();
	m_kContext.moveTo(-25, -5);
	m_kContext.lineTo(-30, 0);
	m_kContext.lineTo(-25, 5);
	m_kContext.lineTo(-27, 5);
	m_kContext.lineTo(-35, 0);
	m_kContext.lineTo(-27, -5);
	//m_kContext.lineTo(-35, 0);
	m_kContext.closePath();	
	m_kContext.stroke();
	m_kContext.fill();
}