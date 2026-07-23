package com.rork.genie.model

/** Narrative intro shown on the What's It All About screen. */
data class AboutContent(
    val headline: String,
    val narrative: List<String>,
)

/** One rules section on the How to Play screen (Your Goal / Core Mechanics / How to Win). */
data class RuleSection(
    val id: String,
    val name: String,
    val content: String,
)

/** One step of the physical Setup Guide. */
data class SetupStep(
    val title: String,
    val instruction: String,
)

/** One narrated action of the Guided First Round. */
data class FirstRoundStep(
    val title: String,
    val instruction: String,
)

/** A player row used on the Scoring Assist screen. */
data class ScoringPlayer(
    val name: String,
    val role: String,
    val startScore: Int,
)

/** All Genie mode content for one game (MVP hardcoded, Phase 4 backend). */
data class GameContent(
    val gameId: String,
    val about: AboutContent,
    val howToPlay: List<RuleSection>,
    val setupSteps: List<SetupStep>,
    val firstRound: List<FirstRoundStep>,
    val players: List<ScoringPlayer>,
    val cooperative: Boolean,
    val winnerNote: String,
)
