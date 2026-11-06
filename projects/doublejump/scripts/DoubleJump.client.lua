local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local TweenService = game:GetService("TweenService")
local RunService = game:GetService("RunService")

local Config = {
	-- Extra jumps allowed while airborne (1 = double jump, 2 = triple jump, etc.)
	AirJumps = 1,

	-- Upward velocity applied on each air jump (default Roblox ground jump is about 50)
	JumpPower = 50,

	-- Minimum seconds between air jumps
	Cooldown = 0.15,

	-- Turns the light up effect on or off
	GlowEnabled = true,

	-- Colors cycled through per air jump (jump 1 uses the first, jump 2 the second, then it wraps)
	GlowColors = {
		Color3.fromRGB(0, 200, 255),
		Color3.fromRGB(255, 80, 200),
		Color3.fromRGB(255, 220, 60),
	},

	-- Glow transparency at the moment of the jump (0 = solid, 1 = invisible)
	GlowStartTransparency = 0.2,

	-- Seconds for the glow to fade out
	GlowDuration = 0.5,
}

local player = Players.LocalPlayer

local resetStates = {
	[Enum.HumanoidStateType.Landed] = true,
	[Enum.HumanoidStateType.Running] = true,
	[Enum.HumanoidStateType.RunningNoPhysics] = true,
	[Enum.HumanoidStateType.Climbing] = true,
	[Enum.HumanoidStateType.Swimming] = true,
	[Enum.HumanoidStateType.Seated] = true,
}

local function setup(character)
	if character:GetAttribute("DoubleJumpSetup") then
		return
	end
	character:SetAttribute("DoubleJumpSetup", true)

	local humanoid = character:WaitForChild("Humanoid")
	local root = character:WaitForChild("HumanoidRootPart")

	local jumpsUsed = 0
	local lastJump = 0
	local glowTween

	local highlight = Instance.new("Highlight")
	highlight.Adornee = character
	highlight.FillTransparency = 1
	highlight.OutlineTransparency = 1
	highlight.DepthMode = Enum.HighlightDepthMode.Occluded
	highlight.Parent = character

	local function glow(index)
		if not Config.GlowEnabled or #Config.GlowColors == 0 then
			return
		end

		local color = Config.GlowColors[(index - 1) % #Config.GlowColors + 1]

		highlight.FillColor = color
		highlight.OutlineColor = color
		highlight.FillTransparency = Config.GlowStartTransparency
		highlight.OutlineTransparency = 0

		if glowTween then
			glowTween:Cancel()
		end

		glowTween = TweenService:Create(
			highlight,
			TweenInfo.new(Config.GlowDuration, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
			{ FillTransparency = 1, OutlineTransparency = 1 }
		)

		glowTween:Play()
	end

	local function launch()
		local velocity = root.AssemblyLinearVelocity
		root.AssemblyLinearVelocity = Vector3.new(velocity.X, Config.JumpPower, velocity.Z)
	end

	humanoid.StateChanged:Connect(function(_, newState)
		if resetStates[newState] then
			jumpsUsed = 0
		elseif newState == Enum.HumanoidStateType.Jumping then
			lastJump = os.clock()
		end
	end)

	local jumpConnection = UserInputService.JumpRequest:Connect(function()
		if humanoid.Health <= 0 then
			return
		end

		local state = humanoid:GetState()

		if state ~= Enum.HumanoidStateType.Freefall and state ~= Enum.HumanoidStateType.Jumping then
			return
		end

		if jumpsUsed >= Config.AirJumps then
			return
		end

		if os.clock() - lastJump < Config.Cooldown then
			return
		end

		jumpsUsed += 1
		lastJump = os.clock()

		humanoid:ChangeState(Enum.HumanoidStateType.Jumping)
		launch()
		RunService.Heartbeat:Once(launch)

		glow(jumpsUsed)
	end)

	character.Destroying:Connect(function()
		jumpConnection:Disconnect()
	end)
end

if player.Character then
	task.spawn(setup, player.Character)
end

player.CharacterAdded:Connect(setup)
