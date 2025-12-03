import { messages, translate } from "@ccssmnn/intl"

export { baseRemindersMessages, deRemindersMessages, ruRemindersMessages }

const baseRemindersMessages = messages({
	// Reminders page messages
	"reminders.title": "Reminders",
	"reminders.pageTitle": "Reminders - Tilly",
	"reminders.search.placeholder": "Find reminders...",
	"reminders.addButton": "Add Reminder",
	"reminders.noPeople.title": "Add people first",
	"reminders.noPeople.description":
		"You need to add people before you can create reminders for them",
	"reminders.noPeople.addButton": "Add Person",
	"reminders.noReminders.title": "Stay connected",
	"reminders.noReminders.description":
		"Reminders help you stay connected and remember to reach out.",
	"reminders.noResults.message": 'No reminders found matching "{$query}"',
	"reminders.noResults.suggestion": "Try adjusting your search terms",
	"reminders.allCaughtUp.title": "All caught up!",
	"reminders.allCaughtUp.description":
		"Tilly will help you remember what's important",
	"reminders.done.count":
		".input {$count :number} .match $count one {{{$count} done reminder}} * {{{$count} done reminders}}",
	"reminders.done.heading": "Done ({$count :number})",
	"reminders.deleted.count":
		".input {$count :number} .match $count one {{{$count} deleted reminder}} * {{{$count} deleted reminders}}",
	"reminders.deleted.heading": "Deleted ({$count :number})",
	"reminders.created.success": "Reminder created",
	"reminders.empty.withSearch": 'No reminders found matching "{$query}"',
	"reminders.empty.noSearch": "No reminders set",
	"reminders.empty.suggestion.withSearch": "Try adjusting your search terms",
	"reminders.empty.suggestion.noSearch":
		"Reminders help you stay connected and remember to reach out.",
	"reminders.add.title": "Reminder",
	"reminders.add.description":
		"Set a reminder to follow up, check in, or remember something important about them.",

	// Individual reminder messages
	"reminder.select.title": "Select Person",
	"reminder.select.description": "Choose who this reminder is for.",
	"reminder.select.placeholder": "Select a person...",
	"reminder.select.empty": "No people found.",
	"reminder.select.search": "Search people...",
	"reminder.add.title": "Add Reminder",
	"reminder.add.description": "Set a reminder for {$person}.",
	"reminder.form.placeholder": "Set a reminder to follow up when it matters",
	"reminder.actions.title": "Reminder Actions",
	"reminder.actions.description":
		"What would you like to do with this reminder?",
	"reminder.actions.markDone": "Mark as Done",
	"reminder.actions.viewPerson": "View Person",
	"reminder.actions.addNote": "Add Note",
	"reminder.actions.delete": "Delete",
	"reminder.actions.edit": "Edit",
	"reminder.status.deleted": "Deleted",
	"reminder.status.done": "Done",
	"reminder.edit.title": "Edit Reminder",
	"reminder.edit.description": "Update the reminder details below.",
	"reminder.addNote.title": "Add Note for {$personName}",
	"reminder.addNote.description":
		"Record a note about your interaction with {$personName}.",
	"reminder.restore.title": "Restore Reminder",
	"reminder.restore.deletionInfo": "This reminder was deleted {$timeAgo}",
	"reminder.restore.permanentDeletionWarning":
		" and is due for permanent deletion.",
	"reminder.restore.permanentDeletionCountdown":
		" and will be permanently deleted in {$days :number} days.",
	"reminder.restore.question": "Would you like to restore it?",
	"reminder.restore.button": "Restore Reminder",
	"reminder.restore.permanentDelete": "Permanently Delete",
	"reminder.permanentDelete.title": "Permanently Delete Reminder",
	"reminder.permanentDelete.confirmation":
		"Are you sure you want to permanently delete this reminder? This action cannot be undone.",
	"reminder.permanentDelete.cancel": "Cancel",
	"reminder.permanentDelete.confirm": "Permanently Delete",
	"reminder.done.actions.title": "Done Reminder Actions",
	"reminder.done.actions.description":
		"What would you like to do with this completed reminder?",
	"reminder.done.markUndone": "Mark as Undone",
	"reminder.done.delete": "Delete",
	"reminder.toast.restored": "Reminder restored",
	"reminder.toast.permanentlyDeleted": "Reminder permanently deleted",
	"reminder.toast.rescheduled": "Reminder rescheduled",
	"reminder.toast.markedDone": "Reminder marked as done",
	"reminder.toast.markedUndone": "Reminder marked as undone",
	"reminder.toast.markedDoneAgain": "Reminder marked as done again",
	"reminder.toast.restoredToPreviousDate": "Reminder restored to previous date",
	"reminder.toast.markedNotDone": "Reminder marked as not done",
	"reminder.toast.updated": "Reminder updated",
	"reminder.toast.updateUndone": "Reminder update undone",
	"reminder.toast.deleted":
		"Reminder deleted - will be permanently deleted in 30 days",
})

