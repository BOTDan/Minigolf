-- Rubbish Physics Engine
-- BOT Dan

PHYSICS = {}

-- All entities within the system
PHYSICS.entities = {}
PHYSICS.fps = 60
PHYSICS.lastThink = 0
PHYSICS.time = 0
PHYSICS.startTime = false
PHYSICS.tickCount = 0
PHYSICS.frictionScale = 0.1

-- Returns the last physics tick
function PHYSICS.GetLastTick()
	return PHYSICS.lastThink
end

-- Returns the current time
function PHYSICS.GetTime()
	return PHYSICS.time
end

-- Returns the FPS of the physics
function PHYSICS.GetFPS()
	return 1/PHYSICS.fps
end

-- Adds an entity
function PHYSICS.AddEntity( ent )
	table.insert( PHYSICS.entities, 1, ent )
end

-- Removes an entity
function PHYSICS.RemoveEntity( ent )
	for k, v in pairs( PHYSICS.entities ) do
		if v == ent then
			table.remove( PHYSICS.entities, k )
		end
	end
end

-- Returns a list of entities
function PHYSICS.GetEntities()
	return PHYSICS.entities
end

-- Thinks
function PHYSICS.Think( time, dt )
	if not PHYSICS.startTime then PHYSICS.startTime = time end
	PHYSICS.time = time - PHYSICS.startTime
	if PHYSICS.lastThink + (1/PHYSICS.fps) < time then
		if PHYSICS.lastThink == 0 then
			PHYSICS.lastThink = time
		else
			PHYSICS.lastThink = PHYSICS.lastThink + (1/PHYSICS.fps)
		end
		PHYSICS.Update()
		PHYSICS.tickCount = PHYSICS.tickCount + 1
	end
end

-- Updates physics
function PHYSICS.Update()
	-- Move each item
	for _, ent in pairs( PHYSICS.entities ) do
		PHYSICS.ApplyGravity( ent )
	end
	-- Update collisions
	for i=1, #PHYSICS.entities-1 do
		for j=(i+1), #PHYSICS.entities do
			if PHYSICS.IsOverlapping( PHYSICS.entities[i], PHYSICS.entities[j] ) then
				PHYSICS.CheckCollision( PHYSICS.entities[i], PHYSICS.entities[j] )
			end
		end
	end
	-- Update positions
	for _, ent in pairs( PHYSICS.entities ) do
		PHYSICS.ApplyVelocity( ent )
	end
end

-- DoCollision()
function PHYSICS.CheckCollision( ent1, ent2 )
	if ent1:GetMass() == 0 and ent2:GetMass() == 0 then return end
	local style_ent1 = ent1:GetStyle()
	local style_ent2 = ent2:GetStyle()
	if style_ent1 == SHAPE_RECT then
		if style_ent2 == SHAPE_RECT then
			-- Rectangle vs Rectangle
			local normal, penetration = PHYSICS.GetCollisionData_RectVRect( ent1, ent2 )
		elseif style_ent2 == SHAPE_CIRCLE then
			-- Rectangle vs Circle
			local normal, penetration = PHYSICS.GetCollisionData_RectVCircle( ent1, ent2 )
		end
	elseif style_ent1 == SHAPE_CIRCLE then
		if style_ent2 == SHAPE_RECT then
			-- Circle vs Rectangle
			local normal, penetration = PHYSICS.GetCollisionData_RectVCircle( ent2, ent1 )
		elseif style_ent2 == SHAPE_CIRCLE then
			-- Circle vs Circle
			local normal, penetration = PHYSICS.GetCollisionData_CircleVCircle( ent1, ent2 )
		end
	end
end

