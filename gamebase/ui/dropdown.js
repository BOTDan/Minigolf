// Dropdown
GameBase.UI.RegisterType( "dropdown", function() {
	GameBase.UI.GetConstructor( "button" ).call( this );

	// Variables
	this.Options = [];
	this.Current = null;
	this.Dropdown = null;

	// Adds an option to the dropdown
	this.AddOption = function( text, code, texture ) {
		var option = [];
		option.text = text;
		option.code = code;
		option.texture = texture;
		this.Options[code] = option;
		if ( this.Current == null ) {
			this.Current = option;
		}
	}
	// On topmost death
	this.OnTopmostDeath = function() {
		this.Dropdown = null;
	}
	// Called when an option is chosen
	this._Callback = function( code, text ) {
		this.Current = this.Options[code];
		this.OnOptionChosen( code );
		this.OnValueChanged( this.Options[code] );
	}
	// Editable Callback function
	this.OnOptionChosen = function( code ) {}
	// Editable callback funcion
	this.OnValueChanged = function( value ) {

	}
	// Called when it's clicked on
	this.OnClicked = function() {
		if ( this.Dropdown == null ) {
			this.Dropdown = GameBase.UI.CreateElement( "topmost" );
			var pos = GameBase.UI.GetScreenPos( this );
			var h = this.GetHeight();
			this.Dropdown.SetPos( pos[0], pos[1]+h );
			this.Dropdown.SetWidth( this.GetWidth() )
			for ( k in this.Options ) {
				var v = this.Options[k];
				this.Dropdown.AddOption( v.text, v.code, v.texture );
			}
			this.Dropdown.Display();
			var dropdown = this;
			this.Dropdown.OnRemove = function() { dropdown.OnTopmostDeath() };
			this.Dropdown.Callback = function( code, name ) { dropdown._Callback( code, name ) };
		}
	}
	// Draw
	this.OldDraw = this.Draw;
	this.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		this.OldDraw();

		if ( this.Dropdown != null ) {
			_r.color( 0.1, 0.4, 1, 1 );
			_r.rect( 0, 0, w, 1 );
			_r.rect( 0, h-1, w, 1 );
			_r.rect( 0, 1, 1, h-2 );
			_r.rect( w-1, 1, 1, h-2 );
		}

		_r.color( 0, 0, 0, 1 );
		GameBase.Text.SetFont( this.TextFont );
		GameBase.Text.SetSize( this.TextSize );

		if ( this.Current != null ) {
			if ( this.texture != null ) {
				GameBase.Text.DrawText( h/2, h/2, this.Current.text, 0, 1 );
			} else {
				GameBase.Text.DrawText( h/2, h/2, this.Current.text, 0, 1 );
			}
		}
		GameBase.Text.DrawText( w-h/2, h/2, "v", 1, 1 );
	}
} )
