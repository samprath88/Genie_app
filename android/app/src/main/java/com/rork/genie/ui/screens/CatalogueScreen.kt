package com.rork.genie.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Storefront
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.rork.genie.data.GameRepository
import com.rork.genie.ui.components.GameCard
import com.rork.genie.ui.components.GenieButton
import com.rork.genie.ui.components.GenieHeader
import com.rork.genie.ui.theme.GenieColors

/** Screen 2: "Your Games" catalogue with the Continue Playing band and game list. */
@Composable
fun CatalogueScreen(
    ownedGames: Set<String>,
    onGameClick: (String) -> Unit,
    onShopClick: () -> Unit,
) {
    val context = LocalContext.current
    val continueGame = GameRepository.gameById(GameRepository.CONTINUE_PLAYING_ID)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(GenieColors.Cream)
    ) {
        GenieHeader(
            title = "Your Games",
            trailing = {
                IconButton(onClick = onShopClick) {
                    Icon(
                        imageVector = Icons.Default.Storefront,
                        contentDescription = "Shop Games",
                        tint = GenieColors.Gold,
                    )
                }
            },
        )
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = androidx.compose.foundation.layout.PaddingValues(
                start = 24.dp, end = 24.dp, top = 16.dp, bottom = 24.dp
            ),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            if (continueGame != null) {
                item(key = "continue") {
                    ContinuePlayingCard(
                        title = continueGame.title,
                        imageUrl = continueGame.coverUrl,
                        turn = GameRepository.CONTINUE_TURN,
                        totalTurns = GameRepository.CONTINUE_TOTAL_TURNS,
                        onResume = {
                            Toast.makeText(context, "Gameplay screens coming soon", Toast.LENGTH_SHORT).show()
                        },
                    )
                }
            }
            item(key = "all_games_label") {
                Text(
                    text = "ALL GAMES",
                    style = MaterialTheme.typography.labelMedium,
                    color = GenieColors.TextSecondary,
                    modifier = Modifier.padding(top = 8.dp),
                )
            }
            items(GameRepository.games, key = { it.id }) { game ->
                GameCard(
                    game = game,
                    owned = ownedGames.contains(game.id),
                    onClick = { onGameClick(game.id) },
                    onVoiceClick = {
                        Toast.makeText(context, "Voice intro coming soon", Toast.LENGTH_SHORT).show()
                    },
                )
            }
        }
    }
}

@Composable
private fun ContinuePlayingCard(
    title: String,
    imageUrl: String,
    turn: Int,
    totalTurns: Int,
    onResume: () -> Unit,
) {
    val shape = RoundedCornerShape(16.dp)
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(120.dp)
            .clip(shape)
            .background(GenieColors.Ivory)
            .border(1.dp, GenieColors.BorderLight, shape)
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            modifier = Modifier
                .size(96.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(GenieColors.Cream)
        ) {
            AsyncImage(
                model = imageUrl,
                contentDescription = title,
                contentScale = ContentScale.Crop,
                alignment = Alignment.TopCenter,
                modifier = Modifier.fillMaxSize(),
            )
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(GenieColors.ImageOverlay.copy(alpha = 0.2f))
            )
        }
        Column(
            modifier = Modifier
                .weight(1f)
                .padding(start = 12.dp),
        ) {
            Text(
                text = "CONTINUE PLAYING",
                style = MaterialTheme.typography.labelSmall,
                color = GenieColors.GoldDeep,
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                color = GenieColors.MaroonDark,
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Turn $turn of $totalTurns",
                fontSize = 12.sp,
                color = GenieColors.TextSecondary,
            )
            Spacer(modifier = Modifier.height(6.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                LinearProgressIndicator(
                    progress = { turn.toFloat() / totalTurns.toFloat() },
                    modifier = Modifier
                        .weight(1f)
                        .height(4.dp)
                        .clip(RoundedCornerShape(2.dp)),
                    color = GenieColors.Gold,
                    trackColor = GenieColors.BorderLight,
                )
                Spacer(modifier = Modifier.width(12.dp))
                GenieButton(
                    text = "Resume",
                    onClick = onResume,
                    height = 32.dp,
                    modifier = Modifier.width(88.dp),
                )
            }
        }
    }
}
