
# Step-by-Step Guide to Add a New Translation Language

## Overview
Your app uses the `@ccssmnn/intl` library for internationalization and currently supports English (base) and German. Here's how to add a new language (e.g., French, Spanish, etc.).

## Files That Need Changes

### 1. **Message Catalog Files** (8 files in `src/shared/intl/`)
You need to add translations in each of these message catalog files: tilly:1-3 tilly:1-3 tilly:1-3 tilly:1-3 tilly:1-3 tilly:1-3 tilly:1-3 tilly:1-3 

### 2. **Main Messages File** tilly:1-42 

### 3. **Setup File** tilly:1-9 

### 4. **Astro Configuration** tilly:17-23 

### 5. **Main App File** tilly:48-70 

### 6. **Settings Page** tilly:125-172 

## Step-by-Step Instructions

### **Step 1: Add Translations to Each Message Catalog File**

For each of the 8 message catalog files, create a new translated message object. For example, for French (`fr`):

**In each file** (messages.ui.ts, messages.assistant.ts, etc.):

1. Look at how German translations are created using the `translate()` function tilly:141-149 

2. Create a new constant like `frUiMessages`, `frAssistantMessages`, etc. using the same pattern
3. Export the new message object alongside the existing ones tilly:3-3 

**Example pattern for each file:**
```typescript
const frUiMessages = translate(baseUiMessages, {
  "common.cancel": "Annuler",
  "common.save": "Enregistrer",
  // ... translate all keys
})
```

### **Step 2: Update Main Messages File**

Add imports and merge your new language translations: tilly:1-42 

Add:
- Import statements for your new language messages (e.g., `frUiMessages`, `frAssistantMessages`, etc.)
- Export a new merged message catalog (e.g., `messagesFr`)
- Use the `check()` function to ensure all keys are translated

### **Step 3: Update Setup File**

Currently, the setup only initializes English. You may need to adjust this file depending on your implementation strategy. tilly:1-9 

### **Step 4: Update Astro Config**

Add your new locale to the locales array: tilly:17-23 

Add your language code (e.g., `"fr"`) to the `locales` array.

### **Step 5: Update Main App File**

Add logic to handle your new language in the IntlProvider: tilly:48-70 

Add a new conditional block for your language that imports and uses the new message catalog.

### **Step 6: Update Settings Page**

Add your new language option to the language selector: tilly:153-165 

Add a new `<SelectItem>` for your language.

### **Step 7: Update Language Display Names**

Add the display name for your new language in the UI messages. You'll need to add keys like:
- `"language.name.fr": "Français"` (in base messages)
- `"language.name.fr": "Französisch"` (in German messages)
- `"language.name.fr": "French"` (in French messages)

## Complete File List for Adding New Language

1. ✅ `src/shared/intl/messages.ui.ts` - Add new translated UI messages
2. ✅ `src/shared/intl/messages.assistant.ts` - Add new translated assistant messages
3. ✅ `src/shared/intl/messages.settings.ts` - Add new translated settings messages
4. ✅ `src/shared/intl/messages.people.ts` - Add new translated people messages
5. ✅ `src/shared/intl/messages.reminders.ts` - Add new translated reminders messages
6. ✅ `src/shared/intl/messages.notes.ts` - Add new translated notes messages
7. ✅ `src/shared/intl/messages.server.ts` - Add new translated server messages
8. ✅ `src/shared/intl/messages.tour.ts` - Add new translated tour messages
9. ✅ `src/shared/intl/messages.ts` - Import and merge all new translations
10. ✅ `src/shared/intl/setup.ts` - Update if needed for new locale
11. ✅ `astro.config.ts` - Add new locale to config
12. ✅ `src/app/main.tsx` - Add IntlProvider logic for new language
13. ✅ `src/app/routes/_app.settings.tsx` - Add language option to selector

## Notes

