package com.rork.genie.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.CreditCard
import androidx.compose.material.icons.filled.HelpOutline
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.rork.genie.data.GameRepository
import com.rork.genie.ui.components.GenieButton
import com.rork.genie.ui.components.GenieButtonVariant
import com.rork.genie.ui.components.GenieToggle
import com.rork.genie.ui.components.SectionLabel
import com.rork.genie.ui.theme.GenieColors

/** Screen 11: Profile — voice & narration settings, account links and owned games. */
@Composable
fun ProfileScreen(
    ownedGames: Set<String>,
    narratorVoice: String,
    autoplayNarration: Boolean,
    onNarratorVoiceChange: (String) -> Unit,
    onAutoplayChange: (Boolean) -> Unit,
    onGameClick: (String) -> Unit,
    onOpenAccountDetails: () -> Unit,
    onOpenPaymentMethods: () -> Unit,
    onOpenNotifications: () -> Unit,
    onOpenHelp: () -> Unit,
    onLogOut: () -> Unit,
) {
    val context = LocalContext.current
    val voices = remember { listOf("Kore", "Roger", "Tara") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(GenieColors.Cream)
    ) {
        // Soft identity header
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(Brush.linearGradient(listOf(GenieColors.ChromeStart, GenieColors.ChromeEnd)))
                .statusBarsPadding()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp, vertical = 18.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .clip(CircleShape)
                        .background(GenieColors.Gold),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        text = "AR",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = GenieColors.MaroonDark,
                    )
                }
                Spacer(modifier = Modifier.width(14.dp))
                Column {
                    Text(
                        text = "Alex Rivera",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = GenieColors.TextPrimary,
                    )
                    Text(
                        text = "Member since 2024 · ${ownedGames.size} game${if (ownedGames.size == 1) "" else "s"} owned",
                        fontSize = 12.sp,
                        color = GenieColors.TextSecondary,
                    )
                }
            }
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp),
        ) {
            Spacer(modifier = Modifier.height(20.dp))
            SectionLabel(text = "Voice & narration")
            Spacer(modifier = Modifier.height(8.dp))
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(GenieColors.Ivory, RoundedCornerShape(12.dp))
                    .border(1.dp, GenieColors.BorderLight, RoundedCornerShape(12.dp))
                    .padding(16.dp),
            ) {
                Text(
                    text = "🎙  Narrator voice",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = GenieColors.MaroonDark,
                )
                Spacer(modifier = Modifier.height(10.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    voices.forEach { voice ->
                        val selected = voice == narratorVoice
                        Box(
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(if (selected) GenieColors.Mint else GenieColors.Cream)
                                .border(
                                    1.dp,
                                    if (selected) GenieColors.Mint else GenieColors.BorderLight,
                                    CircleShape,
                                )
                                .clickable(
                                    interactionSource = remember { MutableInteractionSource() },
                                    indication = null,
                                ) { onNarratorVoiceChange(voice) }
                                .padding(horizontal = 18.dp, vertical = 8.dp),
                        ) {
                            Text(
                                text = voice,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = GenieColors.TextPrimary,
                            )
                        }
                    }
                }
            }
            Spacer(modifier = Modifier.height(10.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(GenieColors.Ivory, RoundedCornerShape(12.dp))
                    .border(1.dp, GenieColors.BorderLight, RoundedCornerShape(12.dp))
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "▶  Autoplay narration",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = GenieColors.MaroonDark,
                    )
                    Text(
                        text = "Genie starts reading each mode aloud",
                        fontSize = 12.sp,
                        color = GenieColors.TextSecondary,
                    )
                }
                GenieToggle(checked = autoplayNarration, onCheckedChange = onAutoplayChange)
            }

            Spacer(modifier = Modifier.height(24.dp))
            SectionLabel(text = "Account")
            Spacer(modifier = Modifier.height(8.dp))
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(GenieColors.Ivory, RoundedCornerShape(12.dp))
                    .border(1.dp, GenieColors.BorderLight, RoundedCornerShape(12.dp)),
            ) {
                AccountRow(icon = Icons.Default.Person, label = "Account details", onClick = onOpenAccountDetails)
                RowDivider()
                AccountRow(icon = Icons.Default.CreditCard, label = "Payment methods", onClick = onOpenPaymentMethods)
                RowDivider()
                AccountRow(icon = Icons.Default.Notifications, label = "Notifications", onClick = onOpenNotifications)
                RowDivider()
                AccountRow(icon = Icons.Default.HelpOutline, label = "Help & support", onClick = onOpenHelp)
            }

            Spacer(modifier = Modifier.height(24.dp))
            SectionLabel(text = "Your games")
            Spacer(modifier = Modifier.height(8.dp))
            GameRepository.games.forEach { game ->
                val owned = ownedGames.contains(game.id)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 10.dp)
                        .background(GenieColors.Ivory, RoundedCornerShape(12.dp))
                        .border(1.dp, GenieColors.BorderLight, RoundedCornerShape(12.dp))
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                        ) { onGameClick(game.id) }
                        .padding(10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
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
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = game.title,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = GenieColors.MaroonDark,
                        )
                        Text(
                            text = game.description,
                            fontSize = 11.sp,
                            color = GenieColors.TextSecondary,
                            maxLines = 1,
                        )
                    }
                    if (owned) {
                        Text(
                            text = "OWNED",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.sp,
                            color = GenieColors.MaroonDark,
                            modifier = Modifier
                                .background(GenieColors.Gold, CircleShape)
                                .padding(horizontal = 10.dp, vertical = 4.dp),
                        )
                    } else {
                        Text(
                            text = game.priceLabel,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = GenieColors.TextSecondary,
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))
            GenieButton(
                text = "Log out",
                onClick = {
                    Toast.makeText(context, "Logged out", Toast.LENGTH_SHORT).show()
                    onLogOut()
                },
                variant = GenieButtonVariant.Outline,
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
private fun AccountRow(
    icon: ImageVector,
    label: String,
    onClick: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onClick,
            )
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = GenieColors.GoldDeep,
            modifier = Modifier.size(20.dp),
        )
        Spacer(modifier = Modifier.width(12.dp))
        Text(
            text = label,
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = GenieColors.MaroonDark,
            modifier = Modifier.weight(1f),
        )
        Icon(
            imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
            contentDescription = null,
            tint = GenieColors.TextSecondary,
            modifier = Modifier.size(20.dp),
        )
    }
}

@Composable
private fun RowDivider() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .height(1.dp)
            .background(GenieColors.BorderLight)
    )
}
