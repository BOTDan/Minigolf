// Base this
// All other UI elements should be eventually based on this
GameBase.UI.RegisterType( "base", function() {

	// PANEL Variables
	this.Base = null;
	this.Parent = null;
	this.Selected = [0,null];
	this.MousePressed = [];
	this.Focused = null;
	this.HasFocus = false;
	this.Hovered = null;
	this.HoverState = false;
	this.Cursor = "pointer";
	this.Children = [];
	this.Pos = [];
	this.Pos.x = 0;
	this.Pos.y = 0;
	this.Size = [];
	this.Size.w = 100;
	this.Size.h = 100;

	// Internal startup function
	this._Init = function() {
		this.Init();
	}
	// Editable startup function
	this.Init = function() {
		return;
	}
	// Sets the position of this this
	this.SetPos = function( x, y ) {
		this.Pos.x = x;
		this.Pos.y = y;
	}
	// Returns the position of this this
	this.GetPos = function() {
		return [this.Pos.x, this.Pos.y];
	}
	// Sets the size of this this
	this.SetSize = function( w, h ) {
		this.Size.w = w;
		this.Size.h = h;
		this.OnResize();
	}
	// Called when this panel resizes
	this.OnResize = function() {}
	// Returns the size of this this
	this.GetSize = function() {
		return [this.Size.w, this.Size.h];
	}
	// Returns the width of this this
	this.GetWidth = function() {
		return this.Size.w;
	}
	// Returns the height of this this
	this.GetHeight = function() {
		return this.Size.h;
	}
	// Returns the x pos of this this
	this.GetPosX = function() {
		return this.Pos.x;
	}
	// Returns the y pos of this this
	this.GetPosY = function() {
		return this.Pos.y;
	}
	// Returns whether or not this this is being hovered over
	this.IsHovered = function() {
		return this.HoverState;
	}
	// Returns the cursor typoe for this panel
	this.GetCursor = function() {
		return this.Cursor;
	}
	// Sets the cursor type for this panel
	this.SetCursor = function( cursor ) {
		this.Cursor = cursor;
	}
	// Handles thinking for this nad child panels
	this._Think = function() {
		this.Think();
		var panels = this.Children.slice().reverse();
		for ( k in panels ) {
			var v = panels[k];
			v._Think();
		}
	}
	// Editable Think function
	this.Think = function() {

	}
	// Handles drawing of this this and it's children
	this._Draw = function() {
		var layer = GameBase.UI.GetDrawLayer();
		var x = this.GetPosX();
		var y = this.GetPosY();
		var w = this.GetWidth();
		var h = this.GetHeight()
		var cpos = GameBase.UI.GetScreenPos( this );
		var cx = cpos[0];
		var cy = cpos[1];
		_r.layer = layer;
		_r.push();
		_r.translate( x, y );
		_r.pushcliprect( cx, cy, w, h );
		this.Draw();
		GameBase.UI.IncDrawLayer();
		var panels = this.Children.slice().reverse();
		for ( k in panels ) {
			var v = panels[k];
			v._Draw();
		}
		_r.popclip();
		_r.pop();
	}
	// Editable Draw function
	this.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 1, 1, 1, 1 );
		_r.rect( 0, 0, w, h );
	}
	// Sets the parent of this item
	this.SetParent = function( item ) {
		if ( this.Parent != null ) {
			this.Parent.RemoveChild( this );
		} else {
			GameBase.UI.UnparentFromBase( this );
		}
		this.Parent = item;
		item.AddChild( this );
	}
	// Returns the parent of this item
	this.GetParent = function() {
		return this.Parent;
	}
	// Adds a child to this this
	this.AddChild = function( item ) {
		this.Children.unshift( item );
	}
	// Removes a child from this this
	this.RemoveChild = function( item ) {
		for ( k in this.Children ) {
			var v = this.Children[k];
			if ( item == v ) {
				delete this.Children[k];
			}
		}
		this.OnPanelDeath( item );
	}
	// Removes this this
	this.Remove = function() {
		if ( this.Parent != null ) {
			this.Parent.RemoveChild( this );
		} else {
			GameBase.UI.UnparentFromBase( this );
		}
		delete this;
	}
	// Called when a penl dies :(
	this.OnPanelDeath = function( panel ) {
		if ( this.Focused == panel ) {
			this.Focused = null;
		}
		if ( this.Selected[1] == panel ) {
			this.Selected = [0,null];
		}
		for ( button in this.MousePressed ) {
			var data = this.MousePressed[button];
			if ( data == panel ) {
				this.MousePressed[button] = null;
			}
		}
	}
	// Sets the focus for a different panel
	this._SetFocus = function() {
		if ( this.GetParent() != null ) {
			if ( this.GetParent().Focused != this && this.GetParent().Focused != null ) {
				this.GetParent().Focused._OnFocusLost();
			}
			this.GetParent().Focused = this;
			this.GetParent()._SetFocus();
		} else {
			if ( GameBase.UI.Vars.Focused != this && GameBase.UI.Vars.Focused != null ) {
				GameBase.UI.Vars.Focused._OnFocusLost();
			}
			GameBase.UI.Vars.Focused = this;
		}
	}
	// Function to give this panel focus
	this.SetFocused = function() {
		this._SetFocus();
		this._OnFocusGained();
	}
	// Called when the mouse clicks on this this
	this._OnMousePressed = function( x, y, button ) {
		var clicked = false;
		for ( k in this.Children ) {
			var v = this.Children[k];
			var vx = v.GetPosX();
			var vy = v.GetPosY();
			var vw = v.GetWidth();
			var vh = v.GetHeight();
			if ( x>=vx && x<=vx+vw && y>=vy && y<=vy+vh ) {
				if ( this.Focused != v && this.Focused != null ) {
					this.Focused._OnFocusLost();
				}
				this.Focused = v;
				v._OnMousePressed( x-vx, y-vy, button );
				if ( this.Selected[0] == 0 ) {
					this.Selected = [ button, v ];
				}
				this.MousePressed[button] = v;
				clicked = true;
				break;
			}
		}
		if ( clicked == false ) {
			if ( this.Focused != null ) {
				this.Focused._OnFocusLost();
				this.Focused = null;
			}
			if ( this.IsFocused() == false ) {
				this._OnFocusGained();
			}
			this.OnMousePressed( x, y, button );
		}
	}
	// Editable OnMousePressed function
	this.OnMousePressed = function( x, y, button ) {}
	// Called when the mouse is released over this this
	this._OnMouseReleased = function( x, y, button ) {
		if ( this.MousePressed[button] != null ) {
			var v = this.MousePressed[button];
			var vx = v.GetPosX();
			var vy = v.GetPosY();
			v._OnMouseReleased( x-vx, y-vy, button );
			this.MousePressed[button] = null;
			if ( this.Selected[0] == button ) {
				this.Selected = [0,null];
			}
		} else {
			var vw = this.GetWidth();
			var vh = this.GetHeight();
			if ( x>=0 && x<=vw && y>=0 && y<=vh ) {
				this.OnClicked( x, y, button );
			}
			this.OnMouseReleased( x, y, button );
		}
	}
	// Editable OnMouseReleased function
	this.OnMouseReleased = function( x, y, button ) {}
	// Editable OnClicked function
	this.OnClicked = function( x, y, button ) {}
	// Called when the mouse is moved while a mouse button is down
	this._OnMouseDragged = function( x, y, button ) {
		if ( this.Selected[0] == button ) {
			var v = this.Selected[1];
			var vx = v.GetPosX();
			var vy = v.GetPosY();
			v._OnMouseDragged( x-vx, y-vy, button );
		} else {
			this.OnMouseDragged( x, y, button );
		}
	}
	// Editable OnMouseDragged function
	this.OnMouseDragged = function( x, y, button ) {}
	// Called when the mouse enters the this
	this._OnMouseEnter = function( x, y ) {
		var found = false;
		for ( k in this.Children ) {
			var v = this.Children[k];
			var vx = v.GetPosX();
			var vy = v.GetPosY();
			var vw = v.GetWidth();
			var vh = v.GetHeight();
			if ( x>=vx && x<=vx+vw && y>=vy && y<=vy+vh ) {
				if ( this.Hovered != v ) {
					if ( this.Hovered != null ) {
						this.Hovered._OnMouseLeave();
					}
					v._OnMouseEnter( x-vx, y-vy );
				} else {
					v._OnMouseMoved( x-vx, y-vy );
				}
				this.Hovered = v;
				found = true;
				break;
			}
		}
		if ( found == false ) {
			if ( this.Hovered != null ) {
				this.Hovered._OnMouseLeave();
				this.Hovered = null;
			}
			this.HoverState = true;
			this.OnMouseEnter( x, y );
		} else {
			this.HoverState = false;
		}
	}
	// Editable OnMouseEnter function
	this.OnMouseEnter = function( x, y ) {}
	// Called when the mouse moves within this this
	this._OnMouseMoved = function( x, y ) {
		var found = false;
		for ( k in this.Children ) {
			var v = this.Children[k];
			var vx = v.GetPosX();
			var vy = v.GetPosY();
			var vw = v.GetWidth();
			var vh = v.GetHeight();
			if ( x>=vx && x<=vx+vw && y>=vy && y<=vy+vh ) {
				if ( this.Hovered != v ) {
					if ( this.Hovered != null ) {
						this.Hovered._OnMouseLeave();
					}
					v._OnMouseEnter( x-vx, y-vy );
				} else {
					v._OnMouseMoved( x-vx, y-vy );
				}
				this.Hovered = v;
				found = true;
				break;
			}
		}
		if ( found == false ) {
			if ( this.Hovered != null ) {
				this.Hovered._OnMouseLeave();
				this.Hovered = null;
			}
			this.HoverState = true;
		} else {
			this.HoverState = false;
		}
		this.OnMouseMoved( x, y );
	}
	// Editable OnMouseMoved function
	this.OnMouseMoved = function( x, y ) {}
	// Called when the mouse leaves this this
	this._OnMouseLeave = function() {
		if ( this.Hovered != null ) {
			this.Hovered._OnMouseLeave();
		}
		this.HoverState = false;
		this.OnMouseLeave();
	}
	// Returns if the panel has focus or not
	this.IsFocused = function() {
		return this.HasFocus;
	}
	// Editable OnMouseLeave function
	this.OnMouseLeave = function() {};
	// Called when the panel gains focus
	this._OnFocusGained = function() {
		this.HasFocus = true;
		this.OnFocusGained();
	}
	// Editable OnFocusGained function
	this.OnFocusGained = function() {
		print( "Panel gained focus: "+this );
	};
	// Called when the panel loses focus
	this._OnFocusLost = function() {
		if ( this.Focused != null ) {
			this.Focused._OnFocusLost();
		}
		if ( this.IsFocused() ) {
			this.HasFocus = false;
			this.OnFocusLost();
		}
		this.Focused = null;
	}
	// Editable OnFocusLost function
	this.OnFocusLost = function() {
		print( "Panel lost focus: "+this );
	};
	// Called when a button is pressed while this panel has focus
	this._OnKeyPressed = function( key ) {
		if ( this.Focused != null ) {
			this.Focused._OnKeyPressed( key );
		} else {
			this.OnKeyPressed( key );
		}
	}
	// Editable OnKeyPressed function
	this.OnKeyPressed = function( key ) {
		print( "Panel pressed key: "+key );
	}
	// Called when a button is repeated while this panel has focus
	this._OnKeyRepeat = function( key ) {
		if ( this.Focused != null ) {
			this.Focused._OnKeyRepeat( key );
		} else {
			this.OnKeyRepeat( key );
		}
	}
	// Editable OnKeyRepeat function
	this.OnKeyRepeat = function( key ) {
		print( "Panel repeated key: "+key );
	}
	// Called when a button is released while this panel has focus
	this._OnKeyReleased = function( key ) {
		if ( this.Focused != null ) {
			this.Focused._OnKeyReleased( key );
		} else {
			this.OnKeyReleased( key );
		}
	}
	// Editable OnKeyReleased function
	this.OnKeyReleased = function( key ) {
		print( "Panel released key: "+key );
	}

} );
