// Hooks Module
GameBase.Hooks = [];

// Variables
GameBase.Hooks.Items = [];

// Calls a Hook
GameBase.Hooks.Call = function( name ) {
	if ( this.Items[name] != null ) {
		for ( i in this.Items[name] ) {
			var item = this.Items[name][i];
			if (item["name"] == name) {
				if ( arguments.length > 0 ) {
					var args = Array.prototype.slice.call(arguments, 1)
					item["func"]( ...args );
				} else {
					item["func"]();
				}
			}
		}
	}
}

// Adds a Hook
GameBase.Hooks.Add = function( name, id, func ) {
	var hook = [];
	hook["name"] = name;
	hook["id"] = id;
	hook["func"] = func;
	if ( this.Items[name] == null ) {
		this.Items[name] = [];
	}
	this.Items[name][id] = hook;
}

// Removes a Hook
GameBase.Hooks.Remove = function( id ) {
	for ( i in this.Items ) {
		for ( j in this.Items[i] ) {
			if ( this.Items[i][j]["id"] == id ) {
				delete this.Items[i][j];
			}
		}
	}
}
