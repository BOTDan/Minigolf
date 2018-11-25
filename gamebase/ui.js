// UI Module
GameBase.UI = [];

// Cursor Types
GameBase.UI.Cursors = [];
GameBase.UI.Cursors["pointer"] = assets["cursor_pointer.tex"];
GameBase.UI.Cursors["clicker"] = assets["cursor_clicker.tex"];
GameBase.UI.Cursors["text"] = assets["cursor_text.tex"];

// Variables
GameBase.UI.Vars = [];
GameBase.UI.Vars.Panels = [];
GameBase.UI.Vars.Selected = [0,null];
GameBase.UI.Vars.Hovered = null;
GameBase.UI.Vars.MousePressed = [];
GameBase.UI.Vars.Focused = null;
GameBase.UI.Vars.Types = [];
GameBase.UI.Vars.DrawLayer = 9000;
GameBase.UI.Vars.BaseDrawLayer = 9000;
GameBase.UI.Vars.Cursor = "pointer";
GameBase.UI.Vars.DrawCursor = (_m.gamebase_drawcursor != undefined) ? !!+_m.gamebase_drawcursor : false;

// Returns the current draw layer (used to layer up UI)
GameBase.UI.GetDrawLayer = function() {
	return this.Vars.DrawLayer;
}
// Increments the draw layer by 1
GameBase.UI.IncDrawLayer = function() {
	this.Vars.DrawLayer += 1;
	_r.layer = this.Vars.DrawLayer;
}
// Resets the draw layer to the base level
GameBase.UI.ResetDrawLayer = function() {
	this.Vars.DrawLayer = this.Vars.BaseDrawLayer;
	_r.layer = this.Vars.DrawLayer;
}
// Sets the base draw layer level
GameBase.UI.SetBaseDrawLayer = function( layer ) {
	this.Vars.BaseDrawLayer = layer;
}
// Registers a UI element so that it can be created
GameBase.UI.RegisterType = function( name, settings ) {
	print("> "+name)
	this.Vars.Types[name] = settings;
}
// Returns constructor of given element
GameBase.UI.GetConstructor = function( name ) {
	if ( this.Vars.Types[name] != null ) {
		return this.Vars.Types[name];
	} else {
		return false;
	}
}
// Creates a new instance of the given element
GameBase.UI.CreateElement = function( name, parent ) {
	//var bases = this.GetElementBaseList( name );
	var newitem = [];
	/*
	for ( name in bases ) {
		var base = new this.Vars.Types[bases[name]]();
		Object.assign( newitem, base );
	}
	*/
	print(name)
	newitem = new this.Vars.Types[name]();

	if ( parent != null ) {
		parent.AddChild( newitem );
		newitem.Parent = parent;
	} else {
		this.ParentToBase( newitem )
	}
	newitem.Init();
	return newitem;
}
// Parents a panel to the base game
GameBase.UI.ParentToBase = function( item ) {
	if ( item.GetParent() != null ) {
		item.GetParent().RemoveChild( item );
	}
	this.Vars.Panels.unshift( item );
}
// Removes a panel from the base game
GameBase.UI.UnparentFromBase = function( item ) {
	this.RemoveFromTable( this.Vars.Panels, item );
	this.OnPanelDeath( item );
}
// Called by a panel when it dies :(
GameBase.UI.OnPanelDeath = function( panel ) {
	if ( this.Vars.Focused == panel ) {
		this.Vars.Focused = null;
	}
	if ( this.Vars.Selected[1] == panel ) {
		this.Vars.Selected = [0,null];
	}
	for ( button in this.Vars.MousePressed ) {
		var data = this.Vars.MousePressed[button];
		if ( data == panel ) {
			this.Vars.MousePressed[button] = null;
		}
	}
}
// Called when the mouse is pressed
// Returns false if no item is clicked
GameBase.UI.OnMousePressed = function( x, y, button ) {
	for ( k in this.Vars.Panels ) {
		var v = this.Vars.Panels[k];
		var vx = v.GetPosX();
		var vy = v.GetPosY();
		var vw = v.GetWidth();
		var vh = v.GetHeight();
		if ( x>=vx && x<=vx+vw && y>=vy && y<=vy+vh ) {
			if ( this.Vars.Focused != v && this.Vars.Focused != null ) {
				this.Vars.Focused._OnFocusLost();
			}
			this.Vars.Focused = v;
			v._OnMousePressed( x-vx, y-vy, button );
			if ( this.Vars.Selected[0] == 0 ) {
				this.Vars.Selected = [ button, v ];
			}
			this.Vars.MousePressed[button] = v;
			return true;
		}
	}
	if ( this.Vars.Focused != null ) {
		this.Vars.Focused._OnFocusLost();
	}
	this.Vars.Focused = null;
	return false;
}
// Called when the mouse button is released
GameBase.UI.OnMouseReleased = function( x, y, button ) {
	if ( this.Vars.MousePressed[button] != null ) {
		var v = this.Vars.MousePressed[button];
		var vx = v.GetPosX();
		var vy = v.GetPosY();
		v._OnMouseReleased( x-vx, y-vy, button );
		this.Vars.MousePressed[button] = null;
		if ( this.Vars.Selected[0] == button ) {
			this.Vars.Selected = [0,null];
		}
		this.CalculateHover( x, y );
		return true;
	}
	return false;
}
// Called when the mouse is dragged with a button down
GameBase.UI.OnMouseMoved = function( x, y, dx, dy, focused ) {
	if ( this.Vars.Selected[0] != 0 ) {
		var v = this.Vars.Selected[1];
		var vx = v.GetPosX();
		var vy = v.GetPosY();
		v._OnMouseDragged( x-vx, y-vy, this.Vars.Selected[0] );
		return true;
	} else {
		var found = this.CalculateHover( x, y );
		if ( found == false && this.Vars.Hovered != null ) {
			this.Vars.Hovered._OnMouseLeave();
			this.Vars.Hovered = null;
		}
	}
}
// Calculates which panel is being hovered over
GameBase.UI.CalculateHover = function( x, y ) {
	var found = false;
	for ( k in this.Vars.Panels ) {
		var v = this.Vars.Panels[k];
		var vx = v.GetPosX();
		var vy = v.GetPosY();
		var vw = v.GetWidth();
		var vh = v.GetHeight();
		if ( x>=vx && x<=vx+vw && y>=vy && y<=vy+vh ) {
			if ( this.Vars.Hovered != v ) {
				if ( this.Vars.Hovered != null ) {
					this.Vars.Hovered._OnMouseLeave();
				}
				v._OnMouseEnter( x-vx, y-vy );
			} else {
				v._OnMouseMoved( x-vx, y-vy );
			}
			this.Vars.Hovered = v;
			found = true;
			return true
		}
	}
	return false;
}
// Called when a button is pressed
GameBase.UI.OnKeyPressed = function( key ) {
	if ( this.Vars.Focused != null ) {
		this.Vars.Focused._OnKeyPressed( key );
		return true;
	}
	return false;
}
// Called when a button is repeated
GameBase.UI.OnKeyRepeat = function( key ) {
	if ( this.Vars.Focused != null ) {
		this.Vars.Focused._OnKeyRepeat( key );
		return true;
	}
	return false;
}
// Called when a button is released
GameBase.UI.OnKeyReleased = function( key ) {
	if ( this.Vars.Focused != null ) {
		this.Vars.Focused._OnKeyReleased( key );
		return true;
	}
	return false;
}
// Called every tick
GameBase.UI.Think = function() {
	var panels = this.Vars.Panels.slice().reverse();
	for ( k in panels ) {
		var v = panels[k];
		v._Think();
	}
}
// Called every frame - draws the UI
GameBase.UI.Draw = function() {
	this.ResetDrawLayer();
	var panels = this.Vars.Panels.slice().reverse();
	for ( k in panels ) {
		var v = panels[k];
		_r.push(); // Pointless
		v._Draw();
		_r.pop(); // Pointless
	}
	this.DrawCursor();
}
// Register sa cursor
GameBase.UI.RegisterCursor = function( name, texture ) {
	this.Cursors[name] = texture;
}
// Draws the cursor (if enabled)
GameBase.UI.DrawCursor = function() {
	if ( this.Vars.DrawCursor ) {
		this.IncDrawLayer();
		var pos = GameBase.GetCursorPos();
		_r.color( 1, 1, 1, 1 );
		var hovered = this.GetHoveredPanel();
		if ( hovered != null ) {
			if ( this.Cursors[hovered.GetCursor()] !== undefined ) {
				_r.rect( pos[0]-25, pos[1]-25, 50, 50, this.Cursors[hovered.GetCursor()] );
			} else {
				_r.rect( pos[0]-25, pos[1]-25, 50, 50, this.Cursors["pointer"] );
			}
		} else if ( this.Cursors[this.Vars.Cursor] !== undefined ) {
			_r.rect( pos[0]-25, pos[1]-25, 50, 50, this.Cursors[this.Vars.Cursor] );
		} else {
			_r.rect( pos[0]-25, pos[1]-25, 50, 50, this.Cursors["pointer"] );
		}
	}
}
// Returns the "world" location of a panel relative to the screen
GameBase.UI.GetScreenPos = function( panel ) {
	if ( panel.GetParent() == null ) {
		var x = panel.GetPosX();
		var y = panel.GetPosY();
		return [x, y];
	} else {
		var x = panel.GetPosX();
		var y = panel.GetPosY();
		var npos = this.GetScreenPos( panel.GetParent() );
		return [x+npos[0], y+npos[1]];
	}
}
// Returns the local cursor pos on that panel
GameBase.UI.GetLocalCursorPos = function( panel ) {
	var panel_pos = this.GetScreenPos( panel );
	var cursor_pos = GameBase.GetCursorPos();
	return [cursor_pos[0]-panel_pos[0], cursor_pos[1]-panel_pos[1]];
}

