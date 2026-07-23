package com.rork.genie.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.rork.genie.model.Game
import com.rork.genie.ui.components.FeatureCard
import com.rork.genie.ui.components.GenieHeader
import com.rork.genie.ui.components.PurchaseSheet
import com.rork.genie.ui.theme.GenieColors

/** Screens 4+5: Game Detail with hero, five mode cards and the unlock paywall sheet. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GameDetailScreen(
    game: Game,
    owned: Boolean,
    purchasingId: String?,
    purchaseCompletedId: String?,
    onPurchase: (String) -> Unit,
    onOpenMode: (String) -> Unit,
    onBack: () -> Unit,
) {
    val context = LocalContext.current
    var showUnlockSheet by remember { mutableStateOf(false) }
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    LaunchedEffect(purchaseCompletedId) {
        if (purchaseCompletedId == game.id && showUnlockSheet) {
            showUnlockSheet = false
            Toast.makeText(
                context,
                "🎉 Welcome! You've unlocked ${game.title}",
                Toast.LENGTH_SHORT
            ).show()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(GenieColors.Cream)
    ) {
        GenieHeader(title = game.title, onBack = onBack)
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(bottom = 24.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            item(key = "hero") {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp)
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
                            .background(GenieColors.ImageOverlay)
                    )
                    Column(
                        modifier = Modifier
                            .align(Alignment.Center)
                            .padding(horizontal = 24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        Text(
                            text = game.title,
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            textAlign = TextAlign.Center,
                        )
                        Text(
                            text = game.tagline,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Light,
                            color = Color.White.copy(alpha = 0.9f),
                            textAlign = TextAlign.Center,
                        )
                    }
                }
            }
            item(key = "label") {
                Text(
                    text = "EVERYTHING GENIE CAN DO",
                    style = MaterialTheme.typography.labelMedium,
                    color = GenieColors.TextSecondary,
                    modifier = Modifier.padding(horizontal = 24.dp, vertical = 4.dp),
                )
            }
            items(game.modes, key = { it.id }) { mode ->
                FeatureCard(
                    mode = mode,
                    unlocked = mode.free || owned,
                    priceLabel = game.priceLabel,
                    onStart = { onOpenMode(mode.id) },
                    onUnlock = { showUnlockSheet = true },
                    modifier = Modifier.padding(horizontal = 24.dp),
                )
            }
        }
    }

    if (showUnlockSheet) {
        PurchaseSheet(
            sheetState = sheetState,
            title = "Unlock ${game.title}?",
            tagline = "Get instant access to every mode",
            imageUrl = game.heroUrl,
            priceLabel = game.priceLabel,
            features = listOf(
                "How to Play",
                "Setup Guide",
                "Guided First Round",
                "Scoring Assist",
                "Ask Anything",
            ),
            isPurchasing = purchasingId == game.id,
            onConfirm = { onPurchase(game.id) },
            onDismiss = { showUnlockSheet = false },
        )
    }
}
