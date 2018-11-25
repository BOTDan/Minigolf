// Button
GameBase.UI.RegisterType( "button", function() {
	GameBase.UI.GetConstructor( "base" ).call( this );

	// Variables
	this.Text = "";
	this.Texture = false;
	this.TextSize = 20;
	this.TextFont = "Mplus1m";
	this.ButtonType = "default";
	this.TextXAlign = 1;
	this.Cursor = "clicker";

	// Sets the text of this button
	this.SetText = function( text ) {
		this.Text = text;
	}
	// Returns the text of this button
	this.GetText = function() {
		return this.Text;
	}
	// Sets the texture to display
	this.SetTexture = function( asset ) {
		this.Texture = asset;
	}
	// Returns the texture
	this.GetTexture = function() {
		return this.Texture;
	}
	// Sets the text size of this button
	this.SetTextSize = function( size ) {
		this.TextSize = size;
	}
	// Returns the text size of this button
	this.GetTextSize = function() {
		return this.TextSize;
	}
	// Sets the text font
	this.SetTextFont = function( font ) {
		this.TextFont = font;
	}
	// Sets the type of button this is
	this.SetType = function( type ) {
		this.ButtonType = type;
	}
	// Draws this panel
	this.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 1, 1, 1, 1 );
		_r.rect( 0, 0, w, h );

		if ( this.IsHovered() ) {
			GameBase.UI.IncDrawLayer();
			_r.color( 0.75, 0.75, 0.75, 1 );
			_r.rect( 0, 0, w, 1 );
			_r.rect( 0, h-1, w, 1 );
			_r.rect( 0, 1, 1, h-2 );
			_r.rect( w-1, 1, 1, h-2 );
		}

		GameBase.UI.IncDrawLayer();
		_r.color( 0, 0, 0, 1 );
		GameBase.Text.SetFont( this.TextFont );
		GameBase.Text.SetSize( this.TextSize );
		if ( this.Texture == false ) {
			if ( this.TextXAlign == 1 ) {
				GameBase.Text.DrawText( w/2, h/2, this.Text, 1, 1 );
			} else if ( this.TextXAlign == 0 ) {
				GameBase.Text.DrawText( h/2, h/2, this.Text, 0, 1 );
			} else if ( this.TextXAlign == 2 ) {
				GameBase.Text.DrawText( w-h/2, h/2, this.Text, 2, 1 );
			}
		} else {
			if ( this.TextXAlign == 1 ) {
				var text_w = GameBase.Text.GetTextWidth( this.Text );
				GameBase.Text.DrawText( w/2-(text_w+this.TextSize*1.5)/2+this.TextSize*1.5, h/2, this.Text, 0, 1 );
				_r.rect( w/2-(text_w+this.TextSize*1.5)/2, h/2-this.TextSize/2, this.TextSize, this.TextSize, this.Texture );
			} else if ( this.TextXAlign == 0 ) {
				GameBase.Text.DrawText( h/2+this.TextSize*1.5, h/2, this.Text, 0, 1 );
				_r.rect( h/2, h/2-this.TextSize/2, this.TextSize, this.TextSize, this.Texture );
			} else if ( this.TextXAlign == 2 ) {
				GameBase.Text.DrawText( w-h/2-this.TextSize*1.5, h/2, this.Text, 2, 1 );
				_r.rect( w-h/2-this.TextSize, h/2-this.TextSize/2, this.TextSize, this.TextSize, this.Texture );
			}
		}
	}

} )
