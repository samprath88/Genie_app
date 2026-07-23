package com.rork.genie.ui.components

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.genie.ui.theme.GenieColors

/**
 * "Ask Genie anything…" pill with a gold mic button.
 * MVP: tapping shows a toast; Phase 4 wires this to the /ask endpoint.
 */
@Composable
fun AskGenieBar(
    modifier: Modifier = Modifier,
    dark: Boolean = false,
) {
    val context = LocalContext.current
    val onTap = {
        Toast.makeText(context, "Ask Genie is coming in Phase 4", Toast.LENGTH_SHORT).show()
    }
    val pillBackground = if (dark) GenieColors.EspressoPanel else GenieColors.Ivory
    val pillBorder = if (dark) GenieColors.NightBorder else GenieColors.BorderLight
    val hintColor = if (dark) GenieColors.Cream.copy(alpha = 0.6f) else GenieColors.TextSecondary

    Row(
        modifier = modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            modifier = Modifier
                .weight(1f)
                .height(48.dp)
                .background(pillBackground, CircleShape)
                .border(1.dp, pillBorder, CircleShape)
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = onTap,
                )
                .padding(horizontal = 14.dp),
            contentAlignment = Alignment.CenterStart,
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                GenieBrandMark(size = 24.dp)
                Text(
                    text = "Ask Genie anything…",
                    fontSize = 14.sp,
                    color = hintColor,
                    modifier = Modifier.padding(start = 8.dp),
                )
            }
        }
        Box(
            modifier = Modifier
                .padding(start = 10.dp)
                .size(48.dp)
                .background(GenieColors.Gold, CircleShape)
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = onTap,
                ),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                imageVector = Icons.Default.Mic,
                contentDescription = "Ask by voice",
                tint = GenieColors.TextPrimary,
                modifier = Modifier.size(22.dp),
            )
        }
    }
}

/** Warm section divider label, e.g. "ASK ANYTHING" / "YOUR CARDS". */
@Composable
fun SectionLabel(
    text: String,
    modifier: Modifier = Modifier,
    color: Color = GenieColors.MaroonDark,
) {
    Text(
        text = text.uppercase(),
        fontSize = 12.sp,
        letterSpacing = 1.2.sp,
        color = color,
        style = androidx.compose.material3.MaterialTheme.typography.labelMedium,
        modifier = modifier,
    )
}
