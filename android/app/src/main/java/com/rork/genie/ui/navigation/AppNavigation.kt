package com.rork.genie.ui.navigation

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PlayCircle
import androidx.compose.material.icons.filled.Storefront
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.rork.genie.GenieViewModel
import com.rork.genie.data.GameRepository
import com.rork.genie.data.ModeContentRepository
import com.rork.genie.ui.screens.AboutGameScreen
import com.rork.genie.ui.screens.AccountDetailsScreen
import com.rork.genie.ui.screens.CatalogueScreen
import com.rork.genie.ui.screens.FirstRoundScreen
import com.rork.genie.ui.screens.GameDetailScreen
import com.rork.genie.ui.screens.HelpSupportScreen
import com.rork.genie.ui.screens.HowToPlayScreen
import com.rork.genie.ui.screens.MarketScreen
import com.rork.genie.ui.screens.NotificationsSettingsScreen
import com.rork.genie.ui.screens.NowPlayingScreen
import com.rork.genie.ui.screens.PaymentMethodsScreen
import com.rork.genie.ui.screens.ProfileScreen
import com.rork.genie.ui.screens.ScoringScreen
import com.rork.genie.ui.screens.SetupGuideScreen
import com.rork.genie.ui.screens.WelcomeScreen
import com.rork.genie.ui.theme.GenieColors

object Routes {
    const val WELCOME = "welcome"
    const val HOME = "home"
    const val MARKET = "market"
    const val NOW_PLAYING = "now_playing"
    const val PROFILE = "profile"
    const val GAME_DETAIL = "game/{gameId}"
    const val MODE_ABOUT = "playing/about/{gameId}"
    const val MODE_HOW_TO_PLAY = "playing/how/{gameId}"
    const val MODE_SETUP = "playing/setup/{gameId}"
    const val MODE_FIRST_ROUND = "playing/first/{gameId}"
    const val MODE_SCORING = "playing/scoring/{gameId}"
    const val ACCOUNT_DETAILS = "profile/details"
    const val PAYMENT_METHODS = "profile/payment"
    const val NOTIFICATION_SETTINGS = "profile/notifications"
    const val HELP_SUPPORT = "profile/help"

    fun gameDetail(gameId: String) = "game/$gameId"

    fun mode(modeId: String, gameId: String): String = when (modeId) {
        "about" -> "playing/about/$gameId"
        "how_to_play" -> "playing/how/$gameId"
        "setup" -> "playing/setup/$gameId"
        "first_round" -> "playing/first/$gameId"
        else -> "playing/scoring/$gameId"
    }
}

private data class TabItem(val route: String, val label: String, val icon: ImageVector)

private val tabs = listOf(
    TabItem(Routes.HOME, "Home", Icons.Default.Home),
    TabItem(Routes.MARKET, "Catalogue", Icons.Default.Storefront),
    TabItem(Routes.NOW_PLAYING, "Now Playing", Icons.Default.PlayCircle),
    TabItem(Routes.PROFILE, "Profile", Icons.Default.Person),
)

