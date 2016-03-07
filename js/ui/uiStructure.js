UIStructure.prototype = new UIObjectSelect();
UIStructure.prototype.constructor = UIStructure;

function UIStructure(structure)
{	
	this.m_kStructure = structure;
	
	// Location of button
	var _x = -(this.m_iWidth / 2) + 10;
	var _y = (this.m_iHeight / 2) - 30;
	
	this.m_kUpgradeButton = new UIButton("UPGRADE", _x, _y, 280, 20, 255, 165, 0);
}

UIStructure.prototype.update = function()
{	
}

UIStructure.prototype.draw = function()
{		
	// Call base draw
	UIObjectSelect.prototype.draw.call(this);
	
	// Name
	UIObjectSelect.prototype.drawName.call(this, this.m_kStructure.m_sName);
	
	// If unconstructed use the progress bar to show construction
	if(!this.m_kStructure.m_bIsConstructed)
	{
		// Construction
		UIObjectSelect.prototype.drawProgress.call(this, 0, this.m_kStructure.m_iMetalBuilt, this.m_kStructure.m_iMetalRequired, 'orange');	
	}
	else
	{
		// If constructed use the progress bar to show leveling up progress
		UIObjectSelect.prototype.drawProgress.call(this, 0, 100, 1000, 'orange');	
	}
	
	
	// Stats
	UIObjectSelect.prototype.drawStatBar.call(this, 0, this.m_kStructure.m_iShields, this.m_kStructure.m_iShieldCap, "blue", "black");
	UIObjectSelect.prototype.drawStatBar.call(this, 25, this.m_kStructure.m_iArmour, this.m_kStructure.m_iArmourCap, "grey", "black");
	UIObjectSelect.prototype.drawStatBar.call(this, 50, this.m_kStructure.m_iHull, this.m_kStructure.m_iHullCap, "brown", "black");

	// Object Icon
	UIObjectSelect.prototype.drawIcon.call(this, this.m_kStructure, 0.1);
	
	// Resources
	UIObjectSelect.prototype.drawResourceBar.call(this, -100, this.m_kStructure.m_iPowerDrain, this.m_kStructure.m_iPowerGenerated, "red", "yellow");		// POWER GENERATED
	UIObjectSelect.prototype.drawResourceBar.call(this, 0, this.m_kStructure.m_iMetalStored, this.m_kStructure.m_iMetalStoredMax, "orange", "black");		// METAL STORED
	
	// Move renderer relative to center of UI
	m_kContext.save();
	m_kContext.translate(this.m_liPos[0], this.m_liPos[1]);
	
	this.m_kUpgradeButton.draw();
	
	// Restore context back to default from relative to the draw area
	m_kContext.restore();
}