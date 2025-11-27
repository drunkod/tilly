import { messages, translate } from "@ccssmnn/intl"

export { baseServerMessages, deServerMessages, ruServerMessages }

let baseServerMessages = messages({
	"server.push.test-title": "Test Notification",
	"server.push.test-body":
		"This is a test push notification. Your device is configured correctly! 🚀",
	"server.push.dueReminders.title":
		".input {$count :number} .match $count one {{You have one reminder due today}} * {{You have {$count} reminders due today}}",
	"server.push.dueReminders.body":
		"A few moments to reach out could brighten someone's day ✨",

	"server.error.notificationSettingsNotConfigured":
		"NotificationSettings not configured",
	"server.error.deviceNotInList": "the device is not in the device list.",
	"server.error.failedToSendNotification":
		"Failed to send notification to the Push Notification Server.",
})

let deServerMessages = translate(baseServerMessages, {
	"server.push.test-title": "Test-Benachrichtigung",
	"server.push.test-body":
		"Das ist eine Test-Push-Benachrichtigung. Dein Gerät ist korrekt konfiguriert!",
	"server.push.dueReminders.title":
		".input {$count :number} .match $count one {{Du hast eine Erinnerung Heute}} * {{Du hast {$count} Erinnerungen heute}}",
	"server.push.dueReminders.body":
		"Manchmal reicht ein kleiner Moment, um jemandem den Tag zu versüßen ✨",

	"server.error.notificationSettingsNotConfigured":
		"Benachrichtigungseinstellungen nicht konfiguriert",
	"server.error.deviceNotInList": "Das Gerät ist nicht in der Geräteliste.",
	"server.error.failedToSendNotification":
		"Benachrichtigung konnte nicht an den Push-Benachrichtigungsserver gesendet werden.",
})

let ruServerMessages = translate(baseServerMessages, {
	"server.push.test-title": "Тестовое уведомление",
	"server.push.test-body":
		"Это тестовое push-уведомление. Ваше устройство настроено правильно! 🚀",
	"server.push.dueReminders.title":
		".input {$count :number} .match $count one {{У вас одно напоминание на сегодня}} * {{У вас {$count} напоминаний на сегодня}}",
	"server.push.dueReminders.body":
		"Несколько моментов внимания могут скрасить чей-то день ✨",

	"server.error.notificationSettingsNotConfigured":
		"Настройки уведомлений не настроены",
	"server.error.deviceNotInList": "Устройство отсутствует в списке устройств.",
	"server.error.failedToSendNotification":
		"Не удалось отправить уведомление на сервер push-уведомлений.",
})
