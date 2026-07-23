package com.rork.genie.ui.screens

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.rork.genie.model.Game
import com.rork.genie.model.GameContent
import com.rork.genie.ui.components.AskGenieBar
import com.rork.genie.ui.components.GenieButton
import com.rork.genie.ui.components.NowPlayingIndicator
import com.rork.genie.ui.theme.GenieColors

/** Screen 9: Guided First Round — full-bleed narrated walkthrough of the first turn. */
@Composable
fun FirstRoundScreen(
    game: Game,
    content: GameContent,
    onFinish: () -> Unit,
    onBack: () -> Unit,
) {
    var stepIndex by remember { mutableIntStateOf(0) }
    var narrating by remember { mutableStateOf(true) }
    val steps = content.firstRound
    val roundImage = game.modes.firstOrNull { it.id == "first_round" }?.imageUrl ?: game.heroUrl

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(GenieColors.Espresso)
    ) {
        AsyncImage(
            model = roundImage,
            contentDescription = game.title,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize(),
        )
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            GenieColors.ImageOverlay.copy(alpha = 0.25f),
                            GenieColors.ImageOverlay.copy(alpha = 0.18f),
                            GenieColors.Cream.copy(alpha = 0.90f),
                            GenieColors.Cream,
                        ),
                    )
                )
        )

        Column(modifier = Modifier.fillMaxSize()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .statusBarsPadding()
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(
                    onClick = onBack,
                    modifier = Modifier
                        .size(40.dp)
                        .background(GenieColors.Ivory.copy(alpha = 0.86f), CircleShape),
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Back",
                        tint = GenieColors.TextPrimary,
                        modifier = Modifier.size(22.dp),
                    )
                }
                Column(
                    modifier = Modifier.weight(1f),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Text(
                        text = "Guided First Round",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = GenieColors.TextPrimary,
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        steps.forEachIndexed { index, _ ->
                            ProgressDot(active = index <= stepIndex)
                        }
                    }
                }
                Spacer(modifier = Modifier.size(40.dp))
            }

            Spacer(modifier = Modifier.weight(1f))

            AnimatedContent(
                targetState = stepIndex,
                transitionSpec = {
                    val forward = targetState > initialState
                    (slideInHorizontally { if (forward) it / 3 else -it / 3 } + fadeIn())
                        .togetherWith(slideOutHorizontally { if (forward) -it / 3 else it / 3 } + fadeOut())
                },
                label = "firstRoundStep",
                modifier = Modifier.padding(horizontal = 28.dp),
            ) { index ->
                val step = steps[index]
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Text(
                        text = "STEP ${index + 1} OF ${steps.size}",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 2.sp,
                        color = GenieColors.Gold,
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = step.title,
                        fontSize = 26.sp,
                        lineHeight = 32.sp,
                        fontWeight = FontWeight.Bold,
                        color = GenieColors.TextPrimary,
                        textAlign = TextAlign.Center,
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = step.instruction,
                        fontSize = 14.sp,
                        lineHeight = 22.sp,
                        color = GenieColors.TextPrimary,
                        textAlign = TextAlign.Center,
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 28.dp),
                contentAlignment = Alignment.Center,
            ) {
                if (narrating) {
                    NowPlayingIndicator(label = "Now playing")
                } else {
                    Text(
                        text = "Narration paused",
                        fontSize = 12.sp,
                        color = GenieColors.TextSecondary,
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                RoundNavButton(
                    forward = false,
                    enabled = stepIndex > 0,
                    onClick = { if (stepIndex > 0) stepIndex -= 1 },
                )
                Box(modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 10.dp)) {
                    AskGenieBar(dark = true)
                }
                RoundNavButton(
                    forward = true,
                    enabled = true,
                    onClick = {
                        if (stepIndex < steps.size - 1) stepIndex += 1 else onFinish()
                    },
                )
            }
            if (stepIndex == steps.size - 1) {
                Spacer(modifier = Modifier.height(10.dp))
                GenieButton(
                    text = "🏆  Finish round · Scoring Assist",
                    onClick = onFinish,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 24.dp),
                )
            }
            Spacer(
                modifier = Modifier
                    .navigationBarsPadding()
                    .height(14.dp)
            )
        }
    }
}

@Composable
private fun ProgressDot(active: Boolean) {
    val color by animateColorAsState(
        targetValue = if (active) GenieColors.Mint else GenieColors.BorderLight,
        label = "dotColor",
    )
    val width by animateDpAsState(
        targetValue = if (active) 18.dp else 8.dp,
        label = "dotWidth",
    )
    Box(
        modifier = Modifier
            .width(width)
            .height(6.dp)
            .background(color, CircleShape)
    )
}

@Composable
private fun RoundNavButton(
    forward: Boolean,
    enabled: Boolean,
    onClick: () -> Unit,
) {
    IconButton(
        onClick = onClick,
        enabled = enabled,
        modifier = Modifier
            .size(48.dp)
            .background(
                if (enabled) GenieColors.Gold else GenieColors.BorderLight,
                CircleShape,
            ),
    ) {
        Icon(
            imageVector = if (forward) Icons.AutoMirrored.Filled.ArrowForward else Icons.AutoMirrored.Filled.ArrowBack,
            contentDescription = if (forward) "Next step" else "Previous step",
            tint = if (enabled) GenieColors.TextPrimary else GenieColors.TextSecondary,
            modifier = Modifier.size(22.dp),
        )
    }
}
