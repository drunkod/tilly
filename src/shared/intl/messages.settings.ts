import { messages, translate } from "@ccssmnn/intl"

export { baseSettingsMessages, deSettingsMessages, ruSettingsMessages }

const baseSettingsMessages = messages({
	// Settings page messages
	"settings.title": "Settings",
	"settings.pageTitle": "Settings - Tilly",
	"settings.auth.title": "Authentication",
	"settings.auth.description.signedIn":
		"Manage your account settings, change email/password, or sign out.",
	"settings.auth.description.signedOut.online":
		"Sign in to sync your relationships and enable Tilly across all your devices.",
	"settings.auth.description.signedOut.offline":
		"Sign in requires an internet connection to sync your data across devices.",
	"settings.auth.status.label": "Status",
	"settings.auth.status.signedIn": "Signed in as {$email}",
	"settings.auth.status.signedOut": "Not signed in",
	"settings.auth.tier.label": "Plan",
	"settings.auth.tier.plus": "Tilly Plus",
	"settings.auth.tier.free": "Free",
	"settings.auth.requiresInternet":
		"Account features require internet connection",
	"settings.auth.offlineDescription":
		"Please connect to the internet to sign in or manage your account.",
	"settings.auth.manageAccount": "Manage Account",
	"settings.auth.manageSubscription": "Manage Subscription",
	"settings.auth.signOut": "Sign Out",
	"settings.auth.status.authenticated": "Authenticated with passkey",
	"settings.auth.status.unauthenticated": "Not authenticated",
	"settings.auth.logout": "Log Out",
	"settings.auth.logout.error": "Failed to log out. Please try again.",
	"settings.auth.login": "Log In",
	"settings.auth.signup": "Sign Up",
	"settings.profile.title": "About You",
	"settings.profile.description": "Update your personal information.",
	"settings.profile.displayName.label": "Display Name",
	"settings.profile.displayName.placeholder": "No display name set",
	"settings.profile.displayName.change": "Change",
	"settings.profile.displayName.dialog.title": "Change Display Name",
	"settings.profile.displayName.current.label": "Current display name",
	"settings.profile.displayName.new.label": "New display name",
	"settings.profile.displayName.new.placeholder": "Enter your name",
	"settings.profile.displayName.new.description":
		"This is the name that will be displayed in your profile",
	"settings.profile.displayName.new.required": "Name is required.",
	"settings.profile.displayName.cancel": "Cancel",
	"settings.profile.displayName.save": "Save",
	"settings.agent.title": "AI Assistant",
	"settings.agent.description":
		"Configure your AI assistant and view usage statistics.",
	"settings.agent.displayName.label": "Your Name",
	"settings.agent.displayName.placeholder": "No name set",
	"settings.agent.displayName.change": "Change",
	"settings.agent.displayName.dialog.title": "Change Your Name",
	"settings.agent.displayName.current.label": "Current name",
	"settings.agent.displayName.new.label": "New name",
	"settings.agent.displayName.new.placeholder": "Enter your name",
	"settings.agent.displayName.new.description":
		"This is the name Tilly will use to address you in conversations",
	"settings.agent.displayName.cancel": "Cancel",
	"settings.agent.displayName.save": "Save",
	"settings.agent.usage.title": "Usage",
	"settings.agent.usage.budget.label": "Usage this cycle",
	"settings.agent.usage.budget.reset": "Resets on {$date}",
	"settings.data.title": "Your Data",
	"settings.data.description":
		"Export, import, or manage your relationship notes.",
	"settings.data.export.label": "Export Data",
	"settings.data.export.description":
		"Download all your relationship notes and details as JSON",
	"settings.data.import.label": "Import Data",
	"settings.data.import.description":
		"Upload a JSON file to restore or merge your relationship notes",

	// Data deletion
	"settings.data.delete.title": "Delete All Your Data",
	"settings.data.delete.description":
		"Permanently delete all your data for this account. This action cannot be undone. We recommend exporting your data first so you can import it later.",
	"settings.data.delete.button": "Delete All Data",
	"settings.data.delete.dialog.title": "Delete All Data",
	"settings.data.delete.dialog.description":
		"This action will permanently delete all your people, notes, and reminders. This cannot be undone. We recommend exporting your data first so you can import it later.",
	"settings.data.delete.confirm.label": 'Type "delete all my data" to confirm:',
	"settings.data.delete.confirm.placeholder": "delete all my data",
	"settings.data.delete.confirm.error":
		'You must type "delete all my data" exactly',
	"settings.data.delete.deleting": "Deleting...",
	"settings.data.delete.success": "All data deleted successfully",
	"settings.data.delete.error.load": "Failed to load account data",
	"settings.data.delete.error.rootMissing": "Account root missing",
	"settings.about.title": "About",
	"settings.about.description":
		"Learn more about Tilly or redo the welcome tour.",
	"settings.about.visit": "Visit Website",
	"settings.about.learnMore": "Read About Journaling",
	"settings.about.redoTour": "Take the Tour",
	"settings.language.title": "Language",
	"settings.language.description": "Choose your preferred language.",
	"settings.language.select.label": "Language",
	"settings.language.comingSoon": "More languages coming soon",

	// PWA-related settings
	"settings.pwa.title": "App Installation",
	"settings.pwa.description.mobile":
		"Get the best experience with push notifications and faster access.",
	"settings.pwa.description.desktop":
		"Install Tilly as an app for a cleaner interface and quick access.",
	"settings.pwa.status.label": "Status",
	"settings.pwa.status.installed": "✅ Tilly is installed as an app",
	"settings.pwa.status.browser": "📱 Tilly is running in browser",
	"settings.pwa.install.button": "Install App",
	"settings.pwa.install.description.mobile":
		"Add Tilly to your home screen for faster access. Push notifications require signing in.",
	"settings.pwa.install.description.desktop":
		"Install Tilly as an app to remove browser UI and launch it like any other app.",
	"settings.pwa.benefits.title": "Benefits you're enjoying:",
	"settings.pwa.benefits.mobile.notifications":
		"• Push notifications (when signed in)",
	"settings.pwa.benefits.mobile.startup": "• Faster app startup",
	"settings.pwa.benefits.mobile.experience": "• Native app-like experience",
	"settings.pwa.benefits.mobile.icon": "• Dedicated app icon on home screen",
	"settings.pwa.benefits.desktop.interface":
		"• Clean interface without browser UI",
	"settings.pwa.benefits.desktop.launch": "• Launch like any other desktop app",
	"settings.pwa.benefits.desktop.startup": "• Faster app startup",
	"settings.pwa.benefits.desktop.window": "• Dedicated app window",
	"settings.pwa.hideInstall.label": "Hide Install Button",
	"settings.pwa.hideInstall.description":
		"Hide the install button from the navigation menu",

	// PWA installation dialogs
	"pwa.install.title": "Install Tilly",
	"pwa.install.addToHomeScreen.chrome":
		'Select "Add to Home screen" or "Install app"',
	"pwa.install.addToHomeScreen.confirm": 'Tap "Add" or "Install" to confirm',
	"pwa.install.safari.scrollDown": 'Scroll down and tap "Add to Home Screen"',
	"pwa.install.safari.confirm": 'Tap "Add" to confirm',
	"pwa.install.chrome.browser": "Chrome/Edge:",
	"pwa.install.safari.browser": "Safari (Mac):",
	"pwa.install.firefox.browser": "Firefox:",
	"pwa.install.generic.instruction":
		'Look for an "Install" or "Add to Home Screen" option in your browser',
	"pwa.install.followPrompts":
		"Follow the prompts to add Tilly to your home screen",
	"pwa.install.dialog.title": "Install Tilly",
	"pwa.install.dialog.description.mobile":
		"Install Tilly as an app for faster access and push notifications.",
	"pwa.install.dialog.description.desktop":
		"Install Tilly as an app for a cleaner interface and quick access.",
	"pwa.install.dialog.later": "Maybe Later",
	"pwa.install.dialog.browser.title":
		"Install Tilly directly from your browser for the best experience.",
	"pwa.install.dialog.install": "Install Now",
	"pwa.install.android.title":
		"To install Tilly as a progressive web app on your Android device:",
	"pwa.install.android.step1": 'Select "Add to Home screen" or "Install app"',
	"pwa.install.android.step2": 'Tap "Add" or "Install" to confirm',
	"pwa.install.ios.title":
		"To install Tilly as a progressive web app on your iPhone or iPad:",
	"pwa.install.ios.step1": 'Scroll down and tap "Add to Home Screen"',
	"pwa.install.ios.step2": 'Tap "Add" to confirm',
	"pwa.install.ios.note":
		"Note: On iOS, installation is only available through the Safari browser.",
	"pwa.install.desktop.browser.title":
		"Install Tilly directly from your browser for a cleaner experience.",
	"pwa.install.desktop.title":
		"To install Tilly as a progressive web app on desktop:",
	"pwa.install.desktop.chrome": "Chrome/Edge:",
	"pwa.install.desktop.chrome.instruction":
		"Look for the install button in the address bar",
	"pwa.install.desktop.safari": "Safari (Mac):",
	"pwa.install.desktop.safari.instruction": "Click … Share → Add to Dock",
	"pwa.install.desktop.firefox": "Firefox:",
	"pwa.install.desktop.firefox.instruction": "Installation support varies",
	"pwa.install.generic.title": "To install Tilly as a progressive web app:",
	"pwa.install.generic.step1":
		'Look for an "Install" or "Add to Home Screen" option in your browser menu',
	"pwa.install.generic.step2":
		"Follow the prompts to add Tilly to your home screen",
	"pwa.install.android.menuStep":
		"Tap the menu (⋮) or {#shareIcon}share{/shareIcon} button in your browser",
	"pwa.install.ios.shareStep":
		"Tap the {#shareIcon}Share{/shareIcon} button at the bottom of Safari",

	// Notifications settings
	"notifications.title": "Push Notifications",
	"notifications.description":
		"Choose when you want to receive reminder notifications and manage your devices.",
	"notifications.signInRequired.title":
		"Sign in to get access to push notifications",
	"notifications.timing.heading": "Timing",
	"notifications.timezone.label": "Timezone",
	"notifications.timezone.change": "Change",
	"notifications.timezone.usingDefault":
		"Using your device's timezone as default",
	"notifications.timezone.dialog.title": "Change Timezone",
	"notifications.timezone.current.label": "Current timezone",
	"notifications.timezone.new.label": "New timezone",
	"notifications.timezone.new.placeholder": "e.g., Europe/Berlin",
	"notifications.timezone.new.description":
		'Enter a valid IANA timezone identifier like "Europe/Berlin", "America/New_York", or "Asia/Tokyo"',
	"notifications.timezone.detectDevice": "Detect Device Timezone",
	"notifications.timezone.cancel": "Cancel",
	"notifications.timezone.save": "Save",
	"notifications.timezone.invalid": "Invalid timezone identifier",
	"notifications.time.label": "Notification Time",
	"notifications.time.change": "Change",
	"notifications.time.defaultMessage":
		"Using 12:00 PM as default notification time",
	"notifications.time.customMessage":
		"You'll receive notifications at this time each day in your timezone",
	"notifications.time.dialog.title": "Change Notification Time",
	"notifications.time.current.label": "Current notification time",
	"notifications.time.new.label": "New notification time",
	"notifications.time.new.placeholder": "Select notification time",
	"notifications.time.description":
		"Choose when you want to receive daily reminder notifications.",
	"notifications.devices.heading": "Devices",
	"notifications.devices.description":
		"Manage devices registered for push notifications.",
	"notifications.devices.noDevices.description":
		"Add devices to receive push notifications.",
	"notifications.devices.noDevices.title": "No Devices Added",
	"notifications.devices.noDevices.warning":
		"You will NOT receive any notifications until you add at least one device. Add this device to start receiving reminders.",
	"notifications.devices.thisDevice": "This device",
	"notifications.devices.actions.title": "Device Actions",
	"notifications.devices.actions.description":
		'What would you like to do with "{$deviceName}"?',
	"notifications.devices.table.device": "Device",
	"notifications.devices.table.browser": "Browser",
	"notifications.devices.table.os": "OS",
	"notifications.devices.table.lastActive": "Last Active",
	"notifications.devices.table.status": "Status",
	"notifications.devices.remove": "Remove",
	"notifications.devices.editName": "Edit name",
	"notifications.devices.editDialog.title": "Edit Device Name",
	"notifications.devices.editDialog.description":
		"Change the display name for this device.",
	"notifications.devices.remove.confirm.title": "Remove Device",
	"notifications.devices.remove.confirm.description":
		"Are you sure you want to remove this device? You will stop receiving notifications on it.",
	"notifications.devices.remove.confirm.cancel": "Cancel",
	"notifications.devices.remove.confirm.remove": "Remove",
	"notifications.devices.status.active": "Active",
	"notifications.devices.status.inactive": "Inactive",
	"notifications.devices.empty": "No devices registered for notifications yet.",
	"notifications.devices.enabled": "Enabled",
	"notifications.devices.disabled": "Disabled",
	"notifications.devices.sendTest": "Send test notification",
	"notifications.devices.sendingTest": "Sending...",
	"notifications.devices.enable": "Enable Notifications",
	"notifications.devices.disable": "Disable Notifications",
	"notifications.devices.endpointPrefix": "Endpoint:",
	"notifications.enable.heading": "Enable Notifications",
	"notifications.enable.description":
		"To receive reminders as push notifications, enable notifications for your account.",
	"notifications.enable.step1":
		"Grant permission when prompted by your browser.",
	"notifications.enable.step2":
		"Keep this device registered for notifications.",
	"notifications.enable.button": "Enable Push Notifications",
	"notifications.enable.success": "Notifications enabled successfully!",
	"notifications.enable.error": "Failed to enable notifications.",
	"notifications.permission.denied.title": "Permission Denied",
	"notifications.permission.denied.description":
		"Notifications are blocked in your browser settings. Please enable them to receive reminders.",
	"notifications.permission.openSettings": "Open Browser Settings",
	"notifications.register.title": "Register Device",
	"notifications.register.description":
		"Register this device to receive push notifications.",
	"notifications.register.button": "Register",
	"notifications.register.success": "Device registered successfully!",
	"notifications.register.error": "Failed to register device.",
	"notifications.unregister.title": "Unregister Device",
	"notifications.unregister.description":
		"Stop receiving notifications on this device.",
	"notifications.unregister.button": "Unregister",
	"notifications.unregister.success": "Device unregistered successfully!",
	"notifications.unregister.error": "Failed to unregister device.",
	"notifications.devices.permissionError":
		"Failed to request notification permission",
	"notifications.toast.unsubscribeFailed":
		"Failed to unsubscribe from notifications",
	"notifications.toast.subscribeFailed":
		"Failed to subscribe to push notifications",
	"notifications.toast.testSendFailed": "Failed to send test notification",
	"notifications.toast.testSendSuccess": "Test notification sent",
	"notifications.toast.deviceRemoved": "Device removed successfully",
	"notifications.toast.deviceAdded": "Device added successfully!",
	"notifications.toast.nameUpdated": "Device name updated",
	"notifications.lastDelivery.label": "Last Notification Check",
	"notifications.lastDelivery.reset": "Reset",
	"notifications.lastDelivery.description":
		"When reminders were last checked and, if needed, delivered. Reset this to force another check on the next hourly run.",
	"notifications.devices.addButton": "Add This Device",
	"notifications.devices.addDialog.title": "Add This Device",
	"notifications.devices.addDialog.description.enabled":
		"Enable push notifications for this device to receive reminders.",
	"notifications.devices.addDialog.description.blocked":
		"Push notifications are blocked. Please enable them in your browser settings.",
	"notifications.devices.nameLabel": "Device Name",
	"notifications.devices.name.required": "Device name is required",
	"notifications.devices.adding": "Adding...",
	"notifications.iosRequirement.title":
		"Push notifications require app installation",
	"notifications.iosRequirement.description":
		"On iOS, push notifications are only available after installing Tilly to your home screen. Install the app from the App Installation section below to enable push notifications.",
	"notifications.browserNotSupported.title": "Push notifications not available",
	"notifications.browserNotSupported.recommendation.ios":
		"On iOS, please use Safari and install the app for the full Tilly experience.",
	"notifications.browserNotSupported.recommendation.iosInApp":
		"On iOS, please open this link in Safari and install the app for the full Tilly experience.",
	"notifications.browserNotSupported.recommendation.android":
		"On Android, please use Chrome and install the app for the full Tilly experience.",
	"notifications.browserNotSupported.recommendation.androidInApp":
		"On Android, please open this link in Chrome and install the app for the full Tilly experience.",
	"notifications.browserNotSupported.recommendation.windows":
		"On Windows, please use Chrome or Edge for the full Tilly experience.",
	"notifications.browserNotSupported.recommendation.macos":
		"On macOS, please use Chrome or Safari for the full Tilly experience.",
	"notifications.browserNotSupported.recommendation.generic":
		"Please try using Chrome, Edge, or Safari for the full Tilly experience.",
	// Server not configured messages for push notifications
	"notifications.serverNotConfigured.title": "Server configuration required",
	"notifications.serverNotConfigured.description":
		"Push notifications require a server connection. Configure a server URL in the Server Features section to enable push notifications.",
	"notifications.serverNotConfigured.alternative":
		"Without a server, you can still use Tilly's core features. Your data is stored locally and synced via Jazz.",
	"notifications.serverNotConfigured.configureButton": "Configure Server",
	// Status messages
	"status.offline.title": "You're offline",
	"status.update.title": "Update available",
	"status.offline.tooltip": "You're offline",
	"status.offline.dialog.title": "Offline Mode",
	"status.offline.description": "Most of Tilly works offline.",
	"status.offline.feature.core": "View and edit people, notes, and reminders",
	"status.offline.feature.requiresInternet":
		"Sync, push notifications, and Tilly Assistant require internet",
	"status.update.tooltip": "Update available",
	"status.update.dialog.title": "Update Available",
	"status.update.description":
		"A new version of Tilly is available with improvements and bug fixes.",
	"status.update.updating": "Updating...",
	"status.update.updateNow": "Update Now",
	"status.update.later": "Later",
	"status.notSignedIn.tooltip": "Not signed in",
	"status.notSignedIn.dialog.title": "Not Signed In",
	"status.notSignedIn.browserOnly":
		"Without sign in, the data is only stored in the browser",
	"status.notSignedIn.benefits":
		"Sign in to back up and sync your data, and receive push notifications",
	"status.notSignedIn.signIn": "Sign In",

	// Server settings
	"settings.server.title": "Server Features",
	"settings.server.description":
		"Configure optional server features like AI chat and push notifications.",
	"settings.server.url.label": "Server URL",
	"settings.server.url.placeholder": "https://your-server.com",
	"settings.server.test": "Test",
	"settings.server.testing": "Testing...",
	"settings.server.connected": "Connected successfully",
	"settings.server.connectionFailed": "Connection failed",
	"settings.server.aiChat.label": "Enable AI Chat",
	"settings.server.push.label": "Enable Push Notifications",
	"settings.server.notConfigured":
		"No server URL configured. Server features like AI chat and push notifications require a server connection.",
	"settings.server.status.connected": "Connected",
	"settings.server.status.disconnected": "Disconnected",
	"settings.server.status.notConfigured": "Not configured",
	"settings.server.status.checking": "Checking...",
})

