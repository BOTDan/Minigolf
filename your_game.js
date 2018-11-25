// Write your game code here

/*
GameBase.Hooks.Add( "think", "test_think_hook", function( time ) {
	print("time");
});
*/


// Window Header
var top_panel = GameBase.UI.CreateElement( "base" );
top_panel.SetPos( 0, 0 );
top_panel.SetSize( GameBase.GetScrW(), 20 );
top_panel.Draw = function() {
	var w = this.GetWidth();
	var h = this.GetHeight();

	_r.color( 1, 1, 1, 1 );
	_r.rect( 0, 0, w, h );

	_r.color( 0, 0, 0, 1 );
	GameBase.UI.IncDrawLayer();
	GameBase.Text.SetFont( "Mplus1m Bold" );
	GameBase.Text.SetSize( 14 );
	GameBase.Text.DrawText( 5, h/2, "Minigolf - Level Editor", 0, 1 );
}

// Window Header Close Button
var top_panel_close = GameBase.UI.CreateElement( "button", top_panel );
top_panel_close.SetPos( top_panel.GetWidth()-50, 0 );
top_panel_close.SetSize( 50, 20 );
top_panel_close.Draw = function() {
	var w = this.GetWidth();
	var h = this.GetHeight();

	if ( this.IsHovered() ) {
		_r.color( 1, 0, 0, 1 );
		_r.rect( 0, 0, w, h );
		_r.color( 1, 1, 1, 1 );
		GameBase.Text.SetFont( "Mplus1m SemiBold" );
		GameBase.Text.SetSize( 14 );
		GameBase.Text.DrawText( w/2, h/2, "X", 1, 1 );
	} else {
		_r.color( 1, 1, 1, 1 );
		_r.rect( 0, 0, w, h );
		_r.color( 0, 0, 0, 1 );
		GameBase.Text.SetFont( "Mplus1m SemiBold" );
		GameBase.Text.SetSize( 14 );
		GameBase.Text.DrawText( w/2, h/2, "X", 1, 1 );
	}
}

// Toolbar Header
var options_panel = GameBase.UI.CreateElement( "base" );
options_panel.SetPos( 0, 20 );
options_panel.SetSize( GameBase.GetScrW(), 20 );
// Toolbar - File
var options_file = GameBase.UI.CreateElement( "button", options_panel );
options_file.SetPos( 0, 0 );
options_file.SetSize( 50, 20 );
options_file.SetText( "File" );
options_file.SetTextSize( 12 );
// Toolbar - Edit
var options_edit = GameBase.UI.CreateElement( "button", options_panel );
options_edit.SetPos( 50, 0 );
options_edit.SetSize( 50, 20 );
options_edit.SetText( "Edit" );
options_edit.SetTextSize( 12 );

// Toolbar Header
var quick_panel = GameBase.UI.CreateElement( "base" );
quick_panel.SetPos( 0, 40 );
quick_panel.SetSize( GameBase.GetScrW(), 60 );
quick_panel.Draw = function() {
	var w = this.GetWidth();
	var h = this.GetHeight();

	_r.color( 0.9, 0.9, 0.9, 1 );
	_r.rect( 0, 0, w, h );
}

// Width Panel
var width_box = GameBase.UI.CreateElement( "base", quick_panel );
width_box.SetPos( 5, 5 );
width_box.SetSize( 100, 50 );
width_box.Draw = function() {
	var w = this.GetWidth();
	var h = this.GetHeight();

	_r.color( 1, 1, 1, 1 );
	_r.rect( 0, 0, w, h );

	_r.color( 0.5, 0.5, 0.5, 1 );
	_r.rect( 0, 0, w, 20 );
	_r.rect( 0, h-1, w, 1 );
	_r.rect( 0, 1, 1, h-2 );
	_r.rect( w-1, 1, 1, h-2 );

	GameBase.UI.IncDrawLayer();
	_r.color( 1, 1, 1, 1 );
	GameBase.Text.SetFont( "Mplus1m Bold" );
	GameBase.Text.SetSize( 14 );
	GameBase.Text.DrawText( w/2, 10, "WIDTH", 1, 1 );
}
// Width Number Entry
var width_entry = GameBase.UI.CreateElement( "numentry", width_box );
width_entry.SetPos( 1, 20 );
width_entry.SetSize( 98, 29 );
width_entry.SetMinValue( 10 );
width_entry.SetMaxValue( 100 );
width_entry.SetIncrement( 10 );
width_entry.SetForceIncrement( true );

