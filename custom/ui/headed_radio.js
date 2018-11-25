// Radio Button Type Thing
GameBase.UI.RegisterType( "headed_radio", function() {
	GameBase.UI.GetConstructor( "base" ).call( this );

	// Variables
	this.Text = "BLANK";
	this.Options = [];
	this.Current = null;

	// Called on Init
	this.Init = function() {
		this.RecalcSizes();
	}
	// Adds an option to the radio
	this.AddOption = function( text, desc, code, texture ) {
		var option = [];
		option.text = text;
		option.desc = desc;
		option.code = code;
		option.texture = texture;
		this.Options[code] = option;
		if ( this.Current == null ) {
			this.Current = option;
		}
		this.RecalcSizes();
	}
	// Sets the headed text
	this.SetText = function( name ) {
		this.Text = name;
	}
	this.OnResize = function() {
		this.RecalcSizes();
	}
	this.SelectOption = function( option ) {
		this.Chosen = option;
		for ( child in this.Children ) {
			this.Children[child].Chosen = this.Children[child].Option == option;
		}
		this.OnValueChanged( option )
	}
	// Editable callbakc function
	this.OnValueChanged = function( option ) {}
	this.RecalcSizes = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		for ( child in this.Children ) {
			this.Children[child].Remove();
		}
		var i = 0;
		for ( option in this.Options ) {
			option = this.Options[option]
			var button = GameBase.UI.CreateElement( "button", this );
			button.Option = option;
			button.Chosen = option == this.Current;
			button.Tooltip = false;
			button.SetPos( 5, 20+(5*(i+1))+((w-10)*i) );
			button.SetSize(  w-10, w-10 );
			button.OnClicked = function( x, y, button ) {
				if (button == 1) {
					this.GetParent().SelectOption( this.Option );
				}
			}
			button.OldDraw = button.Draw;
			button.Draw = function() {
				this.OldDraw();

				var w = this.GetWidth();
				var h = this.GetHeight();

				if ( this.Chosen ) {
					_r.color( 0.1, 0.4, 1, 1 );
					_r.rect( 0, 0, w, 1 );
					_r.rect( 0, h-1, w, 1 );
					_r.rect( 0, 1, 1, h-2 );
					_r.rect( w-1, 1, 1, h-2 );
				}

				GameBase.UI.IncDrawLayer();
				_r.color( 1, 1, 1, 1 );
				_r.rect( 5, 5, w-10, h-10, this.Option.texture );
			}
			button.OnMouseEnter = function() {
				if ( this.Tooltip != false ) {
					this.Tooltip.Remove();
				}
				this.Tooltip = GameBase.UI.CreateElement( "tooltip_right" );
				var pos = GameBase.UI.GetScreenPos( this );
				var w = this.GetWidth();
				var h = this.GetHeight();
				this.Tooltip.SetAnchor( pos[0]+w+15, pos[1]+(h/2) );
				this.Tooltip.SetTitle( this.Option.text );
				this.Tooltip.SetDescription( this.Option.desc );
			}
			button.OnMouseLeave = function() {
				if ( this.Tooltip != false ) {
					this.Tooltip.Remove();
					this.Tooltip = false;
				}
			}
			i += 1;
		}
		this.Size.h = 20+10+(w-10)*i+(5*(i-1))
	}
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
