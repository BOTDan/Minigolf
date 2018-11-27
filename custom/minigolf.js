MINIGOLF = {};
// The materials used for each level
MINIGOLF.Materials = [];
MINIGOLF.Materials["grass"] = { mat: assets["custom_grass.tex"], width: [ 10, 100, 10 ], height: [ 10, 10, 0 ], order: 1 };
MINIGOLF.Materials["hole"] = { mat: assets["custom_hole.tex"], width: [ 10, 10, 0 ], height: [ 10, 10, 0 ], order: 1 };
MINIGOLF.Materials["block"] = { mat: assets["custom_block.tex"], width: [ 7, 7, 0 ], height: [ 7, 7, 0 ], order: 0 };
MINIGOLF.Materials["placeholder"] = { mat: assets["custom_placeholder.tex"], width: [ 10, 100, 10 ], height: [ 10, 100, 10 ], order: 0 };
MINIGOLF.Materials["trigger"] = { mat: assets["custom_trigger.tex"], width: [ 5, 100, 5 ], height: [ 5, 100, 5 ], order: 0 };

// MINIGOLF - Physics Calls
// All Physics/Level related functions should be here
MINIGOLF.Physics = [];
MINIGOLF.Physics.Box2D = Box2D();
MINIGOLF.Physics.Categories = {};
MINIGOLF.Physics.Categories.Level = ~0x0001;
MINIGOLF.Physics.Categories.Ball = ~0x0002;
MINIGOLF.Physics.Categories.Triggers = ~0x0004;
MINIGOLF.Physics.Types = [];
// Grass "static" object
MINIGOLF.Physics.Types["grass"] = function( id, level ) {

	// Variables
	this.Scale = level.Scale;
	this.World = level.World;
	this.ItemID = id;
	this.Level = level.Level;
	this.ObjectType = "static";
	this.Type = "grass";
	this.Body = undefined;

	// Sets the item of this item
	this.SetItem = function( id ) {
		this.ItemID = id;
	}

	// Sets the Level data for this item
	this.SetLevel = function( level ) {
		this.Level = level;
	}

	// Sets the world for the physics
	this.SetWorld = function( world ) {
		this.World = world;
	}

	// Builds the Physics for this object
	this.BuildPhysics = function() {
		// Create a quad of the block
		var item = this.Level[this.ItemID];
		var size = item["size"];
		var points = [
			[ 0, 0 ],
			[ 0, size.h*5 ],
			[ size.w*5, size.h*5 ],
			[ size.w*5, 0 ]
		];
		// Loop through each connection this block has
		for ( conn_id in item["con"] ) {
			var conn = item["con"][conn_id];
			// Make sure we're connected to a valid block
			if ( this.Level[conn[0]] !== undefined ) {
				// Make sure it's grass
				if ( this.Level[conn[0]]["type"] == "grass" || this.Level[conn[0]]["type"] == "hole" ) {
					// Check the connection is valid
					if ( MINIGOLF.IsValidConnection( conn_id, conn[1] ) ) {
						// Store the second block
						var item2 = this.Level[conn[0]];
						var ang = item2["ang"] - item["ang"];
						ang = ang / 2
						// Calculate distance cut by other shape
						var dist = Math.tan( ang*(Math.PI/180) ) * (size.h*5);
						if ( conn_id == 1 ) {
							var curpos = points[1];
							var newpos = MINIGOLF.LerpPositions( curpos, [ size.w*5, size.h*5 ], dist/(size.w*5) );
							points[1] = newpos;
						} else if ( conn_id == 2 ) {
							dist = -dist;
							var curpos = points[2];
							var newpos = MINIGOLF.LerpPositions( curpos, [ 0, size.h*5 ], dist/(size.w*5) );
							points[2] = newpos;
						} else if ( conn_id == 3 ) {
							if ( dist < 0 ) { // Dstance must be negative to represent the hitbox
								dist = -dist;
								var curpos = points[0];
								var newpos = MINIGOLF.LerpPositions( curpos, [ size.w*5, 0 ], dist/(size.w*5) );
								points[0] = newpos;
							}
						} else if ( conn_id == 4 ) {
							if ( dist > 0 ) { // Dstance must be positive to represent the hitbox
								var curpos = points[3];
								var newpos = MINIGOLF.LerpPositions( curpos, [ 0, 0 ], dist/(size.w*5) );
								points[3] = newpos;
							}
						}
					}
				}
			}
		}
		// Scale co-ordinates
		for ( point_id in points ) {
			points[point_id][0] = (points[point_id][0]-item["size"]["w"]*5/2) / this.Scale;
			points[point_id][1] = (points[point_id][1]-item["size"]["h"]*5/2) / this.Scale;
		}
		// Make co-ordinates into Box2D-friendly format
		var verts = [];
		verts.push( new MINIGOLF.Physics.Box2D.b2Vec2( points[0][0], points[0][1] ) );
		verts.push( new MINIGOLF.Physics.Box2D.b2Vec2( points[1][0], points[1][1] ) );
		verts.push( new MINIGOLF.Physics.Box2D.b2Vec2( points[2][0], points[2][1] ) );
		verts.push( new MINIGOLF.Physics.Box2D.b2Vec2( points[3][0], points[3][1] ) );
		// Find the centre point
		var pos = MINIGOLF.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) );

		// - Create the Physics
		// The shape
		var shape = MINIGOLF.Physics.CreatePolygonShape( verts );

		// Create a static body definition
		var bodydef = new MINIGOLF.Physics.Box2D.b2BodyDef();
		bodydef.set_type( MINIGOLF.Physics.Box2D.b2_staticBody );
		bodydef.set_position( new MINIGOLF.Physics.Box2D.b2Vec2( item["pos"]["x"] / this.Scale, item["pos"]["y"] / this.Scale ) );
		bodydef.set_angle( -item["ang"] * ( Math.PI / 180 ) );

		// Create the body itself
		var body = this.World.CreateBody( bodydef );

		// Create the fixture
		var fix = new MINIGOLF.Physics.Box2D.b2FixtureDef();
		fix.set_shape( shape );
		fix.set_density( 1 );
		fix.set_friction( 1 );
		fix.set_restitution( 0.2 );

		// Add fixture to the body
		body.CreateFixture( fix );

		this.Body = body;
	}
}
// Hole "static" object
MINIGOLF.Physics.Types["hole"] = function( id, level ) {

	// Variables
	this.Scale = level.Scale;
	this.World = level.World;
	this.ItemID = id;
	this.Level = level.Level;
	this.ObjectType = "static";
	this.Type = "hole";
	this.Body = undefined;

	// Sets the item of this item
	this.SetItem = function( id ) {
		this.ItemID = id;
	}

	// Sets the Level data for this item
	this.SetLevel = function( level ) {
		this.Level = level;
	}

	// Sets the world for the physics
	this.SetWorld = function( world ) {
		this.World = world;
	}

	// Builds the Physics for this object
	this.BuildPhysics = function() {
		// Create a quad of the block
		var item = this.Level[this.ItemID];
		var size = item["size"];
		// Create a quad of the block
		var points = [
			[ 0, 0 ],
			[ 0, size.h*5 ],
			[ size.w*5, size.h*5 ],
			[ size.w*5, 0 ]
		];
		// Create a left-hand extrusion
		var left_points = [
			[ 10, 0 ],
			[ 0, 0 ],
			[ 0, size.h*5 ],
			[ 10, size.h*5 ]
		]
		// Create a right-hand extrusion
		var right_points = [
			[ size.w*5-10, 0 ],
			[ size.w*5, 0 ],
			[ size.w*5, size.h*5 ],
			[ size.w*5-10, size.h*5 ]
		]
		// Create the bottom piece
		var bottom_points = [
			[ 10, size.h*5-12.5 ],
			[ 10, size.h*5 ],
			[ size.w*5-10, size.h*5 ],
			[ size.w*5-10, size.h*5-12.5 ]
		]
		// Loop through each connection this block has
		for ( conn_id in item["con"] ) {
			var conn = item["con"][conn_id];
			// Make sure we're connected to a valid block
			if ( this.Level[conn[0]] !== undefined ) {
				// Make sure it's grass
				if ( this.Level[conn[0]]["type"] == "grass" || this.Level[conn[0]]["type"] == "hole" ) {
					// Check the connection is valid
					if ( MINIGOLF.IsValidConnection( conn_id, conn[1] ) ) {
						// Store the second block
						var item2 = this.Level[conn[0]];
						var ang = item2["ang"] - item["ang"];
						ang = ang / 2
						// Calculate distance cut by other shape
						var dist = Math.tan( ang*(Math.PI/180) ) * (size.h*5);
						if ( conn_id == 1 ) {
							var curpos = points[1];
							// Add to the extrusion
							var newpos = MINIGOLF.LerpPositions( curpos, [ size.w*5, size.h*5 ], dist/(size.w*5) );
							left_points[2] = newpos;
						} else if ( conn_id == 2 ) {
							dist = -dist;
							var curpos = points[2];
							var newpos = MINIGOLF.LerpPositions( curpos, [ 0, size.h*5 ], dist/(size.w*5) );
							right_points[2] = newpos;
						} else if ( conn_id == 3 ) {
							if ( dist < 0 ) { // Dstance must be negative to represent the hitbox
								dist = -dist;
								var curpos = points[0];
								var newpos = MINIGOLF.LerpPositions( curpos, [ size.w*5, 0 ], dist/(size.w*5) );
								left_points[0] = newpos;
							}
						} else if ( conn_id == 4 ) {
							if ( dist > 0 ) { // Dstance must be positive to represent the hitbox
								var curpos = points[3];
								var newpos = MINIGOLF.LerpPositions( curpos, [ 0, 0 ], dist/(size.w*5) );
								right_points[3] = newpos;
							}
						}
					}
				}
			}
		}
		// Scale co-ordinates
		for ( point_id in left_points ) {
			left_points[point_id][0] = (left_points[point_id][0]-item["size"]["w"]*5/2) / this.Scale;
			left_points[point_id][1] = (left_points[point_id][1]-item["size"]["h"]*5/2) / this.Scale;
		}
		// Scale co-ordinates
		for ( point_id in right_points ) {
			right_points[point_id][0] = (right_points[point_id][0]-item["size"]["w"]*5/2) / this.Scale;
			right_points[point_id][1] = (right_points[point_id][1]-item["size"]["h"]*5/2) / this.Scale;
		}
		// Scale co-ordinates
		for ( point_id in bottom_points ) {
			bottom_points[point_id][0] = (bottom_points[point_id][0]-item["size"]["w"]*5/2) / this.Scale;
			bottom_points[point_id][1] = (bottom_points[point_id][1]-item["size"]["h"]*5/2) / this.Scale;
		}
		// Make co-ordinates into Box2D-friendly format
		var left_verts = [];
		left_verts.push( new MINIGOLF.Physics.Box2D.b2Vec2( left_points[0][0], left_points[0][1] ) );
		left_verts.push( new MINIGOLF.Physics.Box2D.b2Vec2( left_points[1][0], left_points[1][1] ) );
		left_verts.push( new MINIGOLF.Physics.Box2D.b2Vec2( left_points[2][0], left_points[2][1] ) );
		left_verts.push( new MINIGOLF.Physics.Box2D.b2Vec2( left_points[3][0], left_points[3][1] ) );
		var right_verts = [];
		right_verts.push( new MINIGOLF.Physics.Box2D.b2Vec2( right_points[0][0], right_points[0][1] ) );
		right_verts.push( new MINIGOLF.Physics.Box2D.b2Vec2( right_points[3][0], right_points[3][1] ) );
		right_verts.push( new MINIGOLF.Physics.Box2D.b2Vec2( right_points[2][0], right_points[2][1] ) );
		right_verts.push( new MINIGOLF.Physics.Box2D.b2Vec2( right_points[1][0], right_points[1][1] ) );
		var bottom_verts = [];
		bottom_verts.push( new MINIGOLF.Physics.Box2D.b2Vec2( bottom_points[0][0], bottom_points[0][1] ) );
		bottom_verts.push( new MINIGOLF.Physics.Box2D.b2Vec2( bottom_points[1][0], bottom_points[1][1] ) );
		bottom_verts.push( new MINIGOLF.Physics.Box2D.b2Vec2( bottom_points[2][0], bottom_points[2][1] ) );
		bottom_verts.push( new MINIGOLF.Physics.Box2D.b2Vec2( bottom_points[3][0], bottom_points[3][1] ) );
		// Find the centre point
		var pos = MINIGOLF.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) );

		// - Create the Physics
		// The shapes
		var left_shape = MINIGOLF.Physics.CreatePolygonShape( left_verts );
		var right_shape = MINIGOLF.Physics.CreatePolygonShape( right_verts );
		var bottom_shape = MINIGOLF.Physics.CreatePolygonShape( bottom_verts );

		// Create a static body definition
		var bodydef = new MINIGOLF.Physics.Box2D.b2BodyDef();
		bodydef.set_type( MINIGOLF.Physics.Box2D.b2_staticBody );
		bodydef.set_position( new MINIGOLF.Physics.Box2D.b2Vec2( item["pos"]["x"] / this.Scale, item["pos"]["y"] / this.Scale ) );
		bodydef.set_angle( -item["ang"] * ( Math.PI / 180 ) );

		// Create the body itself
		var body = this.World.CreateBody( bodydef );

		// Create the fixture
		var left_fix = new MINIGOLF.Physics.Box2D.b2FixtureDef();
		left_fix.set_shape( left_shape );
		left_fix.set_density( 1 );
		left_fix.set_friction( 1 );
		left_fix.set_restitution( 0.2 );

		// Add fixture to the body
		body.CreateFixture( left_fix );

		// Create the fixture
		var right_fix = new MINIGOLF.Physics.Box2D.b2FixtureDef();
		right_fix.set_shape( right_shape );
		right_fix.set_density( 1 );
		right_fix.set_friction( 1 );
		right_fix.set_restitution( 0.2 );

		// Add fixture to the body
		body.CreateFixture( right_fix );

		// Create the fixture
		var bottom_fix = new MINIGOLF.Physics.Box2D.b2FixtureDef();
		bottom_fix.set_shape( bottom_shape );
		bottom_fix.set_density( 1 );
		bottom_fix.set_friction( 1 );
		bottom_fix.set_restitution( 0.2 );

		// Add fixture to the body
		body.CreateFixture( bottom_fix );

		this.Body = body;
	}
}
// Block "static" object
MINIGOLF.Physics.Types["block"] = function( id, level ) {

	// Variables
	this.Scale = level.Scale;
	this.World = level.World;
	this.ItemID = id;
	this.Level = level.Level;
	this.ObjectType = "static";
	this.Type = "block";
	this.Body = undefined;

	// Sets the item of this item
	this.SetItem = function( id ) {
		this.ItemID = id;
	}

	// Sets the Level data for this item
	this.SetLevel = function( level ) {
		this.Level = level;
	}

	// Sets the world for the physics
	this.SetWorld = function( world ) {
		this.World = world;
	}

	// Builds the Physics for this object
	this.BuildPhysics = function() {
		// Create a quad of the block
		var item = this.Level[this.ItemID];
		var size = item["size"];
		// Find the centre point
		var pos = MINIGOLF.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) );

		// - Create the Physics
		// The shape
		var shape = new MINIGOLF.Physics.Box2D.b2PolygonShape();
		shape.SetAsBox( item["size"]["w"] * 5 / 2 / this.Scale, item["size"]["h"] * 5 / 2 / this.Scale )

		// Create a static body definition
		var bodydef = new MINIGOLF.Physics.Box2D.b2BodyDef();
		bodydef.set_type( MINIGOLF.Physics.Box2D.b2_staticBody );
		bodydef.set_position( new MINIGOLF.Physics.Box2D.b2Vec2( item["pos"]["x"] / this.Scale, item["pos"]["y"] / this.Scale ) );
		bodydef.set_angle( -item["ang"] * ( Math.PI / 180 ) );

		// Create the body itself
		var body = this.World.CreateBody( bodydef );

		// Create the fixture
		var fix = new MINIGOLF.Physics.Box2D.b2FixtureDef();
		fix.set_shape( shape );
		fix.set_density( 1 );
		fix.set_friction( 1 );
		fix.set_restitution( 0.2 );

		// Add fixture to the body
		body.CreateFixture( fix );

		this.Body = body;
	}
}
// func_push "dynamic" object
MINIGOLF.Physics.Types["func_push"] = function( id, level ) {

	// Variables
	this.Scale = level.Scale;
	this.World = level.World;
	this.ItemID = id;
	this.Level = level.Level;
	this.ObjectType = "dynamic";
	this.Type = "func_push";
	this.Collisions = [];
	this.Body = undefined;

	// Sets the item of this item
	this.SetItem = function( id ) {
		this.ItemID = id;
	}

	// Sets the Level data for this item
	this.SetLevel = function( level ) {
		this.Level = level;
	}

	// Sets the world for the physics
	this.SetWorld = function( world ) {
		this.World = world;
	}

	// Adds an incoming collision
	this.BeginContact = function( item ) {
		if ( !this.Collisions.includes( item ) ) {
			this.Collisions.push( item );
		}
	}

	// Removed the given collision
	this.EndContact = function( item ) {
		var index = this.Collisions.indexOf( item );
		if ( index > -1 ) {
			this.Collisions.splice( index, 1 );
		}
	}

	// Builds the Physics for this object
	this.BuildPhysics = function() {
		// Create a quad of the block
		var item = this.Level[this.ItemID];
		var size = item["size"];
		// Find the centre point
		var pos = MINIGOLF.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) );

		// - Create the Physics
		// The shape
		var shape = new MINIGOLF.Physics.Box2D.b2PolygonShape();
		shape.SetAsBox( item["size"]["w"] * 5 / 2 / this.Scale, item["size"]["h"] * 5 / 2 / this.Scale )

		// Create a static body definition
		var bodydef = new MINIGOLF.Physics.Box2D.b2BodyDef();
		bodydef.set_type( MINIGOLF.Physics.Box2D.b2_staticBody );
		bodydef.set_position( new MINIGOLF.Physics.Box2D.b2Vec2( item["pos"]["x"] / this.Scale, item["pos"]["y"] / this.Scale ) );
		bodydef.set_angle( -item["ang"] * ( Math.PI / 180 ) );

		// Create the body itself
		var body = this.World.CreateBody( bodydef );

		// Filter
		var filter = new MINIGOLF.Physics.Box2D.b2Filter();
		filter.maskBits = MINIGOLF.Physics.Categories.Trigger;

		// Create the fixture
		var fix = new MINIGOLF.Physics.Box2D.b2FixtureDef();
		fix.set_shape( shape );
		fix.set_density( 1 );
		fix.set_friction( 1 );
		fix.set_restitution( 0.2 );
		fix.set_isSensor( true );
		fix.set_filter( filter );

		// Add fixture to the body
		body.CreateFixture( fix );

		this.Body = body;
	}

	// Used to draw this object
	this.Draw = function( w, h, x_off, y_off ) {
		MINIGOLF.Draw.FuncPushTile( this.ItemID, this.Level, w, h, x_off, y_off );
	}

	// Used to move the ball in a given direction
	this.Think = function( time, dt ) {
		for ( var id in this.Collisions ) {
			var obj = this.Collisions[id];
			var me = this.Level[this.ItemID];
			if ( obj.Type == "ball" ) {
				var vec_x = -Math.sin( me["settings"]["direction"] * ( Math.PI / 180 ) );
				var vec_y = -Math.cos( me["settings"]["direction"] * ( Math.PI / 180 ) );
				var speed = me["settings"]["acceleration"] / 10;
				var max_speed = me["settings"]["max_speed"];
				var vel = obj.Body.GetLinearVelocity();
				var velNormal = ( vel.get_x() * vec_x ) + ( vel.get_y() * vec_y );
				//print( velNormal );
				//print( vec_x + "  " + vec_y );
				if ( velNormal < max_speed ) {
					obj.Body.ApplyLinearImpulse( new MINIGOLF.Physics.Box2D.b2Vec2( vec_x*speed, vec_y*speed ), obj.Body.GetWorldCenter(), true );
				}
			}
		}
	}
}
// func_move "dynamic" object
MINIGOLF.Physics.Types["func_move"] = function( id, level ) {

	// Variables
	this.Scale = level.Scale;
	this.World = level.World;
	this.ItemID = id;
	this.Level = level.Level;
	this.ObjectType = "dynamic";
	this.Type = "func_move";
	this.Collisions = [];
	this.Active = this.Level[this.ItemID]["settings"]["start_on"]
	this.CurrentMode = -1 // Uninitialised
	this.CurrentModeStart = 0
	this.Body = undefined;

	// Sets the item of this item
	this.SetItem = function( id ) {
		this.ItemID = id;
	}

	// Sets the Level data for this item
	this.SetLevel = function( level ) {
		this.Level = level;
	}

	// Sets the world for the physics
	this.SetWorld = function( world ) {
		this.World = world;
	}

	// Adds an incoming collision
	this.BeginContact = function( item ) {
		if ( !this.Collisions.includes( item ) ) {
			this.Collisions.push( item );
			print(item)
		}
	}

	// Removed the given collision
	this.EndContact = function( item ) {
		var index = this.Collisions.indexOf( item );
		if ( index > -1 ) {
			this.Collisions.splice( index, 1 );
		}
	}

	// Builds the Physics for this object
	this.BuildPhysics = function() {
		// Create a quad of the block
		var item = this.Level[this.ItemID];
		var size = item["size"];
		// Find the centre point
		var pos = MINIGOLF.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) );

		// - Create the Physics
		// The shape
		var shape = new MINIGOLF.Physics.Box2D.b2PolygonShape();
		shape.SetAsBox( item["size"]["w"] * 5 / 2 / this.Scale, item["size"]["h"] * 5 / 2 / this.Scale )

		// Create a static body definition
		var bodydef = new MINIGOLF.Physics.Box2D.b2BodyDef();
		bodydef.set_type( MINIGOLF.Physics.Box2D.b2_kinematicBody );
		bodydef.set_position( new MINIGOLF.Physics.Box2D.b2Vec2( item["pos"]["x"] / this.Scale, item["pos"]["y"] / this.Scale ) );
		bodydef.set_angle( -item["ang"] * ( Math.PI / 180 ) );

		// Create the body itself
		var body = this.World.CreateBody( bodydef );

		// Filter
		var filter = new MINIGOLF.Physics.Box2D.b2Filter();
		filter.maskBits = MINIGOLF.Physics.Categories.Trigger;

		// Create the fixture
		var fix = new MINIGOLF.Physics.Box2D.b2FixtureDef();
		fix.set_shape( shape );
		fix.set_density( 1 );
		fix.set_friction( 1 );
		fix.set_restitution( 0.2 );

		// Add fixture to the body
		body.CreateFixture( fix );

		this.Body = body;
	}

	// Used to draw this object
	this.Draw = function( w, h, x_off, y_off ) {
		MINIGOLF.Draw.FuncMoveTile( this.ItemID, this.Level, w, h, x_off, y_off, this.Body, this.Scale );
	}

	// Used to move the ball in a given direction
	this.Think = function( time, dt ) {
		// If we're active
		var me = this.Level[this.ItemID];
		if (this.Active) { // If not active, don't do anything
			if (this.CurrentMode == -1) { // If we're uninitialised
				if (this.CurrentModeStart == 0) {
					this.CurrentModeStart = GameBase.GetTime();
				}
				if (this.CurrentModeStart + me["settings"]["start_delay"] < GameBase.GetTime()) {
					this.CurrentMode = 1 // Go to moving phase
					this.CurrentModeStart = GameBase.GetTime();
					var next_pos = new MINIGOLF.Physics.Box2D.b2Vec2( me["settings"]["end_pos"]["x"] / this.Scale, me["settings"]["end_pos"]["y"] / this.Scale );
					next_pos.op_sub(this.Body.GetPosition())
					next_pos.op_mul(1/me["settings"]["speed"]);
					this.Body.SetLinearVelocity( next_pos );
				}
			} else if (this.CurrentMode == 0) { // If we're waiting to start
				if (this.CurrentModeStart + me["settings"]["restart_delay"] < GameBase.GetTime()) { // Ready to start moving
					this.CurrentMode = 1; // Go to moving forward phase
					this.CurrentModeStart = GameBase.GetTime();
					var next_pos = new MINIGOLF.Physics.Box2D.b2Vec2( me["settings"]["end_pos"]["x"] / this.Scale, me["settings"]["end_pos"]["y"] / this.Scale );
					next_pos.op_sub(this.Body.GetPosition())
					next_pos.op_mul(1/me["settings"]["speed"]);
					this.Body.SetLinearVelocity( next_pos );
				}
			} else if (this.CurrentMode == 1) { // If we're moving forward
				if (this.CurrentModeStart + me["settings"]["speed"] <= GameBase.GetTime()) {
					// Assume we've moved far enough
					var final_pos = new MINIGOLF.Physics.Box2D.b2Vec2( me["settings"]["end_pos"]["x"] / this.Scale, me["settings"]["end_pos"]["y"] / this.Scale );
					this.Body.SetLinearVelocity( new MINIGOLF.Physics.Box2D.b2Vec2( 0, 0 ) );
					this.Body.SetTransform( final_pos, this.Body.GetAngle() );
					this.CurrentMode = 2;
					this.CurrentModeStart = GameBase.GetTime();
				}
			} else if (this.CurrentMode == 2) { // Waiting to return
				if (this.CurrentModeStart + me["settings"]["return_delay"] < GameBase.GetTime()) {
					this.CurrentMode = 3 // Start returning
					this.CurrentModeStart = GameBase.GetTime();
					var next_pos = new MINIGOLF.Physics.Box2D.b2Vec2( me["settings"]["start_pos"]["x"] / this.Scale, me["settings"]["start_pos"]["y"] / this.Scale );
					next_pos.op_sub(this.Body.GetPosition())
					next_pos.op_mul(1/me["settings"]["speed"]);
					this.Body.SetLinearVelocity( next_pos );
				}
			} else if (this.CurrentMode == 3) { // Returning to start pos
				if (this.CurrentModeStart + me["settings"]["speed"] <= GameBase.GetTime()) {
					// Assume we've moved far enough
					var final_pos = new MINIGOLF.Physics.Box2D.b2Vec2( me["settings"]["start_pos"]["x"] / this.Scale, me["settings"]["start_pos"]["y"] / this.Scale );
					this.Body.SetLinearVelocity( new MINIGOLF.Physics.Box2D.b2Vec2( 0, 0 ) );
					this.Body.SetTransform( final_pos, this.Body.GetAngle() );
					this.CurrentMode = 0;
					this.CurrentModeStart = GameBase.GetTime();
				}
			}
		}
	}
}

