local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local TweenService = game:GetService("TweenService")

local player = Players.LocalPlayer
local WALK_SPEED, SPRINT_SPEED = 16, 25
local humanoid
local activeTween

local function setSpeed(speed)
	if not humanoid then return end
	if activeTween then activeTween:Cancel() end
	activeTween = TweenService:Create(humanoid, TweenInfo.new(0.18), { WalkSpeed = speed })
	activeTween:Play()
end

local function bindCharacter(character)
	humanoid = character:WaitForChild("Humanoid")
	humanoid.WalkSpeed = WALK_SPEED
end

if player.Character then bindCharacter(player.Character) end
player.CharacterAdded:Connect(bindCharacter)
UserInputService.InputBegan:Connect(function(input, processed)
	if not processed and input.KeyCode == Enum.KeyCode.LeftShift then setSpeed(SPRINT_SPEED) end
end)
UserInputService.InputEnded:Connect(function(input)
	if input.KeyCode == Enum.KeyCode.LeftShift then setSpeed(WALK_SPEED) end
end)
