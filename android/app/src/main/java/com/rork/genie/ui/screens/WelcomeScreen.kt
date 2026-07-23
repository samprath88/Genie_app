package com.rork.genie.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.foundation.Image
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.genie.R
import com.rork.genie.ui.components.GenieBrandMark
import com.rork.genie.ui.components.GenieButton
import com.rork.genie.ui.components.GenieButtonVariant
import com.rork.genie.ui.theme.GenieColors

/** Screen 1: full-bleed gradient welcome hero, shown only on first launch. */
@Composable
fun WelcomeScreen(onGetStarted: () -> Unit) {
    val context = LocalContext.current
    val heroGradient = Brush.linearGradient(
        colors = listOf(GenieColors.Mint, GenieColors.Lavender, GenieColors.Blush)
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(heroGradient)
    ) {
        Image(
            painter = painterResource(R.drawable.welcome_hero),
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize(),
        )
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colorStops = arrayOf(
                            0f to Color.Black.copy(alpha = 0.05f),
                            0.45f to GenieColors.TextPrimary.copy(alpha = 0.28f),
                            1f to GenieColors.MaroonDark.copy(alpha = 0.78f),
                        ),
                    ),
                ),
        )
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.linearGradient(
                        listOf(
                            GenieColors.Mint.copy(alpha = 0.14f),
                            GenieColors.Lavender.copy(alpha = 0.14f),
                            GenieColors.Blush.copy(alpha = 0.14f),
                        ),
                    ),
                ),
        )
        Column(
            modifier = Modifier
                .fillMaxSize()
                .systemBarsPadding()
                .padding(horizontal = 32.dp, vertical = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                GenieBrandMark(size = 42.dp)
                Text(
                    text = "Genie",
                    fontSize = 36.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 4.sp,
                    color = GenieColors.Cream,
                    modifier = Modifier.padding(start = 12.dp),
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Skip to the Good Part",
                fontSize = 19.sp,
                fontWeight = FontWeight.Black,
                color = GenieColors.Cream,
                textAlign = TextAlign.Center,
            )
            Spacer(modifier = Modifier.weight(1f))
            GenieButton(
                text = "Get Started",
                onClick = onGetStarted,
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(modifier = Modifier.height(12.dp))
            GenieButton(
                text = "Hear the 30-second tour",
                onClick = {
                    Toast.makeText(context, "Voice tour coming soon", Toast.LENGTH_SHORT).show()
                },
                variant = GenieButtonVariant.Secondary,
                height = 40.dp,
                modifier = Modifier.fillMaxWidth(),
            )
        }
    }
}
