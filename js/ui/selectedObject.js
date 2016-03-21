function SelectedObject(owner, object)
{
	this.m_kOwner = owner;
	this.m_kSelected = new TargetObject(owner.m_kShip, object, true);
	
	this.m_liButtons = new Array();
	
	this.m_liPos = new Array();
	this.m_liPos[0] = 0;
	this.m_liPos[1] = 0;
	this.m_iSize = 0;
	this.m_iPadding = 0;
}

SelectedObject.prototype.update = function()
{
	if(!this.m_kSelected.m_kTarget.m_bIsAlive)
		this.m_kSelected = new TargetObject(this.m_kOwner.m_kShip, this.m_kOwner.m_kShip, true);
	
	this.m_kSelected.update();
	
	this.createButtons(this.m_liPos[0] + (this.m_iPadding * 2) + this.m_iSize, this.m_liPos[1] + this.m_iPadding, this.m_iSize / 2, this.m_iPadding / 2);
}

SelectedObject.prototype.draw = function(x, y, height, width, padding, size)
{
	m_kContext.globalAlpha = 0.75;
	
	// This is required to create the buttons
	this.m_liPos[0] = x;
	this.m_liPos[1] = y;
	this.m_iSize = size;
	this.m_iPadding = padding;
	
	this.drawBackground(x, y, height, width);
	
	this.m_kSelected.draw(x + padding, y + padding, size, padding);
	
	for(var i = 0; i < this.m_liButtons.length; i++)
		this.m_liButtons[i].draw();
	
	m_kContext.globalAlpha = 1;
}

// HELPERS

// This should dynamically change depending on the type of object, the team and so on... for now it doesn't!
SelectedObject.prototype.createButtons = function(x, y, size, padding)
{
	// Clear previous list
	this.m_liButtons.length = 0;	
	
	this.m_liButtons.push(new UIButton(this, 0, x, y, size, size, true, 'targetIcon', 255, 255, 255));
	x += size;
	x += padding;
	
	this.m_liButtons.push(new UIButton(this, 1, x, y, size, size, true, 'swapIcon', 255, 255, 255));
	x += size;
	x += padding;
	
	this.m_liButtons.push(new UIButton(this, 2, x, y, size, size, true, 'boxIcon', 255, 255, 255));
	x += size;
	x += padding;
	
	this.m_liButtons.push(new UIButton(this, 3, x, y, size, size, true, 'collectIcon', 255, 255, 255));
	x += size;
	x += padding;
}

SelectedObject.prototype.drawBackground = function(x, y, height, width)
{	
	// Save context!
	m_kContext.save();
	
	// Translate to center// Translate to center
	m_kContext.translate(x, y);
	
	m_kContext.strokeStyle = 'white';	
	m_kContext.fillStyle = 'black';
	m_kContext.lineWidth = 1;
	
	// Background
	m_kContext.fillRect(0, 0, width, height);
	m_kContext.beginPath();
	m_kContext.rect(0, 0, width, height);
	m_kContext.closePath();
	m_kContext.stroke();
	
	// Restore the context back to how it was before!
	m_kContext.restore();
}

// EVENTS

SelectedObject.prototype.onMouseOver = function(mouse)
{	
	for(var i = 0; i < this.m_liButtons.length; i++)
	{
		if(m_kCollisionManager.circlePolygonCollisionDetection(mouse, this.m_liButtons[i].m_cdCollision))
		{			
			this.m_liButtons[i].onMouseOver();
		}
	}
}

SelectedObject.prototype.onMouseClick = function(mouse)
{	
	for(var i = 0; i < this.m_liButtons.length; i++)
	{
		if(m_kCollisionManager.circlePolygonCollisionDetection(mouse, this.m_liButtons[i].m_cdCollision))
		{	
			this.m_liButtons[i].onClick();
			
			return true;
		}
	}
	
	return false;
}

// Do the stuff the buttons are supposed to do
SelectedObject.prototype.onClick = function(id)
{	
	switch(id)
	{
		case 0:
			// Button 0
			this.m_kOwner.m_kShip.onTarget(this.m_kSelected.m_kTarget);
			break;
			
		case 1:
			if(this.m_kSelected.m_kTarget.m_eObjectType == "Ship")
			{
				this.m_kOwner.onShipChange(this.m_kSelected.m_kTarget);
			}
			
		case 2:
			this.m_kOwner.onOpenCargo(this.m_kSelected.m_kTarget);
			break;
			
		case 3:
			if(this.m_kSelected.m_kTarget.m_eObjectType == "Object")
			{
				if(this.m_kOwner.onStore(this.m_kSelected.m_kTarget))
				{
					this.m_kOwner.m_kSector.removeObject(this.m_kSelected.m_kTarget);	
				}
			}
			
			break;
	}
}