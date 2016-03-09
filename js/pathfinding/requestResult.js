function RequestResult()
{
	this.m_kRequest;
	this.m_iAmount = 0;
	this.m_bRequestCompleted = false;
	this.m_liStructures = new Array();
	this.m_liAmounts = new Array();
	this.m_liPaths = new Array();
}

RequestResult.prototype.addAmount = function(structure, amount)
{
	this.m_liStructures.push(structure);
	this.m_liAmounts.push(amount);
	
	this.m_iAmount += amount;
}