-- Resolves collision between 2 entities
function PHYSICS.ResolveCollision( ent1, ent2, normal, penetration )
	if ent1:IsTrigger() and ent2:IsTrigger() then
		return
	elseif ent1:IsTrigger() then
		ent1:OnTrigger( ent2 )
		return
	elseif ent2:IsTrigger() then
		ent2:OnTrigger( ent1 )
		return
	end

	local rv = ent2:GetVelocity() - ent1:GetVelocity()

	if not normal then return end

	local velAlongNormal = rv:DotProduct( normal )

	if (velAlongNormal > 0) then return end

	local e = math.min( ent1:GetRestitution(), ent2:GetRestitution() )

	local j = -(1 + e) * velAlongNormal
	j = j / ( ent1:GetInvMass() + ent2:GetInvMass() )

	local impulse = normal * j
	ent1:AddVelocity( - impulse * ent1:GetInvMass() )
	ent2:AddVelocity( impulse * ent2:GetInvMass() )

	-- Apply friction
	local tangent = rv - normal * rv:DotProduct( normal )
	tangent = tangent:GetNormalised()

	local jt = -rv:DotProduct( tangent )
	jt = jt / (ent1:GetInvMass() + ent2:GetInvMass())

	local mu = math.pythag( ent1:GetStaticFriction(), ent2:GetStaticFriction() )

	local frictionImpulse = 0
	if (math.abs( jt ) < j * mu) then
		frictionImpulse = tangent * jt
	else
		local dynamicFriction = math.pythag( ent1:GetDynamicFriction(), ent2:GetDynamicFriction() )
		frictionImpulse = tangent * -j * dynamicFriction
	end

	frictionImpulse = frictionImpulse * PHYSICS.frictionScale

	ent1:AddVelocity( - frictionImpulse * ent1:GetInvMass() )
	ent2:AddVelocity( frictionImpulse * ent2:GetInvMass() )

	-- Positional Correction
	PHYSICS.PositionalCorrection( ent1, ent2, normal, penetration )
end

-- Resolves collision between 2 entities (1 rotated)
function PHYSICS.ResolveCollision_Rotated( ent1, ent2, normal, penetration )
	if ent1:IsTrigger() and ent2:IsTrigger() then
		return
	elseif ent1:IsTrigger() then
		ent1:OnTrigger( ent2 )
		return
	elseif ent2:IsTrigger() then
		ent2:OnTrigger( ent1 )
		return
	end

	local rv = ent2:GetVelocity():Rotate( ent1:GetRotation() ) - ent1:GetVelocity()

	if not normal then return end

	local velAlongNormal = rv:DotProduct( normal )

	if (velAlongNormal > 0) then return end

	local e = math.min( ent1:GetRestitution(), ent2:GetRestitution() )

	local j = -(1 + e) * velAlongNormal
	j = j / ( ent1:GetInvMass() + ent2:GetInvMass() )

	local impulse = normal * j
	impulse = impulse:Rotate( -ent1:GetRotation() )
	ent1:AddVelocity( - impulse * ent1:GetInvMass() )
	ent2:AddVelocity( impulse * ent2:GetInvMass() )

	-- Apply friction
	local tangent = rv - normal * rv:DotProduct( normal )
	tangent = tangent:GetNormalised()

	local jt = -rv:DotProduct( tangent )
	jt = jt / (ent1:GetInvMass() + ent2:GetInvMass())

	local mu = math.pythag( ent1:GetStaticFriction(), ent2:GetStaticFriction() )

	local frictionImpulse = 0
	if (math.abs( jt ) < j * mu) then
		frictionImpulse = tangent * jt
	else
		local dynamicFriction = math.pythag( ent1:GetDynamicFriction(), ent2:GetDynamicFriction() )
		frictionImpulse = tangent * -j * dynamicFriction
	end

	frictionImpulse = frictionImpulse * PHYSICS.frictionScale
	frictionImpulse = frictionImpulse:Rotate( -ent1:GetRotation() )

	ent1:AddVelocity( - frictionImpulse * ent1:GetInvMass() )
	ent2:AddVelocity( frictionImpulse * ent2:GetInvMass() )

	-- Positional Correction
	PHYSICS.PositionalCorrection_Rotated( ent1, ent2, normal, penetration )
end

-- Applies positional correction
function PHYSICS.PositionalCorrection( ent1, ent2, normal, penetration )
	local percent = 0.2
	local slop = 0.01
	local correction = math.max( penetration - slop, 0 ) / (ent1:GetInvMass() + ent2:GetInvMass()) * percent
	correction = normal * correction
	ent1:MovePos( ent1:GetPos() - correction * ent1:GetInvMass() )
	ent2:MovePos( ent2:GetPos() + correction * ent2:GetInvMass() )
end

