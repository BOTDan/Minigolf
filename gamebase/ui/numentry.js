// Text entry
GameBase.UI.RegisterType( "numentry", function() {
	GameBase.UI.GetConstructor( "base" ).call( this );

	// Variables
	this.Increment = 1;
	this.MaxValue = false;
	this.MinValue = false;
	this.EnforceIncrement = false;

	// Variables
	this.Init = function() {
		this.Entry = GameBase.UI.CreateElement( "entry", this );
		this.Entry.Text = "0";
		this.Entry.OldOnKeyPressed = this.Entry.OnKeyPressed;
		this.Entry.OnKeyPressed = function( key ) {
			var letter = GameBase.GetKey( key );
			letter = this.ConvertKey( letter );
			if ( letter == "MINUS" ) {
				if ( this.CursorLeft != 0 || this.GetText().includes("-") ) {
					return
				}
			} else if ( letter == "PERIOD" ) {
				if (this.GetText().includes(".")) {
					return
				}
			}
			this.OldOnKeyPressed(key);
		}
		this.Entry.OnFocusLost = function() {
			this.GetParent().CorrectNumber();
		}
		this.Entry.ValidateKey = function( key ) {
			return ("0123456789-.".indexOf( key ) > -1);
		}
		this.Entry.OnEnterPressed = function() {
			this.GetParent().CorrectNumber();
		}
		this.Entry.OnValueChanged = function( text ) {
			this.GetParent().OnValueChanged( text );
		}

		this.ButtonLess = GameBase.UI.CreateElement( "button", this );
		this.ButtonLess.SetText( "<" );
		this.ButtonLess.OnClicked = function() {
			var num = Number( this.GetParent().Entry.GetText() );
			if ( this.GetParent().MinValue !== false ) {
				num = Math.max( this.GetParent().MinValue, num-this.GetParent().Increment );
			} else {
				num = num - this.GetParent().Increment;
			}
			this.GetParent().Entry.SetText( String( num ) );
		}

		this.ButtonMore = GameBase.UI.CreateElement( "button", this );
		this.ButtonMore.SetText( ">" );
		this.ButtonMore.OnClicked = function() {
			var num = Number( this.GetParent().Entry.GetText() );
			if ( this.GetParent().MaxValue !== false ) {
				num = Math.min( this.GetParent().MaxValue, num+this.GetParent().Increment );
			} else {
				num = num + this.GetParent().Increment;
			}
			this.GetParent().Entry.SetText( String( num ) );
		}

		this.RecalcSizes();
	}
	// Editable callbakc function
	this.OnValueChanged = function( number ) {};
	// Returns the number value of this item
	this.GetValue = function() {
		return Number( this.Entry.GetText() );
	}
	// Sets the value of this entry
	this.SetValue = function( num ) {
		this.Entry.SetText( String( num ) );
	}
	// Sets the maximum size of the number
	this.SetMaxValue = function( num ) {
		if ( num === false ) {
			this.MaxValue = false;
		} else {
			this.MaxValue = num;
			if ( Number( this.Entry.GetText() ) > num ) {
				this.Entry.SetText( String( num ) );
			}
		}
	}
	// Sets the minimum value of the number
	this.SetMinValue = function( num ) {
		if ( num === false ) {
			this.MinValue = false;
		} else {
			this.MinValue = num;
			if ( Number( this.Entry.GetText() ) < num ) {
				this.Entry.SetText( String( num ) );
			}
		}
	}
	// Sets the increment
	this.SetIncrement = function( num ) {
		this.Increment = num;
	}
	// Sets if the increment should be forced
	this.SetForceIncrement = function( bool ) {
		this.ForceIncrement = bool;
	}
	// Forces the number to be correct
	this.CorrectNumber = function() {
		var num = Number( this.Entry.GetText() );
		if (num == NaN) {
			num = 0;
		}
		if ( this.MinValue !== false ) {
			num = Math.max( this.MinValue, num );
		}
		if ( this.MaxValue !== false ) {
			num = Math.min( this.MaxValue, num );
		}
		if ( this.ForceIncrement == true ) {
			if ( num % this.Increment != 0 ) {
				if ( (num % this.Increment) / this.Increment >= 0.5 ) {
					num = num + ( this.Increment - (num % this.Increment) );
				} else {
					num = num - num % this.Increment;
				}

			}
		}
		this.Entry.SetText( String( num ) );
	}
	// Called when the panel resizes
	this.OnResize = function() {
		this.RecalcSizes();
	}
	// Places everything where it should be
	this.RecalcSizes = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		this.Entry.SetPos( h/2, 0 );
		this.Entry.SetSize( w-h, h );

		this.ButtonLess.SetPos( 0, 0 );
		this.ButtonLess.SetSize( h/2, h );

		this.ButtonMore.SetPos( w-(h/2), 0 );
		this.ButtonMore.SetSize( h/2, h );
	}
} );
