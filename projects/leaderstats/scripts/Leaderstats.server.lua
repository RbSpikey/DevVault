local Players = game:GetService("Players")

local DEFAULT_STATS = {
	Coins = 100,
	Wins = 0,
	Level = 1,
}

local function createLeaderstats(player)
	local leaderstats = Instance.new("Folder")
	leaderstats.Name = "leaderstats"
	leaderstats.Parent = player

	for statName, startingValue in pairs(DEFAULT_STATS) do
		local stat = Instance.new("IntValue")
		stat.Name = statName
		stat.Value = startingValue
		stat.Parent = leaderstats
	end
end

Players.PlayerAdded:Connect(createLeaderstats)
