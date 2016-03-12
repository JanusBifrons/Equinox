function UIButton(owner, id, x, y, width, height, icon, r, g, b)
{	
	this.m_kOwner = owner;
	this.m_iID = id;

	this.m_liPos = new Array();
	this.m_liPos[0] = x + (width / 2);
	this.m_liPos[1] = y + (height / 2);
	
	this.m_iWidth = width;
	this.m_iHeight = height;
	
	this.m_cdCollision = new P(new V(0, 0), [new V(x, y), new V(x + width, y), new V(x + width, y + height), new V(x, y + height)]);
	
	this.m_kIcon = document.getElementById(icon);
	
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
	
	for(var i = 0; i < this.m_cdCollision.points.length; i++)
	{
		var _x = this.m_cdCollision.points[i].x;
		var _y = this.m_cdCollision.points[i].y;
		
		m_kContext.lineTo(_x, _y);	
	}
	
	m_kContext.closePath();
	m_kContext.fill();	
	
	var _x = this.m_liPos[0] - (this.m_iWidth / 2);
	_x += (this.m_iWidth * 0.1);
	
	var _y = this.m_liPos[1] - (this.m_iHeight / 2);
	_y += (this.m_iHeight * 0.1);
	
	m_kContext.drawImage(this.m_kIcon, _x, _y, this.m_iWidth * 0.8, this.m_iHeight * 0.8);
}

// EVENTS

UIButton.prototype.onClick = function()
{	
	this.m_kOwner.onClick(this.m_iID);

	this.m_cColour = concatenate(255, 0, 0, 255);
}