// Button
GameBase.UI.RegisterType( "checkbox", function() {
	GameBase.UI.GetConstructor( "base" ).call( this );

	// Variables
	this.Text = "";
	this.Toggled = false;
	this.TextSize = 20;
	this.TextFont = "Mplus1m";
	this.ButtonType = "default";
	this.TextXAlign = 0;
	this.Cursor = "clicker";

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
	// Sets the value of this checkbox
	this.SetToggled = function( value ) {
		this.Toggled = value;
	}
	// Returns the toggled state
	this.GetToggled = function() {
		return this.Toggled;
	}
	// Makes the checkbox work
	this.OnClicked = function( x, y, button ) {
		if ( button == 1 ) {
			this.Toggled = !this.Toggled;
			this.OnValueChanged( this.Toggled );
		}
	}
	// Replaces the OnClicked function
	this.OnValueChanged = function( value ) {};
	// Draws this panel
	this.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 1, 1, 1, 1 );
		_r.rect( 0, 0, h, h );

		GameBase.UI.IncDrawLayer();

		GameBase.UI.IncDrawLayer();
		_r.color( 0, 0, 0, 1 );
		GameBase.Text.SetFont( this.TextFont );
		GameBase.Text.SetSize( this.TextSize );
		if ( this.TextXAlign == 1 ) {
			var text_w = GameBase.Text.GetTextWidth( this.Text );
			GameBase.Text.DrawText( w/2-(text_w+h+4)/2+h+4, h/2, this.Text, 0, 1 );
			_r.color( 0.5, 0.5, 0.5, 1 );
			if ( this.Focused != null || this.IsFocused() ) {
				_r.color( 0.1, 0.4, 1, 1 );
			}
			if ( this.Toggled ) {
				_r.rect( w/2-(text_w+h+4)/2+3, 3, h-6, h-6 );
			}
			_r.rect( w/2-(text_w+h+4)/2, 0, h, 1 );
			_r.rect( w/2-(text_w+h+4)/2, h-1, h, 1 );
			_r.rect( w/2-(text_w+h+4)/2, 1, 1, h-2 );
			_r.rect( w/2-(text_w+h+4)/2+h-1, 1, 1, h-2 );
		} else if ( this.TextXAlign == 0 ) {
			GameBase.Text.DrawText( h+4, h/2, this.Text, 0, 1 );
			_r.color( 0.5, 0.5, 0.5, 1 );
			if ( this.Focused != null || this.IsFocused() ) {
				_r.color( 0.1, 0.4, 1, 1 );
			}
			if ( this.Toggled ) {
				_r.rect( 3, 3, h-6, h-6 );
			}
			_r.rect( 0, 0, h, 1 );
			_r.rect( 0, h-1, h, 1 );
			_r.rect( 0, 1, 1, h-2 );
			_r.rect( h-1, 1, 1, h-2 );
		} else if ( this.TextXAlign == 2 ) {
			GameBase.Text.DrawText( w-h-4, h/2, this.Text, 2, 1 );
			_r.color( 0.5, 0.5, 0.5, 1 );
			if ( this.Focused != null || this.IsFocused() ) {
				_r.color( 0.1, 0.4, 1, 1 );
			}
			if ( this.Toggled ) {
				_r.rect( w-h+3, 3, h-6, h-6 );
			}
			_r.rect( w-h, 0, h, 1 );
			_r.rect( w-h, h-1, h, 1 );
			_r.rect( w-h, 1, 1, h-2 );
			_r.rect( w-1, 1, 1, h-2 );
		}
	}

} )
