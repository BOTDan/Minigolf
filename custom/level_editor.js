LEVEL_EDITOR = {};
LEVEL_EDITOR.Physics = Box2D();
LEVEL_EDITOR.Collisions = [];
LEVEL_EDITOR.WorldScale = 25; // Don't use pixel values otherwise you will be murdered by the creator of Box2D.
LEVEL_EDITOR.Ball = false;
LEVEL_EDITOR.World = false;
LEVEL_EDITOR.IsTesting = false;
LEVEL_EDITOR.RunningLevel = false;
LEVEL_EDITOR.Power = 0;
LEVEL_EDITOR.MaxPower = 90;
LEVEL_EDITOR.Hits = 0;
LEVEL_EDITOR.LockCameraToBall = false;
LEVEL_EDITOR.CameraPoints = [];
LEVEL_EDITOR.SelectedCamera = false;
LEVEL_EDITOR.SelectedCameraStartPos = [ 0, 0 ];
LEVEL_EDITOR.SelectedCameraJustCreated = false;
LEVEL_EDITOR.FlyOver = false;
LEVEL_EDITOR.FlyOverStart = 0;
LEVEL_EDITOR.FlyOverLengths = [];
LEVEL_EDITOR.Selection = [];
LEVEL_EDITOR.Settings = {};
LEVEL_EDITOR.Settings.Mode = "pointer";
LEVEL_EDITOR.Settings.Size = {};
LEVEL_EDITOR.Settings.Size.w = 10;
LEVEL_EDITOR.Settings.Size.h = 10;
LEVEL_EDITOR.Settings.Rotation = 0;
LEVEL_EDITOR.Settings.Orientation = 1;
LEVEL_EDITOR.Settings.Material = "grass";
LEVEL_EDITOR.Settings.BlockSnap = true;
LEVEL_EDITOR.Settings.GridSnap = true;
LEVEL_EDITOR.Materials = [];
LEVEL_EDITOR.Materials["grass"] = { mat: assets["custom_grass.tex"], width: [ 10, 100, 10 ], height: [ 10, 10, 0 ], order: 1 };
LEVEL_EDITOR.Materials["hole"] = { mat: assets["custom_hole.tex"], width: [ 10, 10, 0 ], height: [ 10, 10, 0 ], order: 1 };
LEVEL_EDITOR.Materials["block"] = { mat: assets["custom_block.tex"], width: [ 7, 7, 0 ], height: [ 7, 7, 0 ], order: 0 };
LEVEL_EDITOR.Materials["placeholder"] = { mat: assets["custom_placeholder.tex"], width: [ 10, 100, 10 ], height: [ 10, 100, 10 ], order: 0 };
LEVEL_EDITOR.Materials["func_push"] = { mat: assets["custom_trigger_push.tex"], width: [ 5, 100, 5 ], height: [ 5, 100, 5 ], order: 0 };
LEVEL_EDITOR.Materials["func_move"] = { mat: assets["custom_entity.tex"], width: [ 5, 100, 5 ], height: [ 5, 100, 5 ], order: 0 };
LEVEL_EDITOR.LevelSettings = [];
LEVEL_EDITOR.LevelSettings.Name = "";
LEVEL_EDITOR.LevelSettings.Par = 1;
LEVEL_EDITOR.Notifications = []; // type, start, duration, text
LEVEL_EDITOR.Undos = [];
LEVEL_EDITOR.Redos = [];
LEVEL_EDITOR.Level = [];

// Create Score Number font
// Registers a font
GameBase.Text.RegisterFont( "minigolf_score", {
	Texture: assets["ui_font_scores.tex"],
	TextureW: 200,
	TextureH: 20,
	CharW: 20,
	CharH: 20,
	Charset: "0123456789"
} )

LEVEL_EDITOR.UI = {};

function DumpObject(obj)
{
  var od = new Object;
  var result = "";
  var len = 0;

  for (var property in obj)
  {
    var value = obj[property];
    if (typeof value == 'string')
      value = "'" + value + "'";
    else if (typeof value == 'object')
    {
      if (value instanceof Array)
      {
        value = "[ " + value + " ]";
      }
      else
      {
        var ood = DumpObject(value);
        value = "{ " + ood.dump + " }";
      }
    }
    result += "'" + property + "' : " + value + ", ";
    len++;
  }
  od.dump = result.replace(/, $/, "");
  od.len = len;

  return od;
}

