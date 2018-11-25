// Text entry
GameBase.UI.RegisterType( "scroll", function() {
	GameBase.UI.GetConstructor( "base" ).call( this );

	// Variables
	this.Items = [];
	this.ScrollHeight = 0;
	this.ScrollPercent = 0;
	this.Dragging = false;
	this.StartDrag = [];
	this.StartDrag.x = 0;
	this.StartDrag.y = 0;
	this.Spacing = 0;

	// Sets up the scroller
	this.Init = function() {
		var self = this;

		this.Canvas = GameBase.UI.CreateElement( "base", this );
		this.Canvas.SetPos( 0, 0 )
		this.Canvas.SetSize( 0, 0 )
		this.Canvas.Draw = function() {};

		this.ScrollTrack = GameBase.UI.CreateElement( "base", this );
		this.ScrollTrack.Draw = function() {
			var w = this.GetWidth();
			var h = this.GetHeight();

			_r.color( 0, 0, 0, 0.5 );
			_r.rect( 0, 0, w, h );
		}

		this.ScrollDrag = GameBase.UI.CreateElement( "base", this.ScrollTrack );
		this.ScrollDrag.SetPos( 0, 0 );
		this.ScrollDrag.OnMousePressed = function( x, y, button ) {
			self.Dragging = true;
			self.StartDrag.x = x;
			self.StartDrag.y = y;
		}
		this.ScrollDrag.OnMouseDragged = function( x, y, button ) {
			var newx = x - self.StartDrag.x
			var newy = y - self.StartDrag.y
			var thisx = this.GetPosX();
			var thisy = this.GetPosY();
			var thisw = this.GetWidth();
			var thish = this.GetHeight();
			var thatw = self.GetWidth();
			var thath = self.GetHeight();
			var finaly = Math.max( Math.min( thisy+newy, thath-thish ), 0 );
			this.SetPos( thisx, finaly );
			var canvasx = self.Canvas.GetPosX();
			var canvasy = self.Canvas.GetPosY();
			var canvasw = self.Canvas.GetWidth();
			var canvash = self.Canvas.GetHeight();
			if ( canvash <= thath ) {
				self.Canvas.SetPos( canvasx, 0 )
			} else {
				self.Canvas.SetPos( canvasx, (thath-canvash)*(finaly/(thath-thish)) )
			}
			self.ScrollHeight = self.Canvas.GetPosY();
		}
		this.ScrollDrag.OnMouseReleased = function( x, y ) {
			self.Dragging = false;
			self.StartDrag.x = 0;
			self.StartDrag.y = 0;
		}
		this.ScrollDrag.Draw = function() {
			var w = this.GetWidth();
			var h = this.GetHeight();

			_r.color( 1, 1, 1, 1 );
			_r.rect( 0, 0, w, h );

			if ( !this.GetParent().GetParent().Dragging && this.IsHovered() ) {
				_r.color( 0.6, 0.6, 0.6, 1 );
			} else if ( this.GetParent().GetParent().Dragging ) {
				_r.color( 0.1, 0.4, 1, 1 );
			} else {
				_r.color( 0.5, 0.5, 0.5, 1 );
			}
			_r.rect( 0, 0, w, 1 );
			_r.rect( 0, h-1, w, 1 );
			_r.rect( 0, 1, 1, h-2 );
			_r.rect( w-1, 1, 1, h-2 );
		}

		this.Update();
	}

	// Updates stuff
	this.Update = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		var _w = this.Canvas.GetWidth();
		var _h = this.Canvas.GetHeight();
		this.Canvas.SetSize( w-10, _h );
		this.Canvas.SetPos( 0, this.ScrollHeight );

		this.ScrollTrack.SetPos( w-10, 0 );
		this.ScrollTrack.SetSize( 10, h );

		if ( this.GetCanvasHeight() == 0 || this.GetCanvasHeight() <= h ) {
			this.ScrollDrag.SetSize( 0, 0 );
			this.ScrollDrag.SetPos( 0, 0 );
			this.ScrollTrack.SetSize( 0, 0 );
		} else {
			this.ScrollDrag.SetSize( 10, Math.min( h/this.GetCanvasHeight(), 1 ) * h );
			this.ScrollDrag.SetPos( 0, Math.min( -this.ScrollHeight/(this.GetCanvasHeight()-h), 1 ) * (h-Math.min( h/this.GetCanvasHeight(), 1 ) * h) )
			this.ScrollTrack.SetSize( 10, h );
		}
	}

	// Adds an item to the scroll panel
	this.AddItem = function( itm ) {
		this.Items.push( itm );
		var w = itm.GetWidth();
		var h = itm.GetHeight();

		var _w = this.Canvas.GetWidth();
		var _h = this.Canvas.GetHeight();
		itm.SetParent( this.Canvas );
		itm.SetSize( _w, h );
		if ( _h == 0 ) {
			itm.SetPos( 0, _h );
			this.Canvas.SetSize( _w, _h+h );
		} else {
			itm.SetPos( 0, _h+this.Spacing );
			this.Canvas.SetSize( _w, _h+h+this.Spacing );
		}
		this.Update()
	}

	// Clears everything from the scroll panel
	this.Clear = function() {
		for ( var x in this.Items ) {
			this.Items[x].Remove();
		}
		this.Items = [];
		this.Canvas.SetSize( this.Canvas.GetWidth(), 0 );
		this.Update();
	}

	// Returns if an object is odd
	this.IsOdd = function( itm ) {
		for ( var x in this.Items ) {
			if ( this.Items[x] == itm ) {
				return ( x % 2 == 0 );
			}
		}
	}

	// Returns the canvas' height
	this.GetCanvasHeight = function() {
		return this.Canvas.GetHeight();
	}

	// Draw
	this.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 1, 1, 1, 0.1 );
		_r.rect( 0, 0, w, h );
	}

} )
