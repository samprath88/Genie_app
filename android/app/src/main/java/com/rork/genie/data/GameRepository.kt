package com.rork.genie.data

import com.rork.genie.model.Game
import com.rork.genie.model.GameMode

/** Hardcoded MVP catalogue of six games with real box art and board photography. */
object GameRepository {

    private const val ASSETS = "https://r2-pub.rork.com/attachments"
    private const val HOW_TO_PLAY_IMG = "$ASSETS/ynuhpu6f5wi19ubvt55gd.png"

    // High-resolution, correctly-framed tabletop photography generated to replace the
    // low-resolution, oddly cropped source photos that caused blurry/draft-looking cards.
    private const val CATAN_PHOTO = "https://r2-pub.rork.com/projects/08w9w5abl74sy9v60zpuf/assets/576bf353-dee4-40ad-b228-1e93d307db37.png"
    private const val PANDEMIC_PHOTO = "https://r2-pub.rork.com/projects/08w9w5abl74sy9v60zpuf/assets/832433ba-7515-46e8-add9-7778335a9315.png"
    private const val TICKET_TO_RIDE_PHOTO = "https://r2-pub.rork.com/projects/08w9w5abl74sy9v60zpuf/assets/1400f231-2e62-44ed-a2fe-b9743429ed46.png"
    private const val CARCASSONNE_PHOTO = "https://r2-pub.rork.com/projects/08w9w5abl74sy9v60zpuf/assets/13d27ac6-0d2b-49db-ae81-0327635eefa1.png"
    private const val AZUL_PHOTO = "https://r2-pub.rork.com/projects/08w9w5abl74sy9v60zpuf/assets/6bed2043-850a-4409-81ba-12f955da90cd.png"
    // Sharpest of the original Wingspan photos (695x368) — reused everywhere for that game
    // since the regenerated replacement timed out and the other Wingspan crops are smaller still.
    private const val WINGSPAN_PHOTO = "$ASSETS/jnwpy4jmcvo5c6wg51jhe.jpg"

    val categories: List<String> = listOf(
        "All", "Strategy", "Cooperative", "Party", "Worker Placement", "Abstract"
    )

    /** Game shown on the Catalogue "Continue Playing" band. */
    const val CONTINUE_PLAYING_ID = "pandemic"
    const val CONTINUE_TURN = 3
    const val CONTINUE_TOTAL_TURNS = 5

    /** Games the user owns before making any purchase (demo state). */
    val defaultOwned: Set<String> = setOf("catan")

    private fun modes(
        aboutImg: String,
        setupImg: String,
        firstRoundImg: String,
        scoringImg: String,
    ): List<GameMode> = listOf(
        GameMode("about", "What's It All About", "The story and spirit of the game", aboutImg, free = true),
        GameMode("how_to_play", "How to Play", "Complete rules explained", HOW_TO_PLAY_IMG, free = false),
        GameMode("setup", "Setup Guide", "Prepare your game in minutes", setupImg, free = false),
        GameMode("first_round", "Guided First Round", "Your first turn, step by step", firstRoundImg, free = false),
        GameMode("scoring", "Scoring Assist", "Calculate winners instantly", scoringImg, free = false),
    )

    val games: List<Game> = listOf(
        Game(
            id = "catan",
            title = "Catan",
            tagline = "Trade, build and settle the island of Catan",
            description = "Build your empire across a hexagonal frontier",
            coverUrl = "$ASSETS/7en7uhsnw1hiwpm0bak5l.jpg",
            heroUrl = CATAN_PHOTO,
            price = 11.99,
            category = "Strategy",
            rating = 4.8,
            reviews = 214,
            modes = modes(
                aboutImg = CATAN_PHOTO,
                setupImg = CATAN_PHOTO,
                firstRoundImg = CATAN_PHOTO,
                scoringImg = CATAN_PHOTO,
            ),
        ),
        Game(
            id = "pandemic",
            title = "Pandemic",
            tagline = "Cure four diseases before they spread across the world",
            description = "Work together to save humanity",
            coverUrl = "$ASSETS/lfieds8yvsq32zxye2nyw.jpg",
            heroUrl = PANDEMIC_PHOTO,
            price = 8.99,
            category = "Cooperative",
            rating = 4.7,
            reviews = 156,
            modes = modes(
                aboutImg = PANDEMIC_PHOTO,
                setupImg = PANDEMIC_PHOTO,
                firstRoundImg = PANDEMIC_PHOTO,
                scoringImg = PANDEMIC_PHOTO,
            ),
        ),
        Game(
            id = "ticket_to_ride",
            title = "Ticket to Ride",
            tagline = "Connect cities across Europe by rail",
            description = "Claim routes and complete your tickets",
            coverUrl = "$ASSETS/ds8n62x2babtcx0masrhg.jpg",
            heroUrl = TICKET_TO_RIDE_PHOTO,
            price = 12.99,
            category = "Strategy",
            rating = 4.5,
            reviews = 128,
            modes = modes(
                aboutImg = TICKET_TO_RIDE_PHOTO,
                setupImg = TICKET_TO_RIDE_PHOTO,
                firstRoundImg = TICKET_TO_RIDE_PHOTO,
                scoringImg = TICKET_TO_RIDE_PHOTO,
            ),
        ),
        Game(
            id = "carcassonne",
            title = "Carcassonne",
            tagline = "Lay tiles to build a medieval landscape",
            description = "Grow cities, roads and cloisters tile by tile",
            coverUrl = "$ASSETS/stisw6ndvt4qygvpa335q.webp",
            heroUrl = CARCASSONNE_PHOTO,
            price = 8.50,
            category = "Strategy",
            rating = 4.3,
            reviews = 95,
            modes = modes(
                aboutImg = CARCASSONNE_PHOTO,
                setupImg = CARCASSONNE_PHOTO,
                firstRoundImg = CARCASSONNE_PHOTO,
                scoringImg = CARCASSONNE_PHOTO,
            ),
        ),
        Game(
            id = "wingspan",
            title = "Wingspan",
            tagline = "Attract a dazzling array of birds to your preserve",
            description = "Grow the finest wildlife preserve",
            coverUrl = "$ASSETS/r9ccfndpvgff591l5t8mu.webp",
            heroUrl = WINGSPAN_PHOTO,
            price = 13.99,
            category = "Strategy",
            rating = 4.6,
            reviews = 183,
            modes = modes(
                aboutImg = WINGSPAN_PHOTO,
                setupImg = WINGSPAN_PHOTO,
                firstRoundImg = WINGSPAN_PHOTO,
                scoringImg = WINGSPAN_PHOTO,
            ),
        ),
        Game(
            id = "azul",
            title = "Azul",
            tagline = "Craft the most beautiful mosaic wall in the palace",
            description = "Draft tiles to decorate the palace walls",
            coverUrl = "$ASSETS/tb9wvcvlbh6acybmcols1.webp",
            heroUrl = AZUL_PHOTO,
            price = 9.99,
            category = "Abstract",
            rating = 4.4,
            reviews = 141,
            modes = modes(
                aboutImg = AZUL_PHOTO,
                setupImg = AZUL_PHOTO,
                firstRoundImg = AZUL_PHOTO,
                scoringImg = AZUL_PHOTO,
            ),
        ),
    )

    fun gameById(id: String?): Game? = games.firstOrNull { it.id == id }
}