LEVEL_EDITOR.CreateUI = function() {
	// The Whole Window
	this.UI = GameBase.UI.CreateElement( "base" );
	this.UI.SetPos( 0, 0 );
	this.UI.SetSize( GameBase.GetScrW(), GameBase.GetScrH() );

	LEVEL_EDITOR.Log( "    Creating Topbar..." );
	// Top Bar
	this.UI.TopBar = GameBase.UI.CreateElement( "base", this.UI );
	this.UI.TopBar.SetPos( 0, 0 );
	this.UI.TopBar.SetSize( this.UI.GetWidth(), 20 );
	this.UI.TopBar.Draw = function() {
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
	// Top Bar - Close Button
	this.UI.TopBar.Close = GameBase.UI.CreateElement( "button", this.UI.TopBar );
	this.UI.TopBar.Close.SetPos( this.UI.GetWidth()-50, 0 );
	this.UI.TopBar.Close.SetSize( 50, 20 );
	this.UI.TopBar.Close.OnClicked = function() {
		LEVEL_EDITOR.UI.Remove();
	}
	this.UI.TopBar.Close.Draw = function() {
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

	LEVEL_EDITOR.Log( "    Creating Options bar..." );
	// Options Bar
	this.UI.OptionsBar = GameBase.UI.CreateElement( "base", this.UI );
	this.UI.OptionsBar.SetPos( 0, 20 );
	this.UI.OptionsBar.SetSize( this.UI.GetWidth(), 20 );
	// Options Bar - File
	this.UI.OptionsBar.File = GameBase.UI.CreateElement( "button", this.UI.OptionsBar );
	this.UI.OptionsBar.File.Dropdown = null;
	this.UI.OptionsBar.File.Options = [];
	this.UI.OptionsBar.File.Options.push( { text: "Run Level...", code: "run", texture: assets["icon_tick.tex"] } );
	this.UI.OptionsBar.File.Options.push( { text: "Level Settings", code: "settings", texture: assets["icon_settings.tex"] } );
	this.UI.OptionsBar.File.SetPos( 0, 0 );
	this.UI.OptionsBar.File.SetSize( 50, 20 );
	this.UI.OptionsBar.File.SetText( "File" );
	this.UI.OptionsBar.File.SetTextSize( 12 );
	this.UI.OptionsBar.File.OnTopmostDeath = function() {
		this.Dropdown = null;
	}
	this.UI.OptionsBar.File.OnClicked = function( x, y, button ) {
		if ( button == 1 ) {
			if ( this.Dropdown != null ) {
				this.Dropdown.Remove();
			}
			this.CreateDropdown();
		}
	}
	this.UI.OptionsBar.File.CreateDropdown = function() {
		if ( this.Dropdown == null ) {
			this.Dropdown = GameBase.UI.CreateElement( "topmost" );
			var pos = GameBase.UI.GetScreenPos( this );
			var h = this.GetHeight();
			this.Dropdown.SetPos( pos[0], pos[1]+h );
			this.Dropdown.SetWidth( 150 )
			this.Dropdown.SetTextSize( 12 );
			for ( k in this.Options ) {
				var v = this.Options[k];
				this.Dropdown.AddOption( v.text, v.code, v.texture );
			}
			this.Dropdown.Display();
			var dropdown = this;
			this.Dropdown.OnRemove = function() { dropdown.OnTopmostDeath() };
			this.Dropdown.Callback = function( code, name ) { dropdown.OnOptionChosen( code, name ) };
		}
	}
	this.UI.OptionsBar.File.OnOptionChosen = function( code, name ) {
		if ( code == "run" ) {
			print("build level")
			LEVEL_EDITOR.RunningLevel = true;
			LEVEL_EDITOR.Hits = 0;
			LEVEL_EDITOR.UI.Editor.UpdateOverlay( "playtest" );
			LEVEL_EDITOR.BuildLevel();
		} else if ( code == "settings" ) {
			LEVEL_EDITOR.CreateSettingsUI();
		}
	}
	// Options Bar - Edit
	this.UI.OptionsBar.Edit = GameBase.UI.CreateElement( "button", this.UI.OptionsBar );
	this.UI.OptionsBar.Edit.Dropdown = null;
	this.UI.OptionsBar.Edit.Options = [];
	this.UI.OptionsBar.Edit.Options.push( { text: "Undo", code: "undo", texture: assets["icon_undo.tex"] } );
	this.UI.OptionsBar.Edit.Options.push( { text: "Redo", code: "redo", texture: assets["icon_redo.tex"] } );
	this.UI.OptionsBar.Edit.Options.push( { text: "Edit Item Settings...", code: "settings", texture: assets["icon_settings.tex"] } );
	this.UI.OptionsBar.Edit.SetPos( 50, 0 );
	this.UI.OptionsBar.Edit.SetSize( 50, 20 );
	this.UI.OptionsBar.Edit.SetText( "Edit" );
	this.UI.OptionsBar.Edit.SetTextSize( 12 );
	this.UI.OptionsBar.Edit.OnTopmostDeath = function() {
		this.Dropdown = null;
	}
	this.UI.OptionsBar.Edit.OnClicked = function( x, y, button ) {
		if ( button == 1 ) {
			if ( this.Dropdown != null ) {
				this.Dropdown.Remove();
			}
			this.CreateDropdown();
		}
	}
	this.UI.OptionsBar.Edit.CreateDropdown = function() {
		if ( this.Dropdown == null ) {
			this.Dropdown = GameBase.UI.CreateElement( "topmost" );
			var pos = GameBase.UI.GetScreenPos( this );
			var h = this.GetHeight();
			this.Dropdown.SetPos( pos[0], pos[1]+h );
			this.Dropdown.SetWidth( 150 )
			this.Dropdown.SetTextSize( 12 );
			for ( k in this.Options ) {
				var v = this.Options[k];
				this.Dropdown.AddOption( v.text, v.code, v.texture );
			}
			this.Dropdown.Display();
			var dropdown = this;
			this.Dropdown.OnRemove = function() { dropdown.OnTopmostDeath() };
			this.Dropdown.Callback = function( code, name ) { dropdown.OnOptionChosen( code, name ) };
		}
	}
	this.UI.OptionsBar.Edit.OnOptionChosen = function( code, name ) {
		if ( code == "settings" ) {
			if ( LEVEL_EDITOR.Selection.length == 1 ) {
				LEVEL_EDITOR.UI.Editor.CreateEditUI( LEVEL_EDITOR.Selection[0] )
			} else {
				if ( LEVEL_EDITOR.Selection.length < 1 ) {
					LEVEL_EDITOR.AddNotification( "error", "There is no object selected." )
				} else {
					LEVEL_EDITOR.AddNotification( "error", "There is more than 1 object selected." )
				}
			}
		} else if ( code == "undo" ) {
			LEVEL_EDITOR.Undo();
		} else if ( code == "redo" ) {
			LEVEL_EDITOR.Redo();
		}
	}

	// Options Bar - Edit
	this.UI.OptionsBar.View = GameBase.UI.CreateElement( "button", this.UI.OptionsBar );
	this.UI.OptionsBar.View.Dropdown = null;
	this.UI.OptionsBar.View.Options = [];
	this.UI.OptionsBar.View.Options.push( { text: "Go to Origin", code: "cam_center", texture: assets["icon_view.tex"] } );
	this.UI.OptionsBar.View.SetPos( 100, 0 );
	this.UI.OptionsBar.View.SetSize( 50, 20 );
	this.UI.OptionsBar.View.SetText( "View" );
	this.UI.OptionsBar.View.SetTextSize( 12 );
	this.UI.OptionsBar.View.OnTopmostDeath = function() {
		this.Dropdown = null;
	}
	this.UI.OptionsBar.View.OnClicked = function( x, y, button ) {
		if ( button == 1 ) {
			if ( this.Dropdown != null ) {
				this.Dropdown.Remove();
			}
			this.CreateDropdown();
		}
	}
	this.UI.OptionsBar.View.CreateDropdown = function() {
		if ( this.Dropdown == null ) {
			this.Dropdown = GameBase.UI.CreateElement( "topmost" );
			var pos = GameBase.UI.GetScreenPos( this );
			var h = this.GetHeight();
			this.Dropdown.SetPos( pos[0], pos[1]+h );
			this.Dropdown.SetWidth( 150 )
			this.Dropdown.SetTextSize( 12 );
			for ( k in this.Options ) {
				var v = this.Options[k];
				this.Dropdown.AddOption( v.text, v.code, v.texture );
			}
			this.Dropdown.Display();
			var dropdown = this;
			this.Dropdown.OnRemove = function() { dropdown.OnTopmostDeath() };
			this.Dropdown.Callback = function( code, name ) { dropdown.OnOptionChosen( code, name ) };
		}
	}
	this.UI.OptionsBar.View.OnOptionChosen = function( code, name ) {
		if ( code == "cam_center" ) {
			LEVEL_EDITOR.UI.Editor.XOffset = 0;
			LEVEL_EDITOR.UI.Editor.YOffset = 0;
		}
	}

	LEVEL_EDITOR.Log( "    Creating Settings bar..." );
	// Settings Bar
	this.UI.SettingsBar = GameBase.UI.CreateElement( "base", this.UI );
	this.UI.SettingsBar.SetPos( 0, 40 );
	this.UI.SettingsBar.SetSize( this.UI.GetWidth(), 60 );
	this.UI.SettingsBar.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 0.9, 0.9, 0.9, 1 );
		_r.rect( 0, 0, w, h );
	}
	// Settings Bar - Width Entry
	this.UI.SettingsBar.WidthEntry = GameBase.UI.CreateElement( "headed_numentry", this.UI.SettingsBar );
	this.UI.SettingsBar.WidthEntry.SetPos( 5, 5 );
	this.UI.SettingsBar.WidthEntry.SetSize( 100, 50 );
	this.UI.SettingsBar.WidthEntry.SetText( "WIDTH" );
	this.UI.SettingsBar.WidthEntry.Entry.SetMinValue( 10 );
	this.UI.SettingsBar.WidthEntry.Entry.SetMaxValue( 100 );
	this.UI.SettingsBar.WidthEntry.Entry.SetIncrement( 10 );
	this.UI.SettingsBar.WidthEntry.Entry.SetForceIncrement( true );
	this.UI.SettingsBar.WidthEntry.OnValueChanged = function( value ) {
		LEVEL_EDITOR.Settings.Size.w = value;
	}
	// Settings Bar - Height Entry
	this.UI.SettingsBar.HeightEntry = GameBase.UI.CreateElement( "headed_numentry", this.UI.SettingsBar );
	this.UI.SettingsBar.HeightEntry.SetPos( 110, 5 );
	this.UI.SettingsBar.HeightEntry.SetSize( 100, 50 );
	this.UI.SettingsBar.HeightEntry.SetText( "HEIGHT" );
	this.UI.SettingsBar.HeightEntry.Entry.SetMinValue( 10 );
	this.UI.SettingsBar.HeightEntry.Entry.SetMaxValue( 10 );
	this.UI.SettingsBar.HeightEntry.Entry.SetIncrement( 10 );
	this.UI.SettingsBar.HeightEntry.Entry.SetForceIncrement( true );
	this.UI.SettingsBar.HeightEntry.OnValueChanged = function( value ) {
		LEVEL_EDITOR.Settings.Size.h = value;
	}
	// Settings Bar - Rotation Entry
	this.UI.SettingsBar.RotationEntry = GameBase.UI.CreateElement( "headed_numentry", this.UI.SettingsBar );
	this.UI.SettingsBar.RotationEntry.SetPos( 215, 5 );
	this.UI.SettingsBar.RotationEntry.SetSize( 100, 50 );
	this.UI.SettingsBar.RotationEntry.SetText( "ROTATION" );
	this.UI.SettingsBar.RotationEntry.Entry.SetMinValue( 0 );
	this.UI.SettingsBar.RotationEntry.Entry.SetMaxValue( 355 );
	this.UI.SettingsBar.RotationEntry.Entry.SetIncrement( 5 );
	this.UI.SettingsBar.RotationEntry.Entry.SetForceIncrement( true );
	this.UI.SettingsBar.RotationEntry.OnValueChanged = function( value ) {
		LEVEL_EDITOR.Settings.Rotation = value;
	}
	// Settings Bar - Orientation Entry
	this.UI.SettingsBar.OrientationEntry = GameBase.UI.CreateElement( "headed_dropdown", this.UI.SettingsBar );
	this.UI.SettingsBar.OrientationEntry.SetPos( 320, 5 );
	this.UI.SettingsBar.OrientationEntry.SetSize( 160, 50 );
	this.UI.SettingsBar.OrientationEntry.SetText( "ORIENTATION" );
	this.UI.SettingsBar.OrientationEntry.Dropdown.AddOption( "Top Left", 1 );
	this.UI.SettingsBar.OrientationEntry.Dropdown.AddOption( "Top Right", 2 );
	this.UI.SettingsBar.OrientationEntry.Dropdown.AddOption( "Bottom Left", 3 );
	this.UI.SettingsBar.OrientationEntry.Dropdown.AddOption( "Bottom Right", 4 );
	this.UI.SettingsBar.OrientationEntry.OnValueChanged = function( value ) {
		print( value.code );
		LEVEL_EDITOR.Settings.Orientation = value.code;
	}
	// Settings Bar - Snap Selection
	this.UI.SettingsBar.SnapEntry = GameBase.UI.CreateElement( "headed_base", this.UI.SettingsBar );
	this.UI.SettingsBar.SnapEntry.SetPos( 485, 5 );
	this.UI.SettingsBar.SnapEntry.SetSize( 170, 50 );
	this.UI.SettingsBar.SnapEntry.SetText( "SNAP" );
	this.UI.SettingsBar.SnapEntry.Grid = GameBase.UI.CreateElement( "checkbox", this.UI.SettingsBar.SnapEntry );
	this.UI.SettingsBar.SnapEntry.Grid.SetPos( 5, 25 );
	this.UI.SettingsBar.SnapEntry.Grid.SetSize( 70, 20 );
	this.UI.SettingsBar.SnapEntry.Grid.SetText( "Grid" );
	this.UI.SettingsBar.SnapEntry.Grid.SetToggled( LEVEL_EDITOR.Settings.GridSnap );
	this.UI.SettingsBar.SnapEntry.Grid.OnValueChanged = function( value ) {
		LEVEL_EDITOR.Settings.GridSnap = value;
	}
	this.UI.SettingsBar.SnapEntry.Blocks = GameBase.UI.CreateElement( "checkbox", this.UI.SettingsBar.SnapEntry );
	this.UI.SettingsBar.SnapEntry.Blocks.SetPos( 80, 25 );
	this.UI.SettingsBar.SnapEntry.Blocks.SetSize( 85, 20 );
	this.UI.SettingsBar.SnapEntry.Blocks.SetToggled( LEVEL_EDITOR.Settings.BlockSnap );
	this.UI.SettingsBar.SnapEntry.Blocks.SetText( "Blocks" );
	this.UI.SettingsBar.SnapEntry.Blocks.OnValueChanged = function( value ) {
		LEVEL_EDITOR.Settings.BlockSnap = value;
	}

	LEVEL_EDITOR.Log( "    Creating Left bar..." );
	// Left Bar
	this.UI.LeftBar = GameBase.UI.CreateElement( "base", this.UI );
	this.UI.LeftBar.SetPos( 0, 100 );
	this.UI.LeftBar.SetSize( 50, this.UI.GetHeight()-100-20 );
	this.UI.LeftBar.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 0.9, 0.9, 0.9, 1 );
		_r.rect( 0, 0, w, h );
	}
	// Left Bar - Tool Selector
	this.UI.LeftBar.ToolEntry = GameBase.UI.CreateElement( "headed_radio", this.UI.LeftBar );
	this.UI.LeftBar.ToolEntry.SetPos( 5, 5 );
	this.UI.LeftBar.ToolEntry.SetSize( 40, 200 );
	this.UI.LeftBar.ToolEntry.SetText( "TOOL" );
	this.UI.LeftBar.ToolEntry.AddOption( "Pointer", "Used to select and move objects in the editor.", "pointer", assets["icon_cursor.tex"] );
	this.UI.LeftBar.ToolEntry.AddOption( "Block", "Used to create geometry within the level.", "block", assets["icon_block.tex"] );
	this.UI.LeftBar.ToolEntry.AddOption( "Camera", "Used to edit the fly-over camera of the level.", "camera", assets["icon_camera.tex"] );
	this.UI.LeftBar.ToolEntry.OnValueChanged = function( option ) {
		LEVEL_EDITOR.Settings.Mode = option.code;
		LEVEL_EDITOR.UI.Editor.UpdateOverlay( option.code );
	}
	// Left Bar - Material Entry
	this.UI.LeftBar.MaterialEntry = GameBase.UI.CreateElement( "headed_radio", this.UI.LeftBar );
	this.UI.LeftBar.MaterialEntry.SetPos( 5, 140 );
	this.UI.LeftBar.MaterialEntry.SetSize( 40, 200 );
	this.UI.LeftBar.MaterialEntry.SetText( "TYPE" );
	this.UI.LeftBar.MaterialEntry.AddOption( "Grass", "Main Geometry. Connects to itself nicely.", "grass", assets["custom_grass.tex"] );
	this.UI.LeftBar.MaterialEntry.AddOption( "Hole", "Where the ball should end up.", "hole", assets["custom_hole.tex"] );
	this.UI.LeftBar.MaterialEntry.AddOption( "Block", "Use at edges of the level to prevent falling off.", "block", assets["custom_block.tex"] );
	this.UI.LeftBar.MaterialEntry.AddOption( "Placeholder", "Used to help position other blocks. WILL NOT SHOW UP IN-GAME!", "placeholder", assets["custom_placeholder.tex"] );
	this.UI.LeftBar.MaterialEntry.AddOption( "Push", "Pushes the ball in the given direction.", "func_push", assets["custom_trigger_push.tex"] );
	this.UI.LeftBar.MaterialEntry.AddOption( "Move", "Creates a moving object.", "func_move", assets["custom_entity.tex"] );
	this.UI.LeftBar.MaterialEntry.OnValueChanged = function( option ) {
		LEVEL_EDITOR.Settings.Material = option.code;
		LEVEL_EDITOR.UI.SettingsBar.WidthEntry.Entry.SetValue( LEVEL_EDITOR.Materials[LEVEL_EDITOR.Settings.Material].width[0] );
		LEVEL_EDITOR.UI.SettingsBar.WidthEntry.Entry.SetMinValue( LEVEL_EDITOR.Materials[LEVEL_EDITOR.Settings.Material].width[0] );
		LEVEL_EDITOR.UI.SettingsBar.WidthEntry.Entry.SetMaxValue( LEVEL_EDITOR.Materials[LEVEL_EDITOR.Settings.Material].width[1] );
		LEVEL_EDITOR.UI.SettingsBar.WidthEntry.Entry.SetIncrement( LEVEL_EDITOR.Materials[LEVEL_EDITOR.Settings.Material].width[2] );
		LEVEL_EDITOR.UI.SettingsBar.HeightEntry.Entry.SetValue( LEVEL_EDITOR.Materials[LEVEL_EDITOR.Settings.Material].height[0] );
		LEVEL_EDITOR.UI.SettingsBar.HeightEntry.Entry.SetMinValue( LEVEL_EDITOR.Materials[LEVEL_EDITOR.Settings.Material].height[0] );
		LEVEL_EDITOR.UI.SettingsBar.HeightEntry.Entry.SetMaxValue( LEVEL_EDITOR.Materials[LEVEL_EDITOR.Settings.Material].height[1] );
		LEVEL_EDITOR.UI.SettingsBar.HeightEntry.Entry.SetIncrement( LEVEL_EDITOR.Materials[LEVEL_EDITOR.Settings.Material].height[2] );
	}

	LEVEL_EDITOR.Log( "    Creating Editor..." );
	// Main Monster
	this.UI.Editor = GameBase.UI.CreateElement( "base", this.UI );
	this.UI.Editor.SetPos( 50, 100 );
	this.UI.Editor.SetSize( this.UI.GetWidth()-50, this.UI.GetHeight()-100-20 );
	this.UI.Editor.XOffset = 0;
	this.UI.Editor.YOffset = 0;
	this.UI.Editor.StartXOffset = 0;
	this.UI.Editor.StartYOffset = 0;
	this.UI.Editor.DragPosX = 0;
	this.UI.Editor.DragPosY = 0;
	this.UI.Editor.CursorPosX = 0;
	this.UI.Editor.CursorPosY = 0;
	this.UI.Editor.OverlayItems = [];
	this.UI.Editor.OnMousePressed = function( x, y, button ) {
		if ( button == 2 ) {
			this.DragPosX = x;
			this.DragPosY = y;
			this.StartXOffset = this.XOffset;
			this.StartYOffset = this.YOffset;
		} else if ( button == 1 ) {
			if ( LEVEL_EDITOR.RunningLevel == true ) {
				var power = LEVEL_EDITOR.Power
				LEVEL_EDITOR.Ball.Hit( power );
				LEVEL_EDITOR.Hits += 1;
				LEVEL_EDITOR.Log( [192/255, 57/255, 43/255, 1], "[", [231/255, 76/255, 60/255, 1], "LEVEL", [192/255, 57/255, 43/255, 1], "] ", [1,1,1,1], "Applied "+power+" force to the ball." );
			} else if ( LEVEL_EDITOR.Settings.Mode == "pointer" ) {
				var hits = [];
				for ( item_id in LEVEL_EDITOR.Level ) {
					var item = LEVEL_EDITOR.Level[item_id];
					if ( this.IsPointInsideBlock( ( -((this.GetWidth()/2)-x)+this.XOffset ), ( -((this.GetHeight()/2)-y)+this.YOffset ), item ) ) {
						hits.push( item_id );
					}
				}
				if ( hits.length == 1 ) {
					if ( LEVEL_EDITOR.Selection[0] == hits[0] ) {
						this.CreateEditUI( hits[0] );
					}
					LEVEL_EDITOR.Selection = [ hits[0] ];
				} else if ( hits.length > 1 ) {
					this.CreateSelectionUI( hits );
				} else {
					LEVEL_EDITOR.Selection = [];
				}
				LEVEL_EDITOR.Log( [243/255, 156/255, 18/255, 1], "[", [241/255, 196/255, 15/255, 1], "POINTER", [243/255, 156/255, 18/255, 1], "] ", [1,1,1,1], hits.length + " item(s) were found." )
			} else if ( LEVEL_EDITOR.Settings.Mode == "block" ) {
				var conn = [];
				var item = {};
				if ( LEVEL_EDITOR.Settings.Orientation == 1 ) {
					var size = [LEVEL_EDITOR.Settings.Size.w, LEVEL_EDITOR.Settings.Size.h];
					var pos = LEVEL_EDITOR.RotatePoint( this.CursorPosX+size[0]*5/2, this.CursorPosY+size[1]*5/2, this.CursorPosX, this.CursorPosY, -LEVEL_EDITOR.Settings.Rotation * ( Math.PI / 180 ) )
					var con = this.CursorBlock;
					item = {
						type: LEVEL_EDITOR.Settings.Material,
						pos: { x: pos[0], y: pos[1] },
						size: { w: size[0], h: size[1] },
						ang: LEVEL_EDITOR.Settings.Rotation,
						order: LEVEL_EDITOR.Materials[LEVEL_EDITOR.Settings.Material].order,
						con: []
					}
					if ( con !== false ) {
						if ( LEVEL_EDITOR.Level[con[0]]["con"][con[1]] == undefined && this.IsValidConnection( con[1], 1 ) ) {
							item["con"][1] = con;
						}
					}
					var len = LEVEL_EDITOR.Level.push( item );
					if ( con !== false ) {
						if ( LEVEL_EDITOR.Level[con[0]]["con"][con[1]] == undefined && this.IsValidConnection( con[1], 1 ) ) {
							LEVEL_EDITOR.Level[con[0]]["con"][con[1]] = [ Number(len-1), 1 ];
						}
					}
					LEVEL_EDITOR.AddUndo( "create_block", { id: Number(len-1), data: LEVEL_EDITOR.Level[Number(len-1)] } );
					LEVEL_EDITOR.Log( [243/255, 156/255, 18/255, 1], "[", [241/255, 196/255, 15/255, 1], "BLOCK", [243/255, 156/255, 18/255, 1], "] ", [1,1,1,1], "Created a " + LEVEL_EDITOR.Settings.Material + " block." );
				} else if ( LEVEL_EDITOR.Settings.Orientation == 2 ) {
					var size = [LEVEL_EDITOR.Settings.Size.w, LEVEL_EDITOR.Settings.Size.h];
					var pos = LEVEL_EDITOR.RotatePoint( this.CursorPosX-size[0]*5/2, this.CursorPosY+size[1]*5/2, this.CursorPosX, this.CursorPosY, -LEVEL_EDITOR.Settings.Rotation * ( Math.PI / 180 ) )
					var con = this.CursorBlock;
					item = {
						type: LEVEL_EDITOR.Settings.Material,
						pos: { x: pos[0], y: pos[1] },
						size: { w: size[0], h: size[1] },
						ang: LEVEL_EDITOR.Settings.Rotation,
						order: LEVEL_EDITOR.Materials[LEVEL_EDITOR.Settings.Material].order,
						con: []
					}
					if ( con !== false ) {
						if ( LEVEL_EDITOR.Level[con[0]]["con"][con[1]] == undefined && this.IsValidConnection( con[1], 2 ) ) {
							item["con"][2] = con;
						}
					}
					var len = LEVEL_EDITOR.Level.push( item );
					if ( con !== false ) {
						if ( LEVEL_EDITOR.Level[con[0]]["con"][con[1]] == undefined && this.IsValidConnection( con[1], 2 ) ) {
							LEVEL_EDITOR.Level[con[0]]["con"][con[1]] = [ Number(len-1), 2 ];
						}
					}
					LEVEL_EDITOR.AddUndo( "create_block", { id: Number(len-1), data: LEVEL_EDITOR.Level[Number(len-1)] } );
					LEVEL_EDITOR.Log( [243/255, 156/255, 18/255, 1], "[", [241/255, 196/255, 15/255, 1], "BLOCK", [243/255, 156/255, 18/255, 1], "] ", [1,1,1,1], "Created a " + LEVEL_EDITOR.Settings.Material + " block." );
				} else if ( LEVEL_EDITOR.Settings.Orientation == 3 ) {
					var size = [LEVEL_EDITOR.Settings.Size.w, LEVEL_EDITOR.Settings.Size.h];
					var pos = LEVEL_EDITOR.RotatePoint( this.CursorPosX+size[0]*5/2, this.CursorPosY-size[1]*5/2, this.CursorPosX, this.CursorPosY, -LEVEL_EDITOR.Settings.Rotation * ( Math.PI / 180 ) )
					var con = this.CursorBlock;
					item = {
						type: LEVEL_EDITOR.Settings.Material,
						pos: { x: pos[0], y: pos[1] },
						size: { w: size[0], h: size[1] },
						ang: LEVEL_EDITOR.Settings.Rotation,
						order: LEVEL_EDITOR.Materials[LEVEL_EDITOR.Settings.Material].order,
						con: []
					}
					if ( con !== false ) {
						if ( LEVEL_EDITOR.Level[con[0]]["con"][con[1]] == undefined && this.IsValidConnection( con[1], 3 ) ) {
							item["con"][3] = con;
						}
					}
					var len = LEVEL_EDITOR.Level.push( item );
					if ( con !== false ) {
						if ( LEVEL_EDITOR.Level[con[0]]["con"][con[1]] == undefined && this.IsValidConnection( con[1], 3 ) ) {
							LEVEL_EDITOR.Level[con[0]]["con"][con[1]] = [ Number(len-1), 3 ];
						}
					}
					LEVEL_EDITOR.AddUndo( "create_block", { id: Number(len-1), data: LEVEL_EDITOR.Level[Number(len-1)] } );
					LEVEL_EDITOR.Log( [243/255, 156/255, 18/255, 1], "[", [241/255, 196/255, 15/255, 1], "BLOCK", [243/255, 156/255, 18/255, 1], "] ", [1,1,1,1], "Created a " + LEVEL_EDITOR.Settings.Material + " block." );
				} else if ( LEVEL_EDITOR.Settings.Orientation == 4 ) {
					var size = [LEVEL_EDITOR.Settings.Size.w, LEVEL_EDITOR.Settings.Size.h];
					var pos = LEVEL_EDITOR.RotatePoint( this.CursorPosX-size[0]*5/2, this.CursorPosY-size[1]*5/2, this.CursorPosX, this.CursorPosY, -LEVEL_EDITOR.Settings.Rotation * ( Math.PI / 180 ) )
					var con = this.CursorBlock;
					item = {
						type: LEVEL_EDITOR.Settings.Material,
						pos: { x: pos[0], y: pos[1] },
						size: { w: size[0], h: size[1] },
						ang: LEVEL_EDITOR.Settings.Rotation,
						order: LEVEL_EDITOR.Materials[LEVEL_EDITOR.Settings.Material].order,
						con: []
					}
					if ( con !== false ) {
						if ( LEVEL_EDITOR.Level[con[0]]["con"][con[1]] == undefined && this.IsValidConnection( con[1], 4 ) ) {
							item["con"][4] = con;
						}
					}
					var len = LEVEL_EDITOR.Level.push( item );
					if ( con !== false ) {
						if ( LEVEL_EDITOR.Level[con[0]]["con"][con[1]] == undefined && this.IsValidConnection( con[1], 4 ) ) {
							LEVEL_EDITOR.Level[con[0]]["con"][con[1]] = [ Number(len-1), 4 ];
						}
					}
					LEVEL_EDITOR.AddUndo( "create_block", { id: Number(len-1), data: LEVEL_EDITOR.Level[Number(len-1)] } );
					LEVEL_EDITOR.Log( [243/255, 156/255, 18/255, 1], "[", [241/255, 196/255, 15/255, 1], "BLOCK", [243/255, 156/255, 18/255, 1], "] ", [1,1,1,1], "Created a " + LEVEL_EDITOR.Settings.Material + " block." );
				}
				if ( LEVEL_EDITOR.Settings.Material == "func_push" ) {
					item["settings"] = [];
					item["settings"]["start_on"] = true;
					item["settings"]["max_speed"] = 50;
					item["settings"]["acceleration"] = 10;
					item["settings"]["direction"] = LEVEL_EDITOR.Settings.Rotation;
				} else if ( LEVEL_EDITOR.Settings.Material == "func_move" ) {
					item["settings"] = [];
					item["settings"]["start_pos"] = { x: item["pos"]["x"], y: item["pos"]["y"] };
					item["settings"]["end_pos"] = { x: item["pos"]["x"] + 100, y: item["pos"]["y"] };
					item["settings"]["speed"] = 5;
					item["settings"]["start_delay"] = 0;
					item["settings"]["return_delay"] = 2;
					item["settings"]["restart_delay"] = 2;
					item["settings"]["start_on"] = true;
				}
			} else if ( LEVEL_EDITOR.Settings.Mode == "camera" ) {
				// Detect if click was on a camera point
				// If yes, select camera point
				// If no, add camera point
				if ( LEVEL_EDITOR.FlyOver == true ) { return };
				var hit_camera = this.GetHitCamera( x, y );
				if ( hit_camera == -1 ) {
					var w = this.GetWidth();
					var h = this.GetHeight();

					var world_x = Math.round( ( -((w/2)-x)+this.XOffset ) );	// "World" cursor position
					var world_y = Math.round( ( -((h/2)-y)+this.YOffset ) );	// "World" cursor position
					var len = LEVEL_EDITOR.CameraPoints.push( [ world_x, world_y ] );
					LEVEL_EDITOR.SelectedCamera = len-1;
					LEVEL_EDITOR.SelectedCameraStartPos = LEVEL_EDITOR.CameraPoints[len-1];
					LEVEL_EDITOR.SelectedCameraJustCreated = true;
				} else {
					LEVEL_EDITOR.SelectedCamera = hit_camera;
					LEVEL_EDITOR.SelectedCameraStartPos = LEVEL_EDITOR.CameraPoints[hit_camera];
					LEVEL_EDITOR.SelectedCameraJustCreated = false;
				}
			}
		}
	}
	this.UI.Editor.OnMouseDragged = function( x, y, button ) {
		if ( button == 2 ) {
			this.XOffset = this.StartXOffset + this.DragPosX - x;
			this.YOffset = this.StartYOffset + this.DragPosY - y;
		} else if ( button == 1 ) {
			if ( LEVEL_EDITOR.Settings.Mode == "camera" ) {
				if ( LEVEL_EDITOR.FlyOver == true ) { return };
				var w = this.GetWidth();
				var h = this.GetHeight();
				if ( LEVEL_EDITOR.SelectedCamera !== false ) {
					var world_x = Math.round( ( -((w/2)-x)+this.XOffset ) );	// "World" cursor position
					var world_y = Math.round( ( -((h/2)-y)+this.YOffset ) );	// "World" cursor position
					LEVEL_EDITOR.CameraPoints[LEVEL_EDITOR.SelectedCamera] = [ world_x, world_y];
				}
			}
		}
	}
	this.UI.Editor.OnMouseReleased = function( x, y, button ) {
		if ( button == 1 ) {
			if ( LEVEL_EDITOR.Settings.Mode == "camera" ) {
				if ( LEVEL_EDITOR.FlyOver == true ) { return };
				var w = this.GetWidth();
				var h = this.GetHeight();
				if ( LEVEL_EDITOR.SelectedCamera !== false ) {
					var world_x = Math.round( ( -((w/2)-x)+this.XOffset ) );	// "World" cursor position
					var world_y = Math.round( ( -((h/2)-y)+this.YOffset ) );	// "World" cursor position
					LEVEL_EDITOR.CameraPoints[LEVEL_EDITOR.SelectedCamera] = [ world_x, world_y];
					if ( LEVEL_EDITOR.SelectedCameraJustCreated ) {
						LEVEL_EDITOR.AddUndo( "create_camera", { id: LEVEL_EDITOR.SelectedCamera, data: LEVEL_EDITOR.CameraPoints[LEVEL_EDITOR.SelectedCamera] }, null )
					} else {
						LEVEL_EDITOR.AddUndo( "move_camera", { id: LEVEL_EDITOR.SelectedCamera, data: LEVEL_EDITOR.CameraPoints[LEVEL_EDITOR.SelectedCamera] }, { id: LEVEL_EDITOR.SelectedCamera, data: LEVEL_EDITOR.SelectedCameraStartPos } );
					}
				}
			}
		}
	}
	this.UI.Editor.CalculateCameraLengths = function() {
		var cams = LEVEL_EDITOR.CameraPoints;
		var count = cams.length;
		LEVEL_EDITOR.FlyOverLengths = [];
		LEVEL_EDITOR.FlyOverLengths[0] = 0;
		for ( cam in cams ) {
			if ( Number(cam) >= count-1 ) { break };
			var camera = cams[cam];
			var camera2 = cams[Number(cam)+1];
			var dist = ( Math.pow(camera[0]-camera2[0], 2) + Math.pow(camera[1]-camera2[1], 2) );
			dist = ( (dist === 0) ? (0) : Math.pow( dist, 0.5 ) );
			LEVEL_EDITOR.FlyOverLengths[Number(cam)+1] = LEVEL_EDITOR.FlyOverLengths[Number(cam)] + dist;
		}
	}
	this.UI.Editor.UpdateOverlay = function( type ) {
		if ( type == "playtest"  ) {
			for ( ui_id in LEVEL_EDITOR.UI.Editor.OverlayItems ) {
				LEVEL_EDITOR.UI.Editor.OverlayItems[ui_id].Remove();
			}
			LEVEL_EDITOR.UI.Editor.CreatePlaytestOverlay();
		} else if ( LEVEL_EDITOR.RunningLevel == false ) {
			for ( ui_id in LEVEL_EDITOR.UI.Editor.OverlayItems ) {
				LEVEL_EDITOR.UI.Editor.OverlayItems[ui_id].Remove();
			}
			if ( type == "camera" ) {
				LEVEL_EDITOR.UI.Editor.CreateCameraOverlay();
			}
		}
	}
	this.UI.Editor.CreatePlaytestOverlay = function() {
		var endtest = GameBase.UI.CreateElement( "button", this );
		endtest.SetPos( 5, 5 );
		endtest.SetSize( 240, 24 );
		endtest.SetText( "End Playtest" );
		endtest.OnClicked = function( x, y, button ) {
			// End Test
			LEVEL_EDITOR.RunningLevel = false;
			LEVEL_EDITOR.Collisions = [];
			LEVEL_EDITOR.Ball = false;
			LEVEL_EDITOR.World = false;
			GameBase.Hooks.Remove( "PhysicsStep" );
			LEVEL_EDITOR.UI.Editor.UpdateOverlay( LEVEL_EDITOR.Settings.Mode );
		}
		endtest.Draw = function() {
			var w = this.GetWidth();
			var h = this.GetHeight();

			_r.color( 0.30, 0.30, 0.30, 1 );
			_r.rect( 0, 0, w, h );

			if ( this.IsHovered() ) {
				_r.color( 0.50, 0.50, 0.50, 1 );
			} else {
				_r.color( 0.35, 0.35, 0.35, 1 )
			}
			_r.rect( 0, 0, w, 1 );
			_r.rect( 0, h-1, w, 1 );
			_r.rect( 0, 1, 1, h-2 );
			_r.rect( w-1, 1, 1, h-2 );

			GameBase.UI.IncDrawLayer();
			_r.color( 1, 1, 1, 1 );
			GameBase.Text.SetFont( this.TextFont );
			GameBase.Text.SetSize( this.TextSize );
			if ( this.TextXAlign == 1 ) {
				GameBase.Text.DrawText( w/2, h/2, this.Text, 1, 1 );
			} else if ( this.TextXAlign == 0 ) {
				GameBase.Text.DrawText( h/2, h/2, this.Text, 0, 1 );
			} else if ( this.TextXAlign == 2 ) {
				GameBase.Text.DrawText( w-h/2, h/2, this.Text, 2, 1 );
			}
		}
		this.OverlayItems.push( endtest );

		var reset = GameBase.UI.CreateElement( "button", this );
		reset.SetPos( 5, 34 );
		reset.SetSize( 240, 24 );
		reset.SetText( "Reset Level" );
		reset.OnClicked = function( x, y, button ) {
			if ( button == 1 ) {
				LEVEL_EDITOR.CameraPoints = [];
				LEVEL_EDITOR.SelectedCamera = false;
			}
		}
		reset.Draw = function() {
			var w = this.GetWidth();
			var h = this.GetHeight();

			_r.color( 0.30, 0.30, 0.30, 1 );
			_r.rect( 0, 0, w, h );

			if ( this.IsHovered() ) {
				_r.color( 0.50, 0.50, 0.50, 1 );
			} else {
				_r.color( 0.35, 0.35, 0.35, 1 )
			}
			_r.rect( 0, 0, w, 1 );
			_r.rect( 0, h-1, w, 1 );
			_r.rect( 0, 1, 1, h-2 );
			_r.rect( w-1, 1, 1, h-2 );

			GameBase.UI.IncDrawLayer();
			_r.color( 1, 1, 1, 1 );
			GameBase.Text.SetFont( this.TextFont );
			GameBase.Text.SetSize( this.TextSize );
			if ( this.TextXAlign == 1 ) {
				GameBase.Text.DrawText( w/2, h/2, this.Text, 1, 1 );
			} else if ( this.TextXAlign == 0 ) {
				GameBase.Text.DrawText( h/2, h/2, this.Text, 0, 1 );
			} else if ( this.TextXAlign == 2 ) {
				GameBase.Text.DrawText( w-h/2, h/2, this.Text, 2, 1 );
			}
		}
		this.OverlayItems.push( reset );

		var lock = GameBase.UI.CreateElement( "button", this );
		lock.SetPos( 5, 63 );
		lock.SetSize( 240, 24 );
		lock.SetText( "Follow Cam ["+LEVEL_EDITOR.LockCameraToBall+"]" );
		lock.OnClicked = function( x, y, button ) {
			if ( button == 1 ) {
				LEVEL_EDITOR.LockCameraToBall = !LEVEL_EDITOR.LockCameraToBall;
				this.SetText( "Follow Cam ["+LEVEL_EDITOR.LockCameraToBall+"]" );
			}
		}
		lock.Draw = function() {
			var w = this.GetWidth();
			var h = this.GetHeight();

			_r.color( 0.30, 0.30, 0.30, 1 );
			_r.rect( 0, 0, w, h );

			if ( this.IsHovered() ) {
				_r.color( 0.50, 0.50, 0.50, 1 );
			} else {
				_r.color( 0.35, 0.35, 0.35, 1 )
			}
			_r.rect( 0, 0, w, 1 );
			_r.rect( 0, h-1, w, 1 );
			_r.rect( 0, 1, 1, h-2 );
			_r.rect( w-1, 1, 1, h-2 );

			GameBase.UI.IncDrawLayer();
			_r.color( 1, 1, 1, 1 );
			GameBase.Text.SetFont( this.TextFont );
			GameBase.Text.SetSize( this.TextSize );
			if ( this.TextXAlign == 1 ) {
				GameBase.Text.DrawText( w/2, h/2, this.Text, 1, 1 );
			} else if ( this.TextXAlign == 0 ) {
				GameBase.Text.DrawText( h/2, h/2, this.Text, 0, 1 );
			} else if ( this.TextXAlign == 2 ) {
				GameBase.Text.DrawText( w-h/2, h/2, this.Text, 2, 1 );
			}
		}
		this.OverlayItems.push( lock );
	}
	this.UI.Editor.CreateCameraOverlay = function() {
		var preview = GameBase.UI.CreateElement( "button", this );
		preview.SetPos( 5, 5 );
		preview.SetSize( 240, 24 );
		preview.SetText( "Preview Camera Overview" );
		preview.OnClicked = function( x, y, button ) {
			if ( button == 1 && LEVEL_EDITOR.CameraPoints.length > 0 ) {
				LEVEL_EDITOR.UI.Editor.CalculateCameraLengths();
				LEVEL_EDITOR.FlyOver = true;
				LEVEL_EDITOR.FlyOverStart = GameBase.GetTime();
			}
		}
		preview.Draw = function() {
			var w = this.GetWidth();
			var h = this.GetHeight();

			_r.color( 0.30, 0.30, 0.30, 1 );
			_r.rect( 0, 0, w, h );

			if ( LEVEL_EDITOR.FlyOver ) {
				_r.color( 1, 1, 1, 0.1 );
				_r.rect( 0, 0, w * ( ( GameBase.GetTime() - LEVEL_EDITOR.FlyOverStart ) / 5 ), h );
			}

			if ( this.IsHovered() ) {
				_r.color( 0.50, 0.50, 0.50, 1 );
			} else {
				_r.color( 0.35, 0.35, 0.35, 1 )
			}
			_r.rect( 0, 0, w, 1 );
			_r.rect( 0, h-1, w, 1 );
			_r.rect( 0, 1, 1, h-2 );
			_r.rect( w-1, 1, 1, h-2 );

			GameBase.UI.IncDrawLayer();
			_r.color( 1, 1, 1, 1 );
			GameBase.Text.SetFont( this.TextFont );
			GameBase.Text.SetSize( this.TextSize );
			if ( this.TextXAlign == 1 ) {
				GameBase.Text.DrawText( w/2, h/2, this.Text, 1, 1 );
			} else if ( this.TextXAlign == 0 ) {
				GameBase.Text.DrawText( h/2, h/2, this.Text, 0, 1 );
			} else if ( this.TextXAlign == 2 ) {
				GameBase.Text.DrawText( w-h/2, h/2, this.Text, 2, 1 );
			}
		}
		this.OverlayItems.push( preview );

		var clear = GameBase.UI.CreateElement( "button", this );
		clear.SetPos( 5, 34 );
		clear.SetSize( 240, 24 );
		clear.SetText( "Clear All Camera Points" );
		clear.OnClicked = function( x, y, button ) {
			if ( button == 1 ) {
				LEVEL_EDITOR.CameraPoints = [];
				LEVEL_EDITOR.SelectedCamera = false;
			}
		}
		clear.Draw = function() {
			var w = this.GetWidth();
			var h = this.GetHeight();

			_r.color( 0.30, 0.30, 0.30, 1 );
			_r.rect( 0, 0, w, h );

			if ( this.IsHovered() ) {
				_r.color( 0.50, 0.50, 0.50, 1 );
			} else {
				_r.color( 0.35, 0.35, 0.35, 1 )
			}
			_r.rect( 0, 0, w, 1 );
			_r.rect( 0, h-1, w, 1 );
			_r.rect( 0, 1, 1, h-2 );
			_r.rect( w-1, 1, 1, h-2 );

			GameBase.UI.IncDrawLayer();
			_r.color( 1, 1, 1, 1 );
			GameBase.Text.SetFont( this.TextFont );
			GameBase.Text.SetSize( this.TextSize );
			if ( this.TextXAlign == 1 ) {
				GameBase.Text.DrawText( w/2, h/2, this.Text, 1, 1 );
			} else if ( this.TextXAlign == 0 ) {
				GameBase.Text.DrawText( h/2, h/2, this.Text, 0, 1 );
			} else if ( this.TextXAlign == 2 ) {
				GameBase.Text.DrawText( w-h/2, h/2, this.Text, 2, 1 );
			}
		}
		this.OverlayItems.push( clear );
	}
	this.UI.Editor.GetHitCamera = function( x, y ) {
		var w = this.GetWidth();
		var h = this.GetHeight();

		var distance = -1;
		var id = -1;
		var world_x = Math.round( ( -((w/2)-x)+this.XOffset ) );	// "World" cursor position
		var world_y = Math.round( ( -((h/2)-y)+this.YOffset ) );	// "World" cursor position
		for ( cam_id in LEVEL_EDITOR.CameraPoints ) {
			var item = LEVEL_EDITOR.CameraPoints[cam_id];
			var dist = ( Math.pow(world_x-item[0], 2) + Math.pow(world_y-item[1], 2) );
			dist = ( (dist === 0) ? (0) : Math.pow( dist, 0.5 ) );
			if ( ( dist < distance || distance == -1 ) && dist < 7 ) {
				distance = dist;
				id = cam_id;
			}
		}
		return Number(id);
	}
	this.UI.Editor.DeleteSelection = function() {
		if ( LEVEL_EDITOR.Settings.Mode == "pointer" ) {
			var blockdata = [];
			for ( var index in LEVEL_EDITOR.Selection ) {
				index = LEVEL_EDITOR.Selection[index];
				blockdata.push( { id: index, data: LEVEL_EDITOR.Level[index] } );
				if ( LEVEL_EDITOR.Level[index]["con"] ) {
					for ( corner in LEVEL_EDITOR.Level[index]["con"] ) {
						var itm_id = LEVEL_EDITOR.Level[index]["con"][corner];
						delete LEVEL_EDITOR.Level[itm_id[0]]["con"][itm_id[1]];
						/*
						if ( corner == 1 ) {
							delete LEVEL_EDITOR.Level[itm_id]["con"][2];
						} else if ( corner == 2 ) {
							delete LEVEL_EDITOR.Level[itm_id]["con"][1];
						} else if ( corner == 3 ) {
							delete LEVEL_EDITOR.Level[itm_id]["con"][4];
						} else if ( corner == 4 ) {
							delete LEVEL_EDITOR.Level[itm_id]["con"][3];
						}
						*/
					}
				}
				delete LEVEL_EDITOR.Level[index];
			}
			LEVEL_EDITOR.AddUndo( "delete_selection", null, blockdata );
			LEVEL_EDITOR.Selection = [];
		} else if ( LEVEL_EDITOR.Settings.Mode == "camera" ) {
			if ( LEVEL_EDITOR.FlyOver == true ) { return };
			if ( LEVEL_EDITOR.CameraPoints[LEVEL_EDITOR.SelectedCamera] != undefined ) {
				LEVEL_EDITOR.AddUndo( "delete_camera", null, { id: LEVEL_EDITOR.SelectedCamera, data: LEVEL_EDITOR.CameraPoints[LEVEL_EDITOR.SelectedCamera] } );
				LEVEL_EDITOR.CameraPoints.splice( LEVEL_EDITOR.SelectedCamera, 1 )
				LEVEL_EDITOR.SelectedCamera = false;
			}
		}
	}
	this.UI.Editor.CreateEditUI = function( item ) {
		var overlay = GameBase.UI.CreateElement( "base" );
		overlay.SetPos( 0, 0 );
		overlay.SetSize( GameBase.GetScrW(), GameBase.GetScrH() );
		overlay.Draw = function() {
			var w = this.GetWidth();
			var h = this.GetHeight();

			_r.color( 0, 0, 0, 0.8 );
			_r.rect( 0, 0, w, h );
		}

		var base = GameBase.UI.CreateElement( "base", overlay );
		base.SetPos( overlay.GetWidth()/2-200, overlay.GetHeight()/2-150 );
		base.SetSize( 400, 300 );
		base.Buttons = [];
		base.Settings = [];
		base.Draw = function() {
			var w = this.GetWidth();
			var h = this.GetHeight();

			_r.color( 1,1,1,1 );
			_r.rect( 0, 0, w, h );

			_r.color( 0, 0, 0, 1 );
			GameBase.UI.IncDrawLayer();
			GameBase.Text.SetFont( "Mplus1m Bold" );
			GameBase.Text.SetSize( 14 );
			GameBase.Text.DrawText( 5, 10, "Minigolf - Item Settings", 0, 1 );

			_r.color( 0.9, 0.9, 0.9, 1 );
			_r.rect( 0, 20, w, h-20 );
		}

		var close = GameBase.UI.CreateElement( "button", base );
		close.SetPos( base.GetWidth()-50, 0 );
		close.SetSize( 50, 20 );
		close.OnClicked = function() {
			overlay.Remove();
		}
		close.Draw = function() {
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

		var scroll = GameBase.UI.CreateElement( "scroll", base );
		scroll.SetPos( 5, 25 );
		scroll.SetSize( base.GetWidth()-10, 300-25-30 );
		scroll.Spacing = 5;
		scroll.Update();

		var cancel = GameBase.UI.CreateElement( "button", base );
		cancel.SetPos( 5, base.GetHeight()-25 );
		cancel.SetSize( 65, 20 );
		cancel.SetText( "Cancel" );
		cancel.SetTextSize( 15 );
		cancel.OnClicked = function() {
			overlay.Remove();
		}

		var apply = GameBase.UI.CreateElement( "button", base );
		apply.SetPos( base.GetWidth()-70, base.GetHeight()-25 );
		apply.SetSize( 65, 20 );
		apply.SetText( "Apply" );
		apply.SetTextSize( 15 );
		apply.OnClicked = function() {
			//LEVEL_EDITOR.Level[item]["order"] = order_entry.GetValue();
			for ( var id in base.Settings ) {
				var setting = base.Settings[id];
				if ( setting["type"] == "number" ) {
					if ( setting["setting"].length == 1 ) {
						LEVEL_EDITOR.Level[item][setting["setting"][0]] = setting["entry"].GetValue();
					} else if ( setting["setting"].length == 2 ) {
						LEVEL_EDITOR.Level[item][setting["setting"][0]][setting["setting"][1]] = setting["entry"].GetValue();
					}
				} else if ( setting["type"] == "bool" ) {
					if ( setting["setting"].length == 1 ) {
						LEVEL_EDITOR.Level[item][setting["setting"][0]] = setting["entry"].GetToggled();
					} else if ( setting["setting"].length == 2 ) {
						LEVEL_EDITOR.Level[item][setting["setting"][0]][setting["setting"][1]] = setting["entry"].GetToggled();
					}
				} else if ( setting["type"] == "text" ) {
					if ( setting["setting"].length == 1 ) {
						LEVEL_EDITOR.Level[item][setting["setting"][0]] = setting["entry"].GetText();
					} else if ( setting["setting"].length == 2 ) {
						LEVEL_EDITOR.Level[item][setting["setting"][0]][setting["setting"][1]] = setting["entry"].GetText();
					}
				} else if ( setting["type"] == "pos" ) {
					if ( setting["setting"].length == 1 ) {
						LEVEL_EDITOR.Level[item][setting["setting"][0]] = setting["entry"].GetValue();
					} else if ( setting["setting"].length == 2 ) {
						LEVEL_EDITOR.Level[item][setting["setting"][0]][setting["setting"][1]] = setting["entry"].GetValue();
					}
				}
			}
			overlay.Remove();
		}

		base.CreateNumEntry = function( name, desc, setting, min, max, inc, force ) {
			val = 0;
			if ( setting.length == 1 ) {
				val = LEVEL_EDITOR.Level[item][setting[0]];
			} else if ( setting.length == 2 ) {
				val = LEVEL_EDITOR.Level[item][setting[0]][setting[1]];
			}
			var bg = GameBase.UI.CreateElement( "base", base );
			bg.SetSize( base.GetWidth(), 30 );
			bg.Draw = function() {
				var w = this.GetWidth();
				var h = this.GetHeight();

				_r.color( 0.1, 0.1, 0.1, 1 );
				GameBase.Text.SetFont( "Mplus1m" );
				GameBase.Text.SetSize( 20 );
				GameBase.Text.DrawText( 10, 0, name, 0, 0 );
				GameBase.Text.SetSize( 10 );
				GameBase.Text.DrawText( 10, 18, desc, 0, 0 );
			}
			scroll.AddItem( bg );

			var entry = GameBase.UI.CreateElement( "numentry", bg );
			entry.SetPos( bg.GetWidth()/2, 0 );
			entry.SetSize( bg.GetWidth()/2, bg.GetHeight() );
			entry.SetValue( Number(val) );
			entry.SetMinValue( min );
			entry.SetMaxValue( max );
			entry.SetIncrement( inc );
			entry.SetForceIncrement( force );
			base.Settings.push( { setting: setting, type: "number", entry: entry } );
		}

		base.CreatePosEntry = function( name, desc, setting ) {
			val = 0;
			if ( setting.length == 1 ) {
				val = LEVEL_EDITOR.Level[item][setting[0]];
			} else if ( setting.length == 2 ) {
				val = LEVEL_EDITOR.Level[item][setting[0]][setting[1]];
			}
			var bg = GameBase.UI.CreateElement( "base", base );
			bg.SetSize( base.GetWidth(), 30 );
			bg.Draw = function() {
				var w = this.GetWidth();
				var h = this.GetHeight();

				_r.color( 0.1, 0.1, 0.1, 1 );
				GameBase.Text.SetFont( "Mplus1m" );
				GameBase.Text.SetSize( 20 );
				GameBase.Text.DrawText( 10, 0, name, 0, 0 );
				GameBase.Text.SetSize( 10 );
				GameBase.Text.DrawText( 10, 18, desc, 0, 0 );
			}
			bg.GetValue = function() {
				return { x: x_entry.GetValue(), y: y_entry.GetValue() };
			}
			scroll.AddItem( bg );

			print(val);

			var x_entry = GameBase.UI.CreateElement( "numentry", bg );
			x_entry.SetPos( bg.GetWidth()/2, 0 );
			x_entry.SetSize( bg.GetWidth()/4-5, bg.GetHeight() );
			x_entry.SetValue( Number(val["x"]) );
			x_entry.SetIncrement( 1 );
			x_entry.SetForceIncrement( false );

			var y_entry = GameBase.UI.CreateElement( "numentry", bg );
			y_entry.SetPos( bg.GetWidth()*(3/4)+5, 0 );
			y_entry.SetSize( bg.GetWidth()/4-5, bg.GetHeight() );
			y_entry.SetValue( Number(val["y"]) );
			y_entry.SetIncrement( 1 );
			y_entry.SetForceIncrement( false );

			base.Settings.push( { setting: setting, type: "pos", entry: bg } );
		}

		base.CreateEntry = function( name, desc, setting ) {
			val = "None";
			if ( setting.length == 1 ) {
				val = LEVEL_EDITOR.Level[item][setting[0]];
			} else if ( setting.length == 2 ) {
				val = LEVEL_EDITOR.Level[item][setting[0]][setting[1]];
			}
			var bg = GameBase.UI.CreateElement( "base", base );
			bg.SetSize( base.GetWidth(), 30 );
			bg.Draw = function() {
				var w = this.GetWidth();
				var h = this.GetHeight();

				_r.color( 0.1, 0.1, 0.1, 1 );
				GameBase.Text.SetFont( "Mplus1m" );
				GameBase.Text.SetSize( 20 );
				GameBase.Text.DrawText( 10, 0, name, 0, 0 );
				GameBase.Text.SetSize( 10 );
				GameBase.Text.DrawText( 10, 18, desc, 0, 0 );
			}
			scroll.AddItem( bg );

			var entry = GameBase.UI.CreateElement( "entry", bg );
			entry.SetPos( bg.GetWidth()/2, 0 );
			entry.SetSize( bg.GetWidth()/2, bg.GetHeight() );
			entry.SetValue( val );
			base.Settings.push( { setting: setting, type: "text", entry: entry } );
		}

		base.CreateCheckbox = function( name, desc, setting ) {
			val = false;
			if ( setting.length == 1 ) {
				val = LEVEL_EDITOR.Level[item][setting[0]];
			} else if ( setting.length == 2 ) {
				val = LEVEL_EDITOR.Level[item][setting[0]][setting[1]];
			}
			var bg = GameBase.UI.CreateElement( "base", base );
			bg.SetSize( base.GetWidth(), 30 );
			bg.Draw = function() {
				var w = this.GetWidth();
				var h = this.GetHeight();

				_r.color( 0.1, 0.1, 0.1, 1 );
				GameBase.Text.SetFont( "Mplus1m" );
				GameBase.Text.SetSize( 20 );
				GameBase.Text.DrawText( 10, 0, name, 0, 0 );
				GameBase.Text.SetSize( 10 );
				GameBase.Text.DrawText( 10, 18, desc, 0, 0 );
			}
			scroll.AddItem( bg );

			var entry = GameBase.UI.CreateElement( "checkbox", bg );
			entry.SetPos( bg.GetWidth()/2, 0 );
			entry.SetSize( bg.GetWidth()/2, bg.GetHeight() );
			entry.SetToggled( val );
			base.Settings.push( { setting: setting, type: "bool", entry: entry } );
		}

		base.CreateNumEntry( "Z-Index:", "The layer this is drawn on", ["order"], -5, 5, 1, true );
		if ( LEVEL_EDITOR.Level[item]["type"] == "func_push" ) {
			base.CreateNumEntry( "Direction:", "The direction to push the ball", ["settings","direction"], 0, 355, 5, true )
			base.CreateNumEntry( "Acceleration:", "The rate in which to speed up the ball", ["settings","acceleration"], 0, 100, 5, false );
			base.CreateNumEntry( "Max Speed:", "The max speed to push the ball to", ["settings","max_speed"], 0, 100, 5, false );
			base.CreateCheckbox( "Start On:", "If this entity should start enabled", ["settings","start_on"] );
		} else if ( LEVEL_EDITOR.Level[item]["type"] == "func_move" ) {
			base.CreatePosEntry( "End Position:", "Where this object will end up", ["settings","end_pos"] );
			base.CreateNumEntry( "Speed:", "How long the object travels for", ["settings","speed"], 0, 60, 1, true );
			base.CreateNumEntry( "Start Delay:", "Delay before this object starts moving", ["settings","start_delay"], 0, 60, 1, true );
			base.CreateNumEntry( "Return Delay:", "Delay before object starts returning", ["settings","return_delay"], 0, 60, 1, true );
			base.CreateNumEntry( "Restart Delay:", "Delay before object restarts its loop", ["settings","restart_delay"], 0, 60, 1, true );
			base.CreateCheckbox( "Start On:", "If this entity should start enabled", ["settings","start_on"] );
		}

		base.SetSize( 400, Math.min( scroll.GetCanvasHeight()+55, overlay.GetHeight()-50 ) );
		base.SetPos( overlay.GetWidth()/2-base.GetWidth()/2, overlay.GetHeight()/2-base.GetHeight()/2 );
		scroll.SetSize( base.GetWidth()-10, Math.min( scroll.GetCanvasHeight(), base.GetHeight()-55 ) );
		scroll.Update();
		cancel.SetPos( 5, base.GetHeight()-25 );
		apply.SetPos( base.GetWidth()-70, base.GetHeight()-25 );
	}
	this.UI.Editor.CreateSelectionUI = function( list ) {
		var overlay = GameBase.UI.CreateElement( "base" );
		overlay.SetPos( 0, 0 );
		overlay.SetSize( GameBase.GetScrW(), GameBase.GetScrH() );
		overlay.Draw = function() {
			var w = this.GetWidth();
			var h = this.GetHeight();

			_r.color( 0, 0, 0, 0.8 );
			_r.rect( 0, 0, w, h );
		}

		var base = GameBase.UI.CreateElement( "base", overlay );
		base.SetPos( Math.max( overlay.GetWidth()/2-(list.length*105+5)/2, 5 ), overlay.GetHeight()/2-110 );
		base.SetSize( Math.min( (list.length*105)+5, GameBase.GetScrW()-10 ), 230 );
		base.Buttons = [];
		base.Draw = function() {
			var w = this.GetWidth();
			var h = this.GetHeight();

			_r.color( 1,1,1,1 );
			_r.rect( 0, 0, w, h );

			_r.color( 0, 0, 0, 1 );
			GameBase.UI.IncDrawLayer();
			GameBase.Text.SetFont( "Mplus1m Bold" );
			GameBase.Text.SetSize( 14 );
			GameBase.Text.DrawText( 5, 10, "Minigolf - Multiple Items Selected", 0, 1 );

			_r.color( 0.9, 0.9, 0.9, 1 );
			_r.rect( 0, 20, w, h-20 );
		}

		var close = GameBase.UI.CreateElement( "button", base );
		close.SetPos( base.GetWidth()-50, 0 );
		close.SetSize( 50, 20 );
		close.OnClicked = function() {
			overlay.Remove();
		}
		close.Draw = function() {
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

		var scroll = GameBase.UI.CreateElement( "scroll_horizontal", base );
		scroll.SetPos( 5, 25 );
		scroll.SetSize( base.GetWidth()-10, 175 );
		scroll.Update();

		var cancel = GameBase.UI.CreateElement( "button", base );
		cancel.SetPos( 5, base.GetHeight()-25 );
		cancel.SetSize( 65, 20 );
		cancel.SetText( "Cancel" );
		cancel.SetTextSize( 15 );
		cancel.OnClicked = function() {
			overlay.Remove();
		}

		var select = GameBase.UI.CreateElement( "button", base );
		select.SetPos( base.GetWidth()-70, base.GetHeight()-25 );
		select.SetSize( 65, 20 );
		select.SetText( "Select" );
		select.SetTextSize( 15 );
		select.OnClicked = function() {
			var items = [];
			for ( button_id in base.Buttons ) {
				var button = base.Buttons[button_id];
				if ( button.Selected ) {
					items.push( button.ItemID );
				}
			}
			LEVEL_EDITOR.Selection = items;
			overlay.Remove();
		}

		var i = 0;
		for ( var id in list ) {
			var item = LEVEL_EDITOR.Level[list[id]];
			var button = GameBase.UI.CreateElement( "button", scroll );
			button.Item = item;
			button.ItemID = list[id];
			button.Selected = false;
			button.SetPos( 5+(i*105), 25 );
			button.SetSize( 100, 150 );
			button.OnClicked = function( x, y, button ) {
				if ( button == 1 ) {
					this.Selected = !this.Selected
				}
			}
			button.Draw = function() {
				var w = this.GetWidth();
				var h = this.GetHeight();

				_r.color( 1, 1, 1, 1 );
				_r.rect( 0, 0, w, h );

				if ( this.Selected ) {
					_r.color( 0.1, 0.4, 1, 1 );
					_r.rect( 0, 0, w, 1 );
					_r.rect( 0, h-1, w, 1 );
					_r.rect( 0, 1, 1, h-2 );
					_r.rect( w-1, 1, 1, h-2 );
				} else if ( this.IsHovered() ) {
					GameBase.UI.IncDrawLayer();
					_r.color( 0.75, 0.75, 0.75, 1 );
					_r.rect( 0, 0, w, 1 );
					_r.rect( 0, h-1, w, 1 );
					_r.rect( 0, 1, 1, h-2 );
					_r.rect( w-1, 1, 1, h-2 );
				}

				// Draw Preview
				var cpos = GameBase.UI.GetScreenPos( this );
				_r.pushcliprect( cpos[0]+5, cpos[1]+5, w-10, w-10 );
				_r.color( 1, 1, 1, 1 );
				if ( this.Item["type"] != "block" ) {
					_r.sprite( 50, 50, this.Item["size"]["w"]*2, this.Item["size"]["h"]*2, this.Item["ang"]*(Math.PI/180), LEVEL_EDITOR.Materials[this.Item["type"]]["mat"], 0, 0, this.Item["size"]["w"]/10, this.Item["size"]["h"]/10 )
				} else {
					_r.sprite( 50, 50, this.Item["size"]["w"]*2, this.Item["size"]["h"]*2, this.Item["ang"]*(Math.PI/180), LEVEL_EDITOR.Materials[this.Item["type"]]["mat"], 0, 0, 1, 1 )
				}
				_r.popclip();

				// Draw Stats
				_r.color( 0, 0, 0, 1 );
				GameBase.Text.SetFont( "Mplus1m SemiBold" );
				GameBase.Text.SetSize( 14 );
				GameBase.Text.DrawText( 10, 105, "Width: ", 0, 1 );
				GameBase.Text.DrawText( w-10, 105, this.Item["size"]["w"], 2, 1 );
				GameBase.Text.DrawText( 10, 120, "Height: ", 0, 1 );
				GameBase.Text.DrawText( w-10, 120, this.Item["size"]["h"], 2, 1 );
				GameBase.Text.DrawText( 10, 135, "Angle: ", 0, 1 );
				GameBase.Text.DrawText( w-10, 135, this.Item["ang"], 2, 1 );
			}
			base.Buttons.push( button );
			scroll.AddItem( button );
			i += 1;
		}
	}
	this.UI.Editor.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		// Draw the background
		_r.color( 0.2, 0.2, 0.2, 1 );
		_r.rect( 0, 0, w, h );

		if ( LEVEL_EDITOR.FlyOver == true || LEVEL_EDITOR.RunningLevel == true ) {
			//this.DrawTrees( this.XOffset/w );
			MINIGOLF.Draw.Background( w, h, this.XOffset/w );
			GameBase.UI.IncDrawLayer();
		} else {
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

		// The level
		this.DrawLevel();

		if ( LEVEL_EDITOR.RunningLevel == true ) {
			this.DrawModeRunningLevel();
		} else if ( LEVEL_EDITOR.Settings.Mode == "block" ) {
			this.DrawModeBlock();
		} else if ( LEVEL_EDITOR.Settings.Mode == "pointer" ) {
			this.DrawModePointer();
		} else if ( LEVEL_EDITOR.Settings.Mode == "camera" ) {
			this.DrawModeCamera();
		}

		// Draw notifications
		GameBase.UI.IncDrawLayer();
		this.DrawNotifications();

		// Draw debug
		/*
		_r.color( 1, 1, 1, 1 );
		var pos = GameBase.UI.GetLocalCursorPos( this );
		var angle = GameBase.GetTime()/5;
		var u1 = 0;
		var v1 = 0;
		var width = 5
		var height = 5;
		var per = GameBase.GetTime() % 3;
		var vec_x = Math.sin( angle ) * per;
		var vec_y = Math.cos( angle ) * per;
		var pos1 = MINIGOLF.RotatePoint( u1+vec_x, v1+vec_y, 0.5*width, 0.5*height, angle );
		var pos2 = MINIGOLF.RotatePoint( u1+width+vec_x, v1+vec_y, 0.5*width, 0.5*height, angle );
		var pos3 = MINIGOLF.RotatePoint( u1+width+vec_x, v1+height+vec_y, 0.5*width, 0.5*height, angle );
		var pos4 = MINIGOLF.RotatePoint( u1+vec_x, v1+height+vec_y, 0.5*width, 0.5*height, angle );
		_r.quad( 10, 10, pos1[0], pos1[1],
			210, 10, pos2[0], pos2[1],
			210, 210, pos3[0], pos3[1],
			10, 210, pos4[0], pos4[1],
			assets["custom_trigger_push.tex"]
		);
		*/
	}
	this.UI.Editor.DrawNotifications = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		var i = 0;
		for ( var note_id in LEVEL_EDITOR.Notifications ) {
			var notification = LEVEL_EDITOR.Notifications[note_id];
			if ( notification["start"] + notification["duration"] < GameBase.GetTime() ) {
				delete LEVEL_EDITOR.Notifications[note_id];
			} else {
				GameBase.Text.SetSize( 20 );
				GameBase.Text.SetFont( "Mplus1m SemiBold" )
				var text_w = GameBase.Text.GetTextWidth( notification["text"] );
				var fake_w = text_w+10+30;
				var fake_h = 30;
				var fake_x = w-fake_w-5;
				var fake_y = 5+(35*i);
				if ( notification["pos"] == undefined ) {
					notification["pos"] = [ w, fake_y ];
				}
				fake_x = notification["pos"][0] + (fake_x-notification["pos"][0])*0.1;
				fake_y = notification["pos"][1] + (fake_y-notification["pos"][1])*0.1;
				LEVEL_EDITOR.Notifications[note_id]["pos"] = [ fake_x, fake_y ];
				_r.color( 1, 1, 1, 1 );
				_r.rect( fake_x, fake_y, fake_w, fake_h );
				GameBase.UI.IncDrawLayer();
				_r.color( 0.75, 0.75, 0.75, 1 );
				var icon = assets["icon_tick.tex"];
				if ( notification["type"] == "error" ) {
					_r.color( 231/255, 76/255, 60/255, 1 );
					icon = assets["icon_warning.tex"];
				} else if ( notification["type"] == "undo" ) {
					_r.color( 46/255, 204/255, 113/255, 1 );
					icon = assets["icon_undo.tex"];
				} else if ( notification["type"] == "redo" ) {
					_r.color( 46/255, 204/255, 113/255, 1 );
					icon = assets["icon_redo.tex"];
				}
				_r.rect( fake_x, fake_y, fake_w, 1 );
				_r.rect( fake_x, fake_y+fake_h-1, fake_w, 1 );
				_r.rect( fake_x, fake_y, 30, fake_h-1 );
				_r.rect( fake_x+fake_w-1, fake_y, 1, fake_h-1 );
				GameBase.UI.IncDrawLayer();
				_r.color( 1, 1, 1, 1 );
				_r.rect( fake_x, fake_y, 30, 30, icon );
				GameBase.UI.IncDrawLayer();
				_r.color( 0, 0, 0, 1 );
				GameBase.Text.DrawText( fake_x+fake_w/2+15, fake_y+fake_h/2, notification["text"], 1, 1 );
				i += 1;
			}
		}
	}
	this.UI.Editor.Think = function() {
		if ( LEVEL_EDITOR.FlyOver ) {
			var count = LEVEL_EDITOR.CameraPoints.length
			var len = 0;
			for ( id in LEVEL_EDITOR.FlyOverLengths ) {
				len += ( LEVEL_EDITOR.FlyOverLengths[id] - len );
			}
			var per = Math.min( ( GameBase.GetTime() - LEVEL_EDITOR.FlyOverStart ) / 5, 1 );

			var distance = per * len;
			var start = 0;
			for ( var i = count-1; i > 0; i-- ) {
				var v = LEVEL_EDITOR.FlyOverLengths[i];
				if ( distance >= v ) {
					start = i;
					break;
				}
			}

			if ( start == count-1 ) {
				this.XOffset = LEVEL_EDITOR.CameraPoints[start][0];
				this.YOffset = LEVEL_EDITOR.CameraPoints[start][1];
				if ( GameBase.GetTime() > LEVEL_EDITOR.FlyOverStart + 6 ) {
					LEVEL_EDITOR.FlyOver = false;
				}
			} else {
				var newper = distance - LEVEL_EDITOR.FlyOverLengths[start];
				var newend = LEVEL_EDITOR.FlyOverLengths[start+1] - LEVEL_EDITOR.FlyOverLengths[start];
				var pos_x = LEVEL_EDITOR.CameraPoints[start][0] + ( LEVEL_EDITOR.CameraPoints[start+1][0] - LEVEL_EDITOR.CameraPoints[start][0] ) * (newper/newend)
				var pos_y = LEVEL_EDITOR.CameraPoints[start][1] + ( LEVEL_EDITOR.CameraPoints[start+1][1] - LEVEL_EDITOR.CameraPoints[start][1] ) * (newper/newend)
				this.XOffset = pos_x;
				this.YOffset = pos_y;
			}
		} else if ( LEVEL_EDITOR.RunningLevel == true ) {
			var w = this.GetWidth();
			var cpos = GameBase.UI.GetLocalCursorPos( this );
			LEVEL_EDITOR.Power = Math.min( Math.max( (cpos[0]-(w/2))/((w*0.5)-(w*0.2)), -1 ), 1 ) * LEVEL_EDITOR.MaxPower;
			if ( LEVEL_EDITOR.LockCameraToBall == true ) {
				this.XOffset = (LEVEL_EDITOR.Ball.GetPosX()*LEVEL_EDITOR.WorldScale);
				this.YOffset = (LEVEL_EDITOR.Ball.GetPosY()*LEVEL_EDITOR.WorldScale);
			}
		}
	}
	this.UI.Editor.DrawTrees = function( x_offset ) {
		var w = this.GetWidth();
		var h = this.GetHeight();

		// Sly
		_r.color( 1, 1, 1, 1 );
		_r.rect( 0, 0, w, h, assets["altitude_sky.tex"] );

		// Trees
		//var pos = GameBase.UI.GetLocalCursorPos( this );
		//var x_offset = pos[0]/w;

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

	}
	// DrawHUD
	this.UI.Editor.DrawModeRunningLevel = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		// Power Bar
		_r.color( 1, 1, 1, (LEVEL_EDITOR.BallMoving || LEVEL_EDITOR.FlyOver || LEVEL_EDITOR.IsBallPotted) ? (0.25) : (1) )
		_r.rect( w/2-200, h-60, 400, 58, assets["ui_hud_power_bg.tex"] );
		GameBase.UI.IncDrawLayer();
		if ( (LEVEL_EDITOR.Power/LEVEL_EDITOR.MaxPower) > 0 ) {
			_r.rect( w/2, h-60, 194*(LEVEL_EDITOR.Power/LEVEL_EDITOR.MaxPower), 58, assets["ui_hud_power.tex"], 0.5, 0, 0.5+(LEVEL_EDITOR.Power/LEVEL_EDITOR.MaxPower)*0.5, 1 )
		} else {
			_r.rect( w/2, h-60, 194*(LEVEL_EDITOR.Power/LEVEL_EDITOR.MaxPower), 58, assets["ui_hud_power.tex"], 0.5, 1, 0.5-Math.abs(LEVEL_EDITOR.Power/LEVEL_EDITOR.MaxPower)*0.5, 0 )
		}
		GameBase.UI.IncDrawLayer();
		_r.rect( w/2-42, h-46, 84, 30, assets["ui_hud_power_text.tex"] );

		// Hole Info
		_r.color( 1, 1, 1, 1 )
		_r.rect( w/2-192, 5, 384, 40, assets["ui_hud_bg.tex"] );
		GameBase.UI.IncDrawLayer();
		//--_r.rect( 139, 5, 20, 20, _t.hud_numbers, MINIGOLF.NumberUVs( MINIGOLF.Hole ) )
		//MINIGOLF.DrawNumber( MINIGOLF.Hole, 139+4, 5 )
		//--_r.rect( 190, 5, 20, 20, _t.hud_numbers, MINIGOLF.NumberUVs( MINIGOLF.Course[MINIGOLF.Hole].Par ) )
		//MINIGOLF.DrawNumber( MINIGOLF.Course[MINIGOLF.Hole].Par, 190+4, 5 )
		//--_r.rect( 270, 5, 20, 20, _t.hud_numbers, MINIGOLF.NumberUVs( MINIGOLF.ShotNumber ) )
		//MINIGOLF.DrawNumber( MINIGOLF.ShotNumber, 270+4, 5 )
		GameBase.Text.SetFont( "minigolf_score" );
		GameBase.Text.SetSize( 40 );
		GameBase.Text.DrawText( w/2-192+91, 5+20, "1", 1, 1 );
		GameBase.Text.DrawText( w/2, 5+20, LEVEL_EDITOR.LevelSettings.Par , 1, 1 );
		GameBase.Text.DrawText( w/2+160, 5+20, LEVEL_EDITOR.Hits+1, 1, 1 );
	}
	this.UI.Editor.DrawModeCamera = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		if ( LEVEL_EDITOR.FlyOver == false ) {
			for ( var cam_id in LEVEL_EDITOR.CameraPoints ) {
				// Draw line
				var camera = LEVEL_EDITOR.CameraPoints[cam_id];
				if ( LEVEL_EDITOR.CameraPoints[Number(cam_id)+1] != undefined ) {
					// Valid line to draw
					var camera2 = LEVEL_EDITOR.CameraPoints[Number(cam_id)+1];
					var dist = ( Math.pow(camera[0]-camera2[0], 2) + Math.pow(camera[1]-camera2[1], 2) );
					dist = ( (dist === 0) ? (0) : Math.pow( dist, 0.5 ) );
					var ang = -Math.atan2(camera2[1] - camera[1], camera2[0] - camera[0]) * 180 / Math.PI;
					_r.color( 1, 0, 1, 1 );
					LEVEL_EDITOR.DrawRotatedRect( (w/2)-this.XOffset+camera[0], (h/2)-this.YOffset+camera[1], dist, 1, ang );
				}
				if ( Number(cam_id) === LEVEL_EDITOR.SelectedCamera ) {
					_r.color( 1, 1, 1, 1 );
					_r.rect( (w/2)-this.XOffset+camera[0]-7, (h/2)-this.YOffset+camera[1]-7, 14, 14 );
					GameBase.UI.IncDrawLayer();
				}
				_r.color( 1, 0, 1, 1 );
				_r.rect( (w/2)-this.XOffset+camera[0]-6, (h/2)-this.YOffset+camera[1]-6, 12, 12 );
				GameBase.Text.SetFont( "Mplus1m" );
				GameBase.Text.SetSize( 14 );
				_r.color( 0, 0, 0, 1 );
				GameBase.Text.DrawText( (w/2)-this.XOffset+camera[0]+1, (h/2)-this.YOffset+camera[1]+1, cam_id, 1, 1 );
				_r.color( 1, 1, 1, 1 );
				GameBase.Text.DrawText( (w/2)-this.XOffset+camera[0], (h/2)-this.YOffset+camera[1], cam_id, 1, 1 );
			}
		}
	}
	this.UI.Editor.DrawLevel = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		if ( LEVEL_EDITOR.World ) {
			MINIGOLF.Draw.Level( MINIGOLF.Draw.GenerateLevel( LEVEL_EDITOR.Level ), w, h, this.XOffset, this.YOffset );
			for ( var id in LEVEL_EDITOR.World.Collisions ){
				var item = LEVEL_EDITOR.World.Collisions[id];
				if ( item.ObjectType == "dynamic" && item.Draw != undefined ) {
					item.Draw( w, h, this.XOffset, this.YOffset );
				}
			}
		} else {
			MINIGOLF.Draw.Level( MINIGOLF.Draw.GenerateLevel( LEVEL_EDITOR.Level ), w, h, this.XOffset, this.YOffset, LEVEL_EDITOR.Level );
		}
		/*

		_r.color( 1, 1, 1, 1 )
		for ( item_id in LEVEL_EDITOR.Level ) {
			var item = LEVEL_EDITOR.Level[item_id];
			if ( item["type"] == "grass" ) {
				var pos = LEVEL_EDITOR.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) )
				var pos_x = (w/2)-this.XOffset+pos[0];
				var pos_y = (h/2)-this.YOffset+pos[1];
				for ( connection_id in item["con"] ) {
					//this.DrawConnection( item, connection_id )
				}
				//LEVEL_EDITOR.DrawRotatedRect( pos_x, pos_y, item["size"]["w"]*5, item["size"]["h"]*5, item["ang"], LEVEL_EDITOR.Materials["grass"], 0, 0, item["size"]["w"]*5/50, item["size"]["h"]*5/50 );
			}
		}
		this.DrawGrassTiles();
		this.DrawBlockTiles();

		GameBase.UI.IncDrawLayer();
		*/
		if ( LEVEL_EDITOR.Ball ) {
			_r.color( 1, 1, 1, 1 );
			_r.sprite(
				(w/2)-this.XOffset+(LEVEL_EDITOR.Ball.GetPosX()*LEVEL_EDITOR.WorldScale),
				(h/2)-this.YOffset+(LEVEL_EDITOR.Ball.GetPosY()*LEVEL_EDITOR.WorldScale),
				24, 24, -LEVEL_EDITOR.Ball.GetAngle(), assets["golfball.tex"] );
		}
		/*
		for ( item_id in LEVEL_EDITOR.Collisions ) {
			var item = LEVEL_EDITOR.Collisions[item_id];
			_r.color( 1, 1, 0, 0 );
			_r.sprite(
				(w/2)-this.XOffset+(item.GetPosition().get_x()*LEVEL_EDITOR.WorldScale),
				(h/2)-this.YOffset+(item.GetPosition().get_y()*LEVEL_EDITOR.WorldScale),
				item._width*LEVEL_EDITOR.WorldScale,
				item._height*LEVEL_EDITOR.WorldScale,
				-item.GetAngle() );
			//print("Test " + item.GetPosition().get_x())
		}
		*/
	}
	this.UI.Editor.DrawBlockTiles = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		// For every item in the level
		for ( id in LEVEL_EDITOR.Level ) {
			// Get our item
			var item = LEVEL_EDITOR.Level[id];
			// Check that it is in fact grass
			if ( item["type"] == "block" ) {
				// Create a quad of the block
				var size = item["size"];
				var points = [
					[ 0, 0 ],
					[ 0, size.h*5 ],
					[ size.w*5, size.h*5 ],
					[ size.w*5, 0 ]
				];
				var uvs = [
					[ 0, 0 ],
					[ 0, size.h/7 ],
					[ size.w/7, size.h/7 ],
					[ size.w/7, 0 ]
				];
				// Render the final mess
				var pos = LEVEL_EDITOR.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) )
				var pos_x = (w/2)-this.XOffset+pos[0];
				var pos_y = (h/2)-this.YOffset+pos[1];
				for ( point_id in points ) {
					points[point_id][0] = points[point_id][0] + pos_x;
					points[point_id][1] = points[point_id][1] + pos_y;
				}
				LEVEL_EDITOR.DrawRotatedQuad( points, uvs, pos_x, pos_y, item["ang"], LEVEL_EDITOR.Materials["block"].mat )
			}
		}
	}
	this.UI.Editor.DrawGrassTiles = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		// For every item in the level
		for ( id in LEVEL_EDITOR.Level ) {
			// Get our item
			var item = LEVEL_EDITOR.Level[id];
			// Check that it is in fact grass
			if ( item["type"] == "grass" ) {
				// Create a quad of the block
				var size = item["size"];
				var points = [
					[ 0, 0 ],
					[ 0, size.h*5 ],
					[ size.w*5, size.h*5 ],
					[ size.w*5, 0 ]
				];
				var uvs = [
					[ 0, 0 ],
					[ 0, size.h/10 ],
					[ size.w/10, size.h/10 ],
					[ size.w/10, 0 ]
				];
				// Loop through each connection this block has
				for ( conn_id in item["con"] ) {
					var conn = item["con"][conn_id];
					// Make sure we're connected to a valid block
					if ( LEVEL_EDITOR.Level[conn[0]] !== undefined ) {
						// Make sure it's grass
						if ( LEVEL_EDITOR.Level[conn[0]]["type"] == "grass" || LEVEL_EDITOR.Level[conn[0]]["type"] == "hole" ) {
							// Check the connection is valid
							if ( this.IsValidConnection( conn_id, conn[1] ) ) {
								// Store the second block
								var item2 = LEVEL_EDITOR.Level[conn[0]];
								var ang = item2["ang"] - item["ang"];
								ang = ang / 2
								// Calculate distance cut by other shape
								var dist = Math.tan( ang*(Math.PI/180) ) * (size.h*5);
								if ( conn_id == 1 ) {
									var curpos = points[1];
									var newpos = this.LerpPositions( curpos, [ size.w*5, size.h*5 ], dist/(size.w*5) );
									points[1] = newpos;
									uvs[1] = [ dist/50, size.h/10 ];
								} else if ( conn_id == 2 ) {
									dist = -dist;
									var curpos = points[2];
									var newpos = this.LerpPositions( curpos, [ 0, size.h*5 ], dist/(size.w*5) );
									points[2] = newpos;
									uvs[2] = [ (size.w-(dist/5))/10, size.h/10 ];
								} else if ( conn_id == 3 ) {
									if ( dist < 0 ) { // Dstance must be negative to represent the hitbox
										dist = -dist;
										var curpos = points[0];
										var newpos = this.LerpPositions( curpos, [ size.w*5, 0 ], dist/(size.w*5) );
										points[0] = newpos;
										uvs[0] = [ dist/50, 0 ];
									}
								} else if ( conn_id == 4 ) {
									if ( dist > 0 ) { // Dstance must be positive to represent the hitbox
										var curpos = points[3];
										var newpos = this.LerpPositions( curpos, [ 0, 0 ], dist/(size.w*5) );
										points[3] = newpos;
										uvs[3] = [ (size.w-(dist/5))/10, 0 ];
									}
								}
							}
						}
					}
				}
				// Render the final mess
				var pos = LEVEL_EDITOR.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) )
				var pos_x = (w/2)-this.XOffset+pos[0];
				var pos_y = (h/2)-this.YOffset+pos[1];
				for ( point_id in points ) {
					points[point_id][0] = points[point_id][0] + pos_x;
					points[point_id][1] = points[point_id][1] + pos_y;
				}
				LEVEL_EDITOR.DrawRotatedQuad( points, uvs, pos_x, pos_y, item["ang"], LEVEL_EDITOR.Materials[item["type"]].mat )
			} else if ( item["type"] == "hole" ) {
				// Create a quad of the block
				var size = item["size"];
				var points = [
					[ 0, 0 ],
					[ 0, size.h*5 ],
					[ size.w*5, size.h*5 ],
					[ size.w*5, 0 ]
				];
				var uvs = [
					[ 0, 0 ],
					[ 0, size.h/10 ],
					[ size.w/10, size.h/10 ],
					[ size.w/10, 0 ]
				];
				// Create a left-hand extrusion
				var left_points = [
					[ 0, 0 ],
					[ 0, 0 ],
					[ 0, size.h*5 ],
					[ 0, size.h*5 ]
				]
				var left_uvs = [
					[ 0, 0 ],
					[ 0, 0 ],
					[ 0, size.h/10 ],
					[ 0, size.h/10 ]
				]
				// Create a right-hand extrusion
				var right_points = [
					[ size.w*5, 0 ],
					[ size.w*5, 0 ],
					[ size.w*5, size.h*5 ],
					[ size.w*5, size.h*5 ]
				]
				var right_uvs = [
					[ size.w/10, 0 ],
					[ size.w/10, 0 ],
					[ size.w/10, size.h/10 ],
					[ size.w/10, size.h/10 ]
				]
				// Loop through each connection this block has
				for ( conn_id in item["con"] ) {
					var conn = item["con"][conn_id];
					// Make sure we're connected to a valid block
					if ( LEVEL_EDITOR.Level[conn[0]] !== undefined ) {
						// Make sure it's grass
						if ( LEVEL_EDITOR.Level[conn[0]]["type"] == "grass" || LEVEL_EDITOR.Level[conn[0]]["type"] == "hole" ) {
							// Check the connection is valid
							if ( this.IsValidConnection( conn_id, conn[1] ) ) {
								// Store the second block
								var item2 = LEVEL_EDITOR.Level[conn[0]];
								var ang = item2["ang"] - item["ang"];
								ang = ang / 2
								// Calculate distance cut by other shape
								var dist = Math.tan( ang*(Math.PI/180) ) * (size.h*5);
								if ( conn_id == 1 ) {
									var curpos = points[1];
									if ( dist < 0 ) {
										// Add to the extrusion
										var newpos = this.LerpPositions( curpos, [ size.w*5, size.h*5 ], dist/(size.w*5) );
										left_points[3] = newpos;
										left_uvs[3] = [dist/50, size.h/10];
									} else {
										// Modify the base block
										var newpos = this.LerpPositions( curpos, [ size.w*5, size.h*5 ], dist/(size.w*5) );
										points[1] = newpos;
										uvs[1] = [ dist/50, size.h/10 ];
									}
								} else if ( conn_id == 2 ) {
									dist = -dist;
									var curpos = points[2];
									if ( dist < 0 ) {
										// Add to the extrusion
										var newpos = this.LerpPositions( curpos, [ 0, size.h*5 ], dist/(size.w*5) );
										right_points[3] = newpos;
										right_uvs[3] = [ (size.w-(dist/5))/10, size.h/10 ];
									} else {
										// Modify the base block
										var newpos = this.LerpPositions( curpos, [ 0, size.h*5 ], dist/(size.w*5) );
										points[2] = newpos;
										uvs[2] = [ (size.w-(dist/5))/10, size.h/10 ];
									}
								} else if ( conn_id == 3 ) {
									if ( dist < 0 ) { // Dstance must be negative to represent the hitbox
										dist = -dist;
										var curpos = points[0];
										var newpos = this.LerpPositions( curpos, [ size.w*5, 0 ], dist/(size.w*5) );
										points[0] = newpos;
										uvs[0] = [ dist/50, 0 ];
									}
								} else if ( conn_id == 4 ) {
									if ( dist > 0 ) { // Dstance must be positive to represent the hitbox
										var curpos = points[3];
										var newpos = this.LerpPositions( curpos, [ 0, 0 ], dist/(size.w*5) );
										points[3] = newpos;
										uvs[3] = [ (size.w-(dist/5))/10, 0 ];
									}
								}
							}
						}
					}
				}
				// Render the final mess
				var pos = LEVEL_EDITOR.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) )
				var pos_x = (w/2)-this.XOffset+pos[0];
				var pos_y = (h/2)-this.YOffset+pos[1];
				for ( point_id in points ) {
					points[point_id][0] = points[point_id][0] + pos_x;
					points[point_id][1] = points[point_id][1] + pos_y;
				}
				for ( point_id in left_points ) {
					left_points[point_id][0] = left_points[point_id][0] + pos_x;
					left_points[point_id][1] = left_points[point_id][1] + pos_y;
				}
				for ( point_id in right_points ) {
					right_points[point_id][0] = right_points[point_id][0] + pos_x;
					right_points[point_id][1] = right_points[point_id][1] + pos_y;
				}
				LEVEL_EDITOR.DrawRotatedQuad( points, uvs, pos_x, pos_y, item["ang"], LEVEL_EDITOR.Materials["hole"].mat )
				LEVEL_EDITOR.DrawRotatedQuad( left_points, left_uvs, pos_x, pos_y, item["ang"], LEVEL_EDITOR.Materials["grass"].mat )
				LEVEL_EDITOR.DrawRotatedQuad( right_points, right_uvs, pos_x, pos_y, item["ang"], LEVEL_EDITOR.Materials["grass"].mat )
			}
		}
		//LEVEL_EDITOR.DrawRotatedQuad( [[0,0], [100, 10], [150, 70], [50, 60]], [[0,0], [1,0], [1,1], [0,1]], 0, 0, LEVEL_EDITOR.Settings.Rotation, LEVEL_EDITOR.Materials["grass"] );
	}
	this.UI.Editor.LerpPositions = function( pos1, pos2, amt ) {
		var x = pos1[0] + ( pos2[0] - pos1[0] ) * amt;
		var y = pos1[1] + ( pos2[1] - pos1[1] ) * amt;
		return [ x, y ];
	}
	this.UI.Editor.IsValidConnection = function( con1, con2 ) {
		if ( con1 == 1 ) {
			if ( con2 == 2 ) { return true };
		} else if ( con1 == 2 ) {
			if ( con2 == 1 ) { return true };
		} else if ( con1 == 3 ) {
			if ( con2 == 4 ) { return true };
		} else if ( con1 == 4 ) {
			if ( con2 == 3 ) { return true };
		}
		return false
	}
	this.UI.Editor.FindNearestWorldPoint = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		var distance = -1;
		var pos = {};
		pos[0] = 0;
		pos[1] = 0;
		var id = false;
		for ( item_id in LEVEL_EDITOR.Level ) {
			var item = LEVEL_EDITOR.Level[item_id];
			if ( item["type"] != "testgrass" ) {
				var corners = [];
				corners.push( LEVEL_EDITOR.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) ) );
				corners.push( LEVEL_EDITOR.RotatePoint( item["pos"]["x"]+item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) ) ) ;
				corners.push( LEVEL_EDITOR.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]+item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) ) ) ;
				corners.push( LEVEL_EDITOR.RotatePoint( item["pos"]["x"]+item["size"]["w"]*5/2, item["pos"]["y"]+item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) ) ) ;
				for ( corner_id in corners ) {
					var corner = corners[corner_id];

					GameBase.UI.IncDrawLayer();
					_r.color( 0, 1, 1, 0.2 );
					_r.rect( (w/2)-this.XOffset+corner[0]-3, (h/2)-this.YOffset+corner[1]-3, 6, 6 );
					_r.color( 0, 1, 1, 0.05 );
					var pos2 = LEVEL_EDITOR.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) )
					var pos_x = (w/2)-this.XOffset+pos2[0];
					var pos_y = (h/2)-this.YOffset+pos2[1];
					LEVEL_EDITOR.DrawRotatedRect( pos_x, pos_y, item["size"]["w"]*5, item["size"]["h"]*5, item["ang"], assets["overlay_stripe.tex"], 0, 0, item["size"]["w"]*5/6, item["size"]["h"]*5/6 );
					_r.color( 0, 1, 1, 1 );
					_r.rect( (w/2)-this.XOffset+corner[0]-3, (h/2)-this.YOffset+corner[1]-1, 6, 2 );
					_r.rect( (w/2)-this.XOffset+corner[0]-1, (h/2)-this.YOffset+corner[1]-3, 2, 6 );

					if ( corner_id == 0 ) {
						LEVEL_EDITOR.DrawRotatedRect( (w/2)-this.XOffset+corner[0], (h/2)-this.YOffset+corner[1], item["size"]["w"]*5, 1, item["ang"] );
					} else if ( corner_id == 1 ) {
						LEVEL_EDITOR.DrawRotatedRect( (w/2)-this.XOffset+corner[0], (h/2)-this.YOffset+corner[1], 1, item["size"]["h"]*5, item["ang"] );
					} else if ( corner_id == 2 ) {
						LEVEL_EDITOR.DrawRotatedRect( (w/2)-this.XOffset+corner[0], (h/2)-this.YOffset+corner[1], 1, -item["size"]["h"]*5, item["ang"] );
					} else if ( corner_id == 3 ) {
						LEVEL_EDITOR.DrawRotatedRect( (w/2)-this.XOffset+corner[0], (h/2)-this.YOffset+corner[1], -item["size"]["w"]*5, 1, item["ang"] );
					}

					var dist = ( Math.pow(this.CursorPosX-corner[0], 2) + Math.pow(this.CursorPosY-corner[1], 2) );
					dist = ( (dist === 0) ? (0) : Math.pow( dist, 0.5 ) );
					if ( dist < distance || distance == -1 ) {
						distance = dist;
						pos = corner;
						id = [Number(item_id), Number(corner_id)+1];
					}
				}
			}
		}
		return [ distance, pos, id ];
	}
	this.UI.Editor.FindNearestGridPoint = function() {
		var posx = 50*Math.round(this.CursorPosX/50);
		var posy = 50*Math.round(this.CursorPosY/50);
		var dist = ( Math.pow(this.CursorPosX-posx, 2) + Math.pow(this.CursorPosY-posy, 2) );
		dist = ( (dist === 0) ? (0) : Math.pow( dist, 0.5 ) );
		return [ dist, [ posx, posy] ];
	}
	this.UI.Editor.FindNearestPoint = function() {
		var block = this.FindNearestWorldPoint();
		var grid = this.FindNearestGridPoint();
		if ( ( ( block[0] == -1 ) && LEVEL_EDITOR.Settings.GridSnap ) || ( LEVEL_EDITOR.Settings.GridSnap && !LEVEL_EDITOR.Settings.BlockSnap ) ) {
			return [ grid[1], false ];
		} else if ( ( ( block[0] <= grid[0] ) && LEVEL_EDITOR.Settings.BlockSnap ) || ( LEVEL_EDITOR.Settings.BlockSnap && !LEVEL_EDITOR.Settings.GridSnap ) ) {
			return [ block[1], block[2] ];
		} else if ( LEVEL_EDITOR.Settings.GridSnap ) {
			return [ grid[1], false ];
		} else {
			return [ [this.CursorPosX, this.CursorPosY], false ];
		}
	}
	this.UI.Editor.IsPointInsideBlock = function( x, y, item ) {
		var corners = [];
		corners.push( LEVEL_EDITOR.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) ) );
		corners.push( LEVEL_EDITOR.RotatePoint( item["pos"]["x"]+item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) ) ) ;
		corners.push( LEVEL_EDITOR.RotatePoint( item["pos"]["x"]+item["size"]["w"]*5/2, item["pos"]["y"]+item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) ) ) ;
		corners.push( LEVEL_EDITOR.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]+item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) ) ) ;
		return this.IsPointInPolygon( x, y, corners );
	}
	this.UI.Editor.IsPointInPolygon = function( x, y, poly ) {
	    // ray-casting algorithm based on
	    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
		// function blatantly stolen from
		// https://github.com/substack/point-in-polygon/blob/master/index.js

	    // var x = point[0], y = point[1];

	    var inside = false;
	    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
	        var xi = poly[i][0], yi = poly[i][1];
	        var xj = poly[j][0], yj = poly[j][1];

	        var intersect = ((yi > y) != (yj > y))
	            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
	        if (intersect) inside = !inside;
	    }

	    return inside;
	};

	this.UI.Editor.DrawModePointer = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		for ( item_id in LEVEL_EDITOR.Selection ) {
			var item = LEVEL_EDITOR.Level[LEVEL_EDITOR.Selection[item_id]];
			if ( item["type"] != "testgrass" ) {
				var corners = [];
				corners.push( LEVEL_EDITOR.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) ) );
				corners.push( LEVEL_EDITOR.RotatePoint( item["pos"]["x"]+item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) ) ) ;
				corners.push( LEVEL_EDITOR.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]+item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) ) ) ;
				corners.push( LEVEL_EDITOR.RotatePoint( item["pos"]["x"]+item["size"]["w"]*5/2, item["pos"]["y"]+item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) ) ) ;
				for ( corner_id in corners ) {
					var corner = corners[corner_id];

					GameBase.UI.IncDrawLayer();
					_r.color( 1, 1, 0, 0.2 );
					_r.rect( (w/2)-this.XOffset+corner[0]-3, (h/2)-this.YOffset+corner[1]-3, 6, 6 );
					_r.color( 1, 1, 0, 0.05 );
					var pos2 = LEVEL_EDITOR.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) )
					var pos_x = (w/2)-this.XOffset+pos2[0];
					var pos_y = (h/2)-this.YOffset+pos2[1];
					LEVEL_EDITOR.DrawRotatedRect( pos_x, pos_y, item["size"]["w"]*5, item["size"]["h"]*5, item["ang"], assets["overlay_stripe.tex"], 0, 0, item["size"]["w"]*5/6, item["size"]["h"]*5/6 );
					_r.color( 1, 1, 0, 1 );
					_r.rect( (w/2)-this.XOffset+corner[0]-3, (h/2)-this.YOffset+corner[1]-1, 6, 2 );
					_r.rect( (w/2)-this.XOffset+corner[0]-1, (h/2)-this.YOffset+corner[1]-3, 2, 6 );

					if ( corner_id == 0 ) {
						LEVEL_EDITOR.DrawRotatedRect( (w/2)-this.XOffset+corner[0], (h/2)-this.YOffset+corner[1], item["size"]["w"]*5, 1, item["ang"] );
					} else if ( corner_id == 1 ) {
						LEVEL_EDITOR.DrawRotatedRect( (w/2)-this.XOffset+corner[0], (h/2)-this.YOffset+corner[1], 1, item["size"]["h"]*5, item["ang"] );
					} else if ( corner_id == 2 ) {
						LEVEL_EDITOR.DrawRotatedRect( (w/2)-this.XOffset+corner[0], (h/2)-this.YOffset+corner[1], 1, -item["size"]["h"]*5, item["ang"] );
					} else if ( corner_id == 3 ) {
						LEVEL_EDITOR.DrawRotatedRect( (w/2)-this.XOffset+corner[0], (h/2)-this.YOffset+corner[1], -item["size"]["w"]*5, 1, item["ang"] );
					}
				}
			}
		}
	}
	this.UI.Editor.DrawModeBlock = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		if ( this.IsHovered() ) {
			GameBase.UI.IncDrawLayer();
			_r.color( 1, 1, 1, 1 );
			var material = LEVEL_EDITOR.Materials[LEVEL_EDITOR.Settings.Material].mat;
			var pos = GameBase.UI.GetLocalCursorPos( this );
			var cpos = [];
			pos[0] = Math.round( ( -((w/2)-pos[0])+this.XOffset ) );	// "World" cursor position
			cpos[0] = pos[0];
			pos[1] = Math.round( ( -((h/2)-pos[1])+this.YOffset ) );	// "World" cursor position
			cpos[1] = pos[1];
			this.CursorPosX = pos[0];
			this.CursorPosY = pos[1];
			var result = this.FindNearestPoint();
			var pos = result[0];
			var block = result[1];
			this.CursorBlock = block;
			this.CursorPosX = pos[0];
			this.CursorPosY = pos[1];
			var size = [LEVEL_EDITOR.Settings.Size.w, LEVEL_EDITOR.Settings.Size.h];

			_r.color( 1, 1, 1, ( ((GameBase.GetTime() % 1) > 0.5) ? (0.5+(1 - GameBase.GetTime() % 0.5 * 2)/2) : (0.5+(GameBase.GetTime() % 0.5 * 2)/2) ) )
			if ( LEVEL_EDITOR.Settings.Orientation == 1 ) {
				LEVEL_EDITOR.DrawRotatedRect( (w/2)-this.XOffset+pos[0], (h/2)-this.YOffset+pos[1], size[0]*5, size[1]*5, LEVEL_EDITOR.Settings.Rotation, material, 0, 0, size[0]*5/50, size[1]*5/50 );
			} else if ( LEVEL_EDITOR.Settings.Orientation == 2 ) {
				LEVEL_EDITOR.DrawRotatedRect( (w/2)-this.XOffset+pos[0], (h/2)-this.YOffset+pos[1], -size[0]*5, size[1]*5, LEVEL_EDITOR.Settings.Rotation, material, size[0]*5/50, 0, 0, size[1]*5/50 );
			} else if ( LEVEL_EDITOR.Settings.Orientation == 3 ) {
				LEVEL_EDITOR.DrawRotatedRect( (w/2)-this.XOffset+pos[0], (h/2)-this.YOffset+pos[1], size[0]*5, -size[1]*5, LEVEL_EDITOR.Settings.Rotation, material, 0, size[1]*5/50, size[0]*5/50, 0 );
			} else if ( LEVEL_EDITOR.Settings.Orientation == 4 ) {
				LEVEL_EDITOR.DrawRotatedRect( (w/2)-this.XOffset+pos[0], (h/2)-this.YOffset+pos[1], -size[0]*5, -size[1]*5, LEVEL_EDITOR.Settings.Rotation, material, size[0]*5/50, size[1]*5/50, 0, 0 );

			}
			// Draw red cursor
			GameBase.UI.IncDrawLayer();
			_r.color( 0, 1, 0, 0.2 );
			_r.rect( (w/2)-this.XOffset+pos[0]-5, (h/2)-this.YOffset+pos[1]-5, 10, 10 );
			_r.color( 0, 1, 0, 1 );
			_r.rect( (w/2)-this.XOffset+pos[0]-5, (h/2)-this.YOffset+pos[1]-1, 10, 2 );
			_r.rect( (w/2)-this.XOffset+pos[0]-1, (h/2)-this.YOffset+pos[1]-5, 2, 10 );
			// Draw purple cursor
			GameBase.UI.IncDrawLayer();
			_r.color( 1, 0, 1, 0.2 );
			_r.rect( (w/2)-this.XOffset+cpos[0]-5, (h/2)-this.YOffset+cpos[1]-5, 10, 10 );
			_r.color( 1, 0, 1, 1 );
			_r.rect( (w/2)-this.XOffset+cpos[0]-5, (h/2)-this.YOffset+cpos[1]-1, 10, 2 );
			_r.rect( (w/2)-this.XOffset+cpos[0]-1, (h/2)-this.YOffset+cpos[1]-5, 2, 10 );
		}
	}

	LEVEL_EDITOR.Log( "    Creating Bottom bar..." );
	this.UI.BottomBar = GameBase.UI.CreateElement( "base", this.UI );
	this.UI.BottomBar.SetPos( 0, this.UI.GetHeight()-20 );
	this.UI.BottomBar.SetSize( this.UI.GetWidth(), 20 );
	this.UI.BottomBar.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 0.9, 0.9, 0.9, 1 );
		_r.rect( 0, 0, w, h );

		GameBase.UI.IncDrawLayer();
		_r.color( 0.1, 0.1, 0.1, 1 )
		GameBase.Text.SetFont( "Mplus1m" );
		GameBase.Text.SetSize( 12 );
		GameBase.Text.DrawText( 5, h/2, "Position X: ", 0, 1 );
		var t_w1 = GameBase.Text.GetTextWidth( "Position X: " );
		var t_w2 = GameBase.Text.GetTextWidth( " " );
		GameBase.Text.SetFont( "Mplus1m Bold" );
		GameBase.Text.DrawText( 5+t_w1, h/2, String(LEVEL_EDITOR.UI.Editor.CursorPosX), 0, 1 );
		GameBase.Text.SetFont( "Mplus1m" );
		GameBase.Text.DrawText( 5+t_w1+t_w2*8, h/2, "Y: ", 0, 1 );
		GameBase.Text.SetFont( "Mplus1m Bold" );
		GameBase.Text.DrawText( 5+t_w1+t_w2*11, h/2, String(LEVEL_EDITOR.UI.Editor.CursorPosY), 0, 1 );
	}


	GameBase.Hooks.Add( "OnKeyPressed", "bam", function( key ) {
		if ( key == 87 ) {
			LEVEL_EDITOR.UI.SettingsBar.RotationEntry.Entry.SetValue( ((LEVEL_EDITOR.UI.SettingsBar.RotationEntry.Entry.GetValue() + 5)%360 + 360)%360 );
		} else if ( key == 86 ) {
			LEVEL_EDITOR.UI.SettingsBar.RotationEntry.Entry.SetValue( ((LEVEL_EDITOR.UI.SettingsBar.RotationEntry.Entry.GetValue() - 5)%360 + 360)%360 );
		} else if ( key == 7 ) {
			LEVEL_EDITOR.Ball.ApplyLinearImpulse( new LEVEL_EDITOR.Physics.b2Vec2( 1000, 0 ), LEVEL_EDITOR.Ball.GetWorldCenter(), true );
		} else if ( key == 22 ) {
			LEVEL_EDITOR.Ball.ApplyLinearImpulse( new LEVEL_EDITOR.Physics.b2Vec2( 2000, 0 ), LEVEL_EDITOR.Ball.GetWorldCenter(), true );
		} else if ( key == 76 ) {
			LEVEL_EDITOR.UI.Editor.DeleteSelection();
		}
	})

	LEVEL_EDITOR.Log( "Opened the Level Editor." );

}
LEVEL_EDITOR.CreateSettingsUI = function() {
	var overlay = GameBase.UI.CreateElement( "base" );
	overlay.SetPos( 0, 0 );
	overlay.SetSize( GameBase.GetScrW(), GameBase.GetScrH() );
	overlay.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 0, 0, 0, 0.8 );
		_r.rect( 0, 0, w, h );
	}

	var base = GameBase.UI.CreateElement( "base", overlay );
	base.SetPos( overlay.GetWidth()/2-200, overlay.GetHeight()/2-60 );
	base.SetSize( 400, 120 );
	base.Buttons = [];
	base.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 1,1,1,1 );
		_r.rect( 0, 0, w, h );

		_r.color( 0, 0, 0, 1 );
		GameBase.UI.IncDrawLayer();
		GameBase.Text.SetFont( "Mplus1m Bold" );
		GameBase.Text.SetSize( 14 );
		GameBase.Text.DrawText( 5, 10, "Minigolf - Level Settings", 0, 1 );

		_r.color( 0.9, 0.9, 0.9, 1 );
		_r.rect( 0, 20, w, h-20 );
	}

	var close = GameBase.UI.CreateElement( "button", base );
	close.SetPos( base.GetWidth()-50, 0 );
	close.SetSize( 50, 20 );
	close.OnClicked = function() {
		overlay.Remove();
	}
	close.Draw = function() {
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

	var name = GameBase.UI.CreateElement( "base", base );
	name.SetPos( 0, 25 );
	name.SetSize( base.GetWidth(), 30 );
	name.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 0.1, 0.1, 0.1, 1 );
		GameBase.Text.SetFont( "Mplus1m" );
		GameBase.Text.SetSize( 20 );
		GameBase.Text.DrawText( 10, 0, "Level Name:", 0, 0 );
		GameBase.Text.SetSize( 10 );
		GameBase.Text.DrawText( 10, 18, "The name of this level", 0, 0 );
	}

	var name_entry = GameBase.UI.CreateElement( "entry", name );
	name_entry.SetPos( name.GetWidth()/2, 0 );
	name_entry.SetSize( name.GetWidth()/2, name.GetHeight() );
	name_entry.SetText( LEVEL_EDITOR.LevelSettings.Name );

	var par = GameBase.UI.CreateElement( "base", base );
	par.SetPos( 0, 60 );
	par.SetSize( base.GetWidth(), 30 );
	par.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 0.1, 0.1, 0.1, 1 );
		GameBase.Text.SetFont( "Mplus1m" );
		GameBase.Text.SetSize( 20 );
		GameBase.Text.DrawText( 10, 0, "Level Par:", 0, 0 );
		GameBase.Text.SetSize( 10 );
		GameBase.Text.DrawText( 10, 18, "The par for this Level (1-99)", 0, 0 );
	}

	var par_entry = GameBase.UI.CreateElement( "numentry", par );
	par_entry.SetPos( name.GetWidth()/2, 0 );
	par_entry.SetSize( name.GetWidth()/2, name.GetHeight() );
	par_entry.SetValue( LEVEL_EDITOR.LevelSettings.Par );
	par_entry.SetMinValue( 1 );
	par_entry.SetMaxValue( 99 );
	par_entry.SetIncrement( 1 );
	par_entry.SetForceIncrement( true );

	var cancel = GameBase.UI.CreateElement( "button", base );
	cancel.SetPos( 5, base.GetHeight()-25 );
	cancel.SetSize( 65, 20 );
	cancel.SetText( "Cancel" );
	cancel.SetTextSize( 15 );
	cancel.OnClicked = function() {
		overlay.Remove();
	}

	var save = GameBase.UI.CreateElement( "button", base );
	save.SetPos( base.GetWidth()-70, base.GetHeight()-25 );
	save.SetSize( 65, 20 );
	save.SetText( "Save" );
	save.SetTextSize( 15 );
	save.OnClicked = function() {
		LEVEL_EDITOR.LevelSettings.Name = name_entry.GetText();
		LEVEL_EDITOR.LevelSettings.Par = par_entry.GetValue();
		overlay.Remove();
	}

}
LEVEL_EDITOR.Log = function( msg ) {
	GameBase.Console.Log( [ [211/255, 84/255, 0, 1], "[", [230/255, 126/255, 34/255, 1], "LEVEL EDITOR", [211/255, 84/255, 0, 1], "] ", [1,1,1,1], ...arguments ] )
}
LEVEL_EDITOR.DrawRotatedRect = function( x, y, w, h, ang, tex, u1, v1, u2, v2 ) {
	if ( u1 == undefined ) { u1 = 0 };
	if ( v1 == undefined ) { v1 = 0 };
	if ( u2 == undefined ) { u2 = 1 };
	if ( v2 == undefined ) { v2 = 1 };
	ang = -ang * ( Math.PI / 180 );
	var point_1 = [ x, y ];
	var point_2 = this.RotatePoint( x+w, y, x, y, ang );
	var point_3 = this.RotatePoint( x+w, y+h, x, y, ang );
	var point_4 = this.RotatePoint( x, y+h, x, y, ang );
	_r.quad( point_1[0], point_1[1], u1, v1, point_2[0], point_2[1], u2, v1, point_3[0], point_3[1], u2, v2, point_4[0], point_4[1], u1, v2, tex );
}
LEVEL_EDITOR.DrawRotatedQuad = function( points, uvs, x, y, ang, tex ) {
	ang = -ang * ( Math.PI / 180 );
	var point_1 = this.RotatePoint( points[0][0], points[0][1], x, y, ang );
	var point_2 = this.RotatePoint( points[1][0], points[1][1], x, y, ang );
	var point_3 = this.RotatePoint( points[2][0], points[2][1], x, y, ang );
	var point_4 = this.RotatePoint( points[3][0], points[3][1], x, y, ang );
	_r.quad( point_1[0], point_1[1], uvs[0][0], uvs[0][1],
	point_2[0], point_2[1], uvs[1][0], uvs[1][1],
	point_3[0], point_3[1], uvs[2][0], uvs[2][1],
	point_4[0], point_4[1], uvs[3][0], uvs[3][1], tex );
}
LEVEL_EDITOR.RotatePoint = function( x, y, anc_x, anc_y, ang ) {
	var new_x = Math.cos( ang ) * ( x - anc_x ) - Math.sin( ang ) * ( y - anc_y ) + anc_x;
	var new_y = Math.sin( ang ) * ( x - anc_x ) + Math.cos( ang ) * ( y - anc_y ) + anc_y;
	return [ new_x, new_y ];
}
LEVEL_EDITOR.BuildLevel = function() {
	var world = new MINIGOLF.Physics.Level( this.Level, this.WorldScale );
	var ball = new MINIGOLF.Physics.Ball( world, this.WorldScale );
	this.Ball = ball;
	this.World = world;
	GameBase.Hooks.Add( "Think", "PhysicsStep", function( time, dt ) {
		world.Think( time, dt );
	})
}
LEVEL_EDITOR.BuildLevelOld = function() {
	this.Collisions = [];

	var phys = this.Physics;
	var gravity = new phys.b2Vec2( 0.0, 40 );
	var world = new phys.b2World( gravity, true );

	var listener = new phys.JSContactListener();
	listener.BeginContact = function() {};
	listener.EndContact = function() {};
	listener.PreSolve = function() {};
	listener.PostSolve = function() {};

	world.SetContactListener( listener );

	for ( item_id in this.Level ) {
		var item = this.Level[item_id];
		// If the block is grass
		if ( item["type"] == "grass" || item["type"] == "block" ) {
			var bd = new phys.b2BodyDef()
			bd.set_type(phys.b2_staticBody)
			bd.set_position( new phys.b2Vec2( item["pos"]["x"] / this.WorldScale, item["pos"]["y"] / this.WorldScale ) )
			bd.set_angle( -item["ang"] * ( Math.PI / 180 ) );
			var ground = world.CreateBody( bd )

			var shape = new phys.b2PolygonShape();
			shape.SetAsBox( item["size"]["w"]*5 / 2 / this.WorldScale, item["size"]["h"]*5 / 2 / this.WorldScale );

			var fix = new phys.b2FixtureDef();
			fix.set_shape( shape );
			fix.set_density( 1 );
			fix.set_friction( 1 );
			fix.set_restitution( 0.2 );

			ground.CreateFixture( fix )

			ground._width = item["size"]["w"]*5 / this.WorldScale;
			ground._height = item["size"]["h"]*5 / this.WorldScale;
			this.Collisions.push( ground );
		} else if ( item["type"] == "hole" ) {
			// Left Bit
			var pos = LEVEL_EDITOR.RotatePoint( (item["pos"]["x"]-20) / this.WorldScale, (item["pos"]["y"]) / this.WorldScale, item["pos"]["x"] / this.WorldScale, item["pos"]["y"] / this.WorldScale, -item["ang"] * ( Math.PI / 180 ) )
			var bd = new phys.b2BodyDef()
			bd.set_type(phys.b2_staticBody)
			bd.set_position( new phys.b2Vec2( pos[0], pos[1] ) )
			bd.set_angle( -item["ang"] * ( Math.PI / 180 ) );
			var ground = world.CreateBody( bd )

			var shape = new phys.b2PolygonShape();
			shape.SetAsBox( 10 / 2 / this.WorldScale, 50 / 2 / this.WorldScale );

			var fix = new phys.b2FixtureDef();
			fix.set_shape( shape );
			fix.set_density( 1 );
			fix.set_friction( 1 );
			fix.set_restitution( 0.2 );

			ground.CreateFixture( fix )

			ground._width = 10 / this.WorldScale;
			ground._height = 50 / this.WorldScale;
			this.Collisions.push( ground );

			// Right Bit
			var pos = LEVEL_EDITOR.RotatePoint( (item["pos"]["x"]+20) / this.WorldScale, (item["pos"]["y"]) / this.WorldScale, item["pos"]["x"] / this.WorldScale, item["pos"]["y"] / this.WorldScale, -item["ang"] * ( Math.PI / 180 ) )
			var bd = new phys.b2BodyDef()
			bd.set_type(phys.b2_staticBody)
			bd.set_position( new phys.b2Vec2( pos[0], pos[1] ) )
			bd.set_angle( -item["ang"] * ( Math.PI / 180 ) );
			var ground = world.CreateBody( bd )

			var shape = new phys.b2PolygonShape();
			shape.SetAsBox( 10 / 2 / this.WorldScale, 50 / 2 / this.WorldScale );

			var fix = new phys.b2FixtureDef();
			fix.set_shape( shape );
			fix.set_density( 1 );
			fix.set_friction( 1 );
			fix.set_restitution( 0.2 );

			ground.CreateFixture( fix )

			ground._width = 10 / this.WorldScale;
			ground._height = 50 / this.WorldScale;
			this.Collisions.push( ground );

			// Bottom Bit
			var pos = LEVEL_EDITOR.RotatePoint( (item["pos"]["x"]) / this.WorldScale, (item["pos"]["y"]+20) / this.WorldScale, item["pos"]["x"] / this.WorldScale, item["pos"]["y"] / this.WorldScale, -item["ang"] * ( Math.PI / 180 ) )
			var bd = new phys.b2BodyDef()
			bd.set_type(phys.b2_staticBody)
			bd.set_position( new phys.b2Vec2( pos[0], pos[1] ) )
			bd.set_angle( -item["ang"] * ( Math.PI / 180 ) );
			var ground = world.CreateBody( bd )

			var shape = new phys.b2PolygonShape();
			shape.SetAsBox( 50 / 2 / this.WorldScale, 10 / 2 / this.WorldScale );

			var fix = new phys.b2FixtureDef();
			fix.set_shape( shape );
			fix.set_density( 1 );
			fix.set_friction( 1 );
			fix.set_restitution( 0.2 );

			ground.CreateFixture( fix )

			ground._width = 50 / this.WorldScale;
			ground._height = 10 / this.WorldScale;
			this.Collisions.push( ground );
		}
	}

	// Create the ball
	var bd = new phys.b2BodyDef()
	bd.set_type( phys.b2_dynamicBody );
	bd.set_position( new phys.b2Vec2( 0, 0 ) );
	this.Ball = world.CreateBody( bd );

	var shape = new phys.b2CircleShape();
	shape.set_m_radius( 24/2 / this.WorldScale )

	var fix = new phys.b2FixtureDef();
	fix.set_shape( shape );
	fix.set_density( 1 );
	fix.set_friction( 2 );
 	fix.set_restitution( 0.3 );

	this.Ball.CreateFixture( fix );
	this.Ball.SetAngularDamping( 0.9 );
	this.Ball.SetLinearDamping( 0.25 );
	for ( k in this.Ball ) {
		print( k + " " + this.Ball[k] );
	}

	GameBase.Hooks.Add( "Think", "PhysicsStep", function( time, dt ) {
		world.Step( dt, 3, 3 );
	})

	//LEVEL_EDITOR.CreateTestingHUD();
}
LEVEL_EDITOR.CreateTestingHUD = function() {
	if ( this.UI.Editor.PowerBar != undefined ) {
		this.UI.Editor.PowerBar.Remove();
	}
	this.UI.Editor.PowerBar = GameBase.UI.CreateElement( "base", this.UI.Editor );
	var w = this.UI.Editor.GetWidth();
	var h = this.UI.Editor.GetHeight();
	this.UI.Editor.PowerBar.SetPos( 100, h-100 );
	this.UI.Editor.PowerBar.SetSize( w-200, 25 );
	this.UI.Editor.PowerBar.Power = 0;
	this.UI.Editor.PowerBar.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 41/255, 41/255, 41/255, 1 );
		_r.rect( 0, 0, w, h );
		_r.color( 0, 0, 0, 1 );
		_r.rect( 0, 0, w, 1 );
		_r.rect( 0, h-1, w, 1 );
		_r.rect( 0, 1, 1, h-2 );
		_r.rect( w-1, 1, 1, h-2 );

		this.Power = 0;
		if ( this.IsHovered() ) {
			var pos = GameBase.UI.GetLocalCursorPos( this );
			GameBase.UI.IncDrawLayer();
			_r.color( 225/255, 62/255, 117/255, 1 );
			_r.rect( w/2, 0, (pos[0]-(w/2)), h );
			this.Power = Math.round( (pos[0]-(w/2))/(w/2)*3000 );
		}

		GameBase.UI.IncDrawLayer();

		GameBase.Text.SetFont( "Mplus1m" );
		GameBase.Text.SetSize( 20 );
		_r.color( 1, 1, 1, 1 );
		GameBase.Text.DrawText( w/2, h/2, "Power: "+this.Power, 1, 1 );
	}
	this.UI.Editor.PowerBar.OnClicked = function( x, y, button ) {
		if ( button == 1 ) {
			LEVEL_EDITOR.Ball.Hit( this.Power );
			//LEVEL_EDITOR.Ball.ApplyLinearImpulse( new LEVEL_EDITOR.Physics.b2Vec2( this.Power, 0 ), LEVEL_EDITOR.Ball.GetWorldCenter(), true );
		}
	}
}

