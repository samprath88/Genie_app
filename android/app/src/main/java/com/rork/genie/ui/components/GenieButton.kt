package com.rork.genie.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.genie.ui.theme.GenieColors

enum class GenieButtonVariant { Primary, Secondary, Outline }

/**
 * Genie design-system button: gold primary, ivory secondary, maroon outline.
 * Scales down slightly while pressed and fires haptic feedback on tap.
 */
@Composable
fun GenieButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: GenieButtonVariant = GenieButtonVariant.Primary,
    enabled: Boolean = true,
    loading: Boolean = false,
    height: Dp = 48.dp,
) {
    val haptics = LocalHapticFeedback.current
    val interactionSource = remember { MutableInteractionSource() }
    val pressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(targetValue = if (pressed) 0.97f else 1f, label = "buttonScale")

    val background: Color = when (variant) {
        GenieButtonVariant.Primary -> GenieColors.Gold
        GenieButtonVariant.Secondary -> GenieColors.Ivory
        GenieButtonVariant.Outline -> Color.Transparent
    }
    val contentColor: Color = GenieColors.TextPrimary
    val shape = RoundedCornerShape(12.dp)

    val borderModifier = when (variant) {
        GenieButtonVariant.Primary -> Modifier
        GenieButtonVariant.Secondary -> Modifier.border(1.dp, GenieColors.BorderLight, shape)
        GenieButtonVariant.Outline -> Modifier.border(2.dp, GenieColors.MaroonDark, shape)
    }

    Box(
        modifier = modifier
            .scale(scale)
            .height(height)
            .alpha(if (enabled) 1f else 0.5f)
            .then(borderModifier)
            .then(
                if (variant == GenieButtonVariant.Primary) {
                    Modifier.background(Brush.linearGradient(listOf(GenieColors.Blush, GenieColors.Gold)), shape)
                } else {
                    Modifier.background(background, shape)
                }
            )
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                enabled = enabled && !loading,
            ) {
                haptics.performHapticFeedback(HapticFeedbackType.LongPress)
                onClick()
            }
            .padding(horizontal = 16.dp),
        contentAlignment = Alignment.Center,
    ) {
        if (loading) {
            CircularProgressIndicator(
                modifier = Modifier.height(20.dp).scale(0.6f),
                color = contentColor,
                strokeWidth = 2.dp,
            )
        } else {
            Text(
                text = text,
                color = contentColor,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                style = MaterialTheme.typography.labelMedium.copy(fontSize = 14.sp),
                maxLines = 1,
            )
        }
    }
}