@Composable
fun AppNavigation() {
    val viewModel: GenieViewModel = viewModel()
    val navController = rememberNavController()

    val ownedGames by viewModel.ownedGames.collectAsStateWithLifecycle()
    val purchasingId by viewModel.purchasingId.collectAsStateWithLifecycle()
    val narratorVoice by viewModel.narratorVoice.collectAsStateWithLifecycle()
    val autoplayNarration by viewModel.autoplayNarration.collectAsStateWithLifecycle()
    val notificationPrefs by viewModel.notificationPrefs.collectAsStateWithLifecycle()
    val purchaseCompletedId by viewModel.purchaseCompleted
        .collectAsState(initial = null)

    // Read once so the start destination doesn't flip mid-session.
    val startDestination = remember {
        if (viewModel.welcomeSeen.value) Routes.HOME else Routes.WELCOME
    }

    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route
    // Immersive gameplay screens and Welcome hide the tab bar.
    val immersiveRoutes = setOf(
        Routes.WELCOME,
        Routes.MODE_ABOUT,
        Routes.MODE_SETUP,
        Routes.MODE_FIRST_ROUND,
    )
    val showTabBar = currentRoute != null && currentRoute !in immersiveRoutes

    Column(modifier = Modifier.fillMaxSize().background(GenieColors.Cream)) {
        Box(modifier = Modifier.weight(1f)) {
            NavHost(
                navController = navController,
                startDestination = startDestination,
            ) {
                composable(Routes.WELCOME) {
                    WelcomeScreen(
                        onGetStarted = {
                            viewModel.completeWelcome()
                            navController.navigate(Routes.HOME) {
                                popUpTo(Routes.WELCOME) { inclusive = true }
                            }
                        }
                    )
                }
                composable(Routes.HOME) {
                    CatalogueScreen(
                        ownedGames = ownedGames,
                        onGameClick = { gameId ->
                            navController.navigate(Routes.gameDetail(gameId))
                        },
                        onShopClick = { navController.navigateToTab(Routes.MARKET) },
                    )
                }
                composable(Routes.MARKET) {
                    MarketScreen(
                        ownedGames = ownedGames,
                        purchasingId = purchasingId,
                        purchaseCompletedId = purchaseCompletedId,
                        onGameClick = { gameId ->
                            navController.navigate(Routes.gameDetail(gameId))
                        },
                        onPurchase = { gameId -> viewModel.purchase(gameId) },
                    )
                }
                composable(Routes.NOW_PLAYING) {
                    NowPlayingScreen(
                        ownedGames = ownedGames,
                        onOpenMode = { gameId, modeId ->
                            navController.navigate(Routes.mode(modeId, gameId))
                        },
                        onBrowseGames = { navController.navigateToTab(Routes.MARKET) },
                    )
                }
                composable(Routes.PROFILE) {
                    ProfileScreen(
                        ownedGames = ownedGames,
                        narratorVoice = narratorVoice,
                        autoplayNarration = autoplayNarration,
                        onNarratorVoiceChange = { viewModel.setNarratorVoice(it) },
                        onAutoplayChange = { viewModel.setAutoplayNarration(it) },
                        onGameClick = { gameId ->
                            navController.navigate(Routes.gameDetail(gameId))
                        },
                        onOpenAccountDetails = { navController.navigate(Routes.ACCOUNT_DETAILS) },
                        onOpenPaymentMethods = { navController.navigate(Routes.PAYMENT_METHODS) },
                        onOpenNotifications = { navController.navigate(Routes.NOTIFICATION_SETTINGS) },
                        onOpenHelp = { navController.navigate(Routes.HELP_SUPPORT) },
                        onLogOut = { navController.navigateToTab(Routes.HOME) },
                    )
                }
                composable(Routes.GAME_DETAIL) { entry ->
                    val gameId = entry.arguments?.getString("gameId")
                    val game = GameRepository.gameById(gameId)
                    if (game != null) {
                        GameDetailScreen(
                            game = game,
                            owned = ownedGames.contains(game.id),
                            purchasingId = purchasingId,
                            purchaseCompletedId = purchaseCompletedId,
                            onPurchase = { id -> viewModel.purchase(id) },
                            onOpenMode = { modeId ->
                                navController.navigate(Routes.mode(modeId, game.id))
                            },
                            onBack = { navController.popBackStack() },
                        )
                    }
                }
                composable(Routes.MODE_ABOUT) { entry ->
                    val gameId = entry.arguments?.getString("gameId")
                    val game = GameRepository.gameById(gameId)
                    if (game != null) {
                        AboutGameScreen(
                            game = game,
                            content = ModeContentRepository.contentFor(game.id),
                            onLearnToPlay = {
                                navController.navigate(Routes.mode("how_to_play", game.id))
                            },
                            onBack = { navController.popBackStack() },
                        )
                    }
                }
                composable(Routes.MODE_HOW_TO_PLAY) { entry ->
                    val gameId = entry.arguments?.getString("gameId")
                    val game = GameRepository.gameById(gameId)
                    if (game != null) {
                        HowToPlayScreen(
                            game = game,
                            content = ModeContentRepository.contentFor(game.id),
                            onPreviousMode = {
                                navController.navigate(Routes.mode("about", game.id))
                            },
                            onNextMode = {
                                navController.navigate(Routes.mode("setup", game.id))
                            },
                            onBack = { navController.popBackStack() },
                        )
                    }
                }
                composable(Routes.MODE_SETUP) { entry ->
                    val gameId = entry.arguments?.getString("gameId")
                    val game = GameRepository.gameById(gameId)
                    if (game != null) {
                        SetupGuideScreen(
                            game = game,
                            content = ModeContentRepository.contentFor(game.id),
                            onNextMode = {
                                navController.navigate(Routes.mode("first_round", game.id))
                            },
                            onBack = { navController.popBackStack() },
                        )
                    }
                }
                composable(Routes.MODE_FIRST_ROUND) { entry ->
                    val gameId = entry.arguments?.getString("gameId")
                    val game = GameRepository.gameById(gameId)
                    if (game != null) {
                        FirstRoundScreen(
                            game = game,
                            content = ModeContentRepository.contentFor(game.id),
                            onFinish = {
                                navController.navigate(Routes.mode("scoring", game.id))
                            },
                            onBack = { navController.popBackStack() },
                        )
                    }
                }
                composable(Routes.MODE_SCORING) { entry ->
                    val gameId = entry.arguments?.getString("gameId")
                    val game = GameRepository.gameById(gameId)
                    if (game != null) {
                        ScoringScreen(
                            game = game,
                            content = ModeContentRepository.contentFor(game.id),
                            onPlayAgain = { navController.navigateToTab(Routes.HOME) },
                            onBack = { navController.popBackStack() },
                        )
                    }
                }
                composable(Routes.ACCOUNT_DETAILS) {
                    AccountDetailsScreen(onBack = { navController.popBackStack() })
                }
                composable(Routes.PAYMENT_METHODS) {
                    PaymentMethodsScreen(onBack = { navController.popBackStack() })
                }
                composable(Routes.NOTIFICATION_SETTINGS) {
                    NotificationsSettingsScreen(
                        prefs = notificationPrefs,
                        onPrefChange = { key, enabled -> viewModel.setNotificationPref(key, enabled) },
                        onReset = { viewModel.resetNotificationPrefs() },
                        onBack = { navController.popBackStack() },
                    )
                }
                composable(Routes.HELP_SUPPORT) {
                    HelpSupportScreen(onBack = { navController.popBackStack() })
                }
            }
        }
        if (showTabBar) {
            GenieTabBar(
                currentRoute = currentRoute,
                onTabSelected = { route -> navController.navigateToTab(route) },
            )
        }
    }
}

