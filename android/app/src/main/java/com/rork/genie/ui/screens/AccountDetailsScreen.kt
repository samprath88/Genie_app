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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.genie.ui.components.GenieButton
import com.rork.genie.ui.components.GenieButtonVariant
import com.rork.genie.ui.components.GenieHeader
import com.rork.genie.ui.components.SectionLabel
import com.rork.genie.ui.theme.GenieColors

/** Screen 12a: Account Details — personal info and subscription tier (MVP mock). */
@Composable
fun AccountDetailsScreen(onBack: () -> Unit) {
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(GenieColors.Cream)
    ) {
        GenieHeader(title = "Account Details", onBack = onBack)
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp),
        ) {
            Spacer(modifier = Modifier.height(20.dp))
            SectionLabel(text = "Personal information")
            Spacer(modifier = Modifier.height(8.dp))
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(GenieColors.Ivory, RoundedCornerShape(12.dp))
                    .border(1.dp, GenieColors.BorderLight, RoundedCornerShape(12.dp))
                    .padding(16.dp),
            ) {
                InfoRow(label = "Name", value = "Alex Rivera")
                Spacer(modifier = Modifier.height(12.dp))
                InfoRow(label = "Email", value = "alex.rivera@example.com")
                Spacer(modifier = Modifier.height(12.dp))
                InfoRow(label = "Member since", value = "July 2024")
                Spacer(modifier = Modifier.height(16.dp))
                GenieButton(
                    text = "Edit profile",
                    onClick = {
                        Toast.makeText(context, "Profile editing coming in Phase 4", Toast.LENGTH_SHORT).show()
                    },
                    variant = GenieButtonVariant.Secondary,
                    height = 40.dp,
                    modifier = Modifier.fillMaxWidth(),
                )
            }

            Spacer(modifier = Modifier.height(24.dp))
            SectionLabel(text = "Subscription tier")
            Spacer(modifier = Modifier.height(8.dp))
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(GenieColors.Ivory, RoundedCornerShape(12.dp))
                    .border(1.dp, GenieColors.BorderLight, RoundedCornerShape(12.dp))
                    .padding(16.dp),
            ) {
                InfoRow(label = "Tier", value = "Free")
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "No active plan — games are one-time purchases",
                    fontSize = 12.sp,
                    color = GenieColors.TextSecondary,
                )
                Spacer(modifier = Modifier.height(16.dp))
                GenieButton(
                    text = "View plans",
                    onClick = {
                        Toast.makeText(context, "Plans coming soon", Toast.LENGTH_SHORT).show()
                    },
                    height = 40.dp,
                    modifier = Modifier.fillMaxWidth(),
                )
            }
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
private fun InfoRow(label: String, value: String) {
    Row(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = label,
            fontSize = 13.sp,
            color = GenieColors.TextSecondary,
            modifier = Modifier.weight(1f),
        )
        Text(
            text = value,
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = GenieColors.MaroonDark,
        )
    }
}
