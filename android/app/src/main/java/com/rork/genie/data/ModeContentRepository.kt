package com.rork.genie.data

import com.rork.genie.model.AboutContent
import com.rork.genie.model.FirstRoundStep
import com.rork.genie.model.GameContent
import com.rork.genie.model.RuleSection
import com.rork.genie.model.ScoringPlayer
import com.rork.genie.model.SetupStep

/** Hardcoded MVP content for Screens 6–10 (Phase 4 swaps this for backend endpoints). */
object ModeContentRepository {

    fun contentFor(gameId: String?): GameContent =
        contents.firstOrNull { it.gameId == gameId } ?: contents.first()

    private val contents: List<GameContent> = listOf(
        GameContent(
            gameId = "pandemic",
            about = AboutContent(
                headline = "Why Pandemic owns your table tonight",
                narrative = listOf(
                    "The world is sick. Four deadly diseases have broken out, and they're spreading fast. Your team of experts — a medic, scientist, dispatcher and researcher — must work together to stop them.",
                    "Every turn you have four actions. Travel between cities, treat infections, discover cures, prevent outbreaks. But the diseases don't wait — each turn, new infections spread.",
                    "Can you discover all four cures before the outbreaks cascade beyond control? Play carefully. Play together. Because this game is won as a team — or not at all.",
                ),
            ),
            howToPlay = listOf(
                RuleSection(
                    id = "goal",
                    name = "Your Goal",
                    content = "Discover cures for all four diseases before any of the three doom clocks run out. You win — or lose — together, as one team.\n\nYou lose if:\n• 8 outbreaks occur (worldwide panic)\n• Disease cubes of any colour run out\n• The player deck runs out (time's up)",
                ),
                RuleSection(
                    id = "mechanics",
                    name = "Core Mechanics",
                    content = "On your turn, you have 4 actions. Choose from:\n• Move to a connected city (by road, direct flight or shuttle)\n• Treat an infection (remove 1 disease cube)\n• Share knowledge (give or take a city card with another player)\n• Discover a cure (turn in 5 city cards of the same colour at a research station)\n• Build a research station (spend that city's card)\n\nThen draw 2 player cards and infect new cities.",
                ),
                RuleSection(
                    id = "winning",
                    name = "How to Win",
                    content = "Once you discover all four cures, humanity is saved and your team wins instantly.\n\nAct quickly — new infections spread every single turn, and one outbreak can trigger a chain reaction. The clock is always ticking.",
                ),
            ),
            setupSteps = listOf(
                SetupStep(
                    title = "Board Placement",
                    instruction = "Set the board in the centre where everyone can reach it. Put the outbreak marker on 0 and the infection-rate marker on the leftmost \"2\". Place a research station in Atlanta — your team starts there.",
                ),
                SetupStep(
                    title = "Card Distribution",
                    instruction = "Shuffle the infection deck and infect 9 cities: three with 3 cubes, three with 2 cubes, three with 1 cube. Deal each player a role card and starting hand (2–4 cards depending on player count).",
                ),
                SetupStep(
                    title = "Pawn Placement",
                    instruction = "Everyone places their pawn in Atlanta. Shuffle the epidemic cards into the player deck in equal stacks — more epidemics means a harder game. Youngest player goes first.",
                ),
            ),
            firstRound = listOf(
                FirstRoundStep(
                    title = "Move to a city",
                    instruction = "Choose a city connected to Atlanta and move there. You have four actions this turn — moving costs one. Pick a city with disease cubes on it.",
                ),
                FirstRoundStep(
                    title = "Treat the infection",
                    instruction = "Remove one disease cube from your city (the Medic removes them all at once). This stops the disease from spiralling into an outbreak.",
                ),
                FirstRoundStep(
                    title = "Draw two player cards",
                    instruction = "You drew Chicago and a red city card. No Epidemic this time — hold that red card; it moves you closer to a cure.",
                ),
                FirstRoundStep(
                    title = "Infect new cities",
                    instruction = "Flip 2 infection cards and add a cube to each named city. This is how the diseases fight back — every turn, without fail.",
                ),
                FirstRoundStep(
                    title = "Pass the torch",
                    instruction = "Your turn is over. The next player now takes 4 actions. Talk it out as a team — coordination is how you win Pandemic.",
                ),
            ),
            players = listOf(
                ScoringPlayer("You (Medic)", "Medic", 7),
                ScoringPlayer("Priya (Scientist)", "Scientist", 5),
                ScoringPlayer("Marco (Dispatcher)", "Dispatcher", 4),
            ),
            cooperative = true,
            winnerNote = "Congratulations on curing all four diseases together!",
        ),
        GameContent(
            gameId = "catan",
            about = AboutContent(
                headline = "Why Catan never leaves the shelf for long",
                narrative = listOf(
                    "An uncharted island. Five resources. And a race to settle it before your rivals do. Catan turns wood, brick, wheat, sheep and ore into roads, settlements and cities.",
                    "Every dice roll pays somebody. Trade shrewdly, block boldly and expand faster than the players across the table — because nobody wins Catan alone; they win it through everyone else.",
                    "First to 10 victory points takes the island. The question is: will your neighbours let you?",
                ),
            ),
            howToPlay = listOf(
                RuleSection(
                    id = "goal",
                    name = "Your Goal",
                    content = "Be the first player to reach 10 victory points.\n\nPoints come from:\n• Settlements (1 point each)\n• Cities (2 points each)\n• Longest Road and Largest Army (2 points each)\n• Victory point development cards",
                ),
                RuleSection(
                    id = "mechanics",
                    name = "Core Mechanics",
                    content = "On your turn:\n• Roll two dice — every hex with that number pays resources to adjacent settlements\n• Trade resources with other players or the bank (4:1, or better with harbours)\n• Build roads (wood + brick), settlements (wood, brick, wheat, sheep) or cities (3 ore + 2 wheat)\n• Buy development cards (ore, wheat, sheep)\n\nRolling a 7 moves the robber — steal from a rival and block their hex.",
                ),
                RuleSection(
                    id = "winning",
                    name = "How to Win",
                    content = "The moment you hold 10 points on your own turn, declare victory.\n\nWatch the two bonus titles: Longest Road and Largest Army can swing 4 points between players in a single move. Guard yours, chase theirs.",
                ),
            ),
            setupSteps = listOf(
                SetupStep(
                    title = "Build the island",
                    instruction = "Assemble the hexes into the island (random or the beginner layout), then place the number tokens. Keep the desert token-free — that's where the robber starts.",
                ),
                SetupStep(
                    title = "Place starting pieces",
                    instruction = "In turn order, each player places one settlement and one adjoining road, then repeats in reverse order. Your second settlement collects its starting resources immediately.",
                ),
                SetupStep(
                    title = "Sort the supply",
                    instruction = "Split the resource cards into five face-up piles beside the board, shuffle the development deck, and give the two bonus title cards a spot everyone can see.",
                ),
            ),
            firstRound = listOf(
                FirstRoundStep(
                    title = "Roll for the island",
                    instruction = "Roll both dice. Every hex with that number produces — everyone with a settlement touching it takes the matching resource. Even on your turn, others collect.",
                ),
                FirstRoundStep(
                    title = "Make your first trade",
                    instruction = "Check your hand. Missing brick for a road? Offer wheat for it — out loud, to the whole table. Any player can accept. That's the heart of Catan.",
                ),
                FirstRoundStep(
                    title = "Build a road",
                    instruction = "Spend one wood and one brick to place a road extending from your settlement. You're laying the path towards your next settlement spot.",
                ),
                FirstRoundStep(
                    title = "Plan the next settlement",
                    instruction = "Settlements must sit two intersections apart. Spot a junction touching three different numbers — that's where your road should be heading.",
                ),
            ),
            players = listOf(
                ScoringPlayer("You", "Red", 7),
                ScoringPlayer("Priya", "Blue", 5),
                ScoringPlayer("Marco", "Orange", 4),
            ),
            cooperative = false,
            winnerNote = "Closest scores were double-checked by Genie — settlements, cities and bonus titles all counted.",
        ),
        GameContent(
            gameId = "ticket_to_ride",
            about = AboutContent(
                headline = "Why Ticket to Ride is the perfect gateway",
                narrative = listOf(
                    "Europe, 1901. A continent stitched together by rail — and you hold the tickets. Collect train cards, claim routes, and connect distant cities before your rivals cut you off.",
                    "Every ticket is a secret promise: complete it for points, fail and it counts against you. The tension builds one carriage at a time.",
                    "Simple to learn, agonising to master. That's why it never leaves the table.",
                ),
            ),
            howToPlay = listOf(
                RuleSection(
                    id = "goal",
                    name = "Your Goal",
                    content = "Score the most points by claiming railway routes and completing your secret destination tickets.\n\nLonger routes score dramatically more: a 6-carriage route is worth 15 points, a 1-carriage route just 1.",
                ),
                RuleSection(
                    id = "mechanics",
                    name = "Core Mechanics",
                    content = "On your turn, do exactly one of:\n• Draw 2 train cards (from the face-up row or the deck)\n• Claim a route — spend matching coloured cards and place your trains\n• Draw 3 new destination tickets (keep at least 1)\n\nGrey routes accept any single colour; ferries need locomotives; tunnels can cost extra.",
                ),
                RuleSection(
                    id = "winning",
                    name = "How to Win",
                    content = "When any player drops to 2 trains or fewer, everyone gets one final turn.\n\nThen add route points, completed tickets and the 10-point European Express bonus for the longest continuous path — and subtract failed tickets.",
                ),
            ),
            setupSteps = listOf(
                SetupStep(
                    title = "Lay out the map",
                    instruction = "Unfold the Europe map. Each player takes 45 trains and their matching scoring marker, placed on the start of the score track.",
                ),
                SetupStep(
                    title = "Deal the cards",
                    instruction = "Deal 4 train cards to each player, then reveal 5 face-up beside the deck. If 3 locomotives ever show, wipe and redraw the row.",
                ),
                SetupStep(
                    title = "Choose your tickets",
                    instruction = "Deal each player 1 long-route and 3 regular destination tickets. Keep at least 2. These are secret — they're your master plan.",
                ),
            ),
            firstRound = listOf(
                FirstRoundStep(
                    title = "Read your tickets",
                    instruction = "Look at your destination tickets and trace the shortest paths between the cities. Those corridors are where you'll fight.",
                ),
                FirstRoundStep(
                    title = "Draw train cards",
                    instruction = "Take two cards — grab from the face-up row if it shows the colours your routes need. A face-up locomotive costs your whole turn.",
                ),
                FirstRoundStep(
                    title = "Claim your first route",
                    instruction = "Once you hold enough matching cards, spend them and place your trains. Score it immediately on the track.",
                ),
                FirstRoundStep(
                    title = "Watch the bottlenecks",
                    instruction = "Single-track city pairs can be claimed only once. If a rival is collecting the same colour, take the route before they do.",
                ),
            ),
            players = listOf(
                ScoringPlayer("You", "Blue trains", 98),
                ScoringPlayer("Priya", "Red trains", 87),
                ScoringPlayer("Marco", "Green trains", 74),
            ),
            cooperative = false,
            winnerNote = "Genie added route points, tickets and the longest-path bonus for every player.",
        ),
        GameContent(
            gameId = "carcassonne",
            about = AboutContent(
                headline = "Why Carcassonne builds itself a fanbase",
                narrative = listOf(
                    "One tile at a time, a medieval landscape grows across your table — cities, roads, cloisters and fields, all drawn from a single bag.",
                    "Place your meeples wisely: a knight in a city, a robber on a road, a monk in a cloister. Every placement is a small bet on how the map will grow.",
                    "No two games ever build the same world. That's the quiet magic of Carcassonne.",
                ),
            ),
            howToPlay = listOf(
                RuleSection(
                    id = "goal",
                    name = "Your Goal",
                    content = "Score the most points by completing cities, roads and cloisters — and by controlling the biggest farms when the last tile is placed.",
                ),
                RuleSection(
                    id = "mechanics",
                    name = "Core Mechanics",
                    content = "On your turn:\n• Draw one tile and add it to the map (edges must match: city to city, road to road)\n• Optionally place a meeple on a feature of that tile — if no one else already claims it\n• Score any feature the tile just completed, and take those meeples back\n\nYou only have 7 meeples. Spend them carefully.",
                ),
                RuleSection(
                    id = "winning",
                    name = "How to Win",
                    content = "Completed cities score 2 points per tile (plus pennants), roads 1 per tile, cloisters up to 9.\n\nWhen the tiles run out, incomplete features score reduced points and farmers score 3 per completed city they supply. Highest total wins.",
                ),
            ),
            setupSteps = listOf(
                SetupStep(
                    title = "Place the start tile",
                    instruction = "Put the single start tile (darker back) in the middle of the table. Shuffle the rest into face-down stacks everyone can reach.",
                ),
                SetupStep(
                    title = "Hand out meeples",
                    instruction = "Each player takes the 8 meeples of one colour: 7 for playing, 1 laid on the scoreboard's zero space as the score marker.",
                ),
                SetupStep(
                    title = "Set the scoreboard",
                    instruction = "Place the scoreboard where everyone can see it. Choose a start player — the youngest builder begins.",
                ),
            ),
            firstRound = listOf(
                FirstRoundStep(
                    title = "Draw and study your tile",
                    instruction = "Draw one tile and show it to the table. Look for every legal spot — edges must match the landscape already built.",
                ),
                FirstRoundStep(
                    title = "Place it well",
                    instruction = "Add the tile where it helps you most — extend a city you could claim, or grow a road towards open space.",
                ),
                FirstRoundStep(
                    title = "Commit a meeple",
                    instruction = "Place one meeple on the new tile's city, road or cloister. Remember: features already claimed by another player are off-limits.",
                ),
                FirstRoundStep(
                    title = "Score and recover",
                    instruction = "Did your placement complete a feature? Score it now, move your marker, and take the meeple back for future turns.",
                ),
            ),
            players = listOf(
                ScoringPlayer("You", "Yellow", 62),
                ScoringPlayer("Priya", "Green", 55),
                ScoringPlayer("Marco", "Black", 47),
            ),
            cooperative = false,
            winnerNote = "Genie tallied completed features, cloisters and farm control for the final scores.",
        ),
        GameContent(
            gameId = "wingspan",
            about = AboutContent(
                headline = "Why Wingspan makes engines feel alive",
                narrative = listOf(
                    "You are a bird enthusiast with three habitats to fill — forest, grassland and wetland — and 170 gorgeously illustrated birds waiting to move in.",
                    "Each bird you play makes its habitat stronger: more food, more eggs, more cards. Turn by turn, your preserve becomes a living engine.",
                    "Four rounds. Shifting goals. And at the end, the richest ecosystem wins.",
                ),
            ),
            howToPlay = listOf(
                RuleSection(
                    id = "goal",
                    name = "Your Goal",
                    content = "Build the most valuable wildlife preserve over 4 rounds.\n\nPoints come from bird cards, eggs, cached food, tucked cards, bonus cards and end-of-round goals.",
                ),
                RuleSection(
                    id = "mechanics",
                    name = "Core Mechanics",
                    content = "On your turn, take one action:\n• Play a bird — pay its food cost and an egg cost into a habitat\n• Gain food from the birdfeeder (forest)\n• Lay eggs on your birds (grassland)\n• Draw bird cards (wetland)\n\nEach action triggers the row's brown bird powers from right to left — that's your engine.",
                ),
                RuleSection(
                    id = "winning",
                    name = "How to Win",
                    content = "After round 4, add everything: printed bird points, eggs (1 each), cached food, tucked cards, bonus cards and round goals.\n\nStrong engines win late — but the round goals reward players who adapt each round.",
                ),
            ),
            setupSteps = listOf(
                SetupStep(
                    title = "Set the supply",
                    instruction = "Fill the birdfeeder dice tower with the 5 food dice. Shuffle the bird deck and reveal 3 cards to the tray. Place egg tokens within reach.",
                ),
                SetupStep(
                    title = "Deal your start",
                    instruction = "Each player takes a mat, 8 action cubes, 5 bird cards, 2 bonus cards and 5 food. Keep up to 5 birds/food combined — one food discarded per bird kept, then keep 1 bonus card.",
                ),
                SetupStep(
                    title = "Pick the round goals",
                    instruction = "Place a random goal tile on each of the four slots of the goal board. These change how every round is fought.",
                ),
            ),
            firstRound = listOf(
                FirstRoundStep(
                    title = "Gain food first",
                    instruction = "Place a cube on the forest row and take food from the birdfeeder. Match what your best opening bird needs to be played.",
                ),
                FirstRoundStep(
                    title = "Play your first bird",
                    instruction = "Pay the food cost and slide the bird into its habitat. Its power will now trigger every time you use that row.",
                ),
                FirstRoundStep(
                    title = "Lay your first eggs",
                    instruction = "Use the grassland action to lay eggs. Eggs are quiet points — and the currency for playing birds into later columns.",
                ),
                FirstRoundStep(
                    title = "Check the round goal",
                    instruction = "Round 1's goal tile is scored soon. If it counts birds in forests, aim your next placements there.",
                ),
            ),
            players = listOf(
                ScoringPlayer("You", "Blue", 81),
                ScoringPlayer("Priya", "Purple", 76),
                ScoringPlayer("Marco", "Yellow", 68),
            ),
            cooperative = false,
            winnerNote = "Genie summed birds, eggs, tucked cards, bonuses and all four round goals.",
        ),
        GameContent(
            gameId = "azul",
            about = AboutContent(
                headline = "Why Azul is beauty with teeth",
                narrative = listOf(
                    "The King of Portugal wants his palace walls tiled in dazzling azulejos — and you are the artisan to do it.",
                    "Draft tiles from the factory displays, line them up, and complete rows to tile your wall. But every tile you can't place shatters on the floor and costs you points.",
                    "It looks serene. It plays like a knife fight over ceramics.",
                ),
            ),
            howToPlay = listOf(
                RuleSection(
                    id = "goal",
                    name = "Your Goal",
                    content = "Score the most points by tiling your wall in smart patterns.\n\nAdjacent tiles chain into big scores; completed rows, columns and colour sets earn end-game bonuses.",
                ),
                RuleSection(
                    id = "mechanics",
                    name = "Core Mechanics",
                    content = "On your turn:\n• Take ALL tiles of one colour from a factory display (the rest slide to the centre)\n• Or take all tiles of one colour from the centre (first player to do so takes the -1 token)\n• Slot them into one pattern line, right to left\n\nWhen a pattern line fills, one tile moves to your wall at round end — extras fall to the floor line for penalties.",
                ),
                RuleSection(
                    id = "winning",
                    name = "How to Win",
                    content = "Each wall tile scores its connected row and column of neighbours.\n\nThe game ends when someone completes a horizontal row. Add bonuses: 2 per full row, 7 per full column, 10 per colour completed. Highest score tiles the palace.",
                ),
            ),
            setupSteps = listOf(
                SetupStep(
                    title = "Ring the factories",
                    instruction = "Place factory displays in a circle: 5 for two players, 7 for three, 9 for four. Fill each with 4 random tiles from the bag.",
                ),
                SetupStep(
                    title = "Boards and markers",
                    instruction = "Each player takes a player board (pattern side up) and puts their score marker on 0. Keep the floor line clear — that's where mistakes land.",
                ),
                SetupStep(
                    title = "Start token",
                    instruction = "Place the first-player token in the centre of the factory circle. Whoever last visited Portugal begins.",
                ),
            ),
            firstRound = listOf(
                FirstRoundStep(
                    title = "Draft a colour",
                    instruction = "Pick a factory and take every tile of one colour from it. The leftovers slide into the centre pool for everyone.",
                ),
                FirstRoundStep(
                    title = "Fill a pattern line",
                    instruction = "Slot your tiles into one row, right to left. A row can only hold one colour — and only a colour not yet on that wall row.",
                ),
                FirstRoundStep(
                    title = "Mind the floor",
                    instruction = "Took more tiles than the line holds? The extras drop to your floor line: -1, -1, -2... Draft only what you can place.",
                ),
                FirstRoundStep(
                    title = "Score the wall",
                    instruction = "When all tiles are drafted, each full pattern line sends a tile to the wall. Count its connected row and column — that's your score.",
                ),
            ),
            players = listOf(
                ScoringPlayer("You", "Artisan 1", 74),
                ScoringPlayer("Priya", "Artisan 2", 69),
                ScoringPlayer("Marco", "Artisan 3", 58),
            ),
            cooperative = false,
            winnerNote = "Genie checked rows, columns and colour bonuses before calling it.",
        ),
    )
}
