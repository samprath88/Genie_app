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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.genie.ui.components.GenieButton
import com.rork.genie.ui.components.GenieButtonVariant
import com.rork.genie.ui.components.GenieToggle
import com.rork.genie.ui.components.GenieHeader
import com.rork.genie.ui.theme.GenieColors

private data class NotificationOption(
    val key: String,
    val title: String,
    val subtitle: String,
)

/** Screen 12c: Notification preferences with persisted toggles. */
@Composable
fun NotificationsSettingsScreen(
    prefs: Map<String, Boolean>,
    onPrefChange: (String, Boolean) -> Unit,
    onReset: () -> Unit,
    onBack: () -> Unit,
) {
    val context = LocalContext.current
    val options = listOf(
        NotificationOption("games", "Game notifications", "Get alerts when new games arrive"),
        NotificationOption("voice", "Voice announcements", "Hear game prompts read aloud"),
        NotificationOption("digest", "Daily digest", "Email summary at 9am"),
        NotificationOption("push", "Push notifications", "Reminders for active games"),
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(GenieColors.Cream)
    ) {
        GenieHeader(title = "Notifications", onBack = onBack)
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp),
        ) {
            Spacer(modifier = Modifier.height(20.dp))
            options.forEach { option ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp)
                        .background(GenieColors.Ivory, RoundedCornerShape(12.dp))
                        .border(1.dp, GenieColors.BorderLight, RoundedCornerShape(12.dp))
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = option.title,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = GenieColors.MaroonDark,
                        )
                        Text(
                            text = option.subtitle,
                            fontSize = 12.sp,
                            color = GenieColors.TextSecondary,
                        )
                    }
                    GenieToggle(
                        checked = prefs[option.key] ?: true,
                        onCheckedChange = { onPrefChange(option.key, it) },
                    )
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
            GenieButton(
                text = "Reset to defaults",
                onClick = {
                    onReset()
                    Toast.makeText(context, "Notification settings reset", Toast.LENGTH_SHORT).show()
                },
                variant = GenieButtonVariant.Outline,
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
