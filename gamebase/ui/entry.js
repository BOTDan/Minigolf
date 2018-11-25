// Text entry
GameBase.UI.RegisterType( "entry", function() {
	GameBase.UI.GetConstructor( "base" ).call( this );

	// Variables
	this.Text = "";
	this.TextSize = 20;
	this.TextFont = "Mplus1m SemiBold";
	this.TextColour = [0, 0, 0, 1];
	this.CursorLeft = 0;
	this.CursorRight = 0;
	this.LastButtonPress = 0;
	this.StartDrag = [];
	this.StartDrag.x = 0;
	this.StartDrag.y = 0;
	this.DragStartPos = 0;
	this.Cursor = "text";
	this.ConvertList = {
		KP_1: "1",
		KP_2: "2",
		KP_3: "3",
		KP_4: "4",
		KP_5: "5",
		KP_6: "6",
		KP_7: "7",
		KP_8: "8",
		KP_9: "9",
		KP_0: "0",
		KP_ENTER: "RETURN",
		KP_PERIOD: "PERIOD"
	};

	// Sets the text of the text entry
	this.SetText = function( text ) {
		this.Text = text;
		this.OnValueChanged( text );
	}
	// Clears the text
	this.Clear = function() {
		this.Text = "";
		this.OnValueChanged( "" );
	}
	// Returns the text of this text entry
	this.GetText = function() {
		return this.Text;
	}
	// Converts certain keys to input
	this.ConvertKey = function( letter ) {
		if ( this.ConvertList[letter] != undefined ) {
			return this.ConvertList[letter];
		}
		return letter;
	}
	// Called when a button is pressed
	this.OnKeyPressed = function( key ) {
		this.LastButtonPress = GameBase.GetTime();
		var letter = GameBase.GetKey( key );
		letter = this.ConvertKey( letter );
		if ( ( GameBase.IsKeyDown( "LEFT_CONTROL" ) || GameBase.IsKeyDown( "RIGHT_CONTROL" ) ) && letter == "A" ) {
			this.CursorLeft = 0;
			this.CursorRight = this.Text.length;
		} else if ( letter == "RETURN" ) {
			this.OnEnterPressed();
		} else if ( letter == "BACKSPACE" ) {
			if ( this.CursorLeft == this.CursorRight ) {
				if ( this.CursorLeft > 0 ) {
					this.Text = this.Text.substr(0, this.CursorLeft-1) + this.Text.substr(this.CursorLeft);
					this.CursorLeft -= 1;
					this.CursorRight = this.CursorLeft;
				}
			} else {
				this.Text = this.Text.substr(0, this.CursorLeft) + this.Text.substr(this.CursorRight);
				this.CursorRight = this.CursorLeft;
			}
		} else if ( letter == "DELETE" ) {
			if ( this.CursorLeft == this.CursorRight ) {
				if ( this.CursorLeft < this.Text.length ) {
					this.Text = this.Text.substr(0, this.CursorLeft) + this.Text.substr(this.CursorLeft + 1);
				}
			} else {
				this.Text = this.Text.substr(0, this.CursorLeft) + this.Text.substr(this.CursorRight);
				this.CursorRight = this.CursorLeft;
			}
		} else if ( letter == "LEFT" ) {
			if ( this.CursorLeft == this.CursorRight ) {
				if ( this.CursorLeft > 0 ) {
					this.CursorLeft -= 1;
					this.CursorRight = this.CursorLeft;
				}
			} else {
				this.CursorRight = this.CursorLeft;
			}
		} else if ( letter == "RIGHT" ) {
			if ( this.CursorLeft == this.CursorRight ) {
				if ( this.CursorLeft < this.Text.length ) {
					this.CursorLeft += 1;
					this.CursorRight = this.CursorLeft;
				}
			} else {
				this.CursorLeft = this.CursorRight;
			}
 		} else {
			letter = this.FormatLetter( letter );
			this.EnterCharacter( letter.toLowerCase(), key );
		}
	}
	// Editable OnEnter function
	this.OnEnterPressed = function() {};
	// Called when a button is repeated
	this.OnKeyRepeat = function( key ) {
		this.OnKeyPressed( key );
	}
	// Called when the character isn't a special key
	this.EnterCharacter = function( char, code ) {
		if ( this.ValidateKey( char, code ) ) {
			this.Text = this.Text.substr(0, this.CursorLeft) + char + this.Text.substr(this.CursorRight);
			this.CursorLeft += 1;
			this.CursorRight = this.CursorLeft;
			this.OnValueChanged( this.Text );
		}
	}
	// Editable callback function
	this.OnValueChanged = function( text ) {};
	// Editable ValidateKey function
	this.ValidateKey = function( str, code ) {
		if ( str.length == 1 ) {
			return true;
		}
		return false;
	}
	// Formats a letter to it's more-lettery counter-part
	this.FormatLetter = function( key ) {
		print(key);
		if ( key == "SPACEBAR" ) {
			return " ";
		}
		return key;
	}
	// Called when the thing is clicked
	this.OnMousePressed = function( x, y, button ) {
		this.LastButtonPress = GameBase.GetTime();
		if ( button == 1 ) {
			this.StartDrag.x = x;
			this.StartDrag.y = y;

			GameBase.Text.SetFont( this.TextFont );
			GameBase.Text.SetSize( this.TextSize );

			var smallest = -1;
			var index = -1;
			for ( var i=0; i <= this.Text.length; i++ ) {
				var width = GameBase.Text.GetTextWidth( this.Text.substr( 0, i ) );
				var dist = Math.abs( (5+width)-x );
				if ( dist < smallest || smallest == -1 ) {
					smallest = dist;
					index = i;
				}
			}

			this.CursorLeft = Math.max( index, 0 );
			this.CursorRight = this.CursorLeft;
			this.DragStartPos = this.CursorLeft;
		}
	}
	// Called when the mouse is dragged
	this.OnMouseDragged = function( x, y, button ) {
		if ( button == 1 ) {
			GameBase.Text.SetFont( this.TextFont );
			GameBase.Text.SetSize( this.TextSize );

			var smallest = -1;
			var index = -1;
			for ( var i=0; i <= this.Text.length; i++ ) {
				var width = GameBase.Text.GetTextWidth( this.Text.substr( 0, i ) );
				var dist = Math.abs( (5+width)-x );
				if ( dist < smallest || smallest == -1 ) {
					smallest = dist;
					index = i;
				}
			}

			if ( index < this.DragStartPos ) {
				this.CursorLeft = index;
				this.CursorRight = this.DragStartPos;
			} else if ( index > this.DragStartPos ) {
				this.CursorLeft = this.DragStartPos;
				this.CursorRight = index;
			} else {
				this.CursorLeft = index;
				this.CursorRight = this.CursorLeft;
			}
		}
	}
	// Draw
	this.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 1, 1, 1, 1 );
		_r.rect( 0, 0, w, h );

		if ( !this.IsFocused() && this.IsHovered() ) {
			GameBase.UI.IncDrawLayer();
			_r.color( 0.75, 0.75, 0.75, 1 );
			_r.rect( 0, 0, w, 1 );
			_r.rect( 0, h-1, w, 1 );
			_r.rect( 0, 1, 1, h-2 );
			_r.rect( w-1, 1, 1, h-2 );
		} else if ( this.IsFocused() ) {
			_r.color( 0.1, 0.4, 1, 1 );
			_r.rect( 0, 0, w, 1 );
			_r.rect( 0, h-1, w, 1 );
			_r.rect( 0, 1, 1, h-2 );
			_r.rect( w-1, 1, 1, h-2 );
		}

		GameBase.UI.IncDrawLayer();
		this.DrawCharacters();
	}
	// Draws the text. Usefull for restyling
	this.DrawCharacters = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		GameBase.Text.SetFont( this.TextFont );
		GameBase.Text.SetSize( this.TextSize );

		if ( this.IsFocused() ) {
			_r.color( 0.1, 0.4, 1, 1 );
			GameBase.UI.IncDrawLayer();
			if ( this.CursorLeft == this.CursorRight ) {
				if ( (GameBase.GetTime()-this.LastButtonPress) % 1 < 0.5 ) {
					var pos_x = GameBase.Text.GetTextWidth( this.Text.substr( 0, this.CursorLeft ) );
					_r.rect( 5+pos_x, 4, 1, h-8 );
				}
			} else {
				var pos1_x = GameBase.Text.GetTextWidth( this.Text.substr( 0, this.CursorLeft ) );
				var pos2_x = GameBase.Text.GetTextWidth( this.Text.substr( 0, this.CursorRight ) );
				_r.rect( 5+pos1_x, 4, pos2_x-pos1_x, h-8 );
			}
		}

		_r.color( this.TextColour[0], this.TextColour[1], this.TextColour[2], this.TextColour[3] );

		GameBase.Text.DrawText( 5, h/2, this.Text, 0, 1 );
	}

} )
