package com.rork.genie.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/** Calm, light Genie design system palette. */
object GenieColors {
    val MaroonDark = Color(0xFF3A5245)
    val MaroonMid = Color(0xFFA8D5BA)
    val MaroonLight = Color(0xFFD4E8DC)
    val Gold = Color(0xFFD4AF8A)
    val GoldDeep = Color(0xFF3A5245)
    val Cream = Color(0xFFFAFAF8)
    val Ivory = Color(0xFFFFFBF6)
    val TextPrimary = Color(0xFF3A4A42)
    val TextSecondary = Color(0xFF7A8A82)
    val BorderLight = Color(0xFFE0E8E4)
    val ImageOverlay = Color(0x403A4A42)
    val Mint = Color(0xFFA8D5BA)
    val Lavender = Color(0xFFE8DFE8)
    val Blush = Color(0xFFE8D4C4)
    val ChromeStart = Color(0xFFD4E8DC)
    val ChromeEnd = Color(0xFFE8DFE8)

    // Retained names keep immersive flows structurally identical while using the light treatment.
    val Espresso = Cream
    val EspressoPanel = Ivory
    val NightBorder = BorderLight
    val VisaBlue = Color(0xFF1F4E8C)
}

private val GenieColorScheme = lightColorScheme(
    primary = GenieColors.MaroonDark,
    onPrimary = GenieColors.Cream,
    primaryContainer = GenieColors.Mint,
    onPrimaryContainer = GenieColors.TextPrimary,
    secondary = GenieColors.Gold,
    onSecondary = GenieColors.TextPrimary,
    secondaryContainer = GenieColors.Mint,
    onSecondaryContainer = GenieColors.TextPrimary,
    background = GenieColors.Cream,
    onBackground = GenieColors.TextPrimary,
    surface = GenieColors.Ivory,
    onSurface = GenieColors.TextPrimary,
    surfaceVariant = GenieColors.Cream,
    onSurfaceVariant = GenieColors.TextSecondary,
    outline = GenieColors.BorderLight,
    outlineVariant = GenieColors.BorderLight,
)

private val GenieTypography = Typography(
    headlineLarge = TextStyle(fontSize = 28.sp, fontWeight = FontWeight.Bold),
    headlineMedium = TextStyle(fontSize = 24.sp, fontWeight = FontWeight.Bold),
    titleLarge = TextStyle(fontSize = 18.sp, fontWeight = FontWeight.Bold),
    titleMedium = TextStyle(fontSize = 16.sp, fontWeight = FontWeight.Bold),
    bodyMedium = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.Normal, lineHeight = 21.sp),
    bodySmall = TextStyle(fontSize = 12.sp, fontWeight = FontWeight.Normal, lineHeight = 17.sp),
    labelMedium = TextStyle(fontSize = 12.sp, fontWeight = FontWeight.SemiBold, letterSpacing = 0.5.sp),
    labelSmall = TextStyle(fontSize = 11.sp, fontWeight = FontWeight.SemiBold, letterSpacing = 0.5.sp),
)

@Composable
fun AppTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = GenieColorScheme,
        typography = GenieTypography,
        content = content
    )
}