const deRemindersMessages = translate(baseRemindersMessages, {
	// Reminders page messages
	"reminders.title": "Erinnerungen",
	"reminders.pageTitle": "Erinnerungen - Tilly",
	"reminders.search.placeholder": "Erinnerungen finden...",
	"reminders.addButton": "Erinnerung hinzufügen",
	"reminders.noPeople.title": "Zuerst Personen hinzufügen",
	"reminders.noPeople.description":
		"Du musst Personen hinzufügen, bevor du Erinnerungen für sie erstellen kannst",
	"reminders.noPeople.addButton": "Person hinzufügen",
	"reminders.noReminders.title": "Verbunden bleiben",
	"reminders.noReminders.description":
		"Erinnerungen helfen dir, in Kontakt zu bleiben und daran zu denken, dich zu melden.",
	"reminders.noResults.message":
		'Keine passenden Erinnerungen zu "{$query}" gefunden',
	"reminders.noResults.suggestion": "Passe deine Suchbegriffe an",
	"reminders.allCaughtUp.title": "Alles erledigt!",
	"reminders.allCaughtUp.description":
		"Tilly hilft dir, an Wichtiges zu denken",
	"reminders.done.count":
		".input {$count :number} .match $count one {{{$count} erledigte Erinnerung}} * {{{$count} erledigte Erinnerungen}}",
	"reminders.done.heading": "Erledigt ({$count :number})",
	"reminders.deleted.count":
		".input {$count :number} .match $count one {{{$count} gelöschte Erinnerung}} * {{{$count} gelöschte Erinnerungen}}",
	"reminders.deleted.heading": "Gelöscht ({$count :number})",
	"reminders.created.success": "Erinnerung erstellt",
	"reminders.empty.withSearch":
		'Keine passenden Erinnerungen zu "{$query}" gefunden',
	"reminders.empty.noSearch": "Noch keine Erinnerungen",
	"reminders.empty.suggestion.withSearch": "Passe deine Suchbegriffe an",
	"reminders.empty.suggestion.noSearch":
		"Erinnerungen helfen dir, in Kontakt zu bleiben und daran zu denken, dich zu melden.",
	"reminders.add.title": "Erinnerung",
	"reminders.add.description":
		"Lege eine Erinnerung fest – zum Nachfassen, Einchecken oder um etwas Wichtiges nicht zu vergessen.",

	// Individual reminder messages
	"reminder.select.title": "Person auswählen",
	"reminder.select.description": "Wähle, für wen diese Erinnerung ist.",
	"reminder.select.placeholder": "Person auswählen...",
	"reminder.select.empty": "Keine Personen gefunden.",
	"reminder.select.search": "Personen suchen...",
	"reminder.add.title": "Erinnerung hinzufügen",
	"reminder.add.description": "Lege eine Erinnerung für {$person} fest.",
	"reminder.form.placeholder":
		"Erinnerung setzen, um nachzufassen, wenn es wichtig ist",
	"reminder.actions.title": "Aktionen zur Erinnerung",
	"reminder.actions.description": "Was möchtest du mit dieser Erinnerung tun?",
	"reminder.actions.markDone": "Als erledigt markieren",
	"reminder.actions.viewPerson": "Person ansehen",
	"reminder.actions.addNote": "Notiz hinzufügen",
	"reminder.actions.delete": "Löschen",
	"reminder.actions.edit": "Bearbeiten",
	"reminder.status.deleted": "Gelöscht",
	"reminder.status.done": "Erledigt",
	"reminder.edit.title": "Erinnerung bearbeiten",
	"reminder.edit.description": "Aktualisiere die Details der Erinnerung.",
	"reminder.addNote.title": "Notiz für {$personName} hinzufügen",
	"reminder.addNote.description":
		"Halte eine Erinnerung zu deiner Interaktion mit {$personName} fest.",
	"reminder.restore.title": "Erinnerung wiederherstellen",
	"reminder.restore.deletionInfo": "Diese Erinnerung wurde {$timeAgo} gelöscht",
	"reminder.restore.permanentDeletionWarning":
		" und steht zur endgültigen Löschung an.",
	"reminder.restore.permanentDeletionCountdown":
		" und wird in {$days :number} Tagen endgültig gelöscht.",
	"reminder.restore.question": "Möchtest du sie wiederherstellen?",
	"reminder.restore.button": "Erinnerung wiederherstellen",
	"reminder.restore.permanentDelete": "Endgültig löschen",
	"reminder.permanentDelete.title": "Erinnerung endgültig löschen",
	"reminder.permanentDelete.confirmation":
		"Bist du sicher, dass du diese Erinnerung endgültig löschen möchtest? Dies kann nicht rückgängig gemacht werden.",
	"reminder.permanentDelete.cancel": "Abbrechen",
	"reminder.permanentDelete.confirm": "Endgültig löschen",
	"reminder.done.actions.title": "Aktionen für erledigte Erinnerung",
	"reminder.done.actions.description":
		"Was möchtest du mit dieser erledigten Erinnerung tun?",
	"reminder.done.markUndone": "Als nicht erledigt markieren",
	"reminder.done.delete": "Löschen",
	"reminder.toast.restored": "Erinnerung wiederhergestellt",
	"reminder.toast.permanentlyDeleted": "Erinnerung endgültig gelöscht",
	"reminder.toast.rescheduled": "Erinnerung neu terminiert",
	"reminder.toast.markedDone": "Erinnerung als erledigt markiert",
	"reminder.toast.markedUndone": "Erinnerung als nicht erledigt markiert",
	"reminder.toast.markedDoneAgain": "Erinnerung erneut als erledigt markiert",
	"reminder.toast.restoredToPreviousDate":
		"Erinnerung auf vorheriges Datum zurückgesetzt",
	"reminder.toast.markedNotDone": "Erinnerung als nicht erledigt markiert",
	"reminder.toast.updated": "Erinnerung aktualisiert",
	"reminder.toast.updateUndone":
		"Aktualisierung der Erinnerung rückgängig gemacht",
	"reminder.toast.deleted":
		"Erinnerung gelöscht – wird in 30 Tagen endgültig gelöscht",
})

