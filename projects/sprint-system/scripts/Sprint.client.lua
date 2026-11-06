local Players = game:GetService("Players")
local ContextActionService = game:GetService("ContextActionService")
local TweenService = game:GetService("TweenService")
local RunService = game:GetService("RunService")

local Player = Players.LocalPlayer

-- CONFIGURATION
local Config = {
	WalkSpeed = 16, -- Normal movement speed
	SprintSpeed = 50, -- Movement speed while sprinting
	TransitionTime = 0.2, -- Time taken to transition between speeds

	EnableTrails = true, -- Enables or disables sprint trails and particles
	TrailLifetime = 0.4, -- How long the trails remain visible

	TrailColors = {
		Outer = Color3.fromRGB(0, 100, 255), -- Outer trail starting color
		OuterEnd = Color3.fromRGB(0, 220, 255), -- Outer trail ending color
		Inner = Color3.fromRGB(180, 245, 255), -- Inner trail color
		Particles = Color3.fromRGB(0, 190, 255) -- Particle color
	}
}

local CurrentHumanoid
local SpeedTween
local IsSprinting = false
local SprintTrails = {}
local SprintParticles
local TrailConnection

local function CreateTrail(character)
	if not Config.EnableTrails then
		return
	end

	local root = character:WaitForChild("HumanoidRootPart")

	local attachment0 = Instance.new("Attachment")
	attachment0.Position = Vector3.new(-0.9, -1, 0)
	attachment0.Parent = root

	local attachment1 = Instance.new("Attachment")
	attachment1.Position = Vector3.new(0.9, -1, 0)
	attachment1.Parent = root

	local function MakeTrail(name, width, lifetime, color)
		local trail = Instance.new("Trail")
		trail.Name = name
		trail.Attachment0 = attachment0
		trail.Attachment1 = attachment1
		trail.Color = color
		trail.Lifetime = lifetime
		trail.MinLength = 0.05
		trail.LightEmission = 1
		trail.FaceCamera = true
		trail.WidthScale = NumberSequence.new({
			NumberSequenceKeypoint.new(0, 0.1),
			NumberSequenceKeypoint.new(0.2, width),
			NumberSequenceKeypoint.new(0.7, width * 0.7),
			NumberSequenceKeypoint.new(1, 0)
		})
		trail.Transparency = NumberSequence.new({
			NumberSequenceKeypoint.new(0, 0.05),
			NumberSequenceKeypoint.new(0.7, 0.3),
			NumberSequenceKeypoint.new(1, 1)
		})
		trail.Enabled = false
		trail.Parent = root

		table.insert(SprintTrails, trail)
	end

	MakeTrail(
		"OuterSprintTrail",
		1.5,
		Config.TrailLifetime,
		ColorSequence.new({
			ColorSequenceKeypoint.new(0, Config.TrailColors.Outer),
			ColorSequenceKeypoint.new(1, Config.TrailColors.OuterEnd)
		})
	)

	MakeTrail(
		"InnerSprintTrail",
		0.6,
		Config.TrailLifetime * 0.75,
		ColorSequence.new(Config.TrailColors.Inner)
	)

	SprintParticles = Instance.new("ParticleEmitter")
	SprintParticles.Name = "SprintParticles"
	SprintParticles.Color = ColorSequence.new(Config.TrailColors.Particles)
	SprintParticles.LightEmission = 1
	SprintParticles.Rate = 20
	SprintParticles.Lifetime = NumberRange.new(0.2, 0.4)
	SprintParticles.Speed = NumberRange.new(1, 3)
	SprintParticles.SpreadAngle = Vector2.new(180, 180)
	SprintParticles.EmissionDirection = Enum.NormalId.Bottom
	SprintParticles.Size = NumberSequence.new({
		NumberSequenceKeypoint.new(0, 0.35),
		NumberSequenceKeypoint.new(1, 0)
	})
	SprintParticles.Transparency = NumberSequence.new({
		NumberSequenceKeypoint.new(0, 0.1),
		NumberSequenceKeypoint.new(1, 1)
	})
	SprintParticles.Enabled = false
	SprintParticles.Parent = root

	if TrailConnection then
		TrailConnection:Disconnect()
	end

	TrailConnection = RunService.Heartbeat:Connect(function()
		local moving = CurrentHumanoid
			and CurrentHumanoid.MoveDirection.Magnitude > 0.05

		local active = IsSprinting and moving

		for _, trail in ipairs(SprintTrails) do
			trail.Enabled = active
		end

		if SprintParticles then
			SprintParticles.Enabled = active
		end
	end)
end

local function SetSprint(enabled)
	if not CurrentHumanoid or CurrentHumanoid.Health <= 0 then
		return
	end

	IsSprinting = enabled

	if SpeedTween then
		SpeedTween:Cancel()
	end

	local targetSpeed = enabled and Config.SprintSpeed or Config.WalkSpeed

	SpeedTween = TweenService:Create(
		CurrentHumanoid,
		TweenInfo.new(
			Config.TransitionTime,
			Enum.EasingStyle.Quad,
			Enum.EasingDirection.Out
		),
		{WalkSpeed = targetSpeed}
	)

	SpeedTween:Play()
end

local function HandleSprint(_, inputState)
	if inputState == Enum.UserInputState.Begin then
		SetSprint(true)
	elseif inputState == Enum.UserInputState.End
		or inputState == Enum.UserInputState.Cancel then
		SetSprint(false)
	end

	return Enum.ContextActionResult.Sink
end

local function SetupCharacter(character)
	if TrailConnection then
		TrailConnection:Disconnect()
		TrailConnection = nil
	end

	CurrentHumanoid = character:WaitForChild("Humanoid")
	CurrentHumanoid.WalkSpeed = Config.WalkSpeed

	IsSprinting = false
	table.clear(SprintTrails)
	SprintParticles = nil

	CreateTrail(character)
end

Player.CharacterAdded:Connect(SetupCharacter)

if Player.Character then
	SetupCharacter(Player.Character)
end

ContextActionService:BindAction(
	"Sprint",
	HandleSprint,
	true,
	Enum.KeyCode.LeftShift,
	Enum.KeyCode.ButtonL3
)

ContextActionService:SetTitle("Sprint", "SPRINT")
ContextActionService:SetPosition("Sprint", UDim2.new(0.8, 0, 0.65, 0))