// Headed Dropdown
GameBase.UI.RegisterType( "headed_dropdown", function() {
	GameBase.UI.GetConstructor( "base" ).call( this );

	// Variables
	this.Text = "BLANK";

	// Called on Init
	this.Init = function() {
		this.Dropdown = GameBase.UI.CreateElement( "dropdown", this );
		this.Dropdown.OnValueChanged = function( option ) {
			this.GetParent().OnValueChanged( option );
		}
		this.Dropdown.Draw = function() {
			var w = this.GetWidth();
			var h = this.GetHeight();

			this.OldDraw();

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
	}
	// Editable callback function
	this.OnValueChanged = function( option ) {};
	// Sets the headed text
	this.SetText = function( name ) {
		this.Text = name;
	}
	this.OnResize = function() {
		this.RecalcSizes();
	}
	this.RecalcSizes = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		this.Dropdown.SetPos( 1, 20 );
		this.Dropdown.SetSize( w-2, h-21 )
	}
	this.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 1, 1, 1, 1 );
		_r.rect( 0, 0, w, h );

		if ( this.Focused != null || this.IsFocused() || this.Dropdown.Dropdown != null ) {
			_r.color( 0.1, 0.4, 1, 1 );
		} else {
			_r.color( 0.5, 0.5, 0.5, 1 );
		}
		_r.rect( 0, 0, w, 20 );
		_r.rect( 0, h-1, w, 1 );
		_r.rect( 0, 1, 1, h-2 );
		_r.rect( w-1, 1, 1, h-2 );

		GameBase.UI.IncDrawLayer();
		_r.color( 1, 1, 1, 1 );
		GameBase.Text.SetFont( "Mplus1m Bold" );
		GameBase.Text.SetSize( 14 );
		GameBase.Text.DrawText( w/2, 10, this.Text, 1, 1 );
	}
} );
