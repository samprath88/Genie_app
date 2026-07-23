package com.rork.genie.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.rork.genie.data.GameRepository
import com.rork.genie.model.Game
import com.rork.genie.ui.components.GenieButton
import com.rork.genie.ui.components.GenieHeader
import com.rork.genie.ui.theme.GenieColors

private data class ModeLink(val modeId: String, val label: String)

private val modeLinks = listOf(
    ModeLink("about", "The Story"),
    ModeLink("how_to_play", "How to Play"),
    ModeLink("setup", "Setup"),
    ModeLink("first_round", "First Round"),
    ModeLink("scoring", "Scoring"),
)

/** Now Playing tab: hub of owned games with direct links into each Genie mode. */
@Composable
fun NowPlayingScreen(
    ownedGames: Set<String>,
    onOpenMode: (gameId: String, modeId: String) -> Unit,
    onBrowseGames: () -> Unit,
) {
    val owned = GameRepository.games.filter { ownedGames.contains(it.id) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(GenieColors.Cream)
    ) {
        GenieHeader(title = "Now Playing", subtitle = "Genie at your table")
        if (owned.isEmpty()) {
            EmptyNowPlaying(onBrowseGames = onBrowseGames)
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 24.dp),
            ) {
                Spacer(modifier = Modifier.height(16.dp))
                owned.forEach { game ->
                    NowPlayingCard(
                        game = game,
                        onOpenMode = { modeId -> onOpenMode(game.id, modeId) },
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                }
                Text(
                    text = "Unlock more games in the Market to see them here.",
                    fontSize = 12.sp,
                    color = GenieColors.TextSecondary,
                    textAlign = TextAlign.Center,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 24.dp),
                )
            }
        }
    }
}

@Composable
private fun NowPlayingCard(
    game: Game,
    onOpenMode: (String) -> Unit,
) {
    val shape = RoundedCornerShape(16.dp)
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(shape)
            .background(GenieColors.Ivory)
            .border(1.dp, GenieColors.BorderLight, shape),
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(140.dp)
        ) {
            AsyncImage(
                model = game.heroUrl,
                contentDescription = game.title,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize(),
            )
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(Color(0x26000000), Color(0xB3000000)),
                        )
                    )
            )
            Column(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(16.dp)
            ) {
                Text(
                    text = game.title,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                )
                Text(
                    text = game.tagline,
                    fontSize = 12.sp,
                    color = Color.White.copy(alpha = 0.85f),
                    maxLines = 1,
                )
            }
        }
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(12.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            modeLinks.forEach { link ->
                Box(
                    modifier = Modifier
                        .clip(CircleShape)
                        .background(GenieColors.Cream)
                        .border(1.dp, GenieColors.BorderLight, CircleShape)
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                        ) { onOpenMode(link.modeId) }
                        .padding(horizontal = 14.dp, vertical = 8.dp),
                ) {
                    Text(
                        text = link.label,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = GenieColors.MaroonDark,
                    )
                }
            }
        }
    }
}

@Composable
private fun EmptyNowPlaying(onBrowseGames: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text(text = "🎲", fontSize = 48.sp)
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "No game in progress",
            style = MaterialTheme.typography.titleLarge,
            color = GenieColors.MaroonDark,
            textAlign = TextAlign.Center,
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Unlock a game and Genie's story, setup, tutorial and scoring modes will appear here.",
            fontSize = 14.sp,
            color = GenieColors.TextSecondary,
            textAlign = TextAlign.Center,
        )
        Spacer(modifier = Modifier.height(24.dp))
        GenieButton(
            text = "Browse your games",
            onClick = onBrowseGames,
            modifier = Modifier.fillMaxWidth(),
        )
    }
}
