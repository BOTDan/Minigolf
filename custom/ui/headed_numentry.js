// Headed Number Entry
GameBase.UI.RegisterType( "headed_numentry", function() {
	GameBase.UI.GetConstructor( "base" ).call( this );

	// Variables
	this.Text = "BLANK";

	// Called on Init
	this.Init = function() {
		this.Entry = GameBase.UI.CreateElement( "numentry", this );
		this.Entry.Entry.Draw = function() {
			this.DrawCharacters();
		}
		this.Entry.OnValueChanged = function( number ) {
			this.GetParent().OnValueChanged( number );
		}
		this.RecalcSizes();
	}
	// Editable callbakc function
	this.OnValueChanged = function( number ) {};
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

		this.Entry.SetPos( 1, 20 );
		this.Entry.SetSize( w-2, h-21 )
	}
	this.OnValueChanged = function( value ) {}
	this.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 1, 1, 1, 1 );
		_r.rect( 0, 0, w, h );

		if ( this.Focused != null || this.IsFocused() ) {
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