-- Applies positional correction
function PHYSICS.PositionalCorrection_Rotated( ent1, ent2, normal, penetration )
	local percent = 0.5
	local slop = 0.01
	local correction = math.max( penetration - slop, 0 ) / (ent1:GetInvMass() + ent2:GetInvMass()) * percent
	correction = normal * correction
	correction = -correction:Rotate( -ent1:GetRotation() )
	ent1:MovePos( ent1:GetPos() + correction * ent1:GetInvMass() )
	ent2:MovePos( ent2:GetPos() - correction * ent2:GetInvMass() )
end

-- Works out hit normal when rectangle is rotated
function PHYSICS.GetCollisionData_RectVCircle_Rotated( ent1, ent2 )
	local ang = ent1:GetRotation()
	local e1_pos = ent1:GetPos()
	local e2_pos = ent2:GetPos()

	local new_x = math.cos( ang ) * (e2_pos.x - e1_pos.x) - math.sin( ang ) * (e2_pos.y - e1_pos.y) + e1_pos.x
	local new_y = math.sin( ang ) * (e2_pos.x - e1_pos.x) + math.cos( ang ) * (e2_pos.y - e1_pos.y) + e1_pos.y

	local ent2_pos = Vector2( new_x, new_y )

	local n = ent2_pos - ent1:GetPos()
	local closest = n:Copy()

	local x_extent = (ent1:GetSize().x) / 2
	local y_extent = (ent1:GetSize().y) / 2

	closest.x = math.clamp( closest.x, -x_extent, x_extent )
	closest.y = math.clamp( closest.y, -y_extent, y_extent )

	local inside = false
	if ( n == closest ) then
		inside = true

		if ( math.abs( n.x ) > math.abs( n.y ) ) then
			if ( closest.x > 0 ) then
				closest.x = x_extent
			else
				closest.x = -x_extent
			end
		else
			if ( closest.y > 0 ) then
				closest.y = y_extent
			else
				closest.y = -y_extent
			end
		end
	end

	local normal = n - closest
	local d = normal:LengthSquared()
	local r = ent2:GetSize().x/2

	if ( d > r * r and not inside ) then return false end

	d = normal:Length()

	if inside then
		local normal = -normal:GetNormalised()
		local penetration = r - d
		PHYSICS.ResolveCollision_Rotated( ent1, ent2, normal, penetration )
	else
		local normal = normal:GetNormalised()
		local penetration = r - d
		PHYSICS.ResolveCollision_Rotated( ent1, ent2, normal, penetration )
	end
	return false

end

-- Works out the normal of a collision between a rectange and circle
function PHYSICS.GetCollisionData_RectVCircle( ent1, ent2 )
	if ent1:GetRotation() ~= 0 then
		return PHYSICS.GetCollisionData_RectVCircle_Rotated( ent1, ent2 )
	end

	local n = ent2:GetPos() - ent1:GetPos()
	local closest = n:Copy()

	local x_extent = (ent1:GetMaxBounds().x - ent1:GetMinBounds().x) / 2
	local y_extent = (ent1:GetMaxBounds().y - ent1:GetMinBounds().y) / 2

	closest.x = math.clamp( closest.x, -x_extent, x_extent )
	closest.y = math.clamp( closest.y, -y_extent, y_extent )

	local inside = false
	if ( n == closest ) then
		inside = true

		if ( math.abs( n.x ) > math.abs( n.y ) ) then
			if ( closest.x > 0 ) then
				closest.x = x_extent
			else
				closest.x = -x_extent
			end
		else
			if ( closest.y > 0 ) then
				closest.y = y_extent
			else
				closest.y = -y_extent
			end
		end
	end

	local normal = n - closest
	local d = normal:LengthSquared()
	local r = ent2:GetSize().x/2

	if ( d > r * r and not inside ) then return false end

	d = normal:Length()

	if inside then
		local normal = -normal:GetNormalised()
		local penetration = r - d
		PHYSICS.ResolveCollision( ent1, ent2, normal, penetration )
	else
		local normal = normal:GetNormalised()
		local penetration = r - d
		PHYSICS.ResolveCollision( ent1, ent2, normal, penetration )
	end
	return false
end

