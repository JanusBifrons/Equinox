function SelectedObject(owner, object)
{
	this.m_kOwner = owner;
	this.m_kSelected = new TargetObject(owner.m_kShip, object, true);
	
	this.m_liButtons = new Array();
}

SelectedObject.prototype.update = function()
{
	this.m_kSelected.update();
}

SelectedObject.prototype.draw = function(x, y, height, width, padding, size)
{
	//this.createButtons(x + padding + size + padding, y + padding + size + (padding * 0.5), 50, 5); // This one draws it next to the stat bars
	this.createButtons(x + padding + size + padding, y + padding, 50, 5);
	
	this.drawBackground(x, y, height, width);
	
	this.m_kSelected.draw(x + padding, y + padding, size, padding);
	
	for(var i = 0; i < this.m_liButtons.length; i++)
		this.m_liButtons[i].draw();
}

// HELPERS

// This should dynamically change depending on the type of object, the team and so on... for now it doesn't!
SelectedObject.prototype.createButtons = function(x, y, size, padding)
{
	// Clear previous list
	this.m_liButtons.length = 0;	
	
	this.m_liButtons.push(new UIButton(this, 0, x, y, size, size, true, 'targetIcon'));
	x += size;
	x += padding;
	
	this.m_liButtons.push(new UIButton(this, 1, x, y, size, size, true, 'swapIcon'));
	x += size;
	x += padding;
	
	this.m_liButtons.push(new UIButton(this, 2, x, y, size, size, true, 'boxIcon'));
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

SelectedObject.prototype.onMouseClick = function(mouse)
{	
	for(var i = 0; i < this.m_liButtons.length; i++)
	{
		if(m_kCollisionManager.circlePolygonCollisionDetection(mouse, this.m_liButtons[i].m_cdCollision))
		{			
			this.onClick(this.m_liButtons[i].m_iID);
			
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
			
	}
}