// The Level object
MINIGOLF.Physics.Level = function( lvl, scale ) {

	// Variables
	var box2d = MINIGOLF.Physics.Box2D;
	this.Gravity = new box2d.b2Vec2( 0.0, 40 );
	this.World = new box2d.b2World( this.Gravity, true );
	this.Listener = new box2d.JSContactListener();

	var self = this;

	this.Listener.BeginContact = function( contactPtr ) {
		var contact = box2d.wrapPointer( contactPtr, box2d.b2Contact );
		var objA = contact.GetFixtureA();
		var objB = contact.GetFixtureB();

		var objA = MINIGOLF.Physics.GetBaseClass( objA, self.Collisions );
		var objB = MINIGOLF.Physics.GetBaseClass( objB, self.Collisions );

		if ( objA.ObjectType == "dynamic" && objB.ObjectType == "dynamic" ) {
			objA.BeginContact( objB );
			objB.BeginContact( objA );
			print( "["+objA.Type+"] > ["+objB.Type+"]" );
		}

	};
	this.Listener.EndContact = function( contactPtr ) {
		var contact = box2d.wrapPointer( contactPtr, box2d.b2Contact );
		var objA = contact.GetFixtureA();
		var objB = contact.GetFixtureB();

		var objA = MINIGOLF.Physics.GetBaseClass( objA, self.Collisions );
		var objB = MINIGOLF.Physics.GetBaseClass( objB, self.Collisions );

		if ( objA.ObjectType == "dynamic" && objB.ObjectType == "dynamic" ) {
			objA.EndContact( objB );
			objB.EndContact( objA );
			print( "{"+objA.Type+"} ! {"+objB.Type+"}" );
		}
	};
	this.Listener.PreSolve = function() {};
	this.Listener.PostSolve = function() {};
	this.World.SetContactListener( this.Listener );
	this.Collisions = [];

	this.Level = lvl;
	this.Scale = scale;

	// Create Physics Objects
	for ( var item_id in this.Level ) {
		var item = this.Level[item_id];
		// If the item type supports physics
		if ( MINIGOLF.Physics.Types[item["type"]] != undefined ) {
			var hitbox = new MINIGOLF.Physics.Types[item["type"]]( item_id, this );
			hitbox.BuildPhysics();
			this.Collisions.push( hitbox );
		}
	}

	// Think function for running physics
	this.Think = function( time, dt ) {
		for ( var id in this.Collisions ) {
			var obj = this.Collisions[id];
			if ( obj.ObjectType == "dynamic" ) {
				obj.Think( time, dt );
			}
		}
		this.World.Step( dt, 3, 3 );
	}
}

