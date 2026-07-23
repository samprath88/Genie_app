package com.rork.genie.data

import android.content.Context
import android.content.SharedPreferences

/** Local persistence for welcome flag, mock purchases and user preferences (MVP, single device). */
class PurchaseStore(context: Context) {

    private val prefs: SharedPreferences =
        context.getSharedPreferences("genie_prefs", Context.MODE_PRIVATE)

    fun isWelcomeSeen(): Boolean = prefs.getBoolean(KEY_WELCOME_SEEN, false)

    fun setWelcomeSeen() {
        prefs.edit().putBoolean(KEY_WELCOME_SEEN, true).apply()
    }

    fun ownedGames(): Set<String> =
        prefs.getStringSet(KEY_OWNED_GAMES, null) ?: GameRepository.defaultOwned

    fun saveOwnedGames(owned: Set<String>) {
        prefs.edit().putStringSet(KEY_OWNED_GAMES, owned).apply()
    }

    fun narratorVoice(): String = prefs.getString(KEY_NARRATOR_VOICE, "Kore") ?: "Kore"

    fun saveNarratorVoice(voice: String) {
        prefs.edit().putString(KEY_NARRATOR_VOICE, voice).apply()
    }

    fun autoplayNarration(): Boolean = prefs.getBoolean(KEY_AUTOPLAY, true)

    fun saveAutoplayNarration(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_AUTOPLAY, enabled).apply()
    }

    fun notificationPrefs(): Map<String, Boolean> =
        NOTIFICATION_KEYS.associateWith { prefs.getBoolean("notif_$it", true) }

    fun saveNotificationPref(key: String, enabled: Boolean) {
        prefs.edit().putBoolean("notif_$key", enabled).apply()
    }

    fun resetNotificationPrefs() {
        val editor = prefs.edit()
        NOTIFICATION_KEYS.forEach { editor.putBoolean("notif_$it", true) }
        editor.apply()
    }

    companion object {
        val NOTIFICATION_KEYS = listOf("games", "voice", "digest", "push")
        private const val KEY_WELCOME_SEEN = "welcome_seen"
        private const val KEY_OWNED_GAMES = "owned_games"
        private const val KEY_NARRATOR_VOICE = "narrator_voice"
        private const val KEY_AUTOPLAY = "autoplay_narration"
    }
}