// Width Panel
var height_box = GameBase.UI.CreateElement( "base", quick_panel );
height_box.SetPos( 110, 5 );
height_box.SetSize( 100, 50 );
height_box.Draw = function() {
	var w = this.GetWidth();
	var h = this.GetHeight();

	_r.color( 1, 1, 1, 1 );
	_r.rect( 0, 0, w, h );

	_r.color( 0.5, 0.5, 0.5, 1 );
	_r.rect( 0, 0, w, 20 );
	_r.rect( 0, h-1, w, 1 );
	_r.rect( 0, 1, 1, h-2 );
	_r.rect( w-1, 1, 1, h-2 );

	GameBase.UI.IncDrawLayer();
	_r.color( 1, 1, 1, 1 );
	GameBase.Text.SetFont( "Mplus1m Bold" );
	GameBase.Text.SetSize( 14 );
	GameBase.Text.DrawText( w/2, 10, "HEIGHT", 1, 1 );
}
// Width Number Entry
var height_entry = GameBase.UI.CreateElement( "numentry", height_box );
height_entry.SetPos( 1, 20 );
height_entry.SetSize( 98, 29 );
height_entry.SetMinValue( 10 );
height_entry.SetMaxValue( 10 );
height_entry.SetIncrement( 10 );
height_entry.SetForceIncrement( true );

// Width Panel
var rotation_box = GameBase.UI.CreateElement( "base", quick_panel );
rotation_box.SetPos( 215, 5 );
rotation_box.SetSize( 100, 50 );
rotation_box.Draw = function() {
	var w = this.GetWidth();
	var h = this.GetHeight();

	_r.color( 1, 1, 1, 1 );
	_r.rect( 0, 0, w, h );

	_r.color( 0.5, 0.5, 0.5, 1 );
	_r.rect( 0, 0, w, 20 );
	_r.rect( 0, h-1, w, 1 );
	_r.rect( 0, 1, 1, h-2 );
	_r.rect( w-1, 1, 1, h-2 );

	GameBase.UI.IncDrawLayer();
	_r.color( 1, 1, 1, 1 );
	GameBase.Text.SetFont( "Mplus1m Bold" );
	GameBase.Text.SetSize( 14 );
	GameBase.Text.DrawText( w/2, 10, "ROTATION", 1, 1 );
}
// Width Number Entry
var rotation_entry = GameBase.UI.CreateElement( "numentry", rotation_box );
rotation_entry.SetPos( 1, 20 );
rotation_entry.SetSize( 98, 29 );
rotation_entry.SetMinValue( 0 );
rotation_entry.SetMaxValue( 360 );
rotation_entry.SetIncrement( 5 );
rotation_entry.SetForceIncrement( true );

// Width Panel
var relative_box = GameBase.UI.CreateElement( "base", quick_panel );
relative_box.SetPos( 320, 5 );
relative_box.SetSize( 160, 50 );
relative_box.Draw = function() {
	var w = this.GetWidth();
	var h = this.GetHeight();

	_r.color( 1, 1, 1, 1 );
	_r.rect( 0, 0, w, h );

	_r.color( 0.5, 0.5, 0.5, 1 );
	_r.rect( 0, 0, w, 20 );
	_r.rect( 0, h-1, w, 1 );
	_r.rect( 0, 1, 1, h-2 );
	_r.rect( w-1, 1, 1, h-2 );

	GameBase.UI.IncDrawLayer();
	_r.color( 1, 1, 1, 1 );
	GameBase.Text.SetFont( "Mplus1m Bold" );
	GameBase.Text.SetSize( 14 );
	GameBase.Text.DrawText( w/2, 10, "ORIENTATION", 1, 1 );
}
// Width Number Entry
var relative_entry = GameBase.UI.CreateElement( "dropdown", relative_box );
relative_entry.SetPos( 1, 20 );
relative_entry.SetSize( 158, 29 );
relative_entry.AddOption( "Top Left", 1 );
relative_entry.AddOption( "Top Right", 2 );
relative_entry.AddOption( "Bottom Left", 3 );
relative_entry.AddOption( "Bottom Right", 4 );

