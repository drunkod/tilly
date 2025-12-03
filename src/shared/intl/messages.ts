import { merge, check } from "@ccssmnn/intl"

// Consolidated catalog modules
import {
	basePeopleMessages,
	dePeopleMessages,
	ruPeopleMessages,
} from "./messages.people"
import {
	baseRemindersMessages,
	deRemindersMessages,
	ruRemindersMessages,
} from "./messages.reminders"
import {
	baseNotesMessages,
	deNotesMessages,
	ruNotesMessages,
} from "./messages.notes"
import {
	baseSettingsMessages,
	deSettingsMessages,
	ruSettingsMessages,
} from "./messages.settings"
import {
	baseAssistantMessages,
	deAssistantMessages,
	ruAssistantMessages,
} from "./messages.assistant"
import { baseUiMessages, deUiMessages, ruUiMessages } from "./messages.ui"
import {
	baseServerMessages,
	deServerMessages,
	ruServerMessages,
} from "./messages.server"
import {
	baseTourMessages,
	deTourMessages,
	ruTourMessages,
} from "./messages.tour"

export { messagesEn, messagesDe, messagesRu }

let messagesEn = merge(
	basePeopleMessages,
	baseRemindersMessages,
	baseNotesMessages,
	baseSettingsMessages,
	baseAssistantMessages,
	baseUiMessages,
	baseServerMessages,
	baseTourMessages,
)

let messagesDe = check(
	messagesEn,
	dePeopleMessages,
	deRemindersMessages,
	deNotesMessages,
	deSettingsMessages,
	deAssistantMessages,
	deUiMessages,
	deServerMessages,
	deTourMessages,
)

let messagesRu = check(
	messagesEn,
	ruPeopleMessages,
	ruRemindersMessages,
	ruNotesMessages,
	ruSettingsMessages,
	ruAssistantMessages,
	ruUiMessages,
	ruServerMessages,
	ruTourMessages,
)