// Adds to the undo stack
LEVEL_EDITOR.AddUndo = function( type, current, previous, clear_redo ) {
	var clear_redo = ( clear_redo != undefined ? clear_redo : true );
	this.Undos.push( {
		type: type,
		current: current,
		previous: previous
	} );
	if ( clear_redo ) {
		this.Redos = [];
	}
}

// Adds to the redo stack
LEVEL_EDITOR.AddRedo = function( type, current, previous ) {
	this.Redos.push( {
		type: type,
		current: current,
		previous: previous
	} );
}

// Does an undo. Adds the undo to the redo stack
LEVEL_EDITOR.Undo = function() {
	if ( this.Undos.length > 0 ) {
		var data = this.Undos.pop();
		if ( data["type"] == "create_block" ) {
			var block = data["current"];
			this.DeleteCreatedBlock( block["id"] )
			this.AddRedo( "delete_block", null, block );
			this.AddNotification( "undo", "Successfully undone block." )
		} else if ( data["type"] == "delete_selection" ) {
			for ( var i in data["previous"] ) {
				var block = data["previous"][i];
				this.CreateUndoneBlock( block["id"], block["data"] );
			}
			this.AddRedo( "create_selection", data["previous"], null );
			this.AddNotification( "undo", "Successfully undeleted block(s)." )
		} else if ( data["type"] == "create_camera" ) {
			var cam = data["current"];
			if ( this.SelectedCamera == cam["id"] ) {
				this.SelectedCamera = false;
			}
			this.CameraPoints.splice( cam["id"], 1 );
			this.AddRedo( "delete_camera", null, data["current"] );
			this.AddNotification( "undo", "Successfully undone camera point." )
		} else if ( data["type"] == "delete_camera" ) {
			var cam = data["previous"];
			this.CameraPoints.splice( cam["id"], 0, cam["data"] );
			this.AddRedo( "create_camera", data["previous"], null );
			this.AddNotification( "undo", "Successfully undeleted camera point." )
		} else if ( data["type"] == "move_camera" ) {
			var cam_cur = data["current"];
			var cam_old = data["previous"];
			this.CameraPoints[cam_cur["id"]] = cam_old["data"];
			this.AddRedo( "move_camera", cam_old, cam_cur );
			this.AddNotification( "undo", "Successfully unmoved camera point." )
		}
	} else {
		this.AddNotification( "error", "There is nothing to Undo." );
	}
}

