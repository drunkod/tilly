import { CreatePersonResult } from "./people/create-ui"
import { UpdatePersonResult, DeletePersonResult } from "./people/update-ui"
import { ListPeopleResult, GetPersonDetailsResult } from "./people/read-ui"
import { AddNoteResult } from "./notes/create-ui"
import { EditNoteResult, DeleteNoteResult } from "./notes/update-ui"
import { AddReminderResult } from "./reminders/create-ui"
import {
	UpdateReminderResult,
	RemoveReminderResult,
} from "./reminders/update-ui"
import { ListRemindersResult } from "./reminders/read-ui"
import { UserQuestionResult } from "./system/user-question-ui"

export { ToolResultRenderer }

type ToolResultProps = {
	toolName: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	result: any
	userId?: string
}

function ToolResultRenderer({ toolName, result, userId }: ToolResultProps) {
	switch (toolName) {
		case "listPeople":
			return <ListPeopleResult result={result} />
		case "getPersonDetails":
			return <GetPersonDetailsResult result={result} />
		case "createPerson":
			return <CreatePersonResult result={result} />
		case "updatePerson":
			return <UpdatePersonResult result={result} />
		case "deletePerson":
			return <DeletePersonResult result={result} />
		case "addNote":
			return <AddNoteResult result={result} />
		case "editNote":
			return <EditNoteResult result={result} />
		case "deleteNote":
			return <DeleteNoteResult result={result} />
		case "addReminder":
			return <AddReminderResult result={result} userId={userId!} />
		case "updateReminder":
			return <UpdateReminderResult result={result} userId={userId!} />
		case "removeReminder":
			return <RemoveReminderResult result={result} userId={userId!} />
		case "listReminders":
			return <ListRemindersResult result={result} />
		case "userQuestion":
			return <UserQuestionResult result={result} />
		default:
			return null
	}
}
