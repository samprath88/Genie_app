package com.rork.genie

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.rork.genie.data.PurchaseStore
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/** App-wide state: welcome flag, owned games, mock purchase flow and user preferences. */
class GenieViewModel(application: Application) : AndroidViewModel(application) {

    private val store = PurchaseStore(application)

    private val _welcomeSeen = MutableStateFlow(store.isWelcomeSeen())
    val welcomeSeen: StateFlow<Boolean> = _welcomeSeen.asStateFlow()

    private val _ownedGames = MutableStateFlow(store.ownedGames())
    val ownedGames: StateFlow<Set<String>> = _ownedGames.asStateFlow()

    /** Game id currently being "purchased" (spinner state), or null. */
    private val _purchasingId = MutableStateFlow<String?>(null)
    val purchasingId: StateFlow<String?> = _purchasingId.asStateFlow()

    /** Emits the game id after a successful mock purchase (drives success toast + sheet dismiss). */
    private val _purchaseCompleted = MutableSharedFlow<String>()
    val purchaseCompleted: SharedFlow<String> = _purchaseCompleted.asSharedFlow()

    private val _narratorVoice = MutableStateFlow(store.narratorVoice())
    val narratorVoice: StateFlow<String> = _narratorVoice.asStateFlow()

    private val _autoplayNarration = MutableStateFlow(store.autoplayNarration())
    val autoplayNarration: StateFlow<Boolean> = _autoplayNarration.asStateFlow()

    private val _notificationPrefs = MutableStateFlow(store.notificationPrefs())
    val notificationPrefs: StateFlow<Map<String, Boolean>> = _notificationPrefs.asStateFlow()

    fun completeWelcome() {
        store.setWelcomeSeen()
        _welcomeSeen.value = true
    }

    fun isOwned(gameId: String): Boolean = _ownedGames.value.contains(gameId)

    /** Simulates a 1.5s payment, then persists ownership locally. */
    fun purchase(gameId: String) {
        if (_purchasingId.value != null || isOwned(gameId)) return
        viewModelScope.launch {
            _purchasingId.value = gameId
            delay(1500)
            val updated = _ownedGames.value + gameId
            _ownedGames.value = updated
            store.saveOwnedGames(updated)
            _purchasingId.value = null
            _purchaseCompleted.emit(gameId)
        }
    }

    fun setNarratorVoice(voice: String) {
        _narratorVoice.value = voice
        store.saveNarratorVoice(voice)
    }

    fun setAutoplayNarration(enabled: Boolean) {
        _autoplayNarration.value = enabled
        store.saveAutoplayNarration(enabled)
    }

    fun setNotificationPref(key: String, enabled: Boolean) {
        _notificationPrefs.value = _notificationPrefs.value + (key to enabled)
        store.saveNotificationPref(key, enabled)
    }

    fun resetNotificationPrefs() {
        store.resetNotificationPrefs()
        _notificationPrefs.value = store.notificationPrefs()
    }
}
