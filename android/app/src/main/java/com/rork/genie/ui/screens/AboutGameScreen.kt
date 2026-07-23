package com.rork.genie.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
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

/** Screen 6: What's It All About — immersive full-bleed story pitch with mock narration. */
@Composable
fun AboutGameScreen(
    game: Game,
    content: GameContent,
    onLearnToPlay: () -> Unit,
    onBack: () -> Unit,
) {
    var narrating by remember { mutableStateOf(true) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(GenieColors.Espresso)
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
                        text = "What's It All About",
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

            Spacer(modifier = Modifier.weight(1f))

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp)
            ) {
                Text(
                    text = content.about.headline,
                    fontSize = 27.sp,
                    lineHeight = 33.sp,
                    fontWeight = FontWeight.Bold,
                    color = GenieColors.TextPrimary,
                )
                Spacer(modifier = Modifier.height(16.dp))
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(GenieColors.EspressoPanel, RoundedCornerShape(16.dp))
                        .border(1.dp, GenieColors.NightBorder, RoundedCornerShape(16.dp))
                        .padding(16.dp)
                ) {
                    Text(
                        text = "❝",
                        fontSize = 22.sp,
                        color = GenieColors.Gold,
                    )
                    Column(
                        modifier = Modifier
                            .heightIn(max = 190.dp)
                            .verticalScroll(rememberScrollState())
                    ) {
                        content.about.narrative.forEachIndexed { index, paragraph ->
                            if (index > 0) Spacer(modifier = Modifier.height(10.dp))
                            Text(
                                text = paragraph,
                                fontSize = 14.sp,
                                lineHeight = 21.sp,
                                color = GenieColors.TextPrimary,
                            )
                        }
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
                NarrationControl(
                    playing = narrating,
                    onToggle = { narrating = !narrating },
                    playLabel = "Hear the story",
                )
                Spacer(modifier = Modifier.height(10.dp))
                GenieButton(
                    text = "Learn to play  →",
                    onClick = onLearnToPlay,
                    variant = GenieButtonVariant.Outline,
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(GenieColors.Ivory.copy(alpha = 0.82f), RoundedCornerShape(12.dp)),
                )
            }
            Spacer(
                modifier = Modifier
                    .navigationBarsPadding()
                    .height(16.dp)
            )
        }
    }
}
