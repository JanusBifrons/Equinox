function Route(node, cost, source)
{
	this.m_kNode = node;
	this.m_iCost = cost;
	
	this.m_bPowerTransfer = false;
	
	this.m_iR = 100;
	this.m_iG = 100;
	this.m_iB = 100;
	
	this.m_cColour = concatenate(this.m_iR, this.m_iG, this.m_iB, 255);
	
	this.m_cdCollisionPolygon = new P(new V(0, 0), [new V(this.m_kNode.m_liPos[0], this.m_kNode.m_liPos[1]), new V(source.m_liPos[0], source.m_liPos[1])]);
}

Route.prototype.setColour = function(r, g, b)
{
	this.m_cColour = concatenate(r, g, b, 255);
}

Route.prototype.setParent = function(node)
{
	this.m_kNode.m_kParent = node;
}

Route.prototype.getColour = function(){return this.m_cColour;}

Route.prototype.getNode = function(){return this.m_kNode;}

Route.prototype.getCost = function(){return this.m_iCost;}

Route.prototype.getTransfer = function(){return this.m_bPowerTransfer;}

Route.prototype.setTransfer = function(newTransfer, type)
{	
	this.m_bPowerTransfer = newTransfer;
	
	if(this.m_bPowerTransfer)
	{
		switch(type)
		{
			case 0:
				this.setColour(255, 255, 0);
				break;
				
			case 1:
				this.setColour(255, 165, 0);
				break;
				
			case 2:
				// Do nothing
				break;
		}
	}
	else
	{
		this.setColour(this.m_iR, this.m_iG, this.m_iB);
	}
}