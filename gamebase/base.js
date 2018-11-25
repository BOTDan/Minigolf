// GameBase Module
// Created by BOT Dan
// Originally made in lua, which is why the syntax is odd.
GameBase = [];

// Variables
GameBase.Time = 0;
GameBase.CursorPos = [];
GameBase.CursorPos.x = 0;
GameBase.CursorPos.y = 0;
GameBase.HasFocus = true;
GameBase.KeysDown = [];

// Returns the time since the game started
GameBase.GetTime = function() {
	return this.Time;
}

// Returns if the game has focus
GameBase.GetFocus = function() {
	return this.HasFocus;
}

// Returns the width of the screen
GameBase.GetScrW = function() {
	return _m.width;
}

// Returns the height of the screen
GameBase.GetScrH = function() {
	return _m.height;
}

// Returns the cursors current position
GameBase.GetCursorPos = function() {
	return [this.CursorPos.x, this.CursorPos.y];
}

// Returns a key by it's written value from its numeric one
// Stolen from Zak's "jstest" project
// DANGER OF KEY OVERLOAD
GameBase.GetKey = function( value ) {
	return Object.keys(keys).find(key => keys[key] === value);
}

// Returns a number for a given string key
GameBase.GetKeyCode = function( code ) {
	return (keys[code] != undefined) ? keys[code] : undefined;
}

// Returns if a key is currently being pressed
GameBase.IsKeyDown = function( key ) {
	if ( typeof key == "string" ) {
		key = GameBase.GetKeyCode( key );
	}
	if ( key != undefined ) {
		if ( this.KeysDown[key] ) {
			return true;
		}
	}
	return false;
}


// Initialise function
GameBase.Init = function() {
	this.Hooks.Call( "Init" );
}

// Think function
GameBase.Think = function( time, dt ) {
	this.Time += dt;
	this.UI.Think();
	this.Hooks.Call( "Think", this.Time, dt );
}

// Draw function
GameBase.Draw = function() {
	this.UI.Draw();
	this.Hooks.Call( "Draw" );
}

// OnMouseMoved function
GameBase.OnMouseMoved = function( x, y, dx, dy, focused ) {
	this.CursorPos.x = x;
	this.CursorPos.y = y;
	var result = this.UI.OnMouseMoved( x, y, dx, dy, focused );
	this.Hooks.Call( "OnMouseMoved", x, y, dx, dy, focused );
}

// OnMousePressed function
GameBase.OnMousePressed = function( x, y, button, focused ) {
	var result = this.UI.OnMousePressed( x, y, button+1, focused );
	this.Hooks.Call( "OnMousePressed", x, y, button );
}

// OnMouseReleased function
GameBase.OnMouseReleased = function( x, y, button, focused ) {
	var result = this.UI.OnMouseReleased( x, y, button+1, focused );
	this.Hooks.Call( "OnMouseReleased", x, y, button );
}

// OnKeyPressed function
GameBase.OnKeyPressed = function( key ) {
	if ( key == 53 ) {
		this.Console.ToggleConsole();
	}
	this.KeysDown[key] = true;
	var result = this.UI.OnKeyPressed( key );
	this.Hooks.Call( "OnKeyPressed", key );
}

// OnKeyReleased function
GameBase.OnKeyReleased = function( key ) {
	if ( key == 53 ) {
		return
	}
	this.KeysDown[key] = false;
	var result = this.UI.OnKeyReleased( key );
	this.Hooks.Call( "OnKeyReleased", key );
}

// OnKeyRepeat function
GameBase.OnKeyRepeat = function( key ) {
	if ( key == 53 ) {
		return
	}
	var result = this.UI.OnKeyRepeat( key );
	this.Hooks.Call( "OnKeyRepeat", key );
}

// OnFocusGained function
GameBase.OnFocusGained = function( element ) {
	this.HasFocus = true;
	this.Hooks.Call( "OnFocusGained", element );
}

// OnFocusLost function
GameBase.OnFocusLost = function( element ) {
	this.HasFocus = false;
	this.Hooks.Call( "OnFocusLost", element );
}
