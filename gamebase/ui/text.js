// Button
GameBase.UI.RegisterType( "text", function() {
	GameBase.UI.GetConstructor( "base" ).call( this );

	// Variables
	this.Text = "";
	this.TextSize = 20;
	this.TextFont = "Mplus1m";
	this.TextXAlign = 0;

	// Sets the text of this button
	this.SetText = function( text ) {
		this.Text = text;
	}
	// Returns the text of this button
	this.GetText = function() {
		return this.Text;
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

		_r.color( 1, 1, 1, 0 );
		_r.rect( 0, 0, w, h );

		this.DrawText();
		/*
		if ( this.TextXAlign == 1 ) {
			GameBase.Text.DrawText( w/2, h/2, this.Text, 1, 1 );
		} else if (  == 0 ) {
			GameBase.Text.DrawText( h/2, h/2, this.Text, 0, 1 );
		} else if ( this.TextXAlign == 2 ) {
			GameBase.Text.DrawText( w-h/2, h/2, this.Text, 2, 1 );
		}
		*/
	}
	// Draws the text
	this.DrawText = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		GameBase.UI.IncDrawLayer();
		_r.color( 1, 1, 1, 1 );
		GameBase.Text.SetFont( this.TextFont );
		GameBase.Text.SetSize( this.TextSize );
		if ( typeof this.Text == "string" ) {
			GameBase.Text.DrawText( h/2, h/2, this.Text, this.TextXAlign, 1 );
		} else {
			var length = 0;
			for ( var x in this.Text ) {
				var item = this.Text[x];
				if ( typeof item == "string" ) {
					GameBase.Text.DrawText( h/2+length, h/2, item, 0, 1 );
					length += GameBase.Text.GetTextWidth( item );
				} else if ( typeof item == "object" ) {
					_r.color( item[0], item[1], item[2], item[3] );
				}
			}
		}
	}

} )