// The Ball object
MINIGOLF.Physics.Ball = function( level, scale ) {

	// Variables
	this.Scale = level.Scale;
	this.World = level.World;
	this.Level = level.Level;
	this.LevelClass = level;
	this.ObjectType = "dynamic";
	this.Type = "ball";
	this.Collisions = [];
	this.Body = undefined;

	// Sets the item of this item
	this.SetItem = function( id ) {
		this.ItemID = id;
	}

	// Sets the Level data for this item
	this.SetLevel = function( level ) {
		this.Level = level;
	}

	// Sets the world for the physics
	this.SetWorld = function( world ) {
		this.World = world;
	}

	// Gets the ball's position
	this.GetPos = function() {
		var pos = this.Body.GetPosition();
		return [ pos.get_x(), pos.get_y() ];
	}

	// Returns the X position
	this.GetPosX = function() {
		return this.Body.GetPosition().get_x();
	}

	// Returns the Y position
	this.GetPosY = function() {
		return this.Body.GetPosition().get_y();
	}

	// Returns the balls rotation
	this.GetAngle = function() {
		return this.Body.GetAngle();
	}

	// Hits the ball by the given force
	this.Hit = function( force ) {
		if ( this.Body ) {
			this.Body.ApplyLinearImpulse( new MINIGOLF.Physics.Box2D.b2Vec2( force, 0 ), this.Body.GetWorldCenter(), true );
		}
	}

	// Adds an incoming collision
	this.BeginContact = function( item ) {
		if ( !this.Collisions.includes( item ) ) {
			this.Collisions.push( item );
		}
	}

	// Removed the given collision
	this.EndContact = function( item ) {
		var index = this.Collisions.indexOf( item );
		if ( index > -1 ) {
			this.Collisions.splice( index, 1 );
		}
	}

	// Builds the Physics for this object
	this.BuildPhysics = function() {
		// - Create the Physics
		// The shape
		var shape = new MINIGOLF.Physics.Box2D.b2CircleShape();
		shape.set_m_radius( 24/2 / this.Scale );

		// Create a static body definition
		var bodydef = new MINIGOLF.Physics.Box2D.b2BodyDef();
		bodydef.set_type( MINIGOLF.Physics.Box2D.b2_dynamicBody );
		bodydef.set_position( new MINIGOLF.Physics.Box2D.b2Vec2( 0, 0 ) );

		// Create the body itself
		var body = this.World.CreateBody( bodydef );

		// Create the fixture
		var fix = new MINIGOLF.Physics.Box2D.b2FixtureDef();
		fix.set_shape( shape );
		fix.set_density( 1 );
		fix.set_friction( 2 );
		fix.set_restitution( 0.3 );

		// Add fixture to the body
		body.CreateFixture( fix );
		body.SetAngularDamping( 0.9 );
		body.SetLinearDamping( 0.25 );

		this.Body = body;
	}

	// Unused think function
	this.Think = function( time, dt ) {}

	// Build the physics
	this.BuildPhysics();
	level.Collisions.push( this );
}

