import { describe, test, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { PasskeyAuthDialog } from "./passkey-auth"

// Mock the jazz-tools/react module
vi.mock("jazz-tools/react", () => ({
	usePasskeyAuth: vi.fn(),
}))

// Mock the UI components
vi.mock("#shared/ui/dialog", () => ({
	Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
		open ? <div data-testid="dialog">{children}</div> : null,
	DialogContent: ({
		children,
		titleSlot,
	}: {
		children: React.ReactNode
		titleSlot: React.ReactNode
	}) => (
		<div data-testid="dialog-content">
			{titleSlot}
			{children}
		</div>
	),
	DialogHeader: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="dialog-header">{children}</div>
	),
	DialogTitle: ({ children }: { children: React.ReactNode }) => (
		<h2 data-testid="dialog-title">{children}</h2>
	),
	DialogDescription: ({ children }: { children: React.ReactNode }) => (
		<p data-testid="dialog-description">{children}</p>
	),
}))

vi.mock("#shared/ui/button", () => ({
	Button: ({
		children,
		onClick,
		disabled,
		variant,
	}: {
		children: React.ReactNode
		onClick?: () => void
		disabled?: boolean
		variant?: string
	}) => (
		<button
			onClick={onClick}
			disabled={disabled}
			data-variant={variant}
			data-testid="button"
		>
			{children}
		</button>
	),
}))

vi.mock("#shared/ui/input", () => ({
	Input: ({
		id,
		value,
		onChange,
		disabled,
		placeholder,
		onKeyDown,
	}: {
		id?: string
		value: string
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
		disabled?: boolean
		placeholder?: string
		onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
	}) => (
		<input
			id={id}
			value={value}
			onChange={onChange}
			disabled={disabled}
			placeholder={placeholder}
			onKeyDown={onKeyDown}
			data-testid="username-input"
		/>
	),
}))

vi.mock("#shared/ui/label", () => ({
	Label: ({
		children,
		htmlFor,
	}: {
		children: React.ReactNode
		htmlFor?: string
	}) => (
		<label htmlFor={htmlFor} data-testid="label">
			{children}
		</label>
	),
}))

describe("PasskeyAuthDialog", () => {
	let mockSignUp = vi.fn()
	let mockLogIn = vi.fn()
	let mockOnOpenChange = vi.fn()

	beforeEach(async () => {
		vi.clearAllMocks()
		mockSignUp = vi.fn()
		mockLogIn = vi.fn()
		mockOnOpenChange = vi.fn()

		let { usePasskeyAuth } = vi.mocked(
			await import("jazz-tools/react"),
		)
		usePasskeyAuth.mockReturnValue({
			signUp: mockSignUp,
			logIn: mockLogIn,
			state: "signedOut",
		} as never)
	})

	test("signup mode renders username input", () => {
		render(
			<PasskeyAuthDialog
				open={true}
				onOpenChange={mockOnOpenChange}
				mode="signup"
			/>,
		)

		expect(screen.getByTestId("username-input")).toBeInTheDocument()
		expect(screen.getByTestId("label")).toHaveTextContent("Username")
		expect(screen.getByTestId("dialog-title")).toHaveTextContent("Sign Up")
	})

	test("login mode hides username input", () => {
		render(
			<PasskeyAuthDialog
				open={true}
				onOpenChange={mockOnOpenChange}
				mode="login"
			/>,
		)

		expect(screen.queryByTestId("username-input")).not.toBeInTheDocument()
		expect(screen.getByTestId("dialog-title")).toHaveTextContent("Log In")
	})

	test("submit button triggers correct auth method in signup mode", async () => {
		let user = userEvent.setup()
		mockSignUp.mockResolvedValue(undefined)

		render(
			<PasskeyAuthDialog
				open={true}
				onOpenChange={mockOnOpenChange}
				mode="signup"
			/>,
		)

		let usernameInput = screen.getByTestId("username-input")
		await user.type(usernameInput, "testuser")

		let buttons = screen.getAllByTestId("button")
		let signUpButton = buttons.find(btn => btn.textContent === "Sign Up")
		expect(signUpButton).toBeDefined()

		await user.click(signUpButton!)

		await waitFor(() => {
			expect(mockSignUp).toHaveBeenCalledWith("testuser")
			expect(mockOnOpenChange).toHaveBeenCalledWith(false)
		})
	})

	test("submit button triggers correct auth method in login mode", async () => {
		let user = userEvent.setup()
		mockLogIn.mockResolvedValue(undefined)

		render(
			<PasskeyAuthDialog
				open={true}
				onOpenChange={mockOnOpenChange}
				mode="login"
			/>,
		)

		let buttons = screen.getAllByTestId("button")
		let logInButton = buttons.find(btn => btn.textContent === "Log In")
		expect(logInButton).toBeDefined()

		await user.click(logInButton!)

		await waitFor(() => {
			expect(mockLogIn).toHaveBeenCalled()
			expect(mockOnOpenChange).toHaveBeenCalledWith(false)
		})
	})

	test("error handling displays messages", async () => {
		let user = userEvent.setup()
		let errorMessage = "Authentication failed"
		mockSignUp.mockRejectedValue(new Error(errorMessage))

		render(
			<PasskeyAuthDialog
				open={true}
				onOpenChange={mockOnOpenChange}
				mode="signup"
			/>,
		)

		let usernameInput = screen.getByTestId("username-input")
		await user.type(usernameInput, "testuser")

		let buttons = screen.getAllByTestId("button")
		let signUpButton = buttons.find(btn => btn.textContent === "Sign Up")
		await user.click(signUpButton!)

		await waitFor(() => {
			let errorElement = screen.getByRole("alert")
			expect(errorElement).toHaveTextContent(errorMessage)
		})
	})

	test("loading states disable interactions", async () => {
		let user = userEvent.setup()
		let resolveSignUp: (() => void) | undefined
		mockSignUp.mockImplementation(
			() =>
				new Promise(resolve => {
					resolveSignUp = resolve as () => void
				}),
		)

		render(
			<PasskeyAuthDialog
				open={true}
				onOpenChange={mockOnOpenChange}
				mode="signup"
			/>,
		)

		let usernameInput = screen.getByTestId("username-input")
		await user.type(usernameInput, "testuser")

		let buttons = screen.getAllByTestId("button")
		let signUpButton = buttons.find(btn => btn.textContent === "Sign Up")
		await user.click(signUpButton!)

		await waitFor(() => {
			let loadingButton = buttons.find(
				btn => btn.textContent === "Please wait...",
			)
			expect(loadingButton).toBeDefined()
			expect(loadingButton).toBeDisabled()
		})

		let usernameInputAfterClick = screen.getByTestId("username-input")
		expect(usernameInputAfterClick).toBeDisabled()

		resolveSignUp?.()
	})
})
