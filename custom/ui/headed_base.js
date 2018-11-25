// Headed Number Entry
GameBase.UI.RegisterType( "headed_base", function() {
	GameBase.UI.GetConstructor( "base" ).call( this );

	// Variables
	this.Text = "BLANK";

	// Called on Init
	this.Init = function() {

	}
	// Editable callbakc function
	this.OnValueChanged = function( number ) {};
	// Sets the headed text
	this.SetText = function( name ) {
		this.Text = name;
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
