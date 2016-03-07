function GameStats()
{
	this.m_fElapsedTime = 0;
	
	this.m_iPowerGenerated = 0;
	this.m_iMetalCollected = 0;
}

GameStats.prototype.update = function()
{
	//m_kLog.addStaticItem("Elapsed Time: " + this.m_fElapsedTime, 0, 255, 0);
	//m_kLog.addStaticItem("Power Generated: " + this.m_iPowerGenerated, 0, 255, 0);
	//m_kLog.addStaticItem("Metal Collected: " + this.m_iMetalCollected, 0, 255, 0);
	
	this.m_fElapsedTime += m_fElapsedTime;
}

GameStats.prototype.powerGenerated = function(power)
{
	this.m_iPowerGenerated += power;
}

GameStats.prototype.metalCollected = function(metal)
{
	this.m_iMetalCollected += metal;
}