import { usePasskeyAuth, useLogOut, useIsAuthenticated } from "jazz-tools/react"

const APPLICATION_NAME = "Tilly"

export function useAuthStatus() {
	return useIsAuthenticated()
}

export function useAuth() {
	return usePasskeyAuth({ appName: APPLICATION_NAME })
}

export function useSignOut() {
	return useLogOut()
}
