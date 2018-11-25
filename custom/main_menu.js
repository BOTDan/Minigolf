MAIN_MENU = {};

// Store the UI
MAIN_MENU.UI = {}

// Create the main menu
MAIN_MENU.CreateUI = function() {
	// The Whole Window
	this.UI = GameBase.UI.CreateElement( "base" );
	this.UI.SetPos( 0, 0 );
	this.UI.SetSize( GameBase.GetScrW(), GameBase.GetScrH() );
	this.UI.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		// Sly
		_r.color( 1, 1, 1, 1 );
		_r.rect( 0, 0, w, h, assets["altitude_sky.tex"] );

		// Trees
		var pos = GameBase.UI.GetLocalCursorPos( this );
		var x_offset = pos[0]/w;

		GameBase.UI.IncDrawLayer();
		_r.color( 68/255, 115/255, 153/255, 1 );
		_r.rect( 0, h-310, 1280, 207, assets["altitude_trees.tex"], x_offset*0.05+0.1, 0, 1+x_offset*0.05+0.1, 1 ) //0.8

		GameBase.UI.IncDrawLayer();
		_r.color( 57/255, 98/255, 131/255, 1 );
		_r.rect( 0, h-280, 1280, 207, assets["altitude_trees.tex"], x_offset*0.075-0.2, 0, 1+x_offset*0.075-0.2, 1 ) //0.85

		GameBase.UI.IncDrawLayer();
		_r.color( 45/255, 78/255, 105/255, 1 );
		_r.rect( 0, h-245, 1280, 207, assets["altitude_trees.tex"], x_offset*0.1+0.4, 0, 1+x_offset*0.1+0.4, 1 ) //0.9

		GameBase.UI.IncDrawLayer();
		_r.color( 32/255, 60/255, 83/255, 1 );
		_r.rect( 0, h-207, 1280, 207, assets["altitude_trees.tex"], x_offset*0.125-0.5, 0, 1+x_offset*0.125-0.5, 1 )

		// Splash
		GameBase.UI.IncDrawLayer();
		_r.color( 1, 1, 1, 1 );
		_r.rect( (w/2)-(400), (h/2)-(300), 400*2, 300*2, assets["ui_splash.tex"] );


	}

}

MAIN_MENU.CreateUI();
