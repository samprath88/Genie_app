package com.rork.genie.ui.screens

import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.genie.model.Game
import com.rork.genie.model.GameContent
import com.rork.genie.ui.components.GenieButton
import com.rork.genie.ui.components.GenieButtonVariant
import com.rork.genie.ui.components.GenieHeader
import com.rork.genie.ui.components.SectionLabel
import com.rork.genie.ui.theme.GenieColors

/** Screen 10: Scoring Assist — score steppers, winner call and final rankings. */
@Composable
fun ScoringScreen(
    game: Game,
    content: GameContent,
    onPlayAgain: () -> Unit,
    onBack: () -> Unit,
) {
    val context = LocalContext.current
    val haptics = LocalHapticFeedback.current
    var scores by remember {
        mutableStateOf(content.players.map { it.startScore })
    }
    var declared by remember { mutableStateOf(false) }

    val ranked = content.players.zip(scores).sortedByDescending { it.second }
    val winner = ranked.first()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(GenieColors.Cream)
    ) {
        GenieHeader(title = "Scoring Assist", subtitle = game.title, onBack = onBack)
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp),
        ) {
            Spacer(modifier = Modifier.height(16.dp))

            AnimatedVisibility(
                visible = declared,
                enter = fadeIn() + expandVertically(),
            ) {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(
                                Brush.linearGradient(
                                    colors = listOf(GenieColors.Blush, GenieColors.Gold),
                                ),
                                RoundedCornerShape(16.dp),
                            )
                            .padding(vertical = 22.dp, horizontal = 16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        Text(text = "🏆", fontSize = 40.sp)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "WINNER",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 2.sp,
                            color = GenieColors.TextPrimary,
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (content.cooperative) "The whole table!" else winner.first.name,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = GenieColors.TextPrimary,
                            textAlign = TextAlign.Center,
                        )
                        Text(
                            text = if (content.cooperative) {
                                "Cooperative victory · ${winner.second} points of teamwork"
                            } else {
                                "${winner.second} points · ${winner.first.role}"
                            },
                            fontSize = 12.sp,
                            color = GenieColors.TextPrimary,
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = content.winnerNote,
                            fontSize = 12.sp,
                            lineHeight = 17.sp,
                            color = GenieColors.TextPrimary.copy(alpha = 0.85f),
                            textAlign = TextAlign.Center,
                        )
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                    SectionLabel(text = "Final rankings", color = GenieColors.MaroonDark)
                    Spacer(modifier = Modifier.height(8.dp))
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(GenieColors.Ivory, RoundedCornerShape(12.dp))
                            .border(1.dp, GenieColors.BorderLight, RoundedCornerShape(12.dp)),
                    ) {
                        ranked.forEachIndexed { index, (player, score) ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 16.dp, vertical = 12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Text(
                                    text = when (index) {
                                        0 -> "🥇"
                                        1 -> "🥈"
                                        2 -> "🥉"
                                        else -> "${index + 1}."
                                    },
                                    fontSize = 16.sp,
                                    modifier = Modifier.width(32.dp),
                                )
                                Text(
                                    text = player.name,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = GenieColors.MaroonDark,
                                    modifier = Modifier.weight(1f),
                                )
                                Text(
                                    text = "$score",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = GenieColors.GoldDeep,
                                )
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        GenieButton(
                            text = "Save results",
                            onClick = {
                                Toast.makeText(context, "Results saved!", Toast.LENGTH_SHORT).show()
                            },
                            variant = GenieButtonVariant.Secondary,
                            modifier = Modifier.weight(1f),
                        )
                        GenieButton(
                            text = "Play again",
                            onClick = onPlayAgain,
                            modifier = Modifier.weight(1f),
                        )
                    }
                    Spacer(modifier = Modifier.height(20.dp))
                }
            }

            SectionLabel(text = "Players", color = GenieColors.MaroonDark)
            Spacer(modifier = Modifier.height(8.dp))
            content.players.forEachIndexed { index, player ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 10.dp)
                        .background(GenieColors.Ivory, RoundedCornerShape(12.dp))
                        .border(1.dp, GenieColors.BorderLight, RoundedCornerShape(12.dp))
                        .padding(horizontal = 14.dp, vertical = 10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = player.name,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = GenieColors.MaroonDark,
                        )
                        Text(
                            text = player.role,
                            fontSize = 11.sp,
                            color = GenieColors.TextSecondary,
                        )
                    }
                    StepperButton(label = "−") {
                        haptics.performHapticFeedback(HapticFeedbackType.LongPress)
                        scores = scores.toMutableList().also {
                            it[index] = (it[index] - 1).coerceAtLeast(0)
                        }
                    }
                    Text(
                        text = "${scores[index]}",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = GenieColors.TextPrimary,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.width(48.dp),
                    )
                    StepperButton(label = "+") {
                        haptics.performHapticFeedback(HapticFeedbackType.LongPress)
                        scores = scores.toMutableList().also { it[index] = it[index] + 1 }
                    }
                }
            }

            Spacer(modifier = Modifier.height(6.dp))
            GenieButton(
                text = if (declared) "Update winner" else "Declare winner",
                onClick = { declared = true },
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(modifier = Modifier.height(12.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(GenieColors.Ivory, RoundedCornerShape(12.dp))
                    .border(1.dp, GenieColors.BorderLight, RoundedCornerShape(12.dp))
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(text = "⚠️", fontSize = 16.sp)
                Spacer(modifier = Modifier.width(10.dp))
                Text(
                    text = "Disagreement over points? Tap the mic and describe it — Genie cites the exact rule and settles it.",
                    fontSize = 12.sp,
                    lineHeight = 17.sp,
                    color = GenieColors.TextSecondary,
                )
            }
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
private fun StepperButton(
    label: String,
    onClick: () -> Unit,
) {
    Box(
        modifier = Modifier
            .size(36.dp)
            .background(GenieColors.Gold, CircleShape)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onClick,
            ),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = label,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = GenieColors.MaroonDark,
        )
    }
}