- The `translate()` function ensures type safety - you must translate **all** keys from the base messages
- Message keys use dot-notation (e.g., `"common.cancel"`, `"settings.auth.title"`)
- Messages support parameters using `{$variableName}` syntax tilly:16-18 
- ICU MessageFormat is used for pluralization tilly:96-99 
- The user's language preference is stored in `UserAccount.root.language` and syncs across devices tilly:56-56
### Citations
**File:** src/shared/intl/messages.ui.ts (L1-3)
```typescript
import { messages, translate } from "@ccssmnn/intl"

export { baseUiMessages, deUiMessages }
```
**File:** src/shared/intl/messages.ui.ts (L141-149)
```typescript
const deUiMessages = translate(baseUiMessages, {
	// Common UI messages
	"common.cancel": "Abbrechen",
	"common.save": "Speichern",
	"common.change": "Ändern",
	"common.clear": "Löschen",
	"common.add": "Hinzufügen",
	"common.close": "Schließen",
	"common.undo": "Rückgängig",
```
**File:** src/shared/intl/messages.assistant.ts (L1-3)
```typescript
import { messages, translate } from "@ccssmnn/intl"

export { baseAssistantMessages, deAssistantMessages }
```
**File:** src/shared/intl/messages.assistant.ts (L96-99)
```typescript
	"tool.people.found.count":
		".input {$count :number} .match $count one {{Found {$count} person}} * {{Found {$count} people}}",
	"tool.people.found.withQuery":
		'.input {$count :number} .match $count one {{Found {$count} person matching "{$query}"}} * {{Found {$count} people matching "{$query}"}}',
```
**File:** src/shared/intl/messages.settings.ts (L1-3)
```typescript
import { messages, translate } from "@ccssmnn/intl"

export { baseSettingsMessages, deSettingsMessages }
```
**File:** src/shared/intl/messages.settings.ts (L16-18)
```typescript
	"settings.auth.status.label": "Status",
	"settings.auth.status.signedIn": "Signed in as {$email}",
	"settings.auth.status.signedOut": "Not signed in",
```
**File:** src/shared/intl/messages.people.ts (L1-3)
```typescript
import { messages, translate } from "@ccssmnn/intl"

export { basePeopleMessages, dePeopleMessages }
```
**File:** src/shared/intl/messages.reminders.ts (L1-3)
```typescript
import { messages, translate } from "@ccssmnn/intl"

export { baseRemindersMessages, deRemindersMessages }
```
**File:** src/shared/intl/messages.notes.ts (L1-3)
```typescript
import { messages, translate } from "@ccssmnn/intl"

export { baseNotesMessages, deNotesMessages }
```
**File:** src/shared/intl/messages.server.ts (L1-3)
```typescript
import { messages, translate } from "@ccssmnn/intl"

export { baseServerMessages, deServerMessages }
```
**File:** src/shared/intl/messages.tour.ts (L1-3)
```typescript
import { messages, translate } from "@ccssmnn/intl"

export { baseTourMessages, deTourMessages }
```
**File:** src/shared/intl/messages.ts (L1-42)
```typescript
import { merge, check } from "@ccssmnn/intl"

// Consolidated catalog modules
import { basePeopleMessages, dePeopleMessages } from "./messages.people"
import {
	baseRemindersMessages,
	deRemindersMessages,
} from "./messages.reminders"
import { baseNotesMessages, deNotesMessages } from "./messages.notes"
import { baseSettingsMessages, deSettingsMessages } from "./messages.settings"
import {
	baseAssistantMessages,
	deAssistantMessages,
} from "./messages.assistant"
import { baseUiMessages, deUiMessages } from "./messages.ui"
import { baseServerMessages, deServerMessages } from "./messages.server"
import { baseTourMessages, deTourMessages } from "./messages.tour"

export { messagesEn, messagesDe }

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
```
**File:** src/shared/intl/setup.ts (L1-9)
```typescript
import { createIntlForReact } from "@ccssmnn/intl/react"
import { messagesEn } from "./messages"

let { IntlProvider, useIntl, T, useLocale } = createIntlForReact(
	messagesEn,
	"en",
)

export { IntlProvider, useIntl, T, useLocale }
```
**File:** astro.config.ts (L17-23)
```typescript
	i18n: {
		locales: ["en", "de"],
		defaultLocale: "en",
		routing: {
			prefixDefaultLocale: false,
		},
	},
```
**File:** src/app/main.tsx (L48-70)
```typescript
function RouterWithJazz() {
	let { me } = useAccount(UserAccount)

	// Only show splash screen if account is still loading
	if (me === undefined) return <SplashScreen />

	// Pass null for unauthenticated users, me object for authenticated users
	let contextMe = me ? me : null
	let locale = me?.root?.language || "en"

	if (locale === "de") {
		return (
			<IntlProvider messages={messagesDe} locale="de">
				<RouterProvider router={router} context={{ me: contextMe }} />
			</IntlProvider>
		)
	}
	return (
		<IntlProvider>
			<RouterProvider router={router} context={{ me: contextMe }} />
		</IntlProvider>
	)
}
```
**File:** src/app/routes/_app.settings.tsx (L125-172)
```typescript
function LanguageSection() {
	let t = useIntl()
	let data = Route.useLoaderData()
	let { me: subscribedMe } = useAccount(UserAccount, {
		resolve: query,
	})
	let currentMe = subscribedMe ?? data.me

	let currentLang = currentMe?.root?.language || "en"

	function setLanguage(lang: "de" | "en") {
		if (!currentMe?.root) return
		currentMe.root.$jazz.set("language", lang)
	}

	if (!currentMe) {
		return null
	}

	return (
		<SettingsSection
			title={t("settings.language.title")}
			description={t("settings.language.description")}
		>
			<div className="space-y-2">
				<Label>
					<T k="settings.language.select.label" />
				</Label>
				<Select value={currentLang} onValueChange={setLanguage}>
					<SelectTrigger className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent className="w-full">
						<SelectItem value="en">
							<T k="language.name.en" />
						</SelectItem>
						<SelectItem value="de">
							<T k="language.name.de" />
						</SelectItem>
					</SelectContent>
				</Select>
				<TypographyMuted className="text-xs">
					<T k="settings.language.comingSoon" />
				</TypographyMuted>
			</div>
		</SettingsSection>
	)
}
```
## Q2
Please write step by step todo
how add new translate to my app
what files for changes needs
please get list files for add new lang for translate
## Adding a New Translation Language to Tilly
This codemap traces the complete translation system architecture in Tilly, showing how messages are organized in separate catalogs [1a-1d], consolidated into language packages [2a-2d], selected by users [3a-3d], and configured system-wide [4a-4d].
### 1. Translation Message Catalog Structure
The modular translation system with separate message files for each feature area
### 1a. Import translation utilities (`messages.ui.ts:1`)
Core functions for creating and translating messages
```text
import { messages, translate } from "@ccssmnn/intl"
```
### 1b. Define base messages (`messages.ui.ts:5`)
English source messages for UI components
```text
const baseUiMessages = messages({
```
### 1c. Create German translations (`messages.ui.ts:141`)
Translate all base messages to German
```text
const deUiMessages = translate(baseUiMessages, {
```
### 1d. Export message catalogs (`messages.ui.ts:3`)
Make translations available to other modules
```text
export { baseUiMessages, deUiMessages }
```
### 2. Consolidating All Message Catalogs
How separate message files are merged into complete language packages
### 2a. Import all message modules (`messages.ts:4`)
Import base and translated messages from each feature
```text
import { basePeopleMessages, dePeopleMessages } from "./messages.people"
```
### 2b. Merge English messages (`messages.ts:21`)
Combine all base message catalogs into English package
```text
let messagesEn = merge(
```
### 2c. Validate German messages (`messages.ts:32`)
Ensure all German translations match English keys
```text
let messagesDe = check(
```
### 2d. Export language packages (`messages.ts:19`)
Make complete message catalogs available
```text
export { messagesEn, messagesDe }
```
### 3. Language Selection and Switching
How users select language and how the app switches translations
### 3a. Get user's language preference (`main.tsx:56`)
Read language from user account or default to English
```text
let locale = me?.root?.language || "en"
```
### 3b. Check for German locale (`main.tsx:58`)
Conditional logic for German language
```text
if (locale === "de") {
```
### 3c. Apply German translations (`main.tsx:60`)
Wrap app with German message provider
```text
<IntlProvider messages={messagesDe} locale="de">
```
### 3d. Language option in UI (`_app.settings.tsx:161`)
German option in language selector
```text
<SelectItem value="de">
```
### 4. Configuration and Setup
System-level configuration for supported locales
### 4a. Astro i18n configuration (`astro.config.ts:17`)
Configure internationalization in Astro
```text
i18n: {
```
### 4b. Supported locales list (`astro.config.ts:18`)
Declare available languages to the system
```text
locales: ["en", "de"],
```
### 4c. Language display name (`messages.ui.ts:195`)
Localized language name for selector UI
```text
"language.name.de": "🇩🇪 Deutsch",
```
### 4d. Create React components (`setup.ts:4`)
Initialize internationalization for React
```text
let { IntlProvider, useIntl, T, useLocale } = createIntlForReact(
```