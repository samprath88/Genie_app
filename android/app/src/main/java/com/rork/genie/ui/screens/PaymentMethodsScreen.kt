package com.rork.genie.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.genie.ui.components.GenieButton
import com.rork.genie.ui.components.GenieButtonVariant
import com.rork.genie.ui.components.GenieHeader
import com.rork.genie.ui.components.SectionLabel
import com.rork.genie.ui.theme.GenieColors

private data class MockCard(
    val brand: String,
    val last4: String,
    val expires: String,
    val isDefault: Boolean,
    val gradient: List<Color>,
)

private data class MockPurchase(
    val title: String,
    val date: String,
    val price: String,
)

/** Screen 12b: Payment Methods & Billing — card visuals and purchase history (MVP mock). */
@Composable
fun PaymentMethodsScreen(onBack: () -> Unit) {
    val context = LocalContext.current
    val cards = listOf(
        MockCard(
            brand = "Visa",
            last4 = "4242",
            expires = "Expires 08/27",
            isDefault = true,
            gradient = listOf(GenieColors.VisaBlue, Color(0xFF14355F)),
        ),
        MockCard(
            brand = "Mastercard",
            last4 = "8813",
            expires = "Expires 11/28",
            isDefault = false,
            gradient = listOf(GenieColors.MaroonLight, GenieColors.MaroonDark),
        ),
    )
    val purchases = listOf(
        MockPurchase("Catan", "14 May 2026", "£8.99"),
        MockPurchase("Wingspan", "2 Mar 2026", "£8.99"),
        MockPurchase("Pandemic", "10 Jan 2026", "£6.99"),
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(GenieColors.Cream)
    ) {
        GenieHeader(title = "Payment Methods", subtitle = "Cards & billing", onBack = onBack)
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp),
        ) {
            Spacer(modifier = Modifier.height(20.dp))
            SectionLabel(text = "Your cards")
            Spacer(modifier = Modifier.height(8.dp))
            cards.forEach { card ->
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp)
                        .background(
                            Brush.linearGradient(card.gradient),
                            RoundedCornerShape(16.dp),
                        )
                        .padding(18.dp),
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            text = card.brand,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            modifier = Modifier.weight(1f),
                        )
                        if (card.isDefault) {
                            Text(
                                text = "DEFAULT",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp,
                                color = GenieColors.MaroonDark,
                                modifier = Modifier
                                    .background(GenieColors.Gold, CircleShape)
                                    .padding(horizontal = 10.dp, vertical = 4.dp),
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(18.dp))
                    Text(
                        text = "••••  ••••  ••••  ${card.last4}",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold,
                        letterSpacing = 2.sp,
                        color = Color.White,
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = card.expires,
                        fontSize = 12.sp,
                        color = Color.White.copy(alpha = 0.7f),
                    )
                }
            }
            GenieButton(
                text = "+  Add payment method",
                onClick = {
                    Toast.makeText(context, "Adding cards is coming in Phase 4", Toast.LENGTH_SHORT).show()
                },
                variant = GenieButtonVariant.Secondary,
                modifier = Modifier.fillMaxWidth(),
            )

            Spacer(modifier = Modifier.height(24.dp))
            SectionLabel(text = "Billing history")
            Spacer(modifier = Modifier.height(8.dp))
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(GenieColors.Ivory, RoundedCornerShape(12.dp))
                    .border(1.dp, GenieColors.BorderLight, RoundedCornerShape(12.dp)),
            ) {
                purchases.forEachIndexed { index, purchase ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = purchase.title,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = GenieColors.MaroonDark,
                            )
                            Text(
                                text = purchase.date,
                                fontSize = 11.sp,
                                color = GenieColors.TextSecondary,
                            )
                        }
                        Text(
                            text = purchase.price,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = GenieColors.GoldDeep,
                        )
                    }
                    if (index < purchases.size - 1) {
                        Spacer(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp)
                                .height(1.dp)
                                .background(GenieColors.BorderLight)
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
