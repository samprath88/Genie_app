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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.rork.genie.model.Game
import com.rork.genie.model.GameContent
import com.rork.genie.ui.components.AskGenieBar
import com.rork.genie.ui.components.GenieButton
import com.rork.genie.ui.components.GenieButtonVariant
import com.rork.genie.ui.components.GenieHeader
import com.rork.genie.ui.components.NarrationControl
import com.rork.genie.ui.theme.GenieColors

/** Screen 7: How to Play — tabbed rules (Your Goal / Core Mechanics / How to Win). */
@Composable
fun HowToPlayScreen(
    game: Game,
    content: GameContent,
    onPreviousMode: () -> Unit,
    onNextMode: () -> Unit,
    onBack: () -> Unit,
) {
    var selectedIndex by remember { mutableIntStateOf(0) }
    var narrating by remember { mutableStateOf(false) }
    val sections = content.howToPlay

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(GenieColors.Cream)
    ) {
        GenieHeader(title = "How to Play", subtitle = game.title, onBack = onBack)

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(GenieColors.ChromeEnd)
                .padding(start = 16.dp, end = 16.dp, bottom = 14.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            sections.forEachIndexed { index, section ->
                val selected = index == selectedIndex
                Box(
                    modifier = Modifier
                        .clip(CircleShape)
                        .background(if (selected) GenieColors.Mint else GenieColors.Ivory)
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                        ) {
                            selectedIndex = index
                            narrating = false
                        }
                        .padding(horizontal = 14.dp, vertical = 8.dp),
                ) {
                    Text(
                        text = section.name,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = GenieColors.TextPrimary,
                    )
                }
            }
        }

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp),
        ) {
            Spacer(modifier = Modifier.height(16.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(170.dp)
                    .clip(RoundedCornerShape(16.dp))
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
                        .background(GenieColors.ImageOverlay.copy(alpha = 0.25f))
                )
            }
            Spacer(modifier = Modifier.height(20.dp))

            AnimatedContent(
                targetState = selectedIndex,
                transitionSpec = {
                    val forward = targetState > initialState
                    (slideInHorizontally { if (forward) it / 3 else -it / 3 } + fadeIn())
                        .togetherWith(slideOutHorizontally { if (forward) -it / 3 else it / 3 } + fadeOut())
                },
                label = "ruleSection",
            ) { index ->
                val section = sections[index]
                Column(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        text = section.name,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        color = GenieColors.MaroonDark,
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = section.content,
                        fontSize = 14.sp,
                        lineHeight = 22.sp,
                        color = GenieColors.TextPrimary,
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))
            NarrationControl(
                playing = narrating,
                onToggle = { narrating = !narrating },
                playLabel = "Listen to Game Master",
                dark = false,
            )
            Text(
                text = "Hear the ${sections[selectedIndex].name.lowercase()} narrated by Genie",
                fontSize = 12.sp,
                color = GenieColors.TextSecondary,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 6.dp),
            )

            Spacer(modifier = Modifier.height(20.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                GenieButton(
                    text = "←  The Story",
                    onClick = onPreviousMode,
                    variant = GenieButtonVariant.Secondary,
                    height = 44.dp,
                    modifier = Modifier.weight(1f),
                )
                GenieButton(
                    text = "Setup Guide  →",
                    onClick = onNextMode,
                    variant = GenieButtonVariant.Secondary,
                    height = 44.dp,
                    modifier = Modifier.weight(1f),
                )
            }
            Spacer(modifier = Modifier.height(16.dp))
        }

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(GenieColors.Cream)
                .padding(horizontal = 24.dp, vertical = 10.dp)
                .navigationBarsPadding()
        ) {
            AskGenieBar()
        }
    }
}
