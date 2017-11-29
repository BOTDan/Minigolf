--[[

function init()
	TIME = 0

	local ent1 = Entity()
	ent1:SetPos( Vector2( 61, 0 ) )
	ent1:SetStyle( SHAPE_CIRCLE )
	ent1.shape:SetSize( Vector2( 30, 30 ) )
	ent1:SetColour( Colour( 52, 152, 219 ) )

	local ent2 = Entity()
	ent2:SetPos( Vector2( 60, 60 ) )
	ent2:SetStyle( SHAPE_CIRCLE )
	ent2.shape:SetSize( Vector2( 30, 30 ) )
	ent2:SetColour( Colour(155, 89, 182) )
	ent2.mass = 0

	local ent1 = Entity()
	ent1:SetPos( Vector2( 100, 0 ) )
	ent1.shape:SetSize( Vector2( 10, 10 ) )
	ent1:SetColour( Colour(46, 204, 113) )

	local ent2 = Entity()
	ent2:SetPos( Vector2( 90, 45 ) )
	ent2.shape:SetSize( Vector2( 10, 10 ) )
	ent2:SetColour( Colour(241, 196, 15) )

	local ent2 = Entity()
	ent2:SetPos( Vector2( 200, 50 ) )
	ent2.shape:SetSize( Vector2( 40, 40 ) )
	ent2:SetVelocity( Vector2( -40, 0 ) )
	ent2:SetColour( Colour(230, 126, 34) )

	local ent3 = Entity()
	ent3:SetPos( Vector2( 200, 100 ) )
	ent3.shape:SetSize( Vector2( 400, 20 ) )
	ent3.mass = 0

	-- BOTTOM
	local ent1 = Entity()
	ent1:SetPos( Vector2( 100, 150 ) )
	ent1:SetStyle( SHAPE_CIRCLE )
	ent1.shape:SetSize( Vector2( 10, 10 ) )
	ent1:SetColour( Colour( 52, 152, 219 ) )
	ent1:SetVelocity( Vector2( 200, 0 ) )

	local ent1 = Entity()
	ent1:SetPos( Vector2( 5, 185 ) )
	ent1:SetStyle( SHAPE_CIRCLE )
	ent1.shape:SetSize( Vector2( 10, 10 ) )
	ent1:SetColour( Colour( 52, 152, 219 ) )
	ent1:SetVelocity( Vector2( 500, 0 ) )

	local ent3 = Entity()
	ent3:SetPos( Vector2( 50, 200 ) )
	ent3.shape:SetSize( Vector2( 100, 20 ) )
	ent3.mass = 0

	local ent3 = Entity()
	ent3:SetPos( Vector2( 120, 192 ) )
	ent3.shape:SetSize( Vector2( 40, 20 ) )
	ent3:SetRotation( math.pi/8 )
	ent3.mass = 0

	local ent3 = Entity()
	ent3:SetPos( Vector2( 180, 240 ) )
	ent3.shape:SetSize( Vector2( 100, 20 ) )
	ent3:SetRotation( -math.pi/5 )
	ent3.mass = 0

	local ent3 = Entity()
	ent3:SetPos( Vector2( 230, 275 ) )
	ent3.shape:SetSize( Vector2( 20, 20 ) )
	ent3:SetRotation( -math.pi/5+(math.pi/5/5)*1 )
	ent3.mass = 0

	local ent3 = Entity()
	ent3:SetPos( Vector2( 249, 284 ) )
	ent3.shape:SetSize( Vector2( 20, 20 ) )
	ent3:SetRotation( -math.pi/5+(math.pi/5/5)*2 )
	ent3.mass = 0

	local ent3 = Entity()
	ent3:SetPos( Vector2( 268, 290 ) )
	ent3.shape:SetSize( Vector2( 20, 20 ) )
	ent3:SetRotation( -math.pi/5+(math.pi/5/5)*3 )
	ent3.mass = 0

	local ent3 = Entity()
	ent3:SetPos( Vector2( 289, 294 ) )
	ent3.shape:SetSize( Vector2( 20, 20 ) )
	ent3:SetRotation( -math.pi/5+(math.pi/5/5)*4 )
	ent3.mass = 0

	local ent3 = Entity()
	ent3:SetPos( Vector2( 310, 295 ) )
	ent3.shape:SetSize( Vector2( 20, 20 ) )
	ent3:SetRotation( 0 )
	ent3.mass = 0

	local ent3 = Entity()
	ent3:SetPos( Vector2( 331, 294 ) )
	ent3.shape:SetSize( Vector2( 20, 20 ) )
	ent3:SetRotation( math.pi/5-(math.pi/5/5)*4 )
	ent3.mass = 0

	local ent3 = Entity()
	ent3:SetPos( Vector2( 352, 290 ) )
	ent3.shape:SetSize( Vector2( 20, 20 ) )
	ent3:SetRotation( math.pi/5-(math.pi/5/5)*3 )
	ent3.mass = 0

	local ent3 = Entity()
	ent3:SetPos( Vector2( 372, 282 ) )
	ent3.shape:SetSize( Vector2( 20, 20 ) )
	ent3:SetRotation( math.pi/5-(math.pi/5/5) )
	ent3.mass = 0

	local ent3 = Entity()
	ent3:SetPos( Vector2( 400, 220 ) )
	ent3.shape:SetSize( Vector2( 20, 100 ) )
	ent3:SetRotation( 0 )
	ent3.mass = 0

	--THING = Entity()
	--THING:SetPos( Vector2( 250, 150 ) )
	--THING:SetSize( Vector2( 20, 20 ) )
	--THING.mass = 0

end

function draw()
	for _, ent in pairs( PHYSICS.GetEntities() ) do
		local pos = ent:GetLerpPos( TIME )
		local size = ( ent:GetMaxBounds() - ent:GetMinBounds() ) / 2
		_r.color( ent:GetColour():GetNormalised() )
		if ent:GetStyle() == SHAPE_CIRCLE then
			_r.rect( pos.x-size.x, pos.y-size.y, size.x*2, size.y*2, _t.circle )
		else
			if ent:GetRotation() ~= 0 then
				_r.color( 0, 0, 0, 1 )
				--_r.rect( ent:GetMinBounds().x, ent:GetMinBounds().y, ent:GetMaxBounds().x-ent:GetMinBounds().x, ent:GetMaxBounds().y-ent:GetMinBounds().y )
				_r.layer( 1 )
				_r.color( ent:GetColour():GetNormalised() )
				_r.sprite( pos.x, pos.y, ent:GetSize().x, ent:GetSize().y, ent:GetRotation() )
			else
				_r.rect( pos.x-size.x, pos.y-size.y, size.x*2, size.y*2 )
			end
		end
	end
end

function think( time, dt )
	--THING:SetRotation( THING:GetRotation() + math.pi/200 )
	TIME = time
	PHYSICS.Think( time, dt )
end

]]--

