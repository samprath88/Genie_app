package com.rork.genie.ui.screens

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
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
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.rork.genie.model.Game
import com.rork.genie.model.GameContent
import com.rork.genie.ui.components.GenieButton
import com.rork.genie.ui.components.GenieButtonVariant
import com.rork.genie.ui.components.NarrationControl
import com.rork.genie.ui.theme.GenieColors

/** Screen 8: Setup Guide — immersive dark walkthrough with step chips and mock narration. */
@Composable
fun SetupGuideScreen(
    game: Game,
    content: GameContent,
    onNextMode: () -> Unit,
    onBack: () -> Unit,
) {
    var stepIndex by remember { mutableIntStateOf(0) }
    var narrating by remember { mutableStateOf(true) }
    val steps = content.setupSteps
    val setupImage = game.modes.firstOrNull { it.id == "setup" }?.imageUrl ?: game.heroUrl

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(GenieColors.Espresso)
    ) {
        AsyncImage(
            model = setupImage,
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
                Spacer(modifier = Modifier.size(12.dp))
                Column {
                    Text(
                        text = "Setup Guide",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = GenieColors.TextPrimary,
                    )
                    Text(
                        text = game.title,
                        fontSize = 12.sp,
                        color = GenieColors.Gold,
                    )
                }
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                steps.forEachIndexed { index, step ->
                    val selected = index == stepIndex
                    Box(
                        modifier = Modifier
                            .background(
                                if (selected) GenieColors.Mint else GenieColors.Ivory.copy(alpha = 0.80f),
                                CircleShape,
                            )
                            .border(
                                1.dp,
                                if (selected) GenieColors.Mint else GenieColors.NightBorder,
                                CircleShape,
                            )
                            .clickable(
                                interactionSource = remember { MutableInteractionSource() },
                                indication = null,
                            ) { stepIndex = index }
                            .padding(horizontal = 14.dp, vertical = 8.dp),
                    ) {
                        Text(
                            text = step.title,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (selected) GenieColors.MaroonDark else GenieColors.Cream,
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp)
            ) {
                LinearProgressIndicator(
                    progress = { (stepIndex + 1) / steps.size.toFloat() },
                    color = GenieColors.Gold,
                    trackColor = GenieColors.BorderLight,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(4.dp),
                )
                Spacer(modifier = Modifier.height(14.dp))

                AnimatedContent(
                    targetState = stepIndex,
                    transitionSpec = {
                        val forward = targetState > initialState
                        (slideInHorizontally { if (forward) it / 3 else -it / 3 } + fadeIn())
                            .togetherWith(slideOutHorizontally { if (forward) -it / 3 else it / 3 } + fadeOut())
                    },
                    label = "setupStep",
                ) { index ->
                    val step = steps[index]
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text(
                            text = "STEP ${index + 1} OF ${steps.size} · ${step.title.uppercase()}",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.2.sp,
                            color = GenieColors.Gold,
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = step.instruction,
                            fontSize = 15.sp,
                            lineHeight = 23.sp,
                            color = GenieColors.TextPrimary,
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
                NarrationControl(
                    playing = narrating,
                    onToggle = { narrating = !narrating },
                    playLabel = "Hear step ${stepIndex + 1}",
                )
                Spacer(modifier = Modifier.height(10.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    GenieButton(
                        text = "←  Previous",
                        onClick = { if (stepIndex > 0) stepIndex -= 1 },
                        enabled = stepIndex > 0,
                        variant = GenieButtonVariant.Outline,
                        height = 44.dp,
                        modifier = Modifier
                            .weight(1f)
                            .background(GenieColors.Ivory.copy(alpha = 0.82f), RoundedCornerShape(12.dp)),
                    )
                    if (stepIndex < steps.size - 1) {
                        GenieButton(
                            text = "Next  →",
                            onClick = { stepIndex += 1 },
                            height = 44.dp,
                            modifier = Modifier.weight(1f),
                        )
                    } else {
                        GenieButton(
                            text = "First Round  →",
                            onClick = onNextMode,
                            height = 44.dp,
                            modifier = Modifier.weight(1f),
                        )
                    }
                }
            }
            Spacer(
                modifier = Modifier
                    .navigationBarsPadding()
                    .height(16.dp)
            )
        }
    }
}
