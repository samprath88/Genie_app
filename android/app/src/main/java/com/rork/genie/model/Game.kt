package com.rork.genie.model

import java.util.Locale

/** One of the five learning/assist modes available for every game. */
data class GameMode(
    val id: String,
    val name: String,
    val description: String,
    val imageUrl: String,
    val free: Boolean,
)

/** A board game in the Genie catalogue/marketplace. */
data class Game(
    val id: String,
    val title: String,
    val tagline: String,
    val description: String,
    val coverUrl: String,
    val heroUrl: String,
    val price: Double,
    val category: String,
    val rating: Double,
    val reviews: Int,
    val modes: List<GameMode>,
) {
    val priceLabel: String
        get() = String.format(Locale.UK, "£%.2f", price)

    /** Five-character star string, e.g. "★★★★☆". */
    val starLabel: String
        get() {
            val full = rating.toInt().coerceIn(0, 5)
            return "★".repeat(full) + "☆".repeat(5 - full)
        }
}
