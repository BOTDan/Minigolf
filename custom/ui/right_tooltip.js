// Radio Button Type Thing
GameBase.UI.RegisterType( "tooltip_right", function() {
	GameBase.UI.GetConstructor( "base" ).call( this );

	// Variables
	this.Title = "";
	this.Description = "";
	this.Anchor = [];
	this.Anchor.x = 0;
	this.Anchor.y = 0;

	// Sets the anchor point
	this.SetAnchor = function( x, y ) {
		this.Anchor.x = x;
		this.Anchor.y = y;
	}
	// Sets the title
	this.SetTitle = function( title ) {
		this.Title = String(title);
		this.RecalcSizes();
	}
	// Sets the description
	this.SetDescription = function( desc ) {
		this.Description = String(desc);
		this.RecalcSizes();
	}
	// Recalculates Sizes
	this.RecalcSizes = function() {
		if ( this.Title != "" ) {
			GameBase.Text.SetFont( "Mplus1m Bold" );
			GameBase.Text.SetSize( 14 );
			var w1 = GameBase.Text.GetTextWidth( this.Title )+10;
			if ( this.Description != "" ) {
				GameBase.Text.SetFont( "Mplus1m" );
				GameBase.Text.SetSize( 14 );
				var w2 = GameBase.Text.GetTextWidth( this.Description )+10;
				this.SetPos( this.Anchor.x, this.Anchor.y-22 );
				this.SetSize( ((w1 > w2) ? w1 : w2 ), 40 )
			} else {
				this.SetPos( this.Anchor.x, this.Anchor.y-12 );
				this.SetSize( w1, 24 );
			}
		} else {
			if ( this.Description != "" ) {
				GameBase.Text.SetFont( "Mplus1m" );
				GameBase.Text.SetSize( 14 );
				var w2 = GameBase.Text.GetTextWidth( this.Description )+10;
				this.SetPos( this.Anchor.x, this.Anchor.y-12 );
				this.SetSize( w2, 24 )
			} else {
				this.SetPos( this.Anchor.x, this.Anchor.y );
				this.SetSize( 0, 0 );
			}
		}
	}
	// Draw
	this.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 1, 1, 1, 1 )
		_r.rect( 0, 0, w, h );

		GameBase.UI.IncDrawLayer();
		_r.color( 0.75, 0.75, 0.75, 1 );
		_r.rect( 0, 0, w, 1 );
		_r.rect( 0, h-1, w, 1 );
		_r.rect( 0, 1, 1, h-2 );
		_r.rect( w-1, 1, 1, h-2 );

		GameBase.UI.IncDrawLayer();
		_r.color( 0.1, 0.1, 0.1, 1 );
		if ( this.Title != "" ) {
			GameBase.Text.SetFont( "Mplus1m Bold" );
			GameBase.Text.SetSize( 14 );
			GameBase.Text.DrawText( 5, 5, this.Title, 0, 0 );
			if ( this.Description != "" ) {
				GameBase.Text.SetFont( "Mplus1m" );
				GameBase.Text.SetSize( 14 );
				GameBase.Text.DrawText( 5, 21, this.Description, 0, 0 );
			}
		} else {
			if ( this.Description != "" ) {
				GameBase.Text.SetFont( "Mplus1m" );
				GameBase.Text.SetSize( 14 );
				GameBase.Text.DrawText( 5, 5, this.Description, 0, 0 );
			}
		}
	}

} )