// Helper function to return the class of an object based off it's body
MINIGOLF.Physics.GetBaseClass = function( fixture, collisions ) {
	for ( var id in collisions ) {
		var obj = collisions[id];
		if ( obj.Body == fixture.GetBody() ) {
			return obj;
		}
	}
	return null;
}

// Helper function for creating polygons
MINIGOLF.Physics.CreatePolygonShape = function( vertices ) {
    var shape = new this.Box2D.b2PolygonShape();
    // var buffer = Box2D.allocate(vertices.length * 8, 'float', Box2D.ALLOC_STACK);
    var buffer = this.Box2D._malloc(vertices.length * 8);
    var offset = 0;
    for (var i = 0; i < vertices.length; i++) {
        // Box2D.setValue(buffer + (offset), vertices[i].get_x(), 'float'); // x
        this.Box2D.HEAPF32[buffer + offset >> 2] = vertices[i].get_x();
        // Box2D.setValue(buffer + (offset + 4), vertices[i].get_y(), 'float'); // y
        this.Box2D.HEAPF32[buffer + (offset + 4) >> 2] = vertices[i].get_y();
        offset += 8;
    }
    var ptr_wrapped = this.Box2D.wrapPointer(buffer, this.Box2D.b2Vec2);
    shape.Set(ptr_wrapped, vertices.length);
    return shape;
}