// Left panel
var left_panel = GameBase.UI.CreateElement( "base" );
left_panel.SetPos( 0, 100 );
left_panel.SetSize( 50, GameBase.GetScrH()-100 );
left_panel.Draw = function() {
	var w = this.GetWidth();
	var h = this.GetHeight();

	_r.color( 0.9, 0.9, 0.9, 1 );
	_r.rect( 0, 0, w, h );
}
// Type selector
var type_box = GameBase.UI.CreateElement( "base", left_panel );
type_box.SetPos( 5, 5 );
type_box.SetSize( 40, 130 );
type_box.Draw = function() {
	var w = this.GetWidth();
	var h = this.GetHeight();

	_r.color( 1, 1, 1, 1 );
	_r.rect( 0, 0, w, h );

	_r.color( 0.5, 0.5, 0.5, 1 );
	_r.rect( 0, 0, w, 20 );
	_r.rect( 0, h-1, w, 1 );
	_r.rect( 0, 1, 1, h-2 );
	_r.rect( w-1, 1, 1, h-2 );

	GameBase.UI.IncDrawLayer();
	_r.color( 1, 1, 1, 1 );
	GameBase.Text.SetFont( "Mplus1m Bold" );
	GameBase.Text.SetSize( 14 );
	GameBase.Text.DrawText( w/2, 10, "TYPE", 1, 1 );
}

// Grass button
var left_button_grass = GameBase.UI.CreateElement( "button", type_box );
left_button_grass.SetPos( 5, 25 );
left_button_grass.SetSize( 30, 30 );
left_button_grass.OldDraw = left_button_grass.Draw;
left_button_grass.Draw = function() {
	this.OldDraw();

	var w = this.GetWidth();
	var h = this.GetHeight();

	_r.color( 0.1, 0.4, 1, 1 );
	_r.rect( 0, 0, w, 1 );
	_r.rect( 0, h-1, w, 1 );
	_r.rect( 0, 1, 1, h-2 );
	_r.rect( w-1, 1, 1, h-2 );

	GameBase.UI.IncDrawLayer();
	_r.color( 1, 1, 1, 1 );
	_r.rect( 5, 5, 20, 20, assets["custom_grass.tex"] );
}
// Grass button
var left_button_grass = GameBase.UI.CreateElement( "button", type_box );
left_button_grass.SetPos( 5, 60 );
left_button_grass.SetSize( 30, 30 );
left_button_grass.OldDraw = left_button_grass.Draw;
left_button_grass.Draw = function() {
	this.OldDraw();

	GameBase.UI.IncDrawLayer();
	_r.color( 1, 1, 1, 1 );
	_r.rect( 5, 5, 20, 20, assets["custom_block.tex"] );
}
// Grass button
var left_button_grass = GameBase.UI.CreateElement( "button", type_box );
left_button_grass.SetPos( 5, 95 );
left_button_grass.SetSize( 30, 30 );
left_button_grass.OldDraw = left_button_grass.Draw;
left_button_grass.Draw = function() {
	this.OldDraw();

	GameBase.UI.IncDrawLayer();
	_r.color( 1, 1, 1, 1 );
	_r.rect( 5, 5, 20, 20, assets["custom_placeholder.tex"] );
}

// Main Edit Panel
var editor = GameBase.UI.CreateElement( "base" );
editor.SetPos( 50, 100 );
editor.SetSize( GameBase.GetScrW()-50, GameBase.GetScrH()-100 );
editor.XOffset = 0;
editor.YOffset = 0;
editor.StartXOffset = 0;
editor.StartYOffset = 0;
editor.DragPosX = 0;
editor.DragPosY = 0;
editor.OnMousePressed = function( x, y, button ) {
	if ( button == 2 ) {
		this.DragPosX = x;
		this.DragPosY = y;
		this.StartXOffset = this.XOffset;
		this.StartYOffset = this.YOffset;
	}
}
editor.OnMouseDragged = function( x, y, button ) {
	if ( button == 2 ) {
		this.XOffset = this.StartXOffset + this.DragPosX - x;
		this.YOffset = this.StartYOffset + this.DragPosY - y;
	}
}
editor.Draw = function() {
	var w = this.GetWidth();
	var h = this.GetHeight();

	// Draw the background
	_r.color( 0.2, 0.2, 0.2, 1 );
	_r.rect( 0, 0, w, h );

	// Grey lines
	_r.color( 0.3, 0.3, 0.3, 1 );
	for ( var i = 0; i <= Math.floor(w/50); i++ ) {
		_r.rect( ((w/2)-(Math.floor(w/50)/2*50))+(i*50)-(this.XOffset%50), 0, 1, h );
	}
	for ( var i = 0; i <= Math.floor(h/50); i++ ) {
		_r.rect( 0, ((h/2)-(Math.floor(h/50)/2*50))+(i*50)-(this.YOffset%50), w, 1 );
	}

	// Yellow lines
	_r.color( 1, 1, 0, 1 );
	_r.rect( (w/2)-1-this.XOffset, 0, 2, h );
	_r.rect( 0, (h/2)-1-this.YOffset, w, 2 );


}
