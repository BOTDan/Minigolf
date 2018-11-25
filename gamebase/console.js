// GameBase Console
GameBase.Console = {};

// Console Colours
CONSOLE_RED = [232/255, 65/255, 24/255, 1.0];

// Console Variables
GameBase.Console.Commands = [];
GameBase.Console.IsOpen = false;
GameBase.Console.Entries = [];
GameBase.Console.Commands = [];
GameBase.Console.UI = {};

// Adds a command to the console
GameBase.Console.AddCommand = function( name, callback, helptext ) {
	if ( helptext == undefined ) {
		helptext = "";
	}
	var command = {};
	command.name = name;
	command.callback = callback;
	command.helptext = helptext;
	this.Commands[name] = command;
}

// Attempts to run a command (INTERNAL)
GameBase.Console.AttemptCommand = function( name ) {
	if ( this.Commands[name] != undefined ) {
		if ( arguments.length > 0 ) {
			var args = Array.prototype.slice.call(arguments, 1)
			this.Commands[name].callback( ...args );
		} else {
			this.Commands[name].callback();
		}
	} else {
		this.Log( [ CONSOLE_RED, "\""+String(name)+"\" is not a valid command. Try \"info\"." ] );
	}
}

// Create the console
GameBase.Console.ToggleConsole = function() {
	if ( this.IsOpen ) {
		this.CloseConsole();
	} else {
		this.OpenConsole();
	}
	this.IsOpen = !this.IsOpen;
}

// Adds something to the console
GameBase.Console.Log = function( text ) {
	this.Entries.push( text );
	if ( this.IsOpen ) {
		var panel = GameBase.UI.CreateElement( "text" );
		panel.SetSize( 20, 20 )
		panel.SetText( text );
		this.UI.ScrollBox.AddItem( panel )
	}
	//GameBase.Hooks.Call( "ConsoleUpdated", text );
}

GameBase.Console.Log( "########################################" );
GameBase.Console.Log( "# CONSOLE SYSTEM                       #" );
GameBase.Console.Log( "#   Initialised                        #" );
GameBase.Console.Log( [ "#   Type ", [46/255, 204/255, 113/255, 1], "\"info\"", [1,1,1,1], " for more information.  #" ] );
GameBase.Console.Log( "########################################" );

// Cleases the console
GameBase.Console.CloseConsole = function() {
	this.UI.Remove();
	this.UI = {};
}

// Makes the console
GameBase.Console.OpenConsole = function() {
	this.UI = GameBase.UI.CreateElement( "base" );
	this.UI.SetPos( 0, 0 );
	this.UI.SetSize( GameBase.GetScrW(), GameBase.GetScrH() );
	this.UI.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 0, 0, 0, 0.5 );
		_r.rect( 0, 0, w, h );
	}

	this.UI.TextBox = GameBase.UI.CreateElement( "entry", this.UI );
	this.UI.TextBox.SetPos( 0, this.UI.GetHeight()-50 );
	this.UI.TextBox.SetSize( this.UI.GetWidth(), 50 );
	this.UI.TextBox.TextColour = [1,1,1,1];
	this.UI.TextBox.TextSize = 30;
	this.UI.TextBox.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 0, 0, 0, 0.5 );
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
		} else {
			_r.color( 0, 0, 0, 1 );
			_r.rect( 0, 0, w, 1 );
			_r.rect( 0, h-1, w, 1 );
			_r.rect( 0, 1, 1, h-2 );
			_r.rect( w-1, 1, 1, h-2 );
		}

		GameBase.UI.IncDrawLayer();
		this.DrawCharacters();
	}
	this.UI.TextBox.OnEnterPressed = function() {
		var args = this.GetText().trim().split( " " );
		GameBase.Console.Log( "> "+this.GetText() );
		if ( args[0] ) {
			var command = args[0]
			args.shift();
			GameBase.Console.AttemptCommand( command, ...args  );
		}
		this.Clear()
	}

	this.UI.ScrollBox = GameBase.UI.CreateElement( "scroll", this.UI );
	this.UI.ScrollBox.SetPos( 0, 0 );
	this.UI.ScrollBox.SetSize( this.UI.GetWidth(), this.UI.GetHeight()-50 );
	this.UI.ScrollBox.Update();
	this.UI.ScrollBox.ScrollDrag.Draw = function() {
		var w = this.GetWidth();
		var h = this.GetHeight();

		_r.color( 0, 0, 0, 0.5 );
		_r.rect( 0, 0, w, h );

		if ( !this.GetParent().GetParent().Dragging && this.IsHovered() ) {
			GameBase.UI.IncDrawLayer();
			_r.color( 0.75, 0.75, 0.75, 1 );
			_r.rect( 0, 0, w, 1 );
			_r.rect( 0, h-1, w, 1 );
			_r.rect( 0, 1, 1, h-2 );
			_r.rect( w-1, 1, 1, h-2 );
		} else if ( this.GetParent().GetParent().Dragging ) {
			_r.color( 0.1, 0.4, 1, 1 );
			_r.rect( 0, 0, w, 1 );
			_r.rect( 0, h-1, w, 1 );
			_r.rect( 0, 1, 1, h-2 );
			_r.rect( w-1, 1, 1, h-2 );
		} else {
			_r.color( 0, 0, 0, 1 );
			_r.rect( 0, 0, w, 1 );
			_r.rect( 0, h-1, w, 1 );
			_r.rect( 0, 1, 1, h-2 );
			_r.rect( w-1, 1, 1, h-2 );
		}

		GameBase.UI.IncDrawLayer();
	}

	for ( var x in this.Entries ) {
		var text = this.Entries[x];
		var panel = GameBase.UI.CreateElement( "text" );
		panel.SetSize( 20, 20 )
		panel.SetText( text );
		this.UI.ScrollBox.AddItem( panel )
	}
}

// Adds the default commands
GameBase.Console.AddCommand( "help", function() {
	if (arguments[0] == undefined) {
		GameBase.Console.Log( "Usage: \"help [command name]\"." );
	} else if (GameBase.Console.Commands[arguments[0]] == undefined) {
		GameBase.Console.Log( "The command \""+String(arguments[0])+"\" does not exist." );
	} else {
		GameBase.Console.Log( "Command: \""+String(arguments[0])+"\"." );
		GameBase.Console.Log( " - "+GameBase.Console.Commands[arguments[0]].helptext );
	}
}, "Shows help about the given command. Usage: \"help [command name]\"." );

GameBase.Console.AddCommand( "info", function() {
	GameBase.Console.Log( [ "GameBase system created by ", [243/255, 156/255, 18/255, 1], "BOT Dan" ] );
	GameBase.Console.Log( [ "Type ", [46/255, 204/255, 113/255, 1], "\"list\"", [1,1,1,1], " for a list of commands." ] );
	GameBase.Console.Log( [ "Type ", [46/255, 204/255, 113/255, 1], "\"help\"", [1,1,1,1], " for help on using a specific command." ] );
}, "Provides information about this console and some useful commands." );

GameBase.Console.AddCommand( "list", function() {
	GameBase.Console.Commands.sort();
	for ( var x in GameBase.Console.Commands ) {
		var command = GameBase.Console.Commands[x];
		GameBase.Console.Log( [ "- ", [46/255, 204/255, 113/255, 1], "\""+String(x)+"\"", [1,1,1,1], " "+command.helptext ] );
	}
}, "Returns a list of commands useable in this console.")
