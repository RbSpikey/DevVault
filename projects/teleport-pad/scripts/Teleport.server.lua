local Players = game:GetService("Players")
local pad = script.Parent
local destinationRef = pad:WaitForChild("Destination")
local cooldown = {}

pad.Touched:Connect(function(hit)
	local character = hit:FindFirstAncestorOfClass("Model")
	local player = character and Players:GetPlayerFromCharacter(character)
	local root = character and character:FindFirstChild("HumanoidRootPart")
	local destination = destinationRef.Value
	if not player or not root or not destination or cooldown[player] then return end

	cooldown[player] = true
	root.CFrame = destination.CFrame + Vector3.new(0, 3, 0)
	task.delay(1, function() cooldown[player] = nil end)
end)