// MINIGOLF - Draw Calls
// All draw functions should require a width and height parameter for use
// within the Level Editor. This will make everything easier. Slightly.
MINIGOLF.Draw = {};
MINIGOLF.Draw.LevelArt = []; // Stores every item to draw to save performance.

// - Draw the background (DrawTrees)
MINIGOLF.Draw.Background = function( w, h, x_offset ) {
	// Draw the Sky
	_r.color( 1, 1, 1, 1 );
	_r.rect( 0, 0, w, h, assets["altitude_sky.tex"] );

	// Draw the Trees
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

// - Draws the given level render object
MINIGOLF.Draw.Level = function( render, w, h, x_off, y_off, level ) {
	// Offsets
	var x_offset = (w/2)-x_off;
	var y_offset = (h/2)-y_off;
	// For every renderable item...
	for ( var item_id in render ) {
		var item = render[item_id];
		if ( item["type"] == "quad_rot" ) {
			var new_points = [];
			for ( var point_id in item["points"] ) {
				new_points[point_id] = [];
				new_points[point_id][0] = item["points"][point_id][0] + x_offset + item["x"];
				new_points[point_id][1] = item["points"][point_id][1] + y_offset + item["y"];
			}
			GameBase.UI.IncDrawLayer();
			_r.color( 1, 1, 1, 1 );
			MINIGOLF.Draw.RotatedQuad( new_points, item["uvs"], x_offset + item["x"], y_offset + item["y"], item["ang"], item["mat"] );
		}
	}
	if ( level != undefined ) {
		for ( var item_id in level ) {
			var item = level[item_id];
			if ( item["type"] == "func_push" ) {
				MINIGOLF.Draw.FuncPushTile( item_id, level, w, h, x_off, y_off );
			} else if ( item["type"] == "func_move" ) {
				MINIGOLF.Draw.FuncMoveTile( item_id, level, w, h, x_off, y_off );
			}
		}
	}
}

// - Generates the level so it can be drawn (GenerateLevel)
MINIGOLF.Draw.GenerateLevel = function( lvl ) {
	// Organise the level by draw order
	var level = this.SortLevelByDrawOrder( lvl.slice() );
	var render = [];
	// Loop through each item
	for ( var id in level ) {
		// Get our item
		var item = level[id];
		// Check if it's grass/hole
		if ( item["type"] == "grass" ) {
			var tiles = this.GenerateGrassTile( item, lvl );
			for ( var tile_id in tiles ) {
				render.push( tiles[tile_id] );
			}
		} else if ( item["type"] == "hole" ) {
			var tiles = this.GenerateHoleTile( item, lvl );
			for ( var tile_id in tiles ) {
				render.push( tiles[tile_id] );
			}
		} else if ( item["type"] == "block" ) {
			var tiles = this.GenerateBlockTile( item, lvl );
			for ( var tile_id in tiles ) {
				render.push( tiles[tile_id] );
			}
		}
	}
	// Return the drawable level object
	return render;
}

// Generates a Grass Tile for the given item
MINIGOLF.Draw.GenerateGrassTile = function( item, level ) {
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
			if ( level[conn[0]] !== undefined ) {
				// Make sure it's grass
				if ( level[conn[0]]["type"] == "grass" || level[conn[0]]["type"] == "hole" ) {
					// Check the connection is valid
					if ( MINIGOLF.IsValidConnection( conn_id, conn[1] ) ) {
						// Store the second block
						var item2 = level[conn[0]];
						var ang = item2["ang"] - item["ang"];
						ang = ang / 2
						// Calculate distance cut by other shape
						var dist = Math.tan( ang*(Math.PI/180) ) * (size.h*5);
						if ( conn_id == 1 ) {
							var curpos = points[1];
							var newpos = MINIGOLF.LerpPositions( curpos, [ size.w*5, size.h*5 ], dist/(size.w*5) );
							points[1] = newpos;
							uvs[1] = [ dist/50, size.h/10 ];
						} else if ( conn_id == 2 ) {
							dist = -dist;
							var curpos = points[2];
							var newpos = MINIGOLF.LerpPositions( curpos, [ 0, size.h*5 ], dist/(size.w*5) );
							points[2] = newpos;
							uvs[2] = [ (size.w-(dist/5))/10, size.h/10 ];
						} else if ( conn_id == 3 ) {
							if ( dist < 0 ) { // Dstance must be negative to represent the hitbox
								dist = -dist;
								var curpos = points[0];
								var newpos = MINIGOLF.LerpPositions( curpos, [ size.w*5, 0 ], dist/(size.w*5) );
								points[0] = newpos;
								uvs[0] = [ dist/50, 0 ];
							}
						} else if ( conn_id == 4 ) {
							if ( dist > 0 ) { // Dstance must be positive to represent the hitbox
								var curpos = points[3];
								var newpos = MINIGOLF.LerpPositions( curpos, [ 0, 0 ], dist/(size.w*5) );
								points[3] = newpos;
								uvs[3] = [ (size.w-(dist/5))/10, 0 ];
							}
						}
					}
				}
			}
		}
		// Render the final mess
		var pos = MINIGOLF.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) )
		/*var pos_x = (w/2)-this.XOffset+pos[0];
		var pos_y = (h/2)-this.YOffset+pos[1];
		for ( point_id in points ) {
			points[point_id][0] = points[point_id][0] + pos_x;
			points[point_id][1] = points[point_id][1] + pos_y;
		}*/
		// Build a drawable object
		var item = {
			type: "quad_rot",
			points: points,
			uvs: uvs,
			x: pos[0],
			y: pos[1],
			ang: item["ang"],
			mat: MINIGOLF.Materials[item["type"]].mat
		}
		// LEVEL_EDITOR.DrawRotatedQuad( points, uvs, pos_x, pos_y, item["ang"], LEVEL_EDITOR.Materials[item["type"]].mat )
		return [ item ];
	}
}