-- Works out normal of a collision between 2 circles
function PHYSICS.GetCollisionData_CircleVCircle( ent1, ent2 )
	local n = ent2:GetPos() - ent1:GetPos()
	local r = ent1:GetSize().x/2 + ent2:GetSize().x/2
	r2 = r * r

	if ( n:LengthSquared() > r2 ) then return false end

	local d = n:Length()

	if ( d ~= 0 ) then
		local penetration = r - d
		local normal = n / d
		PHYSICS.ResolveCollision( ent1, ent2, normal, penetration )
	else
		local penetration = ent1:GetSize().x
		local normal = Vector2( 1, 0 )
		PHYSICS.ResolveCollision( ent1, ent2, normal, penetration )
	end
	return false
end

-- Works out the normal of a collision
function PHYSICS.GetCollisionData_RectVRect( ent1, ent2 )
	local n = ent2:GetPos() - ent1:GetPos()

	local extent_1 = (ent1:GetMaxBounds().x - ent1:GetMinBounds().x) / 2
	local extent_2 = (ent2:GetMaxBounds().x - ent2:GetMinBounds().x) / 2

	local x_overlap = extent_1 + extent_2 - math.abs( n.x )

	if (x_overlap > 0) then
		local extent_1 = (ent1:GetMaxBounds().y - ent1:GetMinBounds().y) / 2
		local extent_2 = (ent2:GetMaxBounds().y - ent2:GetMinBounds().y) / 2

		local y_overlap = extent_1 + extent_2 - math.abs( n.y )

		if (y_overlap > 0) then
			if (x_overlap < y_overlap) then
				if (n.x < 0) then
					local normal = Vector2( -1, 0 )
					PHYSICS.ResolveCollision( ent1, ent2, normal, x_overlap )
				else
					local normal = Vector2( 1, 0 )
					PHYSICS.ResolveCollision( ent1, ent2, normal, x_overlap )
				end
			else
				if (n.y < 0) then
					local normal = Vector2( 0, -1 )
					PHYSICS.ResolveCollision( ent1, ent2, normal, y_overlap )
				else
					local normal = Vector2( 0, 1 )
					PHYSICS.ResolveCollision( ent1, ent2, normal, y_overlap )
				end
			end
		end
	end
	return false
end

-- Calculate the cross product of 2 items
-- Should really be in the vector library but meh
function PHYSICS.CrossProduct( a, b )
	if type(a) == "number" then
		return Vector2( -s * a.y, s * a.x )
	else
		if type(b) == "number" then
			return Vector2( s * a.y, -s * a.x )
		else
			return a.x * b.y - a.y * b.x
		end
	end
end

-- Applys this entities velocity to its position
function PHYSICS.ApplyVelocity( ent )
	if ent:GetMass() == 0 then return end

	local vel = ent:GetVelocity()
	ent:MovePos( ent:GetPos() + vel * (1/PHYSICS.fps) )
end

-- Calculates gravity for an entity
function PHYSICS.ApplyGravity( ent )
	if ent:GetMass() == 0 then return end

	local gravity = ent:GetGravity()
	local vel = ent:GetVelocity()

	if vel.y > 300 then return end

	ent:AddVelocity( Vector2( 0, 600 ) * (1/PHYSICS.fps) ) -- Will reach terminal velocity in 2 seconds!
end

-- Checks if 2 entities are overlapping
function PHYSICS.IsOverlapping( ent1, ent2 )
	if (ent1:GetMaxBounds().x < ent2:GetMinBounds().x or ent1:GetMinBounds().x > ent2:GetMaxBounds().x) then return false end
	if (ent1:GetMaxBounds().y < ent2:GetMinBounds().y or ent1:GetMinBounds().y > ent2:GetMaxBounds().y) then return false end

	return true
end


