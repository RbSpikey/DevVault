local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local player = Players.LocalPlayer
local config = require(ReplicatedStorage:WaitForChild("Config"))
local jumpsUsed = 0
local character, humanoid

local function bindCharacter(newCharacter)
	character = newCharacter
	humanoid = character:WaitForChild("Humanoid")
	jumpsUsed = 0
	humanoid.StateChanged:Connect(function(_, state)
		if state == Enum.HumanoidStateType.Landed then jumpsUsed = 0 end
	end)
end

if player.Character then bindCharacter(player.Character) end
player.CharacterAdded:Connect(bindCharacter)

UserInputService.JumpRequest:Connect(function()
	if not humanoid or humanoid.Health <= 0 then return end
	if humanoid.FloorMaterial ~= Enum.Material.Air then
		jumpsUsed = 0
	elseif jumpsUsed < config.MaxAirJumps then
		jumpsUsed += 1
		humanoid:ChangeState(Enum.HumanoidStateType.Jumping)
		humanoid.JumpPower = config.JumpPower
	end
end)
