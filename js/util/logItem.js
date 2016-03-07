function LogItem(text, fadeOut, r, g, b)
{
	this.m_sText = text;
	this.m_fFadeOut = fadeOut;
	this.m_fTimeLeft = this.m_fFadeOut;
	
	this._r = r;
	this._g = g;
	this._b = b;
	this._a = 1;
	
	this.m_cColour = this.concatenate(r, g, b, 1);
	
	this.m_bDelete = false;
}

LogItem.prototype.update = function()
{
	// Count down fade timer
	this.m_fTimeLeft -= m_fElapsedTime;
	
	this._a = this.m_fTimeLeft / this.m_fFadeOut;
	
	// Rebuild colour string with new alpha
	this.m_cColour = this.concatenate(this._r, this._g, this._b, this._a);
	
	// Check if timer has expired
	if(this.m_fTimeLeft <= 0)
	{
		// Tag for deletion
		this.m_bDelete = true;
	}
}

LogItem.prototype.concatenate = function(r, g, b, a)
{	
	return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
}

LogItem.prototype.getText = function(){return this.m_sText};

LogItem.prototype.getColour = function(){return this.m_cColour};

LogItem.prototype.getOpacity = function(){return this.m_fOpacity};

LogItem.prototype.getDelete = function(){return this.m_bDelete};