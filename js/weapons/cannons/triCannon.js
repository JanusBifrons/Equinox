TriCannon.prototype = new Cannon();
TriCannon.prototype.constructor = TriCannon;

function TriCannon(owner, offsetX, offsetY, minRotation, maxRotation)
{
	// Call base initialize
	//Weapon.prototype.initialize.call(this, owner, offsetX, offsetY, minRotation, maxRotation, 0.015, 1500, 1, 0.2);
	Weapon.prototype.initialize.call(this, owner, offsetX, offsetY, minRotation, maxRotation, 0.015, 1500, 0, 0.2);
	
	this.m_bBeginSalvo = false;
	this.m_iSalvo = 0;
	this.m_iSalvoTimer = 0;
	
	this.m_liCannons = new Array();
	this.m_liCannons.push(new LightCannon(owner, offsetX, offsetY, minRotation, maxRotation));
	this.m_liCannons.push(new LightCannon(owner, offsetX, offsetY, minRotation, maxRotation));
	this.m_liCannons.push(new LightCannon(owner, offsetX, offsetY, minRotation, maxRotation));
	
	for(var i = 0; i < this.m_liCannons.length; i++)
	{
		this.m_liCannons[i].update();
	}
	
	console.log("Light Cannon initialised successfully.");
}

TriCannon.prototype.update = function()
{	
	// Call base update
	Cannon.prototype.update.call(this);
	
	for(var i = 0; i < this.m_liCannons.length; i++)
	{
		//this.m_liCannons[i].update();
	}
	
	this.m_iSalvoTimer += m_fElapsedTime;
	
	if(this.m_bBeginSalvo)
	{
		if(this.m_iSalvoTimer > 5000)
		{
			this.m_iSalvoTimer = 0;
			
			if(this.m_iSalvo < this.m_liCannons.length)
			{
				m_kLog.addItem("Firing shot " + this.m_iSalvo, 2500, 255, 255, 255);
				m_kLog.addItem("Firing shot " + this.m_iSalvoTimer, 2500, 255, 255, 255);
				
				this.m_liCannons[this.m_iSalvo].onFire();
				
				this.m_iSalvo += 1;
			}
			else
			{
				this.m_bBeginSalvo = false;
				this.m_iSalvo = 0;
			}
		}
	}
}

TriCannon.prototype.draw = function()
{			
	// Call base draw
	Cannon.prototype.draw.call(this);
	
	for(var i = 0; i < this.m_liCannons.length; i++)
	{
		this.m_liCannons[i].draw();
	}
}

// OVERRIDE EVENTS

TriCannon.prototype.onFire = function()
{
	// Call base fire
	Cannon.prototype.onFire.call(this);
	
	if(this.m_bIsFiring && this.m_bBeginSalvo == false)
	{		
		this.m_bBeginSalvo = true;
		this.m_iSalvoTimer = 0;
		this.m_iSalvo = 0;
	}
}