// Redoes an undo. Adds the redo to the undo stack
LEVEL_EDITOR.Redo = function() {
	if ( this.Redos.length > 0 ) {
		var data = this.Redos.pop();
		if ( data["type"] == "delete_block" ) {
			var block = data["previous"];
			this.CreateUndoneBlock( block["id"], block["data"] );
			this.AddUndo( "create_block", block, null, false );
			this.AddNotification( "redo", "Successfully re-created block." )
		} else if ( data["type"] == "create_selection" ) {
			for ( var i in data["current"] ) {
				var block = data["current"][i];
				this.DeleteCreatedBlock( block["id"] );
			}
			this.AddUndo( "delete_selection", null, data["current"], false );
			this.AddNotification( "redo", "Successfully re-deleted block." )
		} else if ( data["type"] == "delete_camera" ) {
			var cam = data["previous"];
			this.CameraPoints.splice( cam["id"], 0, cam["data"] );
			this.AddUndo( "create_camera", data["previous"], null, false );
			this.AddNotification( "redo", "Successfully re-created camera point." )
		} else if ( data["type"] == "create_camera" ) {
			var cam = data["current"];
			if ( this.SelectedCamera == cam["id"] ) {
				this.SelectedCamera = false;
			}
			this.CameraPoints.splice( cam["id"], 1 );
			this.AddUndo( "delete_camera", null, data["current"], false );
			this.AddNotification( "redo", "Successfully re-deleted camera point." )
		} else if ( data["type"] == "move_camera" ) {
			var cam_cur = data["current"];
			var cam_old = data["previous"];
			this.CameraPoints[cam_cur["id"]] = cam_old["data"];
			this.AddUndo( "move_camera", cam_old, cam_cur, false );
			this.AddNotification( "redo", "Successfully re-positioned camera point." )
		}
	} else {
		this.AddNotification( "error", "There is nothing to Redo." );
	}
}