function mg_init()

	MINIGOLF = {}
	MINIGOLF.Hole = 1
	MINIGOLF.Course = {}
	MINIGOLF.Entities = {}
	MINIGOLF.Ball = nil
	MINIGOLF.CameraPos = Vector2( 0, 0 )
	MINIGOLF.CameraSize = Vector2( 400, 300 )
	MINIGOLF.IsBallPotted = false
	MINIGOLF.BallPottedStart = 0
	MINIGOLF.Movables = {}
	MINIGOLF.Power = 0
	MINIGOLF.MaxPower = 750
	MINIGOLF.BallMoving = false
	MINIGOLF.BallLastMove = 0
	MINIGOLF.LastPos = false
	MINIGOLF.ShotNumber = 1
	MINIGOLF.FlyOver = false
	MINIGOLF.FlyOverStart = 0
	MINIGOLF.FlyOverLengths = {}
	MINIGOLF.PlayArea = {}
	MINIGOLF.IsBallOut = false
	MINIGOLF.BallOutStart = 0
	MINIGOLF.BallOutPos = Vector2( 0, 0 )
	MINIGOLF.ShouldDrawScoreCard = false
	MINIGOLF.Scores = {}
	MINIGOLF.IsInMainMenu = true

	function MINIGOLF.RegisterHole( hole, index )
		table.insert( MINIGOLF.Course, index, hole )
	end

	function MINIGOLF.OnKeyPressed( key )
		print( "MINIGOLF.OnKeyPressed( "..key.." )" )
		if key == 7 then
			MINIGOLF.Ball:AddVelocity( Vector2( 100, 0 ) )
		elseif key == 4 then
			MINIGOLF.Ball:AddVelocity( Vector2( -100, 0 ) )
		elseif key == 26 then
			MINIGOLF.Ball:AddVelocity( Vector2( 500, 0 ) )
		elseif key == 22 then
			MINIGOLF.Ball:AddVelocity( Vector2( -500, 0 ) )
		elseif key == 44 then
			MINIGOLF.Ball:SetMass( 0 )
		elseif key == 224 then
			if MINIGOLF.Course[MINIGOLF.Hole].Flyover and not MINIGOLF.IsInMainMenu then
				MINIGOLF.FlyOver = true
				MINIGOLF.FlyOverStart = PHYSICS.GetTime()
			end
		elseif key == 43 then
			MINIGOLF.ShouldDrawScoreCard = true
		end
	end

	function MINIGOLF.OnKeyReleased( key )
		if key == 43 then
			MINIGOLF.ShouldDrawScoreCard = false
		end
	end

	function MINIGOLF.Think( time, dt )
		if MINIGOLF.IsInMainMenu then return end

		-- Check if ball is potted
		if MINIGOLF.IsBallPotted then
			if MINIGOLF.BallPottedStart + 6 < PHYSICS.GetTime() then
				MINIGOLF.GoToNextHole()
			end
		end

		-- Check if ball is moving
		if MINIGOLF.Ball and MINIGOLF.BallMoving and not MINIGOLF.IsBallOut and not MINIGOLF.IsBallPotted then
			if MINIGOLF.Ball:GetVelocity():Length() < 10 then
				if MINIGOLF.BallLastMove + 0.5 < time then
					MINIGOLF.BallMoving = false
					MINIGOLF.ShotNumber = MINIGOLF.ShotNumber + 1
				end
			else
				MINIGOLF.BallLastMove = time
			end
		end

		-- Move Moveable Objects
		for k, v in pairs( MINIGOLF.Movables ) do
			if v.MINIGOLF_MoveState == -1 then -- Initialise
				if v.MINIGOLF_MoveStateTime + v.MINIGOLF_MoveWait < PHYSICS.GetTime() then
					v.MINIGOLF_MoveState = 1 -- MOVE FORWARD
					v.MINIGOLF_MoveStateTime = PHYSICS.GetTime()
				end
			elseif v.MINIGOLF_MoveState == 0 then
				if v.MINIGOLF_MoveStateTime + v.MINIGOLF_MoveDelay < PHYSICS.GetTime() then
					v.MINIGOLF_MoveState = 1 -- MOVE FORWARD
					v.MINIGOLF_MoveStateTime = PHYSICS.GetTime()
				end
			elseif v.MINIGOLF_MoveState == 1 then
				local pos = v:GetPos()
				local diff = v.MINIGOLF_MoveEndPos - v:GetPos()
				local per = v.MINIGOLF_MoveSpeed / math.abs( diff:Length() )
				if per >= 1 then
					v:SetPos( v.MINIGOLF_MoveEndPos )
					v:SetVelocity( diff )
				else
					v:SetPos( v:GetPos() + diff * per )
					v:SetVelocity( diff )
				end
				if v:GetPos() == v.MINIGOLF_MoveEndPos then
					v.MINIGOLF_MoveState = 2 -- WAIT TO MOVE BACKWARDS
					v.MINIGOLF_MoveStateTime = PHYSICS.GetTime()
				end
			elseif v.MINIGOLF_MoveState == 2 then
				if v.MINIGOLF_MoveStateTime + v.MINIGOLF_MoveDelay < PHYSICS.GetTime() then
					v.MINIGOLF_MoveState = 3 -- MOVE BACKWARDS
					v.MINIGOLF_MoveStateTime = PHYSICS.GetTime()
				end
			elseif v.MINIGOLF_MoveState == 3 then
				local pos = v:GetPos()
				local diff = v.MINIGOLF_MoveStartPos - v:GetPos()
				local per = v.MINIGOLF_MoveSpeed / math.abs( diff:Length() )
				if per >= 1 then
					v:SetPos( v.MINIGOLF_MoveStartPos )
					v:SetVelocity( diff )
				else
					v:SetPos( v:GetPos() + diff * per )
					v:SetVelocity( diff * per )
				end
				if v:GetPos() == v.MINIGOLF_MoveStartPos then
					v.MINIGOLF_MoveState = 0 -- WAIT TO MOVE FORWARD
					v.MINIGOLF_MoveStateTime = PHYSICS.GetTime()
				end
			end
		end

		-- Check ball is in the map
		if #MINIGOLF.PlayArea > 0 and MINIGOLF.Ball then
			if MINIGOLF.IsBallOut then
				if PHYSICS.GetTime() > MINIGOLF.BallOutStart + 2 then
					MINIGOLF.Ball:SetVelocity( Vector2( 0, 0 ) )
					MINIGOLF.Ball:SetPos( MINIGOLF.LastPos )
					MINIGOLF.BallMoving = false
					MINIGOLF.BallLastMove = PHYSICS.GetTime()
					MINIGOLF.ShotNumber = MINIGOLF.ShotNumber + 2
					MINIGOLF.IsBallOut = false
				end
			else
				local pass = false
				for k, v in pairs( MINIGOLF.PlayArea ) do
					local pos1 = v[1]
					local pos2 = v[2]
					local pos = MINIGOLF.Ball:GetPos()
					if (pos.x > pos1.x) and (pos.y > pos1.y) and (pos.x < pos2.x) and (pos.y < pos2.y) then
						pass = true
						break
					end
				end
				if not pass then
					print("Triggered")
					MINIGOLF.BallOutOfBounds()
				end
			end
		end
	end

	-- Makes the ball go out of play
	function MINIGOLF.BallOutOfBounds()
		local pos = MINIGOLF.Ball:GetPos()
		MINIGOLF.IsBallOut = true
		MINIGOLF.BallOutStart = PHYSICS.GetTime()
		MINIGOLF.BallOutPos = pos
		local snd = sound.play( _s.ball_out )
		sound.setVolume( snd, 0.5 )
	end

	function MINIGOLF.StartHole( index )
		MINIGOLF.Hole = index
		MINIGOLF.Power = 0
		local hole = MINIGOLF.Course[index]
		for _, v in pairs( hole.Geometry ) do
			local ent = Entity()
			ent:SetPos( v.pos )
			ent:SetSize( v.size )
			ent:SetMass( 0 )
			ent:SetColour( v.colour )
			if v.rotation then
				ent:SetRotation( v.rotation * (math.pi/180) )
			end
			if v.trigger then
				ent:SetTrigger( true )
				function ent:OnTrigger( ent ) v.trigger_func( ent ) end
			end
			if v.end_hole then
				ent:SetTrigger( true )
				function ent:OnTrigger( ent ) MINIGOLF.BallPotted() end
			end
			if v.move then
				ent.MINIGOLF_MoveStartPos = v.move_start
				ent.MINIGOLF_MoveEndPos = v.move_end
				ent.MINIGOLF_MoveDelay = v.move_delay
				ent.MINIGOLF_MoveWait = v.move_wait or 0
				ent.MINIGOLF_MoveSpeed = v.move_speed
				ent.MINIGOLF_MoveState = -1
				ent.MINIGOLF_MoveStateTime = PHYSICS.GetTime()
				table.insert( MINIGOLF.Movables, ent )
			end
			table.insert( MINIGOLF.Entities, { layer = 2, ent = ent } )
		end
		MINIGOLF.PlayArea = {}
		if hole.PlayArea then
			MINIGOLF.PlayArea = hole.PlayArea
		end
		MINIGOLF.SpawnBall( hole.SpawnPoint )
		MINIGOLF.IsBallPotted = false
		MINIGOLF.BallPottedStart = 0
		MINIGOLF.ShotNumber = 1
		if MINIGOLF.Course[index].Flyover then
			MINIGOLF.FlyOver = true
			MINIGOLF.FlyOverStart = PHYSICS.GetTime()
		end
	end

	function MINIGOLF.SpawnBall( pos )
		local ball = Entity()
		ball:SetStyle( SHAPE_CIRCLE )
		ball:SetSize( Vector2( 10, 10 ) )
		ball:SetPos( pos )
		ball.MINIGOLF_Rotation = 0
		--ball:SetMass( 0 )
		if MINIGOLF.Ball then
			MINIGOLF.Ball:Remove()
		end
		MINIGOLF.Ball = ball
		MINIGOLF.CameraPos = pos
		MINIGOLF.LastPos = pos
		MINIGOLF.BallMoving = false
		MINIGOLF.BallLastMove = PHYSICS.GetTime()
	end

	function MINIGOLF.KillBall()
		if MINIGOLF.Ball then MINIGOLF.Ball:Remove() end
		MINIGOLF.Ball = nil
	end

	function MINIGOLF.KillCourse()
		for k, v in pairs( MINIGOLF.Entities ) do
			v.ent:Remove()
		end
		MINIGOLF.Entities = {}
		MINIGOLF.Movables = {}
	end

	function MINIGOLF.BallPotted()
		if not MINIGOLF.IsBallPotted then
			print("End of hole")
			MINIGOLF.Scores[MINIGOLF.Hole] = MINIGOLF.ShotNumber
			MINIGOLF.IsBallPotted = true
			MINIGOLF.BallPottedStart = PHYSICS.GetTime()
			local snd = sound.play( _s.ball_potted )
			sound.setVolume( snd, 0.5 )
		end
	end

	function MINIGOLF.GoToNextHole()
		if MINIGOLF.Course[MINIGOLF.Hole+1] then
			MINIGOLF.Hole = MINIGOLF.Hole + 1
			MINIGOLF.KillBall()
			MINIGOLF.KillCourse()
			MINIGOLF.StartHole( MINIGOLF.Hole )
		else
			print("End of course")
		end
	end

	function MINIGOLF.OnMouseMoved( x, y )
		if not MINIGOLF.BallMoving and not MINIGOLF.FlyOver and not MINIGOLF.IsBallPotted then
			MINIGOLF.Power = math.clamp( (x - 200)/150, -1, 1 )*MINIGOLF.MaxPower
		end
	end

	function MINIGOLF.OnMousePressed( button )
		print( "MINIGOLF.OnMousePressed( "..button.." )" )
		if MINIGOLF.IsInMainMenu then
			MINIGOLF.IsInMainMenu = false
			MINIGOLF.StartHole( 1 )
		else
			if not MINIGOLF.BallMoving and not MINIGOLF.FlyOver and not MINIGOLF.IsBallPotted then
				MINIGOLF.BallMoving = true
				MINIGOLF.LastPos = MINIGOLF.Ball:GetPos()
				MINIGOLF.Ball:AddVelocity( Vector2( MINIGOLF.Power, 0 ) )
				if math.abs( MINIGOLF.Power ) < 150 then
					local snd = sound.play( _s.ball_hit_soft )
					sound.setVolume( snd, 0.5 )
				elseif math.abs( MINIGOLF.Power ) < 500 then
					local snd = sound.play( _s.ball_hit_med )
					sound.setVolume( snd, 0.5 )
				else
					local snd = sound.play( _s.ball_hit_hard )
					sound.setVolume( snd, 0.5 )
				end
				print( "Applied "..MINIGOLF.Power.." to the Ball." )
			end
		end
	end

	function MINIGOLF.DrawSky( x_offset, y_offset )
		-- SKY
		_r.color( 1, 1, 1, 1 )
		_r.layer( 0 )
		_r.rect( 0, 0, 400, 300, _t.altitude_sky )
		-- TREES
		-- Front-most
		_r.layer( 4 )
		_r.color( Colour( 32, 60, 83 ):GetNormalised() )
		_r.rect( -200 + 200*(x_offset/1500), 150, 948, 153, _t.altitude_trees )
		_r.layer( 3 )
		_r.color( Colour( 45, 78, 105 ):GetNormalised() )
		_r.rect( -200 + 210*(x_offset/1500), 125, 948*0.9, 153*0.9, _t.altitude_trees )
		_r.layer( 2 )
		_r.color( Colour( 57, 98, 131 ):GetNormalised() )
		_r.rect( -200 + 220*(x_offset/1500), 110, 948*0.85, 153*0.85, _t.altitude_trees )
		_r.layer( 1 )
		_r.color( Colour( 68, 115, 153 ):GetNormalised() )
		_r.rect( -200 + 230*(x_offset/1500), 100, 948*0.8, 153*0.8, _t.altitude_trees )
	end

	function MINIGOLF.DrawScoreCard()
		local columns = #MINIGOLF.Course
		local w = 54+(columns*20)+52
		local h = 92

		-- Background
		_r.layer( 100 )
		_r.color( 1, 1, 1, 1 )
		_r.rect( 200-(w/2), 150-(h/2), w, h )

		-- Next layer
		_r.layer( 101 )
		_r.color( Colour( 19, 114, 110 ):GetNormalised() )
		_r.rect( 200-(w/2)+2, 150-(h/2)+2, w-4, 20 )
		_r.rect( 200-(w/2)+2, 150-(h/2)+22, 2, h-24 )
		_r.rect( 200+(w/2)-52, 150-(h/2)+22, 50, h-24 )
		_r.rect( 200-(w/2)+4, 150+(h/2)-4, w-8, 2 )

		_r.rect( 200-(w/2)+4, 150-(h/2)+22+22, w-8, 2 )
		_r.rect( 200-(w/2)+4, 150-(h/2)+22+22+22, w-8, 2 )

		-- Text
		_r.rect( 200-(w/2)+4, 150-(h/2)+24, 50, 20, _t.hud_scorecard_text, 0, 0, 1, 0.2 )
		_r.rect( 200-(w/2)+4, 150-(h/2)+46, 50, 20, _t.hud_scorecard_text, 0, 0.2, 1, 0.4 )
		_r.color( 0.2, 0.2, 0.2, 1 )
		_r.rect( 200-(w/2)+4, 150-(h/2)+68, 50, 20, _t.hud_scorecard_text, 0, 0.8, 1, 1 )
		_r.color( 1, 1, 1, 1 )
		_r.rect( 200-25, 150-(h/2)+2, 50, 20, _t.hud_scorecard_text, 0, 0.6, 1, 0.8 )
		_r.rect( 200+(w/2)-48, 150-(h/2)+24, 50, 20, _t.hud_scorecard_text, 0, 0.4, 1, 0.6 )

		-- Stuff
		local par_total = 0
		local you_total = 0
		for k, v in pairs( MINIGOLF.Course ) do
			_r.color( Colour( 19, 114, 110 ):GetNormalised() )
			_r.rect( 200-(w/2)+54+(k-1)*20, 150-(h/2)+22, 2, h-24 )

			--_r.color( 1, 1, 1, 1 )
			--_r.rect( 200-(w/2)+54+(k-1)*20, 150-(h/2)+24, 20, 20, _t.hud_numbers, MINIGOLF.NumberUVs( k ) )
			MINIGOLF.DrawNumber( k, 200-(w/2)+54+(k-1)*20+5, 150-(h/2)+24 )

			--_r.rect( 200-(w/2)+54+(k-1)*20, 150-(h/2)+46, 20, 20, _t.hud_numbers, MINIGOLF.NumberUVs( v.Par ) )
			MINIGOLF.DrawNumber( v.Par, 200-(w/2)+54+(k-1)*20+5, 150-(h/2)+46 )

			_r.color( 0.2, 0.2, 0.2, 1 )
			if MINIGOLF.Hole == k then
				--_r.rect( 200-(w/2)+54+(k-1)*20, 150-(h/2)+68, 20, 20, _t.hud_numbers, MINIGOLF.NumberUVs( MINIGOLF.ShotNumber ) )
				if MINIGOLF.ShotNumber > v.Par then
					_r.color( Colour( 150, 50, 41 ):GetNormalised() )
				end
				MINIGOLF.DrawNumber( MINIGOLF.ShotNumber, 200-(w/2)+54+(k-1)*20+5, 150-(h/2)+68 )
				you_total = you_total + MINIGOLF.ShotNumber
			else
				if MINIGOLF.Scores[k] then
					--_r.rect( 200-(w/2)+54+(k-1)*20, 150-(h/2)+68, 20, 20, _t.hud_numbers, MINIGOLF.NumberUVs( MINIGOLF.Scores[k] ) )
					if MINIGOLF.Scores[k] > v.Par then
						_r.color( Colour( 150, 50, 41 ):GetNormalised() )
					end
					MINIGOLF.DrawNumber( MINIGOLF.Scores[k], 200-(w/2)+54+(k-1)*20+5, 150-(h/2)+68 )
					you_total = you_total + MINIGOLF.Scores[k]
				end
			end

			par_total = par_total + v.Par
		end

		_r.color( 1, 1, 1, 1 )
		--_r.rect( 200+(w/2)-38, 150-(h/2)+46, 20, 20, _t.hud_numbers, MINIGOLF.NumberUVs( par_total ) )
		--_r.rect( 200+(w/2)-38, 150-(h/2)+68, 20, 20, _t.hud_numbers, MINIGOLF.NumberUVs( you_total ) )
		MINIGOLF.DrawNumber( par_total, 200+(w/2)-32, 150-(h/2)+46 )
		MINIGOLF.DrawNumber( you_total, 200+(w/2)-32, 150-(h/2)+68 )
	end

	function MINIGOLF.DrawNumber( number, x, y )
		local number = tostring( number )
		local count = string.len( number )
		local w = count*8
		for i=1, count do
			local num = tonumber( string.sub( number, i, i ) )
			local uvx = num / 10
			_r.rect( x-(w/2) + (w*((i-1)/count)), y, 20, 20, _t.hud_number_set, uvx, 0, uvx+0.1, 1 )
		end
	end

	function MINIGOLF.DrawHUD()
		-- Shot Power
		--[[
		_r.layer( 50 )
		_r.color( 0, 0, 0, 1 )
		_r.rect( 125, 300-25, 150, 20 )
		_r.layer( 51 )
		_r.color( Colour( 41, 41, 41 ):GetNormalised() )
		_r.rect( 127, 300-23, 146, 16 )
		_r.layer( 52 )
		_r.color( Colour( 225, 62, 117 ):GetNormalised() )
		_r.rect( 200, 300-23, 73*(MINIGOLF.Power/MINIGOLF.MaxPower), 16 )
		_r.layer( 53 )
		_r.color( 0, 0, 0, 1 )
		_r.rect( 200, 300-23, 1, 16 )
		]]
		-- Power Bar
		_r.layer( 50 )
		_r.color( 1, 1, 1, (MINIGOLF.BallMoving or MINIGOLF.FlyOver or MINIGOLF.IsBallPotted) and 0.25 or 1 )
		_r.rect( 100, 300-30, 200, 29, _t.hud_power_background )
		if (MINIGOLF.Power/MINIGOLF.MaxPower) > 0 then
			_r.rect( 200, 300-30, 97*(MINIGOLF.Power/MINIGOLF.MaxPower), 29, _t.hud_power_bar, 0.5, 0, 0.5+(MINIGOLF.Power/MINIGOLF.MaxPower)*0.5, 1 )
		else
			_r.rect( 200, 300-30, 97*(MINIGOLF.Power/MINIGOLF.MaxPower), 29, _t.hud_power_bar, 0.5, 1, 0.5-math.abs(MINIGOLF.Power/MINIGOLF.MaxPower)*0.5, 0 )
		end
		_r.layer( 51 )
		_r.rect( 200-21, 300-23, 42, 15, _t.hud_power_text )

		-- For X Text
		--local uvx = MINIGOLF.ShotNumber - MINIGOLF.Course[MINIGOLF.Hole].Par
		if MINIGOLF.ShotNumber <= 1 then
			_r.rect( 100, 250, 200, 16, _t.hud_scores, 0, 0, 1, 0.1 )
		else
			local uvy = math.min( (MINIGOLF.ShotNumber - MINIGOLF.Course[MINIGOLF.Hole].Par) + 5, 9 )
			if uvy > 0 then
				_r.rect( 100, 250, 200, 16, _t.hud_scores, 0, uvy/10, 1, (uvy/10+0.1) )
			end
		end

		-- Hole Info
		_r.layer( 50 )
		_r.color( 1, 1, 1, 1 )
		_r.rect( 104, 5, 192, 20, _t.hud_background )
		_r.layer( 51 )
		--_r.rect( 139, 5, 20, 20, _t.hud_numbers, MINIGOLF.NumberUVs( MINIGOLF.Hole ) )
		MINIGOLF.DrawNumber( MINIGOLF.Hole, 139+4, 5 )
		--_r.rect( 190, 5, 20, 20, _t.hud_numbers, MINIGOLF.NumberUVs( MINIGOLF.Course[MINIGOLF.Hole].Par ) )
		MINIGOLF.DrawNumber( MINIGOLF.Course[MINIGOLF.Hole].Par, 190+4, 5 )
		--_r.rect( 270, 5, 20, 20, _t.hud_numbers, MINIGOLF.NumberUVs( MINIGOLF.ShotNumber ) )
		MINIGOLF.DrawNumber( MINIGOLF.ShotNumber, 270+4, 5 )

		-- OOB Notice
		if MINIGOLF.IsBallOut and MINIGOLF.BallOutStart then
			local per = (PHYSICS.GetTime() - MINIGOLF.BallOutStart) / 2
			if per < 0.2 then
				per = ( per / 0.2 )
			elseif per > 0.8 then
				per = math.max( 1 - ( (per - 0.8) / 0.2 ), 0 )
			else
				per = 1
			end
			_r.color( 1, 1, 1, 1 * per )
			_r.rect( 70, 115 + (20*per), 260, 70, _t.hud_oob )
		end

		-- Score card
		if ( MINIGOLF.IsBallPotted and MINIGOLF.BallPottedStart + 2 < PHYSICS.GetTime() ) or MINIGOLF.ShouldDrawScoreCard then
			MINIGOLF.DrawScoreCard()
		end
	end

	function MINIGOLF.NumberUVs( number )
		if number < 1 or number > 25 then
			return 0, 0, 0.2, 0.2
		else
			local y = math.floor( (number-1) / 5 )
			local x = (number-1) % 5
			return 0.2*x, 0.2*y, 0.2*(x+1), 0.2*(y+1)
		end
	end

	function MINIGOLF.Draw()
		if MINIGOLF.IsInMainMenu then
			MINIGOLF.DrawSky( 0, 0 )
			_r.layer( 10 )
			_r.color( 1, 1, 1, 1 )
			_r.rect( 0, 0, 400, 300, _t.menu_splash )
		else
			local camPos = Vector2( 0, 0 )
			if MINIGOLF.FlyOver then
				local cams = MINIGOLF.Course[MINIGOLF.Hole].Flyover
				local count = #cams

				if #MINIGOLF.FlyOverLengths ~= count then
					MINIGOLF.FlyOverLengths[1] = 0
					for k, v in pairs( cams ) do
						if k >= count then break end
						local dist = v:Distance( cams[k+1] )
						MINIGOLF.FlyOverLengths[k+1] = MINIGOLF.FlyOverLengths[k] + dist
					end
				end

				local len = 0
				for _, v in pairs( MINIGOLF.FlyOverLengths ) do
					len = len + (v-len)
				end
				local per = math.min( (PHYSICS.GetTime() - MINIGOLF.FlyOverStart) / 5, 1 )

				local distance = per * len
				local start = 1
				for i = count, 1, -1 do
					local v = MINIGOLF.FlyOverLengths[i]
					if distance >= v then
						start = i
						break
					end
				end

				if start == count then
					if PHYSICS.GetTime() > MINIGOLF.FlyOverStart + 6 then
						MINIGOLF.FlyOver = false
						MINIGOLF.FlyOverLengths = {}
					end
					camPos = cams[count]
				else
					local newper = distance - MINIGOLF.FlyOverLengths[start]
					local newend = MINIGOLF.FlyOverLengths[start+1] - MINIGOLF.FlyOverLengths[start]
					local pos = cams[start]:Lerp( cams[start+1], newper/newend )
					camPos = pos
				end
			elseif MINIGOLF.Ball then
				if MINIGOLF.IsBallOut then
					camPos = MINIGOLF.BallOutPos
				else
					camPos = MINIGOLF.Ball:GetPos()
				end
			end
			local camSize = MINIGOLF.CameraSize
			local offsetX = -(camPos.x-camSize.x/2)
			local offsetY = -(camPos.y-camSize.y/2)

			--[[
			_r.layer( 30 )
			_r.color( 1, 0, 0, 0.2 )
			for k, v in pairs( MINIGOLF.PlayArea ) do
				local pos1 = v[1]
				local pos2 = v[2]
				_r.rect( offsetX + pos1.x, offsetY + pos1.y, pos2.x-pos1.x, pos2.y-pos1.y )
			end
			]]--

			if MINIGOLF.Course[MINIGOLF.Hole].DrawForeground then
				MINIGOLF.Course[MINIGOLF.Hole].DrawForeground( offsetX, offsetY )
			else
				MINIGOLF.DrawSky( offsetX, offsetY)
				for _, ent in pairs( MINIGOLF.Entities ) do
					_r.layer( ent.layer*5 )
					local pos = ent.ent:GetLerpPos( PHYSICS.GetTime() )
					local size = ent.ent:GetSize()
					local rot = ent.ent:GetRotation()
					_r.color( ent.ent:GetColour():GetNormalised() )
					if ent.ent:GetStyle() == SHAPE_CIRCLE then
						_r.sprite( offsetX+pos.x, offsetY+pos.y, size.x, size.y, 0, _t.circle )
					else
						_r.sprite( offsetX+pos.x, offsetY+pos.y, size.x, size.y, rot )
					end
				end
			end
			if MINIGOLF.Ball then
				_r.layer( 10 )
				_r.color( Colour( 255, 255, 255 ):GetNormalised() )
				local pos = MINIGOLF.Ball:GetPos()
				local size = MINIGOLF.Ball:GetSize()
				local speed = MINIGOLF.Ball:GetVelocity().x
				MINIGOLF.Ball.MINIGOLF_Rotation = (MINIGOLF.Ball.MINIGOLF_Rotation - speed/5) % 360
				_r.sprite( offsetX+pos.x, offsetY+pos.y, size.x, size.y, 0, _t.circle )
			end
			MINIGOLF.DrawHUD()
		end
	end

	--
	-- HOLE 1
	--
	local HOLE = {}
	HOLE.Name = "Hole 1"
	HOLE.Par = 2
	HOLE.SpawnPoint = Vector2( 50, 0 )
	HOLE.Flyover = {
		Vector2( 50, 30 ),
		Vector2( 300, 30 ),
		Vector2( 520, 75 ),
		Vector2( 750, 75 ),
		Vector2( 1050, 100 ),
		Vector2( 1316, 100 ),
	}
	HOLE.PlayArea = {
		{
			Vector2( -20, -400 ),
			Vector2( 1400, 250 )
		}
	}
	HOLE.DrawForeground = function( x_offset, y_offset )
		MINIGOLF.DrawSky( x_offset, y_offset )
		-- WORLD
		_r.layer( 5 )
		_r.color( 1, 1, 1, 1 )
		_r.rect( x_offset, -124+y_offset, 1366, 337, _t.altitude_hole_1 )
	end
	HOLE.Geometry = {
		-- PLATFORM 1
		{
			["pos"] = Vector2( 7, 43 ),	-- Wall
			["size"] = Vector2( 14, 14 ),
			["colour"] = Colour( 147, 118, 84 )
		},
		{
			["pos"] = Vector2( 100, 60 ),	-- Floor
			["size"] = Vector2( 200, 20 ),
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 208, 58 ),	-- Floor
			["size"] = Vector2( 40, 20 ),
			["rotation"] = 10,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 226, 53 ),	-- Floor
			["size"] = Vector2( 40, 20 ),
			["rotation"] = 20,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 242, 45 ),	-- Floor
			["size"] = Vector2( 20, 20 ),
			["rotation"] = 30,
			["colour"] = Colour( 46, 204, 113 )
		},
		-- PLATFORM 2
		{
			["pos"] = Vector2( 507, 93 ),	-- Wall
			["size"] = Vector2( 14, 14 ),
			["colour"] = Colour( 147, 118, 84 )
		},
		{
			["pos"] = Vector2( 650, -75 ),	-- Sky Wall
			["size"] = Vector2( 30, 100 ),
			["colour"] = Colour( 147, 118, 84 )
		},
		{
			["pos"] = Vector2( 600, 110 ),	-- Floor
			["size"] = Vector2( 200, 20 ),
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 708, 108 ),	-- Floor
			["size"] = Vector2( 40, 20 ),
			["rotation"] = 10,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 726, 103 ),	-- Floor
			["size"] = Vector2( 40, 20 ),
			["rotation"] = 20,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 742, 95 ),	-- Floor
			["size"] = Vector2( 20, 20 ),
			["rotation"] = 30,
			["colour"] = Colour( 46, 204, 113 )
		},
		-- FANS
		{
			["pos"] = Vector2( 850, 100 ),	-- Trigger
			["size"] = Vector2( 100, 200 ),
			["trigger"] = true,
			["trigger_func"] = function( ent ) if ent:GetVelocity().y > -200 then ent:AddVelocity( Vector2( 0, -12 ) ) end end,
			["colour"] = Colour( 255, 200, 20, 0.5 )
		},
		{
			["pos"] = Vector2( 1000, 100 ),	-- Trigger
			["size"] = Vector2( 100, 200 ),
			["trigger"] = true,
			["trigger_func"] = function( ent ) if ent:GetVelocity().y > -200 then ent:AddVelocity( Vector2( 0, -12 ) ) end end,
			["colour"] = Colour( 255, 200, 20, 0.5 )
		},
		-- FINAL PLATFORM
		{
			["pos"] = Vector2( 1200, 150 ),	-- Floor
			["size"] = Vector2( 200, 20 ),
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1359, 133 ),	-- Wall
			["size"] = Vector2( 14, 14 ),
			["colour"] = Colour( 147, 118, 84 )
		},
		{
			["pos"] = Vector2( 1308, 157 ),	-- Floor under Hole
			["size"] = Vector2( 16, 6 ),
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1308, 149 ),	-- Hole End Trigger
			["size"] = Vector2( 16, 10 ),
			["end_hole"] = true,
			["colour"] = Colour( 255, 200, 20, 0.5 )
		},
		{
			["pos"] = Vector2( 1341, 150 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["colour"] = Colour( 46, 204, 113 )
		},
	}
	MINIGOLF.RegisterHole( HOLE, 1 )

	--
	-- HOLE 2
	--
	local HOLE = {}
	HOLE.Name = "Hole 2"
	HOLE.Par = 2
	HOLE.SpawnPoint = Vector2( 50, 0 ) -- 50, 0
	HOLE.Flyover = {
		Vector2( 50, 30 ),
		Vector2( 250, 30 ),
		Vector2( 670, 260 ),
		Vector2( 825, 260 ),
		Vector2( 980, 190 ),
		Vector2( 1202, 190 ),
	}
	HOLE.PlayArea = {
		{
			Vector2( -20, -400 ),
			Vector2( 1300, 350 )
		}
	}
	HOLE.DrawForeground = function( x_offset, y_offset )
		MINIGOLF.DrawSky( x_offset, y_offset )
		-- WORLD
		_r.layer( 5 )
		_r.color( 1, 1, 1, 1 )
		_r.rect( -2+x_offset, 37+y_offset, 1253, 283, _t.altitude_hole_2 )
	end
	HOLE.Geometry = {
		-- PLATFORM 1
		{
			["pos"] = Vector2( 7, 43 ),	-- Wall
			["size"] = Vector2( 14, 14 ),
			["colour"] = Colour( 147, 118, 84 )
		},
		{
			["pos"] = Vector2( 100, 60 ),	-- Floor
			["size"] = Vector2( 200, 20 ),
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 214, 61.5 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = -5,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 240, 65 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = -10,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 268, 71.5 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = -15,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 295, 80 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = -20,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 322, 91.5 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = -25,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 348, 105 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = -30,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 372.5, 121 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = -35,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 395.5, 139 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = -40,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 442, 183 ),	-- Floor MIDDLE OF CURVE
			["size"] = Vector2( 100, 20 ),
			["rotation"] = -45,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 488, 227.5 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -40,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 511, 246 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -35,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 535, 261 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -30,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 561, 274 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -25,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 587, 285 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -20,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 614, 294 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -15,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 642, 300.5 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -10,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 671, 304 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -5,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 735, 305 ),	-- Floor BOTTOM OF U
			["size"] = Vector2( 120, 20 ),
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 799, 304 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 5,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 828, 300.5 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 10,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 856, 294 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 15,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 883, 285 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 20,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 909, 274 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 25,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 935, 261 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 30,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 959, 246 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 35,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 982, 228 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = 40,
			["colour"] = Colour( 46, 204, 113 )
		},
		-- FINAL PLATFORM
		{
			["pos"] = Vector2( 1086, 221 ),	-- Floor 1200 150  114
			["size"] = Vector2( 200, 20 ),
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1245, 204 ),	-- Wall
			["size"] = Vector2( 14, 14 ),
			["colour"] = Colour( 147, 118, 84 )
		},
		{
			["pos"] = Vector2( 1194, 228 ),	-- Floor under Hole
			["size"] = Vector2( 16, 6 ),
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1194, 220 ),	-- Hole End Trigger
			["size"] = Vector2( 16, 10 ),
			["end_hole"] = true,
			["colour"] = Colour( 255, 200, 20, 0.5 )
		},
		{
			["pos"] = Vector2( 1227, 221 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["colour"] = Colour( 46, 204, 113 )
		},
	}
	MINIGOLF.RegisterHole( HOLE, 2 )


	--
	-- HOLE 3
	--
	local HOLE = {}
	HOLE.Name = "Hole 3"
	HOLE.Par = 3
	HOLE.SpawnPoint = Vector2( 50, 0 ) -- 50, 0
	HOLE.Flyover = {
		Vector2( 50, 30 ),
		Vector2( 250, 30 ),
		Vector2( 670, 260 ),
		Vector2( 980, 190 ),
		Vector2( 1508, 190 ),
	}
	HOLE.PlayArea = {
		{
			Vector2( -20, -400 ),
			Vector2( 1600, 350 )
		}
	}
	HOLE.DrawForeground = function( x_offset, y_offset )
		MINIGOLF.DrawSky( x_offset, y_offset )
		-- WORLD
		_r.layer( 5 )
		_r.color( 1, 1, 1, 1 )
		_r.rect( -2+x_offset, 37+y_offset, 1567, 301, _t.altitude_hole_3 )
		-- MOVEABLES
		_r.layer( 6 )
		_r.color( Colour( 255, 100, 100 ):GetNormalised() )
		for k, v in pairs( MINIGOLF.Movables ) do
			local pos = v:GetLerpPos( PHYSICS.GetTime() )
			local size = v:GetSize()
			_r.sprite( x_offset + pos.x, y_offset + pos.y, size.x, size.y, 0, _t.altitude_block )
		end
	end
	HOLE.Geometry = {
		-- PLATFORM 1
		{
			["pos"] = Vector2( 7, 43 ),	-- Wall
			["size"] = Vector2( 14, 14 ),
			["colour"] = Colour( 147, 118, 84 )
		},
		{
			["pos"] = Vector2( 100, 60 ),	-- Floor
			["size"] = Vector2( 200, 20 ),
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 214, 61.5 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = -5,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 240, 65 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = -10,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 268, 71.5 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = -15,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 295, 80 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = -20,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 322, 91.5 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = -25,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 348, 105 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = -30,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 372.5, 121 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = -35,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 395.5, 139 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = -40,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 442, 183 ),	-- Floor MIDDLE OF CURVE
			["size"] = Vector2( 100, 20 ),
			["rotation"] = -45,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 488, 227.5 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -40,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 511, 246 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -35,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 535, 261 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -30,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 561, 274 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -25,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 587, 285 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -20,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 614, 294 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -15,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 642, 300.5 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -10,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 671, 304 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -5,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 700, 305 ),	-- Floor BOTTOM OF U 735
			["size"] = Vector2( 50, 20 ),
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 729, 304 ),	-- Floor 799
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 5,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 758, 300.5 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 10,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 786, 294 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 15,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 813, 285 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 20,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 839, 274 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 25,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 865, 261 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 30,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 889, 246 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = 35,
			["colour"] = Colour( 46, 204, 113 )
		},
		-- FANS
		{
			["pos"] = Vector2( 1000, 225 ),	-- Trigger
			["size"] = Vector2( 100, 200 ),
			["trigger"] = true,
			["trigger_func"] = function( ent ) if ent:GetVelocity().y > -200 then ent:AddVelocity( Vector2( 0, -12 ) ) end end,
			["colour"] = Colour( 255, 200, 20, 0.5 )
		},
		{
			["pos"] = Vector2( 1150, 225 ),	-- Trigger
			["size"] = Vector2( 100, 200 ),
			["trigger"] = true,
			["trigger_func"] = function( ent ) if ent:GetVelocity().y > -200 then ent:AddVelocity( Vector2( 0, -12 ) ) end end,
			["colour"] = Colour( 255, 200, 20, 0.5 )
		},
		-- FINAL PLATFORM
		{
			["pos"] = Vector2( 1400, 221 ),	-- Floor 1086 221  114
			["size"] = Vector2( 200, 20 ),
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1559, 204 ),	-- Wall
			["size"] = Vector2( 14, 14 ),
			["colour"] = Colour( 147, 118, 84 )
		},
		{
			["pos"] = Vector2( 1508, 228 ),	-- Floor under Hole
			["size"] = Vector2( 16, 6 ),
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1508, 220 ),	-- Hole End Trigger
			["size"] = Vector2( 16, 10 ),
			["end_hole"] = true,
			["colour"] = Colour( 255, 200, 20, 0.5 )
		},
		{
			["pos"] = Vector2( 1541, 221 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1400, 204 ),	-- Moving Thinig
			["size"] = Vector2( 14, 14 ),
			["colour"] = Colour( 231, 76, 60 ),
			["move"] = true,
			["move_start"] = Vector2( 1400, 204 ),
			["move_end"] = Vector2( 1400, 218 ),
			["move_speed"] = 0.5,
			["move_delay"] = 4,
			["move_wait"] = 0
		},
		{
			["pos"] = Vector2( 1450, 204 ),	-- Moving Thinig
			["size"] = Vector2( 14, 14 ),
			["colour"] = Colour( 231, 76, 60 ),
			["move"] = true,
			["move_start"] = Vector2( 1450, 204 ),
			["move_end"] = Vector2( 1450, 218 ),
			["move_speed"] = 0.5,
			["move_delay"] = 4,
			["move_wait"] = 2
		},
	}
	MINIGOLF.RegisterHole( HOLE, 3 )

	--
	-- HOLE 3
	--
	local HOLE = {}
	HOLE.Name = "Hole 4"
	HOLE.Par = 3
	HOLE.SpawnPoint = Vector2( 50, 0 ) -- 50, 0
	HOLE.DrawForeground = function( x_offset, y_offset )
		MINIGOLF.DrawSky( x_offset, y_offset )
		-- WORLD
		_r.layer( 5 )
		_r.color( 1, 1, 1, 1 )
		_r.rect( x_offset, -121-155+y_offset, 1500, 750, _t.altitude_hole_4 )
	end
	HOLE.Flyover = {
		Vector2( 50, 30 ),
		Vector2( 500, -30 ),
		Vector2( 1100, -30 ),
		Vector2( 900,  100 ),
		Vector2( 496, 100 )
	}
	HOLE.PlayArea = {
		{
			Vector2( -20, -400 ),
			Vector2( 1250, 200 )
		}
	}
	HOLE.Geometry = {
		-- PLATFORM 1
		{
			["pos"] = Vector2( 7, 43 ),	-- Wall
			["size"] = Vector2( 14, 14 ),
			["colour"] = Colour( 147, 118, 84 )
		},
		{
			["pos"] = Vector2( 100, 60 ),	-- Floor
			["size"] = Vector2( 200, 20 ),
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 213, 59 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 5,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 242, 55 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 10,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 270, 48.5 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 15,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 297, 40 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 20,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 324, 29 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 25,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 350, 15.5 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 30,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 374, 0 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 35,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 397, -18 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 40,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 418, -37 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 45,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 438, -58.5 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 50,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 455, -80 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 55,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 471, -104 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = 60,
			["colour"] = Colour( 46, 204, 113 )
		},

		{
			["pos"] = Vector2( 479, -36 ),	-- Floor
			["size"] = Vector2( 20, 150 ),
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 515, -36 ),	-- Floor
			["size"] = Vector2( 20, 150 ),
			["colour"] = Colour( 46, 204, 113 )
		},

		{
			["pos"] = Vector2( 521, -104 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = -60,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 536, -80 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -55,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 553, -58.5 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -50,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 572.5, -37 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -45,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 593, -18 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -40,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 616, 0 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -35,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 641, 15.5 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -30,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 667, 29 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -25,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 694, 40 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -20,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 721, 48.5 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -15,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 749, 55 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -10,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 778, 59 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = -5,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 800, 60 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 823, 59 ),	-- Floor 213
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 5,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 851, 55 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 10,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 880, 48.5 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 15,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 907, 40 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 20,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 934, 29 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 25,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 960, 15.5 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 30,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 984, 0 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 35,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1007, -18 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 40,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1028, -37 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 45,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1048, -58.5 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 50,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1065, -80 ),	-- Floor
			["size"] = Vector2( 50, 20 ),
			["rotation"] = 55,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1081, -104 ),	-- Floor
			["size"] = Vector2( 30, 20 ),
			["rotation"] = 60,
			["colour"] = Colour( 46, 204, 113 )
		},

		{
			["pos"] = Vector2( 1022, 118 ),	-- Floor
			["size"] = Vector2( 60, 20 ),
			["rotation"] = 10,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1059, 108 ),	-- Floor
			["size"] = Vector2( 60, 20 ),
			["rotation"] = 20,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1094, 92 ),	-- Floor
			["size"] = Vector2( 60, 20 ),
			["rotation"] = 30,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1125, 70 ),	-- Floor
			["size"] = Vector2( 60, 20 ),
			["rotation"] = 40,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1152, 44 ),	-- Floor
			["size"] = Vector2( 60, 20 ),
			["rotation"] = 50,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1174, 13 ),	-- Floor
			["size"] = Vector2( 60, 20 ),
			["rotation"] = 60,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1190, -21 ),	-- Floor
			["size"] = Vector2( 60, 20 ),
			["rotation"] = 70,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1200, -58 ),	-- Floor
			["size"] = Vector2( 60, 20 ),
			["rotation"] = 80,
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 1204, -176 ),	-- Floor
			["size"] = Vector2( 20, 200 ),
			["colour"] = Colour( 46, 204, 113 )
		},

		-- FINAL PLATFORM
		{
			["pos"] = Vector2( 754, 121 ),	-- Floor 1086 221  114
			["size"] = Vector2( 500, 20 ),
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 496, 128 ),	-- Floor under Hole
			["size"] = Vector2( 16, 6 ),
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 496, 120 ),	-- Hole End Trigger
			["size"] = Vector2( 16, 10 ),
			["end_hole"] = true,
			["colour"] = Colour( 255, 200, 20, 0.5 )
		},
		{
			["pos"] = Vector2( 388, 121 ),	-- Floor
			["size"] = Vector2( 200, 20 ),
			["colour"] = Colour( 46, 204, 113 )
		},
		{
			["pos"] = Vector2( 295, 104 ),	-- Wall
			["size"] = Vector2( 14, 14 ),
			["colour"] = Colour( 147, 118, 84 )
		},
	}
	MINIGOLF.RegisterHole( HOLE, 4 )
end

function init()
	mg_init()
end

function draw()
	MINIGOLF.Draw()
end

function think( time, dt )
	MINIGOLF.Think( time, dt )
	PHYSICS.Think( time, dt )
end

function onKeyPressed( key )
	MINIGOLF.OnKeyPressed( key )
end

function onKeyReleased( key )
	MINIGOLF.OnKeyReleased( key )
end

function onMousePressed( button )
	MINIGOLF.OnMousePressed( button )
end

function onMouseMoved( x, y )
	MINIGOLF.OnMouseMoved( x, y )
end
