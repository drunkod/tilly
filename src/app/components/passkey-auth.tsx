import { useState } from "react"
import { usePasskeyAuth } from "jazz-tools/react"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "#shared/ui/dialog"
import { Button } from "#shared/ui/button"
import { Input } from "#shared/ui/input"
import { Label } from "#shared/ui/label"

export { PasskeyAuthDialog, APP_NAME }

let APP_NAME = "Tilly"

type PasskeyAuthDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	mode?: "signup" | "login"
}

function PasskeyAuthDialog({
	open,
	onOpenChange,
	mode = "login",
}: PasskeyAuthDialogProps) {
	let [username, setUsername] = useState("")
	let [isLoading, setIsLoading] = useState(false)
	let [error, setError] = useState<string | null>(null)
	let [currentMode, setCurrentMode] = useState(mode)

	let auth = usePasskeyAuth({ appName: APP_NAME })

	async function handleSignUp() {
		if (!username.trim()) {
			setError("Please enter a username")
			return
		}

		setIsLoading(true)
		setError(null)

		try {
			await auth.signUp(username)
			onOpenChange(false)
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Failed to sign up. Please try again.",
			)
		} finally {
			setIsLoading(false)
		}
	}

	async function handleLogIn() {
		setIsLoading(true)
		setError(null)

		try {
			await auth.logIn()
			onOpenChange(false)
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Failed to log in. Please try again.",
			)
		} finally {
			setIsLoading(false)
		}
	}

	function handleModeSwitch() {
		setCurrentMode(currentMode === "login" ? "signup" : "login")
		setError(null)
		setUsername("")
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				titleSlot={
					<DialogHeader>
						<DialogTitle>
							{currentMode === "signup" ? "Sign Up" : "Log In"}
						</DialogTitle>
						<DialogDescription>
							{currentMode === "signup"
								? "Create a new account to sync your data across devices"
								: "Log in to access your account from any device"}
						</DialogDescription>
					</DialogHeader>
				}
			>
				<div className="flex flex-col gap-4">
					{currentMode === "signup" && (
						<div className="flex flex-col gap-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								type="text"
								value={username}
								onChange={e => setUsername(e.target.value)}
								placeholder="Enter your username"
								disabled={isLoading}
								aria-invalid={!!error}
								onKeyDown={e => {
									if (e.key === "Enter" && !isLoading) {
										handleSignUp()
									}
								}}
							/>
						</div>
					)}

					{error && (
						<div className="text-destructive text-sm" role="alert">
							{error}
						</div>
					)}

					<div className="flex flex-col gap-2">
						<Button
							onClick={currentMode === "signup" ? handleSignUp : handleLogIn}
							disabled={
								isLoading || (currentMode === "signup" && !username.trim())
							}
						>
							{isLoading
								? "Please wait..."
								: currentMode === "signup"
									? "Sign Up"
									: "Log In"}
						</Button>

						<Button
							variant="ghost"
							onClick={handleModeSwitch}
							disabled={isLoading}
						>
							{currentMode === "signup"
								? "Already have an account? Log in"
								: "Don't have an account? Sign up"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
