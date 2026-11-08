local part = script.Parent

part.Touched:Connect(function(hit)
	local character = hit.Parent
	local humanoid = character:FindFirstChildOfClass("Humanoid")

	if humanoid then
		humanoid.Health = 0
	end
end)
