package com.rork.genie.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.genie.ui.theme.GenieColors

/**
 * Mock narration control: gold play/pause button with a pulsing
 * "Now playing · Genie narrating" indicator (audio arrives in Phase 4).
 */
@Composable
fun NarrationControl(
    playing: Boolean,
    onToggle: () -> Unit,
    modifier: Modifier = Modifier,
    playLabel: String = "Hear it narrated",
    dark: Boolean = true,
) {
    Column(modifier = modifier.fillMaxWidth()) {
        AnimatedVisibility(visible = playing, enter = fadeIn(), exit = fadeOut()) {
            NowPlayingIndicator(dark = dark, modifier = Modifier.padding(bottom = 10.dp))
        }
        GenieButton(
            text = if (playing) "⏸  Pause narration" else "🔊  $playLabel",
            onClick = onToggle,
            modifier = Modifier.fillMaxWidth(),
        )
    }
}

/** Pulsing gold dot + "Now playing · Genie narrating" caption. */
@Composable
fun NowPlayingIndicator(
    modifier: Modifier = Modifier,
    dark: Boolean = true,
    label: String = "Now playing · Genie narrating",
) {
    val transition = rememberInfiniteTransition(label = "narrationPulse")
    val pulse by transition.animateFloat(
        initialValue = 0.35f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 700, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse,
        ),
        label = "pulseAlpha",
    )
    Row(modifier = modifier, verticalAlignment = Alignment.CenterVertically) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            EqualizerBar(height = 10.dp, alpha = pulse)
            Spacer(modifier = Modifier.width(3.dp))
            EqualizerBar(height = 16.dp, alpha = 1f - pulse * 0.5f)
            Spacer(modifier = Modifier.width(3.dp))
            EqualizerBar(height = 7.dp, alpha = pulse)
        }
        Spacer(modifier = Modifier.width(10.dp))
        Text(
            text = label,
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold,
            letterSpacing = 0.4.sp,
            color = if (dark) GenieColors.Gold else GenieColors.GoldDeep,
        )
    }
}

@Composable
private fun EqualizerBar(height: androidx.compose.ui.unit.Dp, alpha: Float) {
    androidx.compose.foundation.layout.Box(
        modifier = Modifier
            .width(3.dp)
            .height(height)
            .alpha(alpha)
            .background(GenieColors.Gold, CircleShape)
    )
}