// Generates the Hole tile and corresponding side extentions
MINIGOLF.Draw.GenerateHoleTile = function(  item, level ) {
	if ( item["type"] == "hole" ) {
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
			if ( level[conn[0]] !== undefined ) {
				// Make sure it's grass
				if ( level[conn[0]]["type"] == "grass" || level[conn[0]]["type"] == "hole" ) {
					// Check the connection is valid
					if ( MINIGOLF.IsValidConnection( conn_id, conn[1] ) ) {
						// Store the second block
						var item2 = level[conn[0]];
						var ang = item2["ang"] - item["ang"];
						ang = ang / 2
						// Calculate distance cut by other shape
						var dist = Math.tan( ang*(Math.PI/180) ) * (size.h*5);
						if ( conn_id == 1 ) {
							var curpos = points[1];
							if ( dist < 0 ) {
								// Add to the extrusion
								var newpos = MINIGOLF.LerpPositions( curpos, [ size.w*5, size.h*5 ], dist/(size.w*5) );
								left_points[3] = newpos;
								left_uvs[3] = [dist/50, size.h/10];
							} else {
								// Modify the base block
								var newpos = MINIGOLF.LerpPositions( curpos, [ size.w*5, size.h*5 ], dist/(size.w*5) );
								points[1] = newpos;
								uvs[1] = [ dist/50, size.h/10 ];
							}
						} else if ( conn_id == 2 ) {
							dist = -dist;
							var curpos = points[2];
							if ( dist < 0 ) {
								// Add to the extrusion
								var newpos = MINIGOLF.LerpPositions( curpos, [ 0, size.h*5 ], dist/(size.w*5) );
								right_points[3] = newpos;
								right_uvs[3] = [ (size.w-(dist/5))/10, size.h/10 ];
							} else {
								// Modify the base block
								var newpos = MINIGOLF.LerpPositions( curpos, [ 0, size.h*5 ], dist/(size.w*5) );
								points[2] = newpos;
								uvs[2] = [ (size.w-(dist/5))/10, size.h/10 ];
							}
						} else if ( conn_id == 3 ) {
							if ( dist < 0 ) { // Dstance must be negative to represent the hitbox
								dist = -dist;
								var curpos = points[0];
								var newpos = MINIGOLF.LerpPositions( curpos, [ size.w*5, 0 ], dist/(size.w*5) );
								points[0] = newpos;
								uvs[0] = [ dist/50, 0 ];
							}
						} else if ( conn_id == 4 ) {
							if ( dist > 0 ) { // Dstance must be positive to represent the hitbox
								var curpos = points[3];
								var newpos = MINIGOLF.LerpPositions( curpos, [ 0, 0 ], dist/(size.w*5) );
								points[3] = newpos;
								uvs[3] = [ (size.w-(dist/5))/10, 0 ];
							}
						}
					}
				}
			}
		}
		// Render the final mess
		var pos = MINIGOLF.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) )
		/*var pos_x = (w/2)-this.XOffset+pos[0];
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
		}*/
		// Build drawable objects
		// - The hole
		var item1 = {
			type: "quad_rot",
			points: points,
			uvs: uvs,
			x: pos[0],
			y: pos[1],
			ang: item["ang"],
			mat: MINIGOLF.Materials["hole"].mat
		}
		// - The left bit
		var item2 = {
			type: "quad_rot",
			points: left_points,
			uvs: left_uvs,
			x: pos[0],
			y: pos[1],
			ang: item["ang"],
			mat: MINIGOLF.Materials["grass"].mat
		}
		// - The right bit
		var item3 = {
			type: "quad_rot",
			points: right_points,
			uvs: right_uvs,
			x: pos[0],
			y: pos[1],
			ang: item["ang"],
			mat: MINIGOLF.Materials["grass"].mat
		}
		//LEVEL_EDITOR.DrawRotatedQuad( points, uvs, pos_x, pos_y, item["ang"], LEVEL_EDITOR.Materials["hole"].mat )
		//LEVEL_EDITOR.DrawRotatedQuad( left_points, left_uvs, pos_x, pos_y, item["ang"], LEVEL_EDITOR.Materials["grass"].mat )
		//LEVEL_EDITOR.DrawRotatedQuad( right_points, right_uvs, pos_x, pos_y, item["ang"], LEVEL_EDITOR.Materials["grass"].mat )
		return [ item1, item2, item3 ];
	}
}

