package com.rork.genie.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.rork.genie.model.GameMode
import com.rork.genie.ui.theme.GenieColors

/** Mode card on the Game Detail screen: photo, name, status line and START/UNLOCK button. */
@Composable
fun FeatureCard(
    mode: GameMode,
    unlocked: Boolean,
    priceLabel: String,
    onStart: () -> Unit,
    onUnlock: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val shape = RoundedCornerShape(12.dp)
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(shape)
            .background(GenieColors.Ivory)
            .border(1.dp, GenieColors.BorderLight, shape)
            .clickable { if (unlocked) onStart() else onUnlock() }
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            modifier = Modifier
                .width(110.dp)
                .height(64.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(GenieColors.Cream)
        ) {
            AsyncImage(
                model = mode.imageUrl,
                contentDescription = mode.name,
                contentScale = ContentScale.Crop,
                alignment = Alignment.Center,
                modifier = Modifier.fillMaxSize(),
            )
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(GenieColors.ImageOverlay.copy(alpha = 0.15f))
            )
        }
        Column(
            modifier = Modifier
                .weight(1f)
                .padding(start = 12.dp),
        ) {
            Text(
                text = mode.name,
                style = MaterialTheme.typography.titleMedium,
                color = GenieColors.MaroonDark,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Text(
                text = mode.description,
                fontSize = 12.sp,
                color = GenieColors.TextSecondary,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
            )
            Spacer(modifier = Modifier.height(4.dp))
            if (unlocked) {
                Text(
                    text = "✓ Ready to play",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = GenieColors.GoldDeep,
                )
            } else {
                Text(
                    text = "🔒 $priceLabel one-time",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = GenieColors.TextSecondary,
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            GenieButton(
                text = if (unlocked) "START" else "UNLOCK",
                onClick = { if (unlocked) onStart() else onUnlock() },
                height = 40.dp,
                modifier = Modifier.fillMaxWidth(),
            )
        }
    }
}
