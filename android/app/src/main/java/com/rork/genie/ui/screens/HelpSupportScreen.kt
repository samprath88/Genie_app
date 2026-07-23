package com.rork.genie.ui.screens

import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateContentSize
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rork.genie.ui.components.GenieButton
import com.rork.genie.ui.components.GenieButtonVariant
import com.rork.genie.ui.components.GenieHeader
import com.rork.genie.ui.components.SectionLabel
import com.rork.genie.ui.theme.GenieColors

private data class Faq(val question: String, val answer: String)

/** Screen 12d: Help & Support — expandable FAQs plus contact actions. */
@Composable
fun HelpSupportScreen(onBack: () -> Unit) {
    val context = LocalContext.current
    var expandedIndex by remember { mutableIntStateOf(-1) }
    val faqs = listOf(
        Faq(
            "How do I unlock a game?",
            "Games unlock with a one-time purchase. Tap \"Unlock\" on any feature card and follow the prompts — every Genie mode opens instantly.",
        ),
        Faq(
            "Can I play offline?",
            "Yes! Download content while connected and Genie's guides work anywhere your game night takes you.",
        ),
        Faq(
            "What if Genie doesn't understand my question?",
            "Rephrase your question or use the predefined buttons. If issues persist, contact support and we'll take a look.",
        ),
        Faq(
            "Is my data saved?",
            "Yes. Your purchases, settings and game progress are stored on this device, and sync across devices when logged in.",
        ),
        Faq(
            "How often is new content added?",
            "We add new games monthly. Check the Market tab for the latest releases.",
        ),
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(GenieColors.Cream)
    ) {
        GenieHeader(title = "Help & Support", onBack = onBack)
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp),
        ) {
            Spacer(modifier = Modifier.height(20.dp))
            SectionLabel(text = "Frequently asked questions")
            Spacer(modifier = Modifier.height(8.dp))
            faqs.forEachIndexed { index, faq ->
                val expanded = expandedIndex == index
                val chevronRotation by animateFloatAsState(
                    targetValue = if (expanded) 180f else 0f,
                    label = "faqChevron",
                )
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 10.dp)
                        .background(GenieColors.Ivory, RoundedCornerShape(12.dp))
                        .border(1.dp, GenieColors.BorderLight, RoundedCornerShape(12.dp))
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                        ) { expandedIndex = if (expanded) -1 else index }
                        .animateContentSize()
                        .padding(16.dp),
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = faq.question,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = GenieColors.MaroonDark,
                            modifier = Modifier.weight(1f),
                        )
                        Icon(
                            imageVector = Icons.Default.KeyboardArrowDown,
                            contentDescription = if (expanded) "Collapse" else "Expand",
                            tint = GenieColors.GoldDeep,
                            modifier = Modifier
                                .size(20.dp)
                                .rotate(chevronRotation),
                        )
                    }
                    AnimatedVisibility(
                        visible = expanded,
                        enter = expandVertically() + fadeIn(),
                        exit = shrinkVertically() + fadeOut(),
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(top = 10.dp)
                                .background(GenieColors.Cream, RoundedCornerShape(8.dp))
                                .border(1.dp, GenieColors.BorderLight, RoundedCornerShape(8.dp))
                                .padding(12.dp),
                        ) {
                            Text(
                                text = faq.answer,
                                fontSize = 13.sp,
                                lineHeight = 19.sp,
                                color = GenieColors.TextPrimary,
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))
            SectionLabel(text = "Contact & feedback")
            Spacer(modifier = Modifier.height(8.dp))
            GenieButton(
                text = "✉  Email support",
                onClick = {
                    val intent = Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:support@genie.app"))
                    runCatching { context.startActivity(intent) }
                        .onFailure {
                            Toast.makeText(context, "No email app found", Toast.LENGTH_SHORT).show()
                        }
                },
                variant = GenieButtonVariant.Secondary,
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(modifier = Modifier.height(10.dp))
            GenieButton(
                text = "📄  View documentation",
                onClick = {
                    Toast.makeText(context, "Documentation coming soon", Toast.LENGTH_SHORT).show()
                },
                variant = GenieButtonVariant.Secondary,
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(modifier = Modifier.height(10.dp))
            GenieButton(
                text = "💬  Send feedback",
                onClick = {
                    Toast.makeText(context, "Thanks! Feedback form coming in Phase 4", Toast.LENGTH_SHORT).show()
                },
                variant = GenieButtonVariant.Secondary,
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