// Creates a block from an Undo state
LEVEL_EDITOR.CreateUndoneBlock = function( id, data ) {
	this.Level[id] = data;
	if ( this.Level[id]["con"] ) {
		for ( corner in this.Level[id]["con"] ) {
			var itm_id = this.Level[id]["con"][corner];
			if ( !this.Level[itm_id[0]]["con"] ) {
				this.Level[itm_id[0]]["con"] = [];
			}
			this.Level[itm_id[0]]["con"][itm_id[1]] = [ id, corner ];
		}
	}
}

// Deletes a block
LEVEL_EDITOR.DeleteCreatedBlock = function( id ) {
	if ( this.Level[id]["con"] ) {
		for ( corner in this.Level[id]["con"] ) {
			var itm_id = this.Level[id]["con"][corner];
			delete this.Level[itm_id[0]]["con"][itm_id[1]];
		}
	}
	for ( var index in LEVEL_EDITOR.Selection ) {
		var sel_id = LEVEL_EDITOR.Selection[index];
		if ( sel_id == id ) {
			LEVEL_EDITOR.Selection.splice( index, 1 );
		}
	}
	delete this.Level[id];
}

// Creates notifications
LEVEL_EDITOR.AddNotification = function( type, text, duration ) {
	duration = ( duration != undefined ) ? duration : 5 ;
	this.Notifications.push( {
		type: type,
		text: text,
		duration: duration,
		start: GameBase.GetTime()
	} )
}


GameBase.Console.AddCommand( "leveledit", function() {
	LEVEL_EDITOR.Log( "Opening the Level Editor UI..." );
	LEVEL_EDITOR.CreateUI();
}, "Opens the Minigolf level editor." )
//LEVEL_EDITOR.CreateUI();
