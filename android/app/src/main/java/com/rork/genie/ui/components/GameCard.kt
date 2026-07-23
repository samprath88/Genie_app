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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.VolumeUp
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.rork.genie.model.Game
import com.rork.genie.ui.theme.GenieColors

/** Horizontal game row card used on the Catalogue screen. */
@Composable
fun GameCard(
    game: Game,
    owned: Boolean,
    onClick: () -> Unit,
    onVoiceClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val shape = RoundedCornerShape(12.dp)
    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(100.dp)
            .clip(shape)
            .background(GenieColors.Ivory)
            .border(1.dp, GenieColors.BorderLight, shape)
            .clickable(onClick = onClick)
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            modifier = Modifier
                .size(76.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(GenieColors.Cream)
        ) {
            AsyncImage(
                model = game.coverUrl,
                contentDescription = game.title,
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
                .padding(horizontal = 12.dp),
        ) {
            Text(
                text = game.title,
                style = MaterialTheme.typography.titleMedium,
                color = GenieColors.MaroonDark,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Text(
                text = game.description,
                fontSize = 12.sp,
                color = GenieColors.TextSecondary,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
            )
            Spacer(modifier = Modifier.height(4.dp))
            if (owned) {
                Text(
                    text = "✓ Ready to play",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = GenieColors.GoldDeep,
                )
            } else {
                Text(
                    text = "🔒 ${game.priceLabel}",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = GenieColors.TextSecondary,
                )
            }
        }
        IconButton(onClick = onVoiceClick, modifier = Modifier.alpha(0.7f)) {
            Icon(
                imageVector = Icons.AutoMirrored.Filled.VolumeUp,
                contentDescription = "Hear intro for ${game.title}",
                tint = GenieColors.MaroonDark,
                modifier = Modifier.size(20.dp),
            )
        }
    }
}