const deSettingsMessages = translate(baseSettingsMessages, {
	// Settings page messages
	"settings.title": "Einstellungen",
	"settings.pageTitle": "Einstellungen - Tilly",
	"settings.auth.title": "Authentifizierung",
	"settings.auth.description.signedIn":
		"Verwalte deine Kontoeinstellungen, ändere E-Mail/Passwort oder melde dich ab.",
	"settings.auth.description.signedOut.online":
		"Melde dich an, um deine Beziehungen zu synchronisieren und Tilly auf all deinen Geräten zu aktivieren.",
	"settings.auth.description.signedOut.offline":
		"Für die Anmeldung ist eine Internetverbindung erforderlich, um deine Daten über Geräte hinweg zu synchronisieren.",
	"settings.auth.status.label": "Status",
	"settings.auth.status.signedIn": "Angemeldet als {$email}",
	"settings.auth.status.signedOut": "Nicht angemeldet",
	"settings.auth.tier.label": "Tarif",
	"settings.auth.tier.plus": "Tilly Plus",
	"settings.auth.tier.free": "Kostenlos",
	"settings.auth.requiresInternet":
		"Kontofunktionen erfordern eine Internetverbindung",
	"settings.auth.offlineDescription":
		"Bitte stelle eine Internetverbindung her, um dich anzumelden oder dein Konto zu verwalten.",
	"settings.auth.manageAccount": "Konto verwalten",
	"settings.auth.manageSubscription": "Abonnement verwalten",
	"settings.auth.signOut": "Abmelden",
	"settings.auth.status.authenticated": "Mit Passkey authentifiziert",
	"settings.auth.status.unauthenticated": "Nicht authentifiziert",
	"settings.auth.logout": "Abmelden",
	"settings.auth.logout.error":
		"Abmeldung fehlgeschlagen. Bitte versuche es erneut.",
	"settings.auth.login": "Anmelden",
	"settings.auth.signup": "Registrieren",
	"settings.profile.title": "Über dich",
	"settings.profile.description":
		"Aktualisiere deine persönlichen Informationen.",
	"settings.profile.displayName.label": "Anzeigename",
	"settings.profile.displayName.placeholder": "Kein Anzeigename gesetzt",
	"settings.profile.displayName.change": "Ändern",
	"settings.profile.displayName.dialog.title": "Anzeigenamen ändern",
	"settings.profile.displayName.current.label": "Aktueller Anzeigename",
	"settings.profile.displayName.new.label": "Neuer Anzeigename",
	"settings.profile.displayName.new.placeholder": "Gib deinen Namen ein",
	"settings.profile.displayName.new.description":
		"Das ist der Name, der in deinem Profil angezeigt wird",
	"settings.profile.displayName.new.required": "Name ist erforderlich.",
	"settings.profile.displayName.cancel": "Abbrechen",
	"settings.profile.displayName.save": "Speichern",
	"settings.agent.title": "KI-Assistent",
	"settings.agent.description":
		"Konfiguriere deinen KI-Assistenten und sieh dir Nutzungsstatistiken an.",
	"settings.agent.displayName.label": "Dein Name",
	"settings.agent.displayName.placeholder": "Kein Name gesetzt",
	"settings.agent.displayName.change": "Ändern",
	"settings.agent.displayName.dialog.title": "Deinen Namen ändern",
	"settings.agent.displayName.current.label": "Aktueller Name",
	"settings.agent.displayName.new.label": "Neuer Name",
	"settings.agent.displayName.new.placeholder": "Gib deinen Namen ein",
	"settings.agent.displayName.new.description":
		"Das ist der Name, den Tilly in Gesprächen für dich verwenden wird",
	"settings.agent.displayName.cancel": "Abbrechen",
	"settings.agent.displayName.save": "Speichern",
	"settings.agent.usage.title": "Nutzung",
	"settings.agent.usage.budget.label": "Nutzung in diesem Zeitraum",
	"settings.agent.usage.budget.reset": "Setzt sich am {$date} zurück",
	"settings.data.title": "Deine Daten",
	"settings.data.description":
		"Exportiere, importiere oder verwalte deine Daten.",
	"settings.data.export.label": "Daten exportieren",
	"settings.data.export.description": "Lade alle deine Daten als JSON herunter",
	"settings.data.import.label": "Daten importieren",
	"settings.data.import.description":
		"Lade eine JSON-Datei hoch, um deine Daten wiederherzustellen oder mit den bestehenden zusammenzufügen.",

	// Data deletion
	"settings.data.delete.title": "Alle deine Daten löschen",
	"settings.data.delete.description":
		"Lösche dauerhaft alle deine Daten für dieses Konto. Diese Aktion kann nicht rückgängig gemacht werden. Wir empfehlen, deine Daten zuerst zu exportieren, damit du sie später wieder importieren kannst.",
	"settings.data.delete.button": "Alle Daten löschen",
	"settings.data.delete.dialog.title": "Alle Daten löschen",
	"settings.data.delete.dialog.description":
		"Diese Aktion löscht dauerhaft alle deine Daten: Personen, Notizen und Erinnerungen. Dies kann nicht rückgängig gemacht werden. Wir empfehlen, deine Daten zuerst zu exportieren, damit du sie später wieder importieren kannst.",
	"settings.data.delete.confirm.label":
		'Schreibe "delete all my data" zur Bestätigung:',
	"settings.data.delete.confirm.placeholder": "delete all my data",
	"settings.data.delete.confirm.error":
		'Du musst genau "delete all my data" eingeben',
	"settings.data.delete.deleting": "Lösche...",
	"settings.data.delete.success": "Alle Daten wurden erfolgreich gelöscht",
	"settings.data.delete.error.load": "Kontodaten konnten nicht geladen werden",
	"settings.data.delete.error.rootMissing": "Konto-Stammdaten fehlen",
	"settings.about.title": "Über",
	"settings.about.description":
		"Erfahre mehr über Tilly oder wiederhole die Willkommens-Tour.",
	"settings.about.visit": "Webseite besuchen",
	"settings.about.learnMore": "Über Journaling lesen",
	"settings.about.redoTour": "Tour starten",
	"settings.language.title": "Sprache",
	"settings.language.description": "Wähle deine bevorzugte Sprache.",
	"settings.language.select.label": "Sprache",
	"settings.language.comingSoon": "Weitere Sprachen folgen bald",

	// PWA-related settings
	"settings.pwa.title": "App-Installation",
	"settings.pwa.description.mobile":
		"Erhalte die beste Erfahrung mit Push-Benachrichtigungen und schnellerem Zugriff.",
	"settings.pwa.description.desktop":
		"Installiere Tilly als App für eine sauberere Oberfläche und schnellen Zugriff.",
	"settings.pwa.status.label": "Status",
	"settings.pwa.status.installed": "✅ Tilly ist als App installiert",
	"settings.pwa.status.browser": "📱 Tilly läuft im Browser",
	"settings.pwa.install.button": "App installieren",
	"settings.pwa.install.description.mobile":
		"Füge Tilly deinem Startbildschirm hinzu. Push-Benachrichtigungen erfordern eine Anmeldung.",
	"settings.pwa.install.description.desktop":
		"Installiere Tilly als App, um die Browser-UI zu entfernen und sie wie jede andere App zu starten.",
	"settings.pwa.benefits.title": "Vorteile:",
	"settings.pwa.benefits.mobile.notifications":
		"• Push-Benachrichtigungen (bei Anmeldung)",
	"settings.pwa.benefits.mobile.startup": "• Schnellere App-Starts",
	"settings.pwa.benefits.mobile.experience": "• App-ähnliche Erfahrung",
	"settings.pwa.benefits.mobile.icon":
		"• Eigenes App-Icon auf dem Startbildschirm",
	"settings.pwa.benefits.desktop.interface":
		"• Aufgeräumte Oberfläche ohne Browser-UI",
	"settings.pwa.benefits.desktop.launch": "• Start wie jede andere Desktop-App",
	"settings.pwa.benefits.desktop.startup": "• Schnellere App-Starts",
	"settings.pwa.benefits.desktop.window": "• Eigenes App-Fenster",
	"settings.pwa.hideInstall.label": "Installationsknopf ausblenden",
	"settings.pwa.hideInstall.description":
		"Blendet den Installationsknopf aus dem Navigationsmenü aus",

	// PWA installation dialogs
	"pwa.install.title": "Tilly installieren",
	"pwa.install.addToHomeScreen.chrome":
		'"Zum Startbildschirm hinzufügen" oder "App installieren" wählen',
	"pwa.install.addToHomeScreen.confirm":
		'Mit "Hinzufügen" oder "Installieren" bestätigen',
	"pwa.install.safari.scrollDown":
		'Nach unten scrollen und "Zum Home-Bildschirm" tippen',
	"pwa.install.safari.confirm": 'Mit "Hinzufügen" bestätigen',
	"pwa.install.chrome.browser": "Chrome/Edge:",
	"pwa.install.safari.browser": "Safari (Mac):",
	"pwa.install.firefox.browser": "Firefox:",
	"pwa.install.generic.instruction":
		'Im Browser nach "Installieren" oder "Zum Home-Bildschirm" suchen',
	"pwa.install.followPrompts": "Den Anweisungen folgen, um Tilly hinzuzufügen",
	"pwa.install.dialog.title": "Tilly installieren",
	"pwa.install.dialog.description.mobile":
		"Tilly als App installieren für schnellen Zugriff und Push-Benachrichtigungen.",
	"pwa.install.dialog.description.desktop":
		"Tilly als App installieren für eine aufgeräumte Oberfläche und schnellen Zugriff.",
	"pwa.install.dialog.later": "Vielleicht später",
	"pwa.install.dialog.browser.title":
		"Installiere Tilly direkt aus deinem Browser für die beste Erfahrung.",
	"pwa.install.dialog.install": "Jetzt installieren",
	"pwa.install.android.title": "So installierst du Tilly als PWA auf Android:",
	"pwa.install.android.step1":
		'"Zum Startbildschirm hinzufügen" oder "App installieren" wählen',
	"pwa.install.android.step2":
		'Mit "Hinzufügen" oder "Installieren" bestätigen',
	"pwa.install.ios.title":
		"So installierst du Tilly als PWA auf iPhone oder iPad:",
	"pwa.install.ios.step1":
		'Nach unten scrollen und "Zum Home-Bildschirm" tippen',
	"pwa.install.ios.step2": 'Mit "Hinzufügen" bestätigen',
	"pwa.install.ios.note":
		"Hinweis: Unter iOS ist die Installation nur über Safari möglich.",
	"pwa.install.desktop.browser.title":
		"Installiere Tilly direkt aus deinem Browser für ein sauberes Erlebnis.",
	"pwa.install.desktop.title":
		"So installierst du Tilly als PWA auf dem Desktop:",
	"pwa.install.desktop.chrome": "Chrome/Edge:",
	"pwa.install.desktop.chrome.instruction":
		"Nach der Installationsschaltfläche in der Adressleiste suchen",
	"pwa.install.desktop.safari": "Safari (Mac):",
	"pwa.install.desktop.safari.instruction": "… Teilen → Zum Dock hinzufügen",
	"pwa.install.desktop.firefox": "Firefox:",
	"pwa.install.desktop.firefox.instruction":
		"Installationsunterstützung variiert",
	"pwa.install.generic.title": "So installierst du Tilly als PWA:",
	"pwa.install.generic.step1":
		'Im Browsermenü nach "Installieren" oder "Zum Home-Bildschirm" suchen',
	"pwa.install.generic.step2": "Den Anweisungen folgen, um Tilly hinzuzufügen",
	"pwa.install.android.menuStep":
		"Menü (⋮) oder {#shareIcon}Teilen{/shareIcon} im Browser tippen",
	"pwa.install.ios.shareStep":
		"{#shareIcon}Teilen{/shareIcon}-Taste unten in Safari tippen",

	// Notifications settings
	"notifications.title": "Push-Benachrichtigungen",
	"notifications.description":
		"Wähle, wann du Erinnerungsbenachrichtigungen erhalten willst, und verwalte deine Geräte.",
	"notifications.signInRequired.title":
		"Melde dich an, um Zugriff auf Push-Benachrichtigungen zu erhalten",
	"notifications.timing.heading": "Zeitplanung",
	"notifications.timezone.label": "Zeitzone",
	"notifications.timezone.change": "Ändern",
	"notifications.timezone.usingDefault": "Zeitzone deines Geräts als Standard",
	"notifications.timezone.dialog.title": "Zeitzone ändern",
	"notifications.timezone.current.label": "Aktuelle Zeitzone",
	"notifications.timezone.new.label": "Neue Zeitzone",
	"notifications.timezone.new.placeholder": "z. B. Europe/Berlin",
	"notifications.timezone.new.description":
		'Gültige IANA-Zeitzone eingeben, z. B. "Europe/Berlin", "America/New_York" oder "Asia/Tokyo"',
	"notifications.timezone.detectDevice": "Gerätezeitzone erkennen",
	"notifications.timezone.cancel": "Abbrechen",
	"notifications.timezone.save": "Speichern",
	"notifications.timezone.invalid": "Ungültiger Zeitzonenbezeichner",
	"notifications.time.label": "Benachrichtigungszeit",
	"notifications.time.change": "Ändern",
	"notifications.time.defaultMessage":
		"12:00 Uhr als Standard-Benachrichtigungszeit verwenden",
	"notifications.time.customMessage":
		"Du erhältst Benachrichtigungen täglich zu dieser Zeit in deiner Zeitzone",
	"notifications.time.dialog.title": "Benachrichtigungszeit ändern",
	"notifications.time.current.label": "Aktuelle Benachrichtigungszeit",
	"notifications.time.new.label": "Neue Benachrichtigungszeit",
	"notifications.time.new.placeholder": "Benachrichtigungszeit auswählen",
	"notifications.time.description":
		"Wähle, wann du tägliche Erinnerungsbenachrichtigungen erhalten möchtest.",
	"notifications.devices.heading": "Geräte",
	"notifications.devices.description":
		"Geräte verwalten, die Push-Benachrichtigungen empfangen.",
	"notifications.devices.noDevices.description":
		"Füge Geräte hinzu, die Push-Benachrichtigungen erhalten.",
	"notifications.devices.noDevices.title": "Keine Geräte hinzugefügt",
	"notifications.devices.noDevices.warning":
		"Du wirst KEINE Benachrichtigungen erhalten, bis du mindestens ein Gerät hinzufügst. Füge dieses Gerät hinzu, um Erinnerungen zu erhalten.",
	"notifications.devices.thisDevice": "Dieses Gerät",
	"notifications.devices.actions.title": "Geräteaktionen",
	"notifications.devices.actions.description":
		'Was möchtest du mit „{$deviceName}" tun?',
	"notifications.devices.table.device": "Gerät",
	"notifications.devices.table.browser": "Browser",
	"notifications.devices.table.os": "OS",
	"notifications.devices.table.lastActive": "Zuletzt aktiv",
	"notifications.devices.table.status": "Status",
	"notifications.devices.remove": "Entfernen",
	"notifications.devices.editName": "Namen bearbeiten",
	"notifications.devices.editDialog.title": "Gerätenamen bearbeiten",
	"notifications.devices.editDialog.description":
		"Ändere den Anzeigenamen für dieses Gerät.",
	"notifications.devices.remove.confirm.title": "Gerät entfernen",
	"notifications.devices.remove.confirm.description":
		"Möchtest du dieses Gerät entfernen? Du erhältst darauf keine Benachrichtigungen mehr.",
	"notifications.devices.remove.confirm.cancel": "Abbrechen",
	"notifications.devices.remove.confirm.remove": "Entfernen",
	"notifications.devices.status.active": "Aktiv",
	"notifications.devices.status.inactive": "Inaktiv",
	"notifications.devices.empty":
		"Noch keine Geräte für Benachrichtigungen registriert.",
	"notifications.devices.enabled": "Aktiviert",
	"notifications.devices.disabled": "Deaktiviert",
	"notifications.devices.sendTest": "Testbenachrichtigung senden",
	"notifications.devices.sendingTest": "Senden...",
	"notifications.devices.enable": "Benachrichtigungen aktivieren",
	"notifications.devices.disable": "Benachrichtigungen deaktivieren",
	"notifications.devices.endpointPrefix": "Endpunkt:",
	"notifications.enable.heading": "Benachrichtigungen aktivieren",
	"notifications.enable.description":
		"Aktiviere Benachrichtigungen für dein Konto, um Erinnerungen zu erhalten.",
	"notifications.enable.step1":
		"Berechtigung erteilen, wenn der Browser danach fragt.",
	"notifications.enable.step2":
		"Dieses Gerät für Benachrichtigungen registriert lassen.",
	"notifications.enable.button": "Push-Benachrichtigungen aktivieren",
	"notifications.enable.success": "Benachrichtigungen erfolgreich aktiviert!",
	"notifications.enable.error":
		"Aktivieren der Benachrichtigungen fehlgeschlagen.",
	"notifications.permission.denied.title": "Berechtigung verweigert",
	"notifications.permission.denied.description":
		"Benachrichtigungen sind in deinen Browser-Einstellungen blockiert. Bitte aktiviere sie, um Erinnerungen zu erhalten.",
	"notifications.permission.openSettings": "Browsereinstellungen öffnen",
	"notifications.register.title": "Gerät registrieren",
	"notifications.register.description":
		"Dieses Gerät registrieren, um Push-Benachrichtigungen zu erhalten.",
	"notifications.register.button": "Registrieren",
	"notifications.register.success": "Gerät erfolgreich registriert!",
	"notifications.register.error": "Gerät konnte nicht registriert werden.",
	"notifications.unregister.title": "Gerät abmelden",
	"notifications.unregister.description":
		"Keine Benachrichtigungen mehr auf diesem Gerät erhalten.",
	"notifications.unregister.button": "Abmelden",
	"notifications.unregister.success": "Gerät erfolgreich abgemeldet!",
	"notifications.unregister.error": "Abmeldung fehlgeschlagen.",
	"notifications.devices.permissionError":
		"Anfrage für Benachrichtigungsberechtigung fehlgeschlagen",
	"notifications.toast.unsubscribeFailed":
		"Abmeldung von Benachrichtigungen fehlgeschlagen",
	"notifications.toast.subscribeFailed":
		"Anmeldung für Push-Benachrichtigungen fehlgeschlagen",
	"notifications.toast.testSendFailed":
		"Senden der Testbenachrichtigung fehlgeschlagen",
	"notifications.toast.testSendSuccess": "Testbenachrichtigung gesendet",
	"notifications.toast.deviceRemoved": "Gerät erfolgreich entfernt",
	"notifications.toast.deviceAdded": "Gerät erfolgreich hinzugefügt!",
	"notifications.toast.nameUpdated": "Gerätename aktualisiert",
	"notifications.lastDelivery.label": "Letzter Check",
	"notifications.lastDelivery.reset": "Zurücksetzen",
	"notifications.lastDelivery.description":
		"Wann Erinnerungen zuletzt geprüft und bei Bedarf zugestellt wurden. Setze dies zurück, um beim nächsten stündlichen Durchlauf eine erneute Prüfung zu erzwingen.",
	"notifications.devices.addButton": "Dieses Gerät hinzufügen",
	"notifications.devices.addDialog.title": "Dieses Gerät hinzufügen",
	"notifications.devices.addDialog.description.enabled":
		"Aktiviere Push-Benachrichtigungen für dieses Gerät, um Erinnerungen zu erhalten.",
	"notifications.devices.addDialog.description.blocked":
		"Push-Benachrichtigungen sind blockiert. Bitte aktiviere sie in deinen Browser-Einstellungen.",
	"notifications.devices.nameLabel": "Gerätename",
	"notifications.devices.name.required": "Gerätename ist erforderlich",
	"notifications.devices.adding": "Hinzufügen...",
	"notifications.iosRequirement.title":
		"Push-Benachrichtigungen erfordern App-Installation",
	"notifications.iosRequirement.description":
		"Unter iOS sind Push-Benachrichtigungen nur nach Installation von Tilly auf dem Home-Bildschirm verfügbar. Installiere die App unten im Abschnitt App-Installation.",
	"notifications.browserNotSupported.title":
		"Push-Benachrichtigungen nicht verfügbar",
	"notifications.browserNotSupported.recommendation.ios":
		"In iOS verwende bitte Safari und installiere die App für die vollständige Tilly-Erfahrung.",
	"notifications.browserNotSupported.recommendation.iosInApp":
		"In iOS öffne bitte diesen Link in Safari und installiere die App für die vollständige Tilly-Erfahrung.",
	"notifications.browserNotSupported.recommendation.android":
		"In Android verwende bitte Chrome und installiere die App für die vollständige Tilly-Erfahrung.",
	"notifications.browserNotSupported.recommendation.androidInApp":
		"In Android öffne bitte diesen Link in Chrome und installiere die App für die vollständige Tilly-Erfahrung.",
	"notifications.browserNotSupported.recommendation.windows":
		"In Windows verwende bitte Chrome oder Edge für die vollständige Tilly-Erfahrung.",
	"notifications.browserNotSupported.recommendation.macos":
		"In macOS verwende bitte Chrome oder Safari für die vollständige Tilly-Erfahrung.",
	"notifications.browserNotSupported.recommendation.generic":
		"Bitte verwende Chrome, Edge oder Safari für die vollständige Tilly-Erfahrung.",
	// Server not configured messages for push notifications
	"notifications.serverNotConfigured.title":
		"Server-Konfiguration erforderlich",
	"notifications.serverNotConfigured.description":
		"Push-Benachrichtigungen erfordern eine Server-Verbindung. Konfiguriere eine Server-URL im Bereich Server-Funktionen, um Push-Benachrichtigungen zu aktivieren.",
	"notifications.serverNotConfigured.alternative":
		"Ohne Server kannst du weiterhin die Kernfunktionen von Tilly nutzen. Deine Daten werden lokal gespeichert und über Jazz synchronisiert.",
	"notifications.serverNotConfigured.configureButton": "Server konfigurieren",

	// Status messages
	"status.offline.title": "Du bist offline",
	"status.update.title": "Update verfügbar",
	"status.offline.tooltip": "Offline",
	"status.offline.dialog.title": "Offline-Modus",
	"status.offline.description":
		"Du bist gerade offline, aber die meisten Funktionen funktionieren trotzdem:",
	"status.offline.feature.core":
		"Personen, Notizen und Erinnerungen ansehen und bearbeiten",
	"status.offline.feature.requiresInternet":
		"Sync, Push-Benachrichtigungen und Tilly-Assistent benötigen Internet",
	"status.update.tooltip": "Update verfügbar",
	"status.update.dialog.title": "Update verfügbar",
	"status.update.description":
		"Eine neue Version von Tilly ist verfügbar – mit Verbesserungen und Fehlerbehebungen.",
	"status.update.updating": "Wird aktualisiert...",
	"status.update.updateNow": "Jetzt aktualisieren",
	"status.update.later": "Später",
	"status.notSignedIn.tooltip": "Nicht angemeldet",
	"status.notSignedIn.dialog.title": "Nicht angemeldet",
	"status.notSignedIn.browserOnly":
		"Ohne Anmeldung werden die Daten nur im Browser gespeichert",
	"status.notSignedIn.benefits":
		"Melde dich an, um deine Daten zu sichern, zu synchronisieren und Push-Benachrichtigungen zu erhalten",
	"status.notSignedIn.signIn": "Anmelden",

	// Server settings
	"settings.server.title": "Server-Funktionen",
	"settings.server.description":
		"Konfiguriere optionale Server-Funktionen wie KI-Chat und Push-Benachrichtigungen.",
	"settings.server.url.label": "Server-URL",
	"settings.server.url.placeholder": "https://dein-server.com",
	"settings.server.test": "Testen",
	"settings.server.testing": "Teste...",
	"settings.server.connected": "Erfolgreich verbunden",
	"settings.server.connectionFailed": "Verbindung fehlgeschlagen",
	"settings.server.aiChat.label": "KI-Chat aktivieren",
	"settings.server.push.label": "Push-Benachrichtigungen aktivieren",
	"settings.server.notConfigured":
		"Keine Server-URL konfiguriert. Server-Funktionen wie KI-Chat und Push-Benachrichtigungen erfordern eine Server-Verbindung.",
	"settings.server.status.connected": "Verbunden",
	"settings.server.status.disconnected": "Getrennt",
	"settings.server.status.notConfigured": "Nicht konfiguriert",
	"settings.server.status.checking": "Prüfe...",
})