// Generates a Block Tile for the given item
MINIGOLF.Draw.GenerateBlockTile = function( item, level ) {
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
		/*var pos_x = (w/2)-this.XOffset+pos[0];
		var pos_y = (h/2)-this.YOffset+pos[1];
		for ( point_id in points ) {
			points[point_id][0] = points[point_id][0] + pos_x;
			points[point_id][1] = points[point_id][1] + pos_y;
		}*/
		// Build a drawable object
		var item = {
			type: "quad_rot",
			points: points,
			uvs: uvs,
			x: pos[0],
			y: pos[1],
			ang: item["ang"],
			mat: MINIGOLF.Materials["block"].mat
		}
		//LEVEL_EDITOR.DrawRotatedQuad( points, uvs, pos_x, pos_y, item["ang"], LEVEL_EDITOR.Materials["block"].mat )
		return [ item ];
	}
}

// Actually draws a func_push tile
MINIGOLF.Draw.FuncPushTile = function( itemid, level, w, h, x_off, y_off ) {
	// Offsets
	var x_offset = (w/2)-x_off;
	var y_offset = (h/2)-y_off;

	// This item
	var item = level[itemid];

	// Draw the background
	_r.color( 1, 1, 1, 1, 0 );
	var angle = -item["ang"] * ( Math.PI / 180 ) + item["settings"]["direction"] * ( Math.PI / 180 );
	var width = item["size"]["w"]/10;
	var height = item["size"]["h"]/10;
	var per = GameBase.GetTime() / 2 * Math.min( (item["settings"]["max_speed"] / 20), 5 );
	var vec_x = Math.sin( angle ) * per;
	var vec_y = Math.cos( angle ) * per;
	var pos1 = MINIGOLF.RotatePoint( vec_x, vec_y, 0.5*width, 0.5*height, angle );
	var pos2 = MINIGOLF.RotatePoint( width+vec_x, vec_y, 0.5*width, 0.5*height, angle );
	var pos3 = MINIGOLF.RotatePoint( width+vec_x, height+vec_y, 0.5*width, 0.5*height, angle );
	var pos4 = MINIGOLF.RotatePoint( vec_x, height+vec_y, 0.5*width, 0.5*height, angle );
	var verts = [
		[ 5, 5 ],
		[ item["size"]["w"]*5-5, 5 ],
		[ item["size"]["w"]*5-5, item["size"]["h"]*5-5 ],
		[ 5, item["size"]["h"]*5-5 ]
	]
	var pos = LEVEL_EDITOR.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) )
	var pos_x = (w/2)-x_off+pos[0];
	var pos_y = (h/2)-y_off+pos[1]
	for ( var vert_id in verts ) {
		verts[vert_id][0] = verts[vert_id][0] + pos_x;
		verts[vert_id][1] = verts[vert_id][1] + pos_y;
	}
	var uvs = [ pos1, pos2, pos3, pos4 ];
	MINIGOLF.Draw.RotatedQuad( verts, uvs, pos_x, pos_y, item["ang"], assets["custom_func_push_arrows.tex"] );

	// Draw edges
	MINIGOLF.Draw.RotatedRect( pos_x, pos_y, item["size"]["w"]*5, 5, item["ang"], assets["custom_trigger_push.tex"], -0.05, -0.05, item["size"]["w"]/10, 0.05 );
	var pos = LEVEL_EDITOR.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]+item["size"]["h"]*5/2-5, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) )
	MINIGOLF.Draw.RotatedRect( pos[0]+(w/2)-x_off, pos[1]+(h/2)-y_off, item["size"]["w"]*5, 5, item["ang"], assets["custom_trigger_push.tex"], -0.05, -0.05, item["size"]["w"]/10, 0.05 );
	var pos = LEVEL_EDITOR.RotatePoint( item["pos"]["x"]-item["size"]["w"]*5/2, item["pos"]["y"]-item["size"]["h"]*5/2+5, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) )
	MINIGOLF.Draw.RotatedRect( pos[0]+(w/2)-x_off, pos[1]+(h/2)-y_off, 5, item["size"]["h"]*5-10, item["ang"], assets["custom_trigger_push.tex"], -0.05, 0.051, 0.05, item["size"]["h"]/10 );
	var pos = LEVEL_EDITOR.RotatePoint( item["pos"]["x"]+item["size"]["w"]*5/2-5, item["pos"]["y"]-item["size"]["h"]*5/2+5, item["pos"]["x"], item["pos"]["y"], -item["ang"] * ( Math.PI / 180 ) )
	MINIGOLF.Draw.RotatedRect( pos[0]+(w/2)-x_off, pos[1]+(h/2)-y_off, 5, item["size"]["h"]*5-10, item["ang"], assets["custom_trigger_push.tex"], 0.95, 0.051, 1.05, item["size"]["h"]/10 );

}

