package com.rork.genie.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
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
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.rork.genie.model.Game
import com.rork.genie.data.GameRepository
import com.rork.genie.ui.components.GenieButton
import com.rork.genie.ui.components.GenieHeader
import com.rork.genie.ui.components.PurchaseSheet
import com.rork.genie.ui.theme.GenieColors

/** Screen 3: Board Game Market with search, category chips, 2-column grid and BUY flow. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MarketScreen(
    ownedGames: Set<String>,
    purchasingId: String?,
    onGameClick: (String) -> Unit,
    onPurchase: (String) -> Unit,
    purchaseCompletedId: String?,
    onBack: (() -> Unit)? = null,
) {
    val context = LocalContext.current
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("All") }
    var buyCandidate by remember { mutableStateOf<Game?>(null) }
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    val filteredGames = remember(searchQuery, selectedCategory) {
        GameRepository.games.filter { game ->
            val matchesSearch = searchQuery.isBlank() ||
                game.title.contains(searchQuery.trim(), ignoreCase = true)
            val matchesCategory = selectedCategory == "All" || game.category == selectedCategory
            matchesSearch && matchesCategory
        }
    }

    // Close the sheet and toast when the mock purchase for the open candidate completes.
    LaunchedEffect(purchaseCompletedId) {
        val candidate = buyCandidate
        if (purchaseCompletedId != null && candidate != null && purchaseCompletedId == candidate.id) {
            buyCandidate = null
            Toast.makeText(
                context,
                "🎉 Welcome! You've unlocked ${candidate.title}",
                Toast.LENGTH_SHORT
            ).show()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(GenieColors.Cream)
    ) {
        GenieHeader(title = "Shop Games", onBack = onBack)

        SearchField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            modifier = Modifier.padding(horizontal = 24.dp, vertical = 12.dp),
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 24.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            GameRepository.categories.forEach { category ->
                CategoryChip(
                    label = category,
                    selected = category == selectedCategory,
                    onClick = { selectedCategory = category },
                )
            }
        }

        if (filteredGames.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = "No games found. Try another search.",
                    fontSize = 13.sp,
                    color = GenieColors.TextSecondary,
                )
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(start = 24.dp, end = 24.dp, top = 16.dp, bottom = 24.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                items(filteredGames, key = { it.id }) { game ->
                    ProductCard(
                        game = game,
                        owned = ownedGames.contains(game.id),
                        onClick = { onGameClick(game.id) },
                        onBuy = { buyCandidate = game },
                    )
                }
            }
        }
    }

    val candidate = buyCandidate
    if (candidate != null) {
        PurchaseSheet(
            sheetState = sheetState,
            title = candidate.title,
            tagline = "Own this game forever",
            imageUrl = candidate.coverUrl,
            priceLabel = candidate.priceLabel,
            features = emptyList(),
            isPurchasing = purchasingId == candidate.id,
            onConfirm = { onPurchase(candidate.id) },
            onDismiss = { buyCandidate = null },
        )
    }
}

@Composable
private fun SearchField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val shape = RoundedCornerShape(12.dp)
    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(48.dp)
            .clip(shape)
            .background(GenieColors.Ivory)
            .border(1.dp, GenieColors.BorderLight, shape)
            .padding(horizontal = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(
            imageVector = Icons.Default.Search,
            contentDescription = null,
            tint = GenieColors.MaroonDark,
            modifier = Modifier.size(20.dp),
        )
        Spacer(modifier = Modifier.size(8.dp))
        Box(modifier = Modifier.weight(1f)) {
            if (value.isEmpty()) {
                Text(
                    text = "Search games...",
                    fontSize = 14.sp,
                    color = GenieColors.TextSecondary,
                )
            }
            BasicTextField(
                value = value,
                onValueChange = onValueChange,
                singleLine = true,
                textStyle = TextStyle(fontSize = 14.sp, color = GenieColors.TextPrimary),
                modifier = Modifier.fillMaxWidth(),
            )
        }
    }
}

@Composable
private fun CategoryChip(
    label: String,
    selected: Boolean,
    onClick: () -> Unit,
) {
    val shape = RoundedCornerShape(8.dp)
    Box(
        modifier = Modifier
            .height(36.dp)
            .clip(shape)
            .background(if (selected) GenieColors.Mint else GenieColors.Ivory)
            .border(1.dp, if (selected) GenieColors.Mint else GenieColors.BorderLight, shape)
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelMedium,
            color = GenieColors.TextPrimary,
        )
    }
}

@Composable
private fun ProductCard(
    game: Game,
    owned: Boolean,
    onClick: () -> Unit,
    onBuy: () -> Unit,
) {
    val shape = RoundedCornerShape(12.dp)
    Column(
        modifier = Modifier
            .clip(shape)
            .background(GenieColors.Ivory)
            .border(1.dp, GenieColors.BorderLight, shape)
            .clickable(onClick = onClick)
            .padding(12.dp),
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(1f)
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
        }
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = game.title,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            color = GenieColors.MaroonDark,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis,
        )
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            text = game.priceLabel,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = GenieColors.MaroonDark,
        )
        Text(
            text = "${game.starLabel} (${game.reviews})",
            fontSize = 12.sp,
            color = GenieColors.GoldDeep,
        )
        Spacer(modifier = Modifier.height(8.dp))
        GenieButton(
            text = if (owned) "✓ OWNED" else "BUY",
            onClick = onBuy,
            enabled = !owned,
            height = 40.dp,
            modifier = Modifier.fillMaxWidth(),
        )
    }
}