const ruRemindersMessages = translate(baseRemindersMessages, {
	// Reminders page messages
	"reminders.title": "Напоминания",
	"reminders.pageTitle": "Напоминания - Тилли",
	"reminders.search.placeholder": "Найти напоминания...",
	"reminders.addButton": "Добавить напоминание",
	"reminders.noPeople.title": "Сначала добавьте людей",
	"reminders.noPeople.description":
		"Вам нужно добавить людей, прежде чем создавать для них напоминания",
	"reminders.noPeople.addButton": "Добавить человека",
	"reminders.noReminders.title": "Оставайтесь на связи",
	"reminders.noReminders.description":
		"Напоминания помогают вам оставаться на связи и не забывать связаться.",
	"reminders.noResults.message": 'Нет напоминаний, соответствующих "{$query}"',
	"reminders.noResults.suggestion": "Попробуйте изменить поисковый запрос",
	"reminders.allCaughtUp.title": "Всё выполнено!",
	"reminders.allCaughtUp.description":
		"Тилли поможет вам запомнить то, что важно",
	"reminders.done.count":
		".input {$count :number} .match $count one {{{$count} выполненное напоминание}} * {{{$count} выполненных напоминаний}}",
	"reminders.done.heading": "Выполненные ({$count :number})",
	"reminders.deleted.count":
		".input {$count :number} .match $count one {{{$count} удаленное напоминание}} * {{{$count} удаленных напоминаний}}",
	"reminders.deleted.heading": "Удаленные ({$count :number})",
	"reminders.created.success": "Напоминание создано",
	"reminders.empty.withSearch": 'Нет напоминаний, соответствующих "{$query}"',
	"reminders.empty.noSearch": "Напоминания не установлены",
	"reminders.empty.suggestion.withSearch":
		"Попробуйте изменить поисковый запрос",
	"reminders.empty.suggestion.noSearch":
		"Напоминания помогают вам оставаться на связи и не забывать связаться.",
	"reminders.add.title": "Напоминание",
	"reminders.add.description":
		"Установите напоминание, чтобы связаться, узнать как дела или запомнить что-то важное о них.",

	// Individual reminder messages
	"reminder.select.title": "Выбрать человека",
	"reminder.select.description": "Выберите, для кого это напоминание.",
	"reminder.select.placeholder": "Выберите человека...",
	"reminder.select.empty": "Люди не найдены.",
	"reminder.select.search": "Поиск людей...",
	"reminder.add.title": "Добавить напоминание",
	"reminder.add.description": "Установите напоминание для {$person}.",
	"reminder.form.placeholder":
		"Установите напоминание, чтобы связаться в нужный момент",
	"reminder.actions.title": "Действия с напоминанием",
	"reminder.actions.description": "Что вы хотите сделать с этим напоминанием?",
	"reminder.actions.markDone": "Отметить как выполненное",
	"reminder.actions.viewPerson": "Посмотреть контакт",
	"reminder.actions.addNote": "Добавить заметку",
	"reminder.actions.delete": "Удалить",
	"reminder.actions.edit": "Редактировать",
	"reminder.status.deleted": "Удалено",
	"reminder.status.done": "Выполнено",
	"reminder.edit.title": "Редактировать напоминание",
	"reminder.edit.description": "Обновите детали напоминания.",
	"reminder.addNote.title": "Добавить заметку для {$personName}",
	"reminder.addNote.description":
		"Запишите заметку о вашем взаимодействии с {$personName}.",
	"reminder.restore.title": "Восстановить напоминание",
	"reminder.restore.deletionInfo": "Это напоминание было удалено {$timeAgo}",
	"reminder.restore.permanentDeletionWarning":
		" и готово к окончательному удалению.",
	"reminder.restore.permanentDeletionCountdown":
		" и будет окончательно удалено через {$days :number} дней.",
	"reminder.restore.question": "Хотите восстановить его?",
	"reminder.restore.button": "Восстановить напоминание",
	"reminder.restore.permanentDelete": "Удалить навсегда",
	"reminder.permanentDelete.title": "Окончательно удалить напоминание",
	"reminder.permanentDelete.confirmation":
		"Вы уверены, что хотите окончательно удалить это напоминание? Это действие нельзя отменить.",
	"reminder.permanentDelete.cancel": "Отмена",
	"reminder.permanentDelete.confirm": "Удалить навсегда",
	"reminder.done.actions.title": "Действия с выполненным напоминанием",
	"reminder.done.actions.description":
		"Что вы хотите сделать с этим выполненным напоминанием?",
	"reminder.done.markUndone": "Отметить как невыполненное",
	"reminder.done.delete": "Удалить",
	"reminder.toast.restored": "Напоминание восстановлено",
	"reminder.toast.permanentlyDeleted": "Напоминание окончательно удалено",
	"reminder.toast.rescheduled": "Напоминание перенесено",
	"reminder.toast.markedDone": "Напоминание отмечено как выполненное",
	"reminder.toast.markedUndone": "Напоминание отмечено как невыполненное",
	"reminder.toast.markedDoneAgain":
		"Напоминание снова отмечено как выполненное",
	"reminder.toast.restoredToPreviousDate":
		"Напоминание восстановлено на предыдущую дату",
	"reminder.toast.markedNotDone": "Напоминание отмечено как невыполненное",
	"reminder.toast.updated": "Напоминание обновлено",
	"reminder.toast.updateUndone": "Обновление напоминания отменено",
	"reminder.toast.deleted":
		"Напоминание удалено - будет окончательно удалено через 30 дней",
})