private fun NavHostController.navigateToTab(route: String) {
    navigate(route) {
        popUpTo(graph.findStartDestination().id) { saveState = true }
        launchSingleTop = true
        restoreState = true
    }
}

@Composable
private fun GenieTabBar(
    currentRoute: String?,
    onTabSelected: (String) -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Brush.linearGradient(listOf(GenieColors.ChromeStart, GenieColors.ChromeEnd)))
    ) {
        HorizontalDivider(color = GenieColors.BorderLight)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(70.dp),
        ) {
            tabs.forEach { tab ->
                val active = when (tab.route) {
                    Routes.HOME -> currentRoute == Routes.HOME || currentRoute == Routes.GAME_DETAIL
                    Routes.NOW_PLAYING ->
                        currentRoute == Routes.NOW_PLAYING || currentRoute?.startsWith("playing/") == true
                    Routes.PROFILE ->
                        currentRoute == Routes.PROFILE || currentRoute?.startsWith("profile/") == true
                    else -> currentRoute == tab.route
                }
                val tint = GenieColors.MaroonDark
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxSize()
                        .alpha(if (active) 1f else 0.6f)
                        .background(if (active) GenieColors.ChromeStart else androidx.compose.ui.graphics.Color.Transparent, androidx.compose.foundation.shape.RoundedCornerShape(18.dp))
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                        ) { onTabSelected(tab.route) },
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Spacer(modifier = Modifier.height(12.dp))
                    Icon(
                        imageVector = tab.icon,
                        contentDescription = tab.label,
                        tint = tint,
                        modifier = Modifier.size(24.dp),
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = tab.label,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = tint,
                        maxLines = 1,
                    )
                }
            }
        }
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Brush.linearGradient(listOf(GenieColors.ChromeStart, GenieColors.ChromeEnd)))
                .navigationBarsPadding()
        )
    }
}
