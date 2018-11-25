// Topmost
GameBase.UI.RegisterType( "topmost", function() {
	GameBase.UI.GetConstructor( "base" ).call( this );

	// Variables
	this.Direction = 9;
	this.Options = [];
	this.Width = -1;
	this.TextSize = 20;
	this.TextFont = "Mplus1m";

	// Adds an option to this menu
	this.AddOption = function( text, code, texture ) {
		var option = [];
		option.text = text;
		option.code = code;
		option.texture = texture;
		this.Options.push( option );
	}
	// Sets the width of this item
	this.SetWidth = function( size ) {
		this.Width = size;
	}
	// Sets the text size of each button
	this.SetTextSize = function( size ) {
		this.TextSize = size;
	}
	// Sets the font of eacvh button
	this.SetTextFont = function( font ) {
		this.TextFont = font;
	}
	// Callback
	this._Callback = function( code, text ) {
		this.Callback( code, text );
		this.OnRemove();
		this.Remove();
	}
	// Sets the callback for when an option is picked
	this.Callback = function( code, text ) {}
	// Called when the panel dies
	this.OnRemove = function() {}
	// Draws this
	this.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 1, 1, 1, 1 );
		_r.rect( 0, 0, w, h );

		GameBase.UI.IncDrawLayer();
		_r.color( 0.75, 0.75, 0.75, 1 );
		_r.rect( 0, 0, w, 1 );
		_r.rect( 0, h-1, w, 1 );
		_r.rect( 0, 1, 1, h-2 );
		_r.rect( w-1, 1, 1, h-2 );
	}
	// Makes this item start to display properly
	this.Display = function() {
		var width = 200;
		if ( this.Width > -1 ) {
			width = this.Width;
		}
		var i = 0;
		for ( k in this.Options ) {
			var v = this.Options[k];
			var topmost = this;
			var button = GameBase.UI.CreateElement( "button", this );
			button.code = v.code;
			button.text = v.text;
			button.TextXAlign = 0;
			button.SetText( v.text );
			button.SetTextSize( this.TextSize );
			button.SetTextFont( this.TextFont );
			if ( v.texture ) {
				button.SetTexture( v.texture );
			}
			button.SetPos( 1, 1+i*20 );
			button.SetSize( width-2, 20 );
			button.OnClicked = function() {
				topmost._Callback( this.code, this.text );
			}
			button.OnFocusLost = function() {
				topmost.OnFocusLost();
			}
			i += 1;
		}
		this.SetSize( width, (i)*20+2 );
		if ( this.Direction == 9 ) {
			var x = this.GetPosX();
			var y = this.GetPosY();
			this.SetPos( x, y );
		}
		this.SetFocused();
	}
	// Called when it loses focus
	this.OnFocusLost = function() {
		if ( this.Focused == null ) {
			this.OnRemove();
			this.Remove();
		}
	}

} );