// Draws a func_move tile
MINIGOLF.Draw.FuncMoveTile = function( itemid, level, w, h, x_off, y_off, body, scale ) {
	// Offsets
	var x_offset = (w/2)-x_off;
	var y_offset = (h/2)-y_off;

	// This item
	var item = level[itemid];

	// Draw the background
	_r.color( 1, 1, 1, 1, 0 );
	var angle = item["ang"];
	var ang = -angle * ( Math.PI / 180 );
	var x = item["pos"]["x"];
	var y = item["pos"]["y"];
	if (body) {
		x = body.GetPosition().get_x() * scale;
		y = body.GetPosition().get_y() * scale;
	}
	var w = item["size"]["w"];
	var h = item["size"]["h"];
	if ( true ) {
		var pos = MINIGOLF.RotatePoint( x-w*5/2, y-h*5/2, x, y, ang );
		this.RotatedRect( pos[0]+x_offset, pos[1]+y_offset, w*5, h*5, angle, assets["custom_entity.tex"] );
	} else {
		// Top-Left Corner
		var pos = MINIGOLF.RotatePoint( x-w*5/2, y-h*5/2, x, y, ang );
		this.RotatedRect( pos[0]+x_offset, pos[1]+y_offset, 4/14*50, 4/14*50, angle, assets["custom_entity.tex"], 0, 0, 4/14, 4/14 );
		// Top-Right
		var pos = MINIGOLF.RotatePoint( x+w*5/2, y-h*5/2, x, y, ang );
		this.RotatedRect( pos[0]+x_offset, pos[1]+y_offset, -4/14*50, 4/14*50, angle, assets["custom_entity.tex"], 1, 0, 1-4/14, 4/14 )
		// Bottom-Left
		var pos = MINIGOLF.RotatePoint( x-w*5/2, y+h*5/2, x, y, ang );
		this.RotatedRect( pos[0]+x_offset, pos[1]+y_offset, 4/14*50, -4/14*50, angle, assets["custom_entity.tex"], 0, 1, 4/14, 1-4/14 )
		// Bottom-Right
		var pos = MINIGOLF.RotatePoint( x+w*5/2, y+h*5/2, x, y, ang );
		this.RotatedRect( pos[0]+x_offset, pos[1]+y_offset, -4/14*50, -4/14*50, angle, assets["custom_entity.tex"], 1, 1, 1-4/14, 1-4/14 )
		// Left
		var pos = MINIGOLF.RotatePoint( x-w*5/2, y-h*5/2+(4/14*50), x, y, ang );
		this.RotatedRect( pos[0]+x_offset, pos[1]+y_offset, 4/14*50, h*5-8/14*50, angle, assets["custom_entity_left.tex"], 0, 0, 1, (h*5-8/14*50)/(6/14) )
		// Top
		var pos = MINIGOLF.RotatePoint( x-w*5/2+(4/14*50), y-h*5/2, x, y, ang );
		this.RotatedRect( pos[0]+x_offset, pos[1]+y_offset, w*5-8/14*50, 4/14*50, angle, assets["custom_entity_left.tex"], 1, 0, 0, (w*5-8/14*50)/(6/14) )
		// RotatedRect can't draw rotated UVs. Requires DrawQuad.
	}
}

// - Returns an array of the given level, sorted by draw order
MINIGOLF.Draw.SortLevelByDrawOrder = function( level ) {
	return level.sort( function(a,b) { return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1: 0); } );
}
// - Like the function below but easier
MINIGOLF.Draw.RotatedRect = function( x, y, w, h, ang, tex, u1, v1, u2, v2 ) {
	if ( u1 == undefined ) { u1 = 0 };
	if ( v1 == undefined ) { v1 = 0 };
	if ( u2 == undefined ) { u2 = 1 };
	if ( v2 == undefined ) { v2 = 1 };
	ang = -ang * ( Math.PI / 180 );
	var point_1 = [ x, y ];
	var point_2 = MINIGOLF.RotatePoint( x+w, y, x, y, ang );
	var point_3 = MINIGOLF.RotatePoint( x+w, y+h, x, y, ang );
	var point_4 = MINIGOLF.RotatePoint( x, y+h, x, y, ang );
	_r.quad( point_1[0], point_1[1], u1, v1, point_2[0], point_2[1], u2, v1, point_3[0], point_3[1], u2, v2, point_4[0], point_4[1], u1, v2, tex );
}
// - Actually renders a rotated quad
MINIGOLF.Draw.RotatedQuad = function( points, uvs, x, y, ang, tex ) {
	ang = -ang * ( Math.PI / 180 );
	var point_1 = MINIGOLF.RotatePoint( points[0][0], points[0][1], x, y, ang );
	var point_2 = MINIGOLF.RotatePoint( points[1][0], points[1][1], x, y, ang );
	var point_3 = MINIGOLF.RotatePoint( points[2][0], points[2][1], x, y, ang );
	var point_4 = MINIGOLF.RotatePoint( points[3][0], points[3][1], x, y, ang );
	_r.quad( point_1[0], point_1[1], uvs[0][0], uvs[0][1],
	point_2[0], point_2[1], uvs[1][0], uvs[1][1],
	point_3[0], point_3[1], uvs[2][0], uvs[2][1],
	point_4[0], point_4[1], uvs[3][0], uvs[3][1], tex );
}

// - Lerps 2 positions
MINIGOLF.LerpPositions = function( pos1, pos2, amt ) {
	var x = pos1[0] + ( pos2[0] - pos1[0] ) * amt;
	var y = pos1[1] + ( pos2[1] - pos1[1] ) * amt;
	return [ x, y ];
}

// - Rotates a position about a point
MINIGOLF.RotatePoint = function( x, y, anc_x, anc_y, ang ) {
	var new_x = Math.cos( ang ) * ( x - anc_x ) - Math.sin( ang ) * ( y - anc_y ) + anc_x;
	var new_y = Math.sin( ang ) * ( x - anc_x ) + Math.cos( ang ) * ( y - anc_y ) + anc_y;
	return [ new_x, new_y ];
}

// - Returns if a connection is valid
MINIGOLF.IsValidConnection = function( con1, con2 ) {
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
