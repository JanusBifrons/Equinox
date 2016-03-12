function UIButton(name, x, y, width, height, r, g, b)
{
	this.m_sName = name;
	
	this.m_liPos = new Array();
	this.m_liPos[0] = x + (width / 2);
	this.m_liPos[1] = y + (height / 2);
	
	this.m_kButtonCollision = new P(new V(0, 0), [new V(x, y), new V(x + width, y), new V(x + width, y + height), new V(x, y + height)]);
	
	// Drawing
	this.m_iR = r;
	this.m_iG = g;
	this.m_iB = b;
	this.m_iA = 255;
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
}

UIButton.prototype.update = function()
{
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, this.m_iA);
}

UIButton.prototype.draw = function()
{
	m_kContext.lineWidth = 5;	
		
	m_kContext.strokeStyle = "white";
	m_kContext.fillStyle = this.m_cColour;
	m_kContext.globalAlpha = 1;
	
	m_kContext.beginPath();
	
	for(var i = 0; i < this.m_kButtonCollision.points.length; i++)
	{
		_x = this.m_kButtonCollision.points[i].x;
		_y = this.m_kButtonCollision.points[i].y;
		
		m_kContext.lineTo(_x, _y);	
	}
	
	m_kContext.closePath();
	m_kContext.fill();	
	
	// Set the font variables
	m_kContext.font="10px Verdana";
	m_kContext.fillStyle = "black";
	
	// Calculate the width so we can centre it
	var _textWidth = m_kContext.measureText(this.m_sName).width / 2;
	
	// Draw the text
	m_kContext.fillText(this.m_sName, this.m_liPos[0] -_textWidth, this.m_liPos[1] + 3);
}

// EVENTS

UIButton.prototype.onClick = function()
{	
	//this.m_cColour = concatenate(255, 0, 0, 255);
}