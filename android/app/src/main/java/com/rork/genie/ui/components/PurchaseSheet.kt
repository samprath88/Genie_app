package com.rork.genie.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.SheetState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.rork.genie.ui.theme.GenieColors

/**
 * Bottom-sheet purchase confirmation used by both the Marketplace BUY flow
 * and the Game Detail UNLOCK/paywall flow (features list shown when provided).
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PurchaseSheet(
    sheetState: SheetState,
    title: String,
    tagline: String,
    imageUrl: String,
    priceLabel: String,
    features: List<String>,
    isPurchasing: Boolean,
    onConfirm: () -> Unit,
    onDismiss: () -> Unit,
) {
    ModalBottomSheet(
        onDismissRequest = { if (!isPurchasing) onDismiss() },
        sheetState = sheetState,
        containerColor = GenieColors.Ivory,
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp)
                .navigationBarsPadding()
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleLarge,
                color = GenieColors.MaroonDark,
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = tagline,
                fontSize = 12.sp,
                color = GenieColors.TextSecondary,
            )
            Spacer(modifier = Modifier.height(12.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(140.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(GenieColors.Cream)
            ) {
                AsyncImage(
                    model = imageUrl,
                    contentDescription = title,
                    contentScale = ContentScale.Crop,
                    alignment = Alignment.TopCenter,
                    modifier = Modifier.fillMaxSize(),
                )
            }
            if (features.isNotEmpty()) {
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "WHAT YOU'LL GET",
                    style = MaterialTheme.typography.labelMedium,
                    color = GenieColors.TextSecondary,
                )
                Spacer(modifier = Modifier.height(8.dp))
                features.forEach { feature ->
                    Row(
                        modifier = Modifier.padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            text = "✓",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = GenieColors.GoldDeep,
                        )
                        Text(
                            text = feature,
                            fontSize = 13.sp,
                            color = GenieColors.TextPrimary,
                            modifier = Modifier.padding(start = 10.dp),
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
            HorizontalDivider(color = GenieColors.BorderLight)
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = priceLabel,
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                color = GenieColors.GoldDeep,
            )
            Text(
                text = "One-time purchase • Lifetime access",
                fontSize = 12.sp,
                color = GenieColors.TextSecondary,
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "🔒 Secure payment • Your data is protected",
                fontSize = 12.sp,
                color = GenieColors.TextSecondary,
            )
            Spacer(modifier = Modifier.height(20.dp))
            GenieButton(
                text = "Confirm Purchase",
                onClick = onConfirm,
                loading = isPurchasing,
                height = 52.dp,
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(modifier = Modifier.height(10.dp))
            GenieButton(
                text = "Cancel",
                onClick = onDismiss,
                variant = GenieButtonVariant.Outline,
                enabled = !isPurchasing,
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