//\\
// Removes an item from a table
GameBase.UI.RemoveFromTable = function( table, val ) {
	for ( key in table ) {
		var value = table[key];
		if ( value == val ) {
			delete table[key];
		}
	}
	return table;
}
// Merges 2 tables
GameBase.UI.MergeBases = function( dest, source ) {
	for ( key in source ) {
		var item = source[key];
		if ( ( typeof item === "object" ) && ( typeof dest[key] === "object" ) ) {
			dest[key] = this.MergeTables( dest[key], item );
		} else {
			dest[key] = item;
		}
	}
	return dest;
}
// Returns the list of bases for the given element
GameBase.UI.GetElementBaseList = function( name, current ) {
	if ( current == null ) {
		current = [];
		current.push( name );
	}
	if ( this.Vars.Types[name].Base == null ) {
		return current.reverse();
	} else {
		current.push( this.Vars.Types[name].Base )
		return this.GetElementBaseList( this.Vars.Types[name].Base, current )
	}
}
// Returns the currently hovered panel
GameBase.UI.GetHoveredPanel = function() {
	if ( this.Vars.Hovered != null ) {
		var lastpanel = this.Vars.Hovered;
		while ( lastpanel.Hovered != null ) {
			lastpanel = lastpanel.Hovered;
		}
		return lastpanel
	} else {
		return null;
	}
}
