// DO NOT EDIT THIS FILE
// This file hooks all the default functions and passes them to the GameBase system.
// This allows the UI system to work.
// WRITE YOUR GAME CODE IN THE "your_game.js" FILE!
// To use these functions, use:
// GameBase.Hooks.Add( "function_name", "unique_id", callback );
// Note: All function names are the same but must start with a capital.
// e.g. "think" becomes "Think", "onMousePressed" becomes "OnMousePressed" etc.

// Initialisation function
function init() {
	GameBase.Init();
}

// Think function hook-in
function think( time, dt ) {
	GameBase.Think( time, dt );
}

// Draw function
function draw() {
	GameBase.Draw();
}

// OnMousePressed function
function onMousePressed( x, y, button, focused ) {
	GameBase.OnMousePressed( x, y, button, focused );
}

// OnMouseReleased function
function onMouseReleased( x, y, button, focused ) {
	GameBase.OnMouseReleased( x, y, button );
}

// OnMouseMoved function
function onMouseMoved( x, y, dx, dy, focused ) {
	GameBase.OnMouseMoved( x, y, dx, dy, focused );
}

// OnKeyPressed function
function onKeyPressed( keycode ) {
	GameBase.OnKeyPressed( keycode );
}

// OnKeyReleased function
function onKeyReleased( keycode ) {
	GameBase.OnKeyReleased( keycode );
}

// OnKeyRepeat function
function onKeyRepeat( keycode ) {
	GameBase.OnKeyRepeat( keycode );
}

// OnFocusGained function
function onFocusGained( element ) {
	GameBase.OnFocusGained( element );
}

// OnFocusLost function
function onFocusLost( element ) {
	GameBase.OnFocusLost( element );
}