--[[
,------.          ,--.  ,--.  ,--.
|  .---',--,--, ,-'  '-.`--',-'  '-.,--. ,--.
|  `--, |      \'-.  .-',--.'-.  .-' \  '  /
|  `---.|  ||  |  |  |  |  |  |  |    \   '
`------'`--''--'  `--'  `--'  `--'  .-'  /
                                    `---'
]]--

local entity_mt = {}
entity_mt.__index = entity_mt

-- Creates a new Entity
function Entity()
	local entity = setmetatable( {}, entity_mt )
	entity:__init()
	PHYSICS.AddEntity( entity )
	return entity
end

-- Startup function of an entity
function entity_mt:__init()
	self.origin = Vector2( 0, 0 )
	self.lastorigin = Vector2( 0, 0 )
	self.shape = Shape( SHAPE_RECT )
	self.velocity = Vector2( 0, 0 )
	self.rotation = 0
	self.mass = 10
	self.inv_mass = 1/10
	self.restitution = 0.2
	self.gravity = 1
	self.friction_static = 0.5
	self.friction_dynamic = 0.3
	self.is_trigger = false
	self.colour = Colour( 255, 255, 255, 1 )
end

-- TRIGGER CODE
function entity_mt:IsTrigger()
	return self.is_trigger
end

function entity_mt:SetTrigger( bool )
	self.is_trigger = bool
end

function entity_mt:OnTrigger( ent )
	return
end

-- REMOVE
function entity_mt:Remove()
	PHYSICS.RemoveEntity( self )
	self = nil
end

-- ROTATION
-- Returns the rotation of this object
function entity_mt:GetRotation()
	return self.rotation
end

-- Sets the rotation of this object
function entity_mt:SetRotation( rot )
	self.rotation = rot
	self.shape:SetRotation( rot )
end

-- FRICTION
-- Returns the value of static friction
function entity_mt:GetStaticFriction()
	return self.friction_static
end

-- Sets the value of statif friction
function entity_mt:SetStaticFriction( fric )
	self.friction_static = fric
end

-- Returns the value of dynamic friction
function entity_mt:GetDynamicFriction()
	return self.friction_dynamic
end

-- Sets the value of dynamic friction
function entity_mt:SetDynamicFriction( fric )
	self.friction_dynamic = fric
end

-- COLOUR
-- Sets the render colour of this entity
function entity_mt:SetColour( col )
	self.colour = col
end

-- Returns the render colour of this entity
function entity_mt:GetColour()
	return self.colour
end

-- POSITION
-- Sets the position of the netity
function entity_mt:SetPos( vector )
	self.lastorigin = vector
	self.origin =  vector
end

-- Internal setpos
function entity_mt:MovePos( vector )
	self.lastorigin = self.origin
	self.origin =  vector
end

-- Returns the position of the entity
function entity_mt:GetPos()
	return self.origin
end

-- Returnes the interpolated position at the given time
function entity_mt:GetLerpPos( time )
	local percent = ( time - PHYSICS.GetLastTick() ) / (PHYSICS.GetFPS() )
	return self.lastorigin:Lerp( self.origin, percent )
end

-- SIZE
-- Sets the size of the shape
function entity_mt:SetSize( size )
	self.shape:SetSize( size )
end

-- Returns the size of the shape
function entity_mt:GetSize()
	return self.shape:GetSize()
end

-- MASS
-- Sets the mass of this entity
function entity_mt:SetMass( mass )
	self.mass = mass
	self.inv_mass = 1/mass
end

-- Returns the mass of this entity
function entity_mt:GetMass()
	return self.mass
end

-- Returns the inverse of mass
function entity_mt:GetInvMass()
	if self.mass == 0 then
		return 0
	else
		return self.inv_mass
	end
end

-- Sets gravity scale
function entity_mt:SetGravity( grav )
	self.gravity = grav
end

-- Returns gravity scale
function entity_mt:GetGravity()
	return self.gravity
end

-- Sets the restitution of this entity
function entity_mt:GetRestitution()
	return self.restitution
end

-- Gets the restitution of this entioty
function entity_mt:SetRestitution( val )
	self.restitution = val
end

-- STYLE
-- Sets the shape style
function entity_mt:SetStyle( style )
	self.shape:SetStyle( style )
end

-- Returns the shape style
function entity_mt:GetStyle()
	return self.shape:GetStyle()
end

-- VELOCITY
-- Adds velocity to this entity
function entity_mt:AddVelocity( vector )
	self.velocity = self.velocity + vector
end

-- Sets the velocity of this object
function entity_mt:SetVelocity( vector )
	self.velocity = vector
end

-- Returns the velocity of this entity
function entity_mt:GetVelocity()
	return self.velocity
end

-- BOUNDS
-- Returns the min bounds of this entity
function entity_mt:GetMinBounds()
	return self.origin + self.shape:GetMinBounds()
end

-- Returns the max bounds of this entity
function entity_mt:GetMaxBounds()
	return self.origin + self.shape:GetMaxBounds()
end

-- OVERLAPPING
-- Checks if this entity is overlapping the given entity
function entity_mt:IsOverlapping( entity )
	if (self:GetMaxBounds().x < entity:GetMinBounds().x or self:GetMinBounds().x > entity:GetMaxBounds().x) then return false end
	if (self:GetMaxBounds().y < entity:GetMinBounds().y or self:GetMinBounds().y > entity:GetMaxBounds().y) then return false end

	return true
end

--[[
 ,---.  ,--.
'   .-' |  ,---.  ,--,--. ,---.  ,---.
`.  `-. |  .-.  |' ,-.  || .-. || .-. :
.-'    ||  | |  |\ '-'  || '-' '\   --.
`-----' `--' `--' `--`--'|  |-'  `----'
                         `--'
]]--

local shape_mt = {}
shape_mt.__index = shape_mt

SHAPE_RECT = 1
SHAPE_CIRCLE = 2
SHAPE_OTHER = 3

-- Creates a shape object
function Shape( style )
	local shape = setmetatable( {}, shape_mt )
	shape.style = style
	shape.size = Vector2( 10, 10 )
	shape.rotation = 0
	return shape
end

-- Sets the rotation of the shape
function shape_mt:SetRotation( rot )
	self.rotation = rot
end

-- Sets the size of the shape
function shape_mt:SetSize( size )
	if type(size) == "number" then
		self.size = Vector2( size, size )
	else
		self.size = size
	end
end

-- Returns the size of the object
function shape_mt:GetSize()
	return self.size
end

-- Sets the style of this hsape
function shape_mt:SetStyle( style )
	self.style = style
end

-- Returns the style of shape
function shape_mt:GetStyle()
	return self.style
end

-- Returns the min bounds this object (top left)
function shape_mt:GetMinBounds()
	if self.style == SHAPE_RECT then
		if self.rotation == 0 then
			return -self.size/2
		else
			local s = math.sin( self.rotation )
			local c = math.cos( self.rotation )
			if (s < 0) then s = -s end
			if (c < 0) then c = -c end
			local w = self.size.y * s + self.size.x * c
			local h = self.size.y * c + self.size.x * s
			return Vector2( -w/2, -h/2 )
		end
	elseif self.style == SHAPE_CIRCLE then
		return -self.size/2
	end
end

-- Returns the max bounds of this object (bottom right)
function shape_mt:GetMaxBounds()
	if self.style == SHAPE_RECT then
		if self.rotation == 0 then
			return self.size/2
		else
			local s = math.sin( self.rotation )
			local c = math.cos( self.rotation )
			if (s < 0) then s = -s end
			if (c < 0) then c = -c end
			local w = self.size.y * s + self.size.x * c
			local h = self.size.y * c + self.size.x * s
			return Vector2( w/2, h/2 )
		end
	elseif self.style == SHAPE_CIRCLE then
		return self.size/2
	end
end

--[[
,--.   ,--.             ,--.                 ,---.
 \  `.'  /,---.  ,---.,-'  '-. ,---. ,--.--.'.-.  \
  \     /| .-. :| .--''-.  .-'| .-. ||  .--' .-' .'
   \   / \   --.\ `--.  |  |  ' '-' '|  |   /   '-.
    `-'   `----' `---'  `--'   `---' `--'   '-----'
]]--

local vector2_mt = {}
vector2_mt.__index = vector2_mt

-- Creates a Vector2 Object
function Vector2( x, y )
	return setmetatable( { x = x or 0, y = y or 0 }, vector2_mt )
end

--
-- OPERATOR FUNCTIONS
--
-- Adds 2 vectors
function vector2_mt:__add( vector )
	return Vector2( self.x + vector.x, self.y + vector.y )
end

-- Subtracts vector from vector
function vector2_mt:__sub( vector )
	return Vector2( self.x - vector.x, self.y - vector.y )
end

-- Multiplies a vector by a number or vector
function vector2_mt:__mul( vector )
	if type( vector ) == "number" then
		return Vector2( self.x * vector, self.y * vector )
	else
		return Vector2( self.x * vector.x, self.y * vector.y )
	end
end

-- Divides a vector by a number or vector
function vector2_mt:__div( vector )
	if type( vector ) == "number" then
		return Vector2( self.x / vector, self.y / vector )
	else
		return Vector2( self.x / vector.x, self.y / vector.y)
	end
end

-- Check if 2 vectors are the same
function vector2_mt:__eq( vector )
	return self.x == vector.x and self.y == vector.y
end

-- Returns the negative version of this vector
function vector2_mt:__unm()
	return Vector2( -self.x, -self.y )
end

-- Returns a string of this vector
function vector2_mt:__tostring()
	return "[" .. self.x .. "," .. self.y .. "]"
end

--
-- GENERAL FUNCTIONS
--
-- Adds 2 vectors
function vector2_mt:Add( vector )
	self = self + vector
end

-- Subtracts a vector from this vector
function vector2_mt:Sub( vector )
	self = self - vector
end

-- Multiplies 2 vectors
function vector2_mt:Mul( vector )
	self = self * vector
end

-- Divides 2 vectors
function vector2_mt:Div( vector )
	self = self / vector
end

-- Sets a vector to zero
function vector2_mt:Zero()
	self.x = 0
	self.y = 0
end

-- Returns a copy of itself
function vector2_mt:Copy()
	return Vector2( self.x, self.y )
end

-- Returns the dot product of this and another vector
function vector2_mt:DotProduct( vector )
	return (self.x * vector.x) + (self.y * vector.y)
end

-- Returns the length of a vector
function vector2_mt:Length()
	if self.x == 0 and self.y == 0 then return 0 end
	return ( (self.x * self.x) + (self.y * self.y) ) ^ 0.5
end

-- Returns the length of a vector, squared
function vector2_mt:LengthSquared()
	return ( (self.x * self.x) + (self.y * self.y) )
end

-- Returns the distance between 2 vectors
function vector2_mt:Distance( vector )
	local vec = self - vector
	return vec:Length()
end

-- Lerps this vector to the given vector with percentage t
function vector2_mt:Lerp( vector, t )
	local x = self.x + (vector.x-self.x)*t
	local y = self.y + (vector.y-self.y)*t
	return Vector2( x, y )
end

-- Normalises a vector
function vector2_mt:GetNormalised()
	local length = self:Length()
	if length == 0 then return self end
	return self / length
end

-- Rotates a vector by radians
function vector2_mt:Rotate( ang )
	local x = self.x * math.cos( ang ) - self.y * math.sin( ang )
	local y = self.x * math.sin( ang ) + self.y * math.cos( ang )
	return Vector2( x, y )
end

--[[
,--.   ,--.          ,--.  ,--.       ,-.      ,-.
|   `.'   | ,--,--.,-'  '-.|  ,---.  / .' ,---.'. \
|  |'.'|  |' ,-.  |'-.  .-'|  .-.  ||  | (  .-' |  |
|  |   |  |\ '-'  |  |  |  |  | |  ||  | .-'  `)|  |
`--'   `--' `--`--'  `--'  `--' `--' \ '.`----'.' /
                                      `-'      `-'
]]--

-- Returns the factoral of a number
function math.factoral( num )
	for i=1, num-1 do
		num = num * i
	end
	return num
end

-- Clamps a number between min and max
function math.clamp( num, min, max )
	if ( num < min ) then return min end
	if ( num > max ) then return max end
	return num
end

-- Works out a^2+b^2=c^2
function math.pythag( a, b )
	return ( (a*a) + (b*b) ) ^ 0.5
end

--[[
 ,-----.       ,--.
'  .--./ ,---. |  | ,---. ,--.,--.,--.--.
|  |    | .-. ||  || .-. ||  ||  ||  .--'
'  '--'\' '-' '|  |' '-' ''  ''  '|  |
 `-----' `---' `--' `---'  `----' `--'
--]]

local colour_mt = {}
colour_mt.__index = colour_mt

-- Creates a Vector2 Object
function Colour( r, g, b, a )
	return setmetatable( { r = r or 0, g = g or 0, b = b or 0, a = a or 1 }, colour_mt )
end

-- Returns the RGBA in 0-1 format for _r.color
function colour_mt:GetNormalised()
	return self.r/255, self.g/255, self.b/255, self.a
end

-- Creates a random colour
function colour_mt:Random()
	self.r = math.random( 255 )
	self.g = math.random( 255 )
	self.b = math.random( 255 )
	return self
end
