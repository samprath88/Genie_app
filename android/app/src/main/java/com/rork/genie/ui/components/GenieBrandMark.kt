package com.rork.genie.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.rork.genie.R
import com.rork.genie.ui.theme.GenieColors

/** Compact Genie brand mark used wherever a little recognition cue is helpful. */
@Composable
fun GenieBrandMark(
    size: Dp = 28.dp,
    modifier: Modifier = Modifier,
) {
    Box(
        modifier = modifier
            .size(size)
            .background(GenieColors.Cream, CircleShape)
            .padding(size * 0.12f),
        contentAlignment = Alignment.Center,
    ) {
        Image(
            painter = painterResource(R.drawable.genie_logo),
            contentDescription = "Genie",
            contentScale = ContentScale.Fit,
            modifier = Modifier.size(size * 0.76f),
        )
    }
}
