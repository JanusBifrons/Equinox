function Pathfinder()
{
	// Reset lists
	this.m_liOpenList = new Array();
	this.m_liClosedList = new Array();
	this.m_liPath = new Array();
	
	this.m_kStart = new Structure();
	this.m_kCurrentNode = this.m_kStart;
	this.m_kSavedCurrentNode = this.m_kStart;
	this.m_iDrain;
	
	this.m_kRequestResult = new RequestResult();
}

Pathfinder.prototype.makeRequest = function(request)
{
	// Reset all lists for new search
	this.resetPathfinding();
	
	// Set start position (so we can tell when we are done)
	this.m_kStart = request.m_kStructure;
	this.m_kCurrentNode = this.m_kStart;
	this.m_kSavedCurrentNode = this.m_kStart;
	this.m_kRequestResult.m_kRequest = request;
	
	this.m_liOpenList.push(this.m_kCurrentNode);
	
	while(this.m_liOpenList.length > 0)
	{
		if(this.findPath(request))
		{			
			// FOUND IT!
			return true;
		}
	}
	
	// Couldn't find resource!
	return false;
}

Pathfinder.prototype.findPath = function(request)
{	
	// Pop the lowest priced node
	this.popLowest();
	
	// Check if we have reached the goal yet
	if(!this.goalCheck(request, this.m_kCurrentNode))
	{		
		var _routes = this.m_kCurrentNode.m_liRoutes;
		
		for(var i = 0; i < _routes.length; i++)
		{
			var _route = _routes[i];
			
			// Skip if closed
			if(this.checkClosed(_route.getNode()))
			{			
				continue;
			}
			
			var _newCost = this.m_kCurrentNode.m_iCost + _route.getCost();
			
			if(this.checkOpen(_route.getNode() && _route.getNode().m_iCost <= _newCost))
			{				
				// A cheaper route exists
				continue;
			}
			
			_route.setParent(this.m_kCurrentNode);
			
			_route.getNode().m_iCost = _newCost;
			
			_route.getNode().m_iTotal = _route.getNode().m_iCost + _route.getNode().m_iHeuristic;
			
			if(!this.checkOpen(_route.getNode()))
			{				
				if(_route.getNode().m_bIsConstructed)
				{
					this.m_liOpenList.push(_route.getNode());
				}
			}
		}
		
		this.m_liClosedList.push(this.m_kCurrentNode);
	}
	else
	{		
		this.m_liPath.push(this.m_kCurrentNode);
	
		// Build path!
		while(this.m_kCurrentNode != this.m_kStart)
		{
			this.m_kCurrentNode.setTransfer(this.m_kCurrentNode.m_kParent);
			
			this.m_kCurrentNode.m_kParent.setTransfer(this.m_kCurrentNode);
			
			this.m_kCurrentNode = this.m_kCurrentNode.m_kParent;
			
			this.m_liPath.push(this.m_kCurrentNode);
		}
		
		this.m_kCurrentNode.setTransfer(this.m_liPath[this.m_liPath.length - 1]);
		
		// Set up result
		this.m_kRequestResult.m_bRequestCompleted = true;
		this.m_kRequestResult.m_liPath = this.m_liPath;
		
		return true;
	}
	
	this.m_kRequestResult.m_bRequestCompleted = false;
	return false;
}

Pathfinder.prototype.goalCheck = function(request, currentNode)
{
	// Don't check yourself!
	if(request.m_kStructure == currentNode)
		return false;
	
	// Check if this node has some or all of the item requested
	if(currentNode.checkRequest(request))
	{				
		this.m_kRequestResult.m_liStructures.push(currentNode);
		
		// Check if we have all we asked for
		if(this.m_kRequestResult.m_iAmount == request.m_iAmount)
		{			
			// All done!
			return true;
		}
		else
		{			
			// Nope, keep going!
			return false;
		}
	}
	
	// None found yet!
	return false;
}

// HELPER FUNCTIONS

Pathfinder.prototype.resetPathfinding = function()
{
	// Reset lists
	this.m_liOpenList.length = 0;
	this.m_liClosedList.length = 0;
	this.m_liPath.length = 0;
	this.m_kRequestResult = new RequestResult();
}

Pathfinder.prototype.checkOpen = function(node)
{
	var _id = node.m_iID;

	for(var i = 0; i < this.m_liOpenList.length; i++)
	{
		var _compareID = this.m_liOpenList[i].m_iID;
	
		if(_id == _compareID)
		{
			return true;
		}
	}
	
	return false;
}

Pathfinder.prototype.checkClosed = function(node)
{
	var _id = node.m_iID;

	for(var i = 0; i < this.m_liClosedList.length; i++)
	{
		var _compareID = this.m_liClosedList[i].m_iID;
	
		if(_id == _compareID)
		{
			return true;
		}
	}
	
	return false;
}

Pathfinder.prototype.popLowest = function()
{
	var _cheapestNode;
	var _lowest;
	
	_cheapestNode = this.m_liOpenList[0];
	_lowest = _cheapestNode.m_iTotal;
	
	for(var i = 0; i < this.m_liOpenList.length; i++)
	{
		var _testNode = this.m_liOpenList[i];
		
		if(_testNode.m_iTotal < _lowest)
		{
			_lowest = _testNode.m_iTotal;
			
			_cheapestNode = _testNode;
		}
	}
	
	// Pop cheapest
	this.m_kCurrentNode = _cheapestNode;
	
	// Remove current from the open list
	var _index = this.m_liOpenList.indexOf(this.m_kCurrentNode);
	
	if (_index > -1) 
	{
		this.m_liOpenList.splice(_index, 1);
	}
}