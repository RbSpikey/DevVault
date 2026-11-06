local Players = game:GetService("Players")

local function animateNumber(fromValue, toValue, duration, onUpdate)
	local startedAt = os.clock()
	while true do
		local alpha = math.min((os.clock() - startedAt) / duration, 1)
		local eased = alpha * alpha * (3 - 2 * alpha)
		onUpdate(math.floor(fromValue + (toValue - fromValue) * eased + 0.5))
		if alpha >= 1 then break end
		task.wait()
	end
end

Players.PlayerAdded:Connect(function(player)
	local leaderstats = Instance.new("Folder")
	leaderstats.Name = "leaderstats"
	leaderstats.Parent = player
	local score = Instance.new("IntValue")
	score.Name = "Coins"
	score.Value = 0
	score.Parent = leaderstats

	-- Example reward: animate the score from 0 to 250 over 1.2 seconds.
	task.delay(2, function()
		animateNumber(score.Value, 250, 1.2, function(value) score.Value = value end)
	end)
end)