const ruSettingsMessages = translate(baseSettingsMessages, {
	// Settings page messages
	"settings.title": "Настройки",
	"settings.pageTitle": "Настройки - Тилли",
	"settings.auth.title": "Аутентификация",
	"settings.auth.description.signedIn":
		"Управляйте настройками аккаунта, изменяйте email/пароль или выходите из системы.",
	"settings.auth.description.signedOut.online":
		"Войдите, чтобы синхронизировать ваши отношения и использовать Tilly на всех ваших устройствах.",
	"settings.auth.description.signedOut.offline":
		"Для входа требуется подключение к интернету для синхронизации данных между устройствами.",
	"settings.auth.status.label": "Статус",
	"settings.auth.status.signedIn": "Вы вошли как {$email}",
	"settings.auth.status.signedOut": "Вы не вошли",
	"settings.auth.tier.label": "Тариф",
	"settings.auth.tier.plus": "Tilly Plus",
	"settings.auth.tier.free": "Бесплатно",
	"settings.auth.requiresInternet":
		"Функции аккаунта требуют подключения к интернету",
	"settings.auth.offlineDescription":
		"Пожалуйста, подключитесь к интернету для входа или управления аккаунтом.",
	"settings.auth.manageAccount": "Управление аккаунтом",
	"settings.auth.manageSubscription": "Управление подпиской",
	"settings.auth.signOut": "Выйти",
	"settings.auth.status.authenticated": "Аутентификация с ключом доступа",
	"settings.auth.status.unauthenticated": "Не аутентифицирован",
	"settings.auth.logout": "Выйти",
	"settings.auth.logout.error": "Не удалось выйти. Попробуйте снова.",
	"settings.auth.login": "Войти",
	"settings.auth.signup": "Зарегистрироваться",
	"settings.profile.title": "О вас",
	"settings.profile.description": "Обновите вашу личную информацию.",
	"settings.profile.displayName.label": "Отображаемое имя",
	"settings.profile.displayName.placeholder": "Имя не установлено",
	"settings.profile.displayName.change": "Изменить",
	"settings.profile.displayName.dialog.title": "Изменить отображаемое имя",
	"settings.profile.displayName.current.label": "Текущее отображаемое имя",
	"settings.profile.displayName.new.label": "Новое отображаемое имя",
	"settings.profile.displayName.new.placeholder": "Введите ваше имя",
	"settings.profile.displayName.new.description":
		"Это имя будет отображаться в вашем профиле",
	"settings.profile.displayName.new.required": "Имя обязательно.",
	"settings.profile.displayName.cancel": "Отмена",
	"settings.profile.displayName.save": "Сохранить",
	"settings.agent.title": "AI Ассистент",
	"settings.agent.description":
		"Настройте вашего AI ассистента и просмотрите статистику использования.",
	"settings.agent.displayName.label": "Ваше имя",
	"settings.agent.displayName.placeholder": "Имя не установлено",
	"settings.agent.displayName.change": "Изменить",
	"settings.agent.displayName.dialog.title": "Изменить ваше имя",
	"settings.agent.displayName.current.label": "Текущее имя",
	"settings.agent.displayName.new.label": "Новое имя",
	"settings.agent.displayName.new.placeholder": "Введите ваше имя",
	"settings.agent.displayName.new.description":
		"Это имя будет использовать Тилли для обращения к вам в разговорах",
	"settings.agent.displayName.cancel": "Отмена",
	"settings.agent.displayName.save": "Сохранить",
	"settings.agent.usage.title": "Использование",
	"settings.agent.usage.budget.label": "Использование в этом цикле",
	"settings.agent.usage.budget.reset": "Обновляется {$date}",
	"settings.data.title": "Ваши данные",
	"settings.data.description":
		"Экспортируйте, импортируйте или управляйте вашими заметками об отношениях.",
	"settings.data.export.label": "Экспорт данных",
	"settings.data.export.description":
		"Скачайте все ваши заметки и детали как JSON",
	"settings.data.import.label": "Импорт данных",
	"settings.data.import.description":
		"Загрузите JSON файл для восстановления или объединения ваших заметок",
	// Data deletion
	"settings.data.delete.title": "Удалить все ваши данные",
	"settings.data.delete.description":
		"Окончательно удалить все ваши данные для этого аккаунта. Это действие нельзя отменить. Мы рекомендуем сначала экспортировать данные, чтобы вы могли импортировать их позже.",
	"settings.data.delete.button": "Удалить все данные",
	"settings.data.delete.dialog.title": "Удалить все данные",
	"settings.data.delete.dialog.description":
		"Это действие окончательно удалит все ваши данные: людей, заметки и напоминания. Это нельзя отменить. Мы рекомендуем сначала экспортировать данные, чтобы вы могли импортировать их позже.",
	"settings.data.delete.confirm.label":
		'Введите "delete all my data" для подтверждения:',
	"settings.data.delete.confirm.placeholder": "delete all my data",
	"settings.data.delete.confirm.error":
		'Вы должны ввести точно "delete all my data"',
	"settings.data.delete.deleting": "Удаление...",
	"settings.data.delete.success": "Все данные успешно удалены",
	"settings.data.delete.error.load": "Не удалось загрузить данные аккаунта",
	"settings.data.delete.error.rootMissing": "Отсутствует корень аккаунта",
	"settings.about.title": "О программе",
	"settings.about.description":
		"Узнайте больше о Тилли или повторите вводный тур.",
	"settings.about.visit": "Посетить сайт",
	"settings.about.learnMore": "Узнать о ведении дневника",
	"settings.about.redoTour": "Пройти тур",
	"settings.language.title": "Язык",
	"settings.language.description": "Выберите предпочитаемый язык.",
	"settings.language.select.label": "Язык",
	"settings.language.comingSoon": "Скоро будут доступны другие языки",
	// PWA-related settings
	"settings.pwa.title": "Установка приложения",
	"settings.pwa.description.mobile":
		"Получите лучший опыт с push-уведомлениями и быстрым доступом.",
	"settings.pwa.description.desktop":
		"Установите Тилли как приложение для чистого интерфейса и быстрого доступа.",
	"settings.pwa.status.label": "Статус",
	"settings.pwa.status.installed": "✅ Тилли установлена как приложение",
	"settings.pwa.status.browser": "📱 Тилли работает в браузере",
	"settings.pwa.install.button": "Установить приложение",
	"settings.pwa.install.description.mobile":
		"Добавьте Тилли на главный экран для быстрого доступа. Push-уведомления требуют входа.",
	"settings.pwa.install.description.desktop":
		"Установите Тилли как приложение для удаления UI браузера и запуска как любое другое приложение.",
	"settings.pwa.benefits.title": "Преимущества, которыми вы пользуетесь:",
	"settings.pwa.benefits.mobile.notifications":
		"• Push-уведомления (при входе)",
	"settings.pwa.benefits.mobile.startup": "• Более быстрый запуск приложения",
	"settings.pwa.benefits.mobile.experience": "• Опыт нативного приложения",
	"settings.pwa.benefits.mobile.icon":
		"• Специальная иконка приложения на главном экране",
	"settings.pwa.benefits.desktop.interface":
		"• Чистый интерфейс без UI браузера",
	"settings.pwa.benefits.desktop.launch":
		"• Запуск как любое другое десктопное приложение",
	"settings.pwa.benefits.desktop.startup": "• Более быстрый запуск приложения",
	"settings.pwa.benefits.desktop.window": "• Отдельное окно приложения",
	"settings.pwa.hideInstall.label": "Скрыть кнопку установки",
	"settings.pwa.hideInstall.description":
		"Скрыть кнопку установки из меню навигации",
	// PWA installation dialogs
	"pwa.install.title": "Установить Тилли",
	"pwa.install.addToHomeScreen.chrome":
		'Выберите "Добавить на главный экран" или "Установить приложение"',
	"pwa.install.addToHomeScreen.confirm":
		'Нажмите "Добавить" или "Установить" для подтверждения',
	"pwa.install.safari.scrollDown":
		'Прокрутите вниз и нажмите "Добавить на главный экран"',
	"pwa.install.safari.confirm": 'Нажмите "Добавить" для подтверждения',
	"pwa.install.chrome.browser": "Chrome/Edge:",
	"pwa.install.safari.browser": "Safari (Mac):",
	"pwa.install.firefox.browser": "Firefox:",
	"pwa.install.generic.instruction":
		'Найдите опцию "Установить" или "Добавить на главный экран" в вашем браузере',
	"pwa.install.followPrompts":
		"Следуйте подсказкам для добавления Тилли на главный экран",
	"pwa.install.dialog.title": "Установить Тилли",
	"pwa.install.dialog.description.mobile":
		"Установите Тилли как приложение для быстрого доступа и push-уведомлений.",
	"pwa.install.dialog.description.desktop":
		"Установите Тилли как приложение для чистого интерфейса и быстрого доступа.",
	"pwa.install.dialog.later": "Может быть позже",
	"pwa.install.dialog.browser.title":
		"Установите Тилли прямо из браузера для лучшего опыта.",
	"pwa.install.dialog.install": "Установить сейчас",
	"pwa.install.android.title":
		"Чтобы установить Тилли как PWA на Android устройство:",
	"pwa.install.android.step1":
		'Выберите "Добавить на главный экран" или "Установить приложение"',
	"pwa.install.android.step2":
		'Нажмите "Добавить" или "Установить" для подтверждения',
	"pwa.install.ios.title": "Чтобы установить Тилли как PWA на iPhone или iPad:",
	"pwa.install.ios.step1":
		'Прокрутите вниз и нажмите "Добавить на главный экран"',
	"pwa.install.ios.step2": 'Нажмите "Добавить" для подтверждения',
	"pwa.install.ios.note":
		"Примечание: На iOS установка доступна только через браузер Safari.",
	"pwa.install.desktop.browser.title":
		"Установите Тилли прямо из браузера для более чистого опыта.",
	"pwa.install.desktop.title": "Чтобы установить Тилли как PWA на десктопе:",
	"pwa.install.desktop.chrome": "Chrome/Edge:",
	"pwa.install.desktop.chrome.instruction":
		"Найдите кнопку установки в адресной строке",
	"pwa.install.desktop.safari": "Safari (Mac):",
	"pwa.install.desktop.safari.instruction":
		"Нажмите ... Поделиться → Добавить в Dock",
	"pwa.install.desktop.firefox": "Firefox:",
	"pwa.install.desktop.firefox.instruction": "Поддержка установки варьируется",
	"pwa.install.generic.title": "Чтобы установить Тилли как PWA:",
	"pwa.install.generic.step1":
		'Найдите опцию "Установить" или "Добавить на главный экран" в меню браузера',
	"pwa.install.generic.step2":
		"Следуйте подсказкам для добавления Тилли на главный экран",
	"pwa.install.android.menuStep":
		"Нажмите меню (⋮) или кнопку {#shareIcon}поделиться{/shareIcon} в браузере",
	"pwa.install.ios.shareStep":
		"Нажмите кнопку {#shareIcon}Поделиться{/shareIcon} внизу Safari",
	// Notifications settings
	"notifications.title": "Push-уведомления",
	"notifications.description":
		"Выберите, когда вы хотите получать уведомления-напоминания и управляйте устройствами.",
	"notifications.signInRequired.title":
		"Войдите для доступа к push-уведомлениям",
	"notifications.timing.heading": "Время",
	"notifications.timezone.label": "Часовой пояс",
	"notifications.timezone.change": "Изменить",
	"notifications.timezone.usingDefault":
		"Используется часовой пояс вашего устройства по умолчанию",
	"notifications.timezone.dialog.title": "Изменить часовой пояс",
	"notifications.timezone.current.label": "Текущий часовой пояс",
	"notifications.timezone.new.label": "Новый часовой пояс",
	"notifications.timezone.new.placeholder": "например, Europe/Moscow",
	"notifications.timezone.new.description":
		'Введите действительный IANA идентификатор часового пояса, например "Europe/Moscow", "America/New_York" или "Asia/Tokyo"',
	"notifications.timezone.detectDevice": "Определить часовой пояс устройства",
	"notifications.timezone.cancel": "Отмена",
	"notifications.timezone.save": "Сохранить",
	"notifications.timezone.invalid": "Неверный идентификатор часового пояса",
	"notifications.time.label": "Время уведомления",
	"notifications.time.change": "Изменить",
	"notifications.time.defaultMessage":
		"Используется 12:00 в качестве времени уведомления по умолчанию",
	"notifications.time.customMessage":
		"Вы будете получать уведомления в это время каждый день в вашем часовом поясе",
	"notifications.time.dialog.title": "Изменить время уведомления",
	"notifications.time.current.label": "Текущее время уведомления",
	"notifications.time.new.label": "Новое время уведомления",
	"notifications.time.new.placeholder": "Выберите время уведомления",
	"notifications.time.description":
		"Выберите, когда вы хотите получать ежедневные уведомления-напоминания.",
	"notifications.devices.heading": "Устройства",
	"notifications.devices.description":
		"Управляйте устройствами, зарегистрированными для push-уведомлений.",
	"notifications.devices.noDevices.description":
		"Добавьте устройства для получения push-уведомлений.",
	"notifications.devices.noDevices.title": "Устройства не добавлены",
	"notifications.devices.noDevices.warning":
		"Вы НЕ будете получать никаких уведомлений, пока не добавите хотя бы одно устройство. Добавьте это устройство, чтобы начать получать напоминания.",
	"notifications.devices.thisDevice": "Это устройство",
	"notifications.devices.actions.title": "Действия с устройством",
	"notifications.devices.actions.description":
		'Что вы хотите сделать с "{$deviceName}"?',
	"notifications.devices.table.device": "Устройство",
	"notifications.devices.table.browser": "Браузер",
	"notifications.devices.table.os": "ОС",
	"notifications.devices.table.lastActive": "Последняя активность",
	"notifications.devices.table.status": "Статус",
	"notifications.devices.remove": "Удалить",
	"notifications.devices.editName": "Редактировать имя",
	"notifications.devices.editDialog.title": "Редактировать имя устройства",
	"notifications.devices.editDialog.description":
		"Измените отображаемое имя для этого устройства.",
	"notifications.devices.remove.confirm.title": "Удалить устройство",
	"notifications.devices.remove.confirm.description":
		"Вы уверены, что хотите удалить это устройство? Вы перестанете получать на него уведомления.",
	"notifications.devices.remove.confirm.cancel": "Отмена",
	"notifications.devices.remove.confirm.remove": "Удалить",
	"notifications.devices.status.active": "Активно",
	"notifications.devices.status.inactive": "Неактивно",
	"notifications.devices.empty":
		"Пока не зарегистрировано устройств для уведомлений.",
	"notifications.devices.enabled": "Включено",
	"notifications.devices.disabled": "Отключено",
	"notifications.devices.sendTest": "Отправить тестовое уведомление",
	"notifications.devices.sendingTest": "Отправка...",
	"notifications.devices.enable": "Включить уведомления",
	"notifications.devices.disable": "Отключить уведомления",
	"notifications.devices.endpointPrefix": "Конечная точка:",
	"notifications.enable.heading": "Включить уведомления",
	"notifications.enable.description":
		"Чтобы получать напоминания как push-уведомления, включите уведомления для вашего аккаунта.",
	"notifications.enable.step1": "Предоставьте разрешение при запросе браузера.",
	"notifications.enable.step2":
		"Оставьте это устройство зарегистрированным для уведомлений.",
	"notifications.enable.button": "Включить Push-уведомления",
	"notifications.enable.success": "Уведомления успешно включены!",
	"notifications.enable.error": "Не удалось включить уведомления.",
	"notifications.permission.denied.title": "Разрешение отклонено",
	"notifications.permission.denied.description":
		"Уведомления заблокированы в настройках браузера. Пожалуйста, включите их для получения напоминаний.",
	"notifications.permission.openSettings": "Открыть настройки браузера",
	"notifications.register.title": "Зарегистрировать устройство",
	"notifications.register.description":
		"Зарегистрируйте это устройство для получения push-уведомлений.",
	"notifications.register.button": "Зарегистрировать",
	"notifications.register.success": "Устройство успешно зарегистрировано!",
	"notifications.register.error": "Не удалось зарегистрировать устройство.",
	"notifications.unregister.title": "Отменить регистрацию устройства",
	"notifications.unregister.description":
		"Прекратить получение уведомлений на это устройство.",
	"notifications.unregister.button": "Отменить регистрацию",
	"notifications.unregister.success":
		"Регистрация устройства успешно отменена!",
	"notifications.unregister.error":
		"Не удалось отменить регистрацию устройства.",
	"notifications.devices.permissionError":
		"Не удалось запросить разрешение на уведомления",
	"notifications.toast.unsubscribeFailed":
		"Не удалось отписаться от уведомлений",
	"notifications.toast.subscribeFailed":
		"Не удалось подписаться на push-уведомления",
	"notifications.toast.testSendFailed":
		"Не удалось отправить тестовое уведомление",
	"notifications.toast.testSendSuccess": "Тестовое уведомление отправлено",
	"notifications.toast.deviceRemoved": "Устройство успешно удалено",
	"notifications.toast.deviceAdded": "Устройство успешно добавлено!",
	"notifications.toast.nameUpdated": "Имя устройства обновлено",
	"notifications.lastDelivery.label": "Последняя проверка уведомлений",
	"notifications.lastDelivery.reset": "Сбросить",
	"notifications.lastDelivery.description":
		"Когда последний раз проверялись напоминания и, при необходимости, доставлялись. Сбросьте это, чтобы принудительно выполнить еще одну проверку при следующем часовом запуске.",
	"notifications.devices.addButton": "Добавить это устройство",
	"notifications.devices.addDialog.title": "Добавить это устройство",
	"notifications.devices.addDialog.description.enabled":
		"Включите push-уведомления для этого устройства, чтобы получать напоминания.",
	"notifications.devices.addDialog.description.blocked":
		"Push-уведомления заблокированы. Пожалуйста, включите их в настройках браузера.",
	"notifications.devices.nameLabel": "Имя устройства",
	"notifications.devices.name.required": "Имя устройства обязательно",
	"notifications.devices.adding": "Добавление...",
	"notifications.iosRequirement.title":
		"Push-уведомления требуют установки приложения",
	"notifications.iosRequirement.description":
		"На iOS push-уведомления доступны только после установки Tilly на главный экран. Установите приложение из раздела установки приложений ниже, чтобы включить push-уведомления.",
	"notifications.browserNotSupported.title": "Push-уведомления недоступны",
	"notifications.browserNotSupported.recommendation.ios":
		"На iOS пожалуйста используйте Safari и установите приложение для полного опыта Tilly.",
	"notifications.browserNotSupported.recommendation.iosInApp":
		"На iOS пожалуйста откройте эту ссылку в Safari и установите приложение для полного опыта Tilly.",
	"notifications.browserNotSupported.recommendation.android":
		"На Android пожалуйста используйте Chrome и установите приложение для полного опыта Tilly.",
	"notifications.browserNotSupported.recommendation.androidInApp":
		"На Android пожалуйста откройте эту ссылку в Chrome и установите приложение для полного опыта Tilly.",
	"notifications.browserNotSupported.recommendation.windows":
		"На Windows пожалуйста используйте Chrome или Edge для полного опыта Tilly.",
	"notifications.browserNotSupported.recommendation.macos":
		"На macOS пожалуйста используйте Chrome или Safari для полного опыта Tilly.",
	"notifications.browserNotSupported.recommendation.generic":
		"Пожалуйста попробуйте использовать Chrome, Edge или Safari для полного опыта Tilly.",
	// Server not configured messages for push notifications
	"notifications.serverNotConfigured.title": "Требуется настройка сервера",
	"notifications.serverNotConfigured.description":
		"Push-уведомления требуют подключения к серверу. Настройте URL сервера в разделе Серверные функции, чтобы включить push-уведомления.",
	"notifications.serverNotConfigured.alternative":
		"Без сервера вы все еще можете использовать основные функции Tilly. Ваши данные хранятся локально и синхронизируются через Jazz.",
	"notifications.serverNotConfigured.configureButton": "Настроить сервер",
	// Status messages
	"status.offline.title": "Вы оффлайн",
	"status.update.title": "Доступно обновление",
	"status.offline.tooltip": "Вы оффлайн",
	"status.offline.dialog.title": "Режим оффлайн",
	"status.offline.description": "Большая часть Tilly работает оффлайн.",
	"status.offline.feature.core":
		"Просмотр и редактирование людей, заметок и напоминаний",
	"status.offline.feature.requiresInternet":
		"Синхронизация, push-уведомления и Ассистент Tilly требуют интернет",
	"status.update.tooltip": "Доступно обновление",
	"status.update.dialog.title": "Доступно обновление",
	"status.update.description":
		"Доступна новая версия Tilly с улучшениями и исправлениями ошибок.",
	"status.update.updating": "Обновление...",
	"status.update.updateNow": "Обновить сейчас",
	"status.update.later": "Позже",
	"status.notSignedIn.tooltip": "Вы не вошли",
	"status.notSignedIn.dialog.title": "Вы не вошли",
	"status.notSignedIn.browserOnly":
		"Без входа данные хранятся только в браузере",
	"status.notSignedIn.benefits":
		"Войдите, чтобы сохранять и синхронизировать данные, и получать push-уведомления",
	"status.notSignedIn.signIn": "Войти",

	// Server settings
	"settings.server.title": "Серверные функции",
	"settings.server.description":
		"Настройте дополнительные серверные функции, такие как AI-чат и push-уведомления.",
	"settings.server.url.label": "URL сервера",
	"settings.server.url.placeholder": "https://ваш-сервер.com",
	"settings.server.test": "Тест",
	"settings.server.testing": "Тестирование...",
	"settings.server.connected": "Успешно подключено",
	"settings.server.connectionFailed": "Ошибка подключения",
	"settings.server.aiChat.label": "Включить AI-чат",
	"settings.server.push.label": "Включить push-уведомления",
	"settings.server.notConfigured":
		"URL сервера не настроен. Серверные функции, такие как AI-чат и push-уведомления, требуют подключения к серверу.",
	"settings.server.status.connected": "Подключено",
	"settings.server.status.disconnected": "Отключено",
	"settings.server.status.notConfigured": "Не настроено",
	"settings.server.status.checking": "Проверка...",
})
