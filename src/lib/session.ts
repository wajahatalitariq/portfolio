import { cookies } from 'next/headers'

/**
 * Session Management Utilities
 * 
 * Handles setting, clearing, and checking the admin authentication cookie.
 * This is a lightweight way to manage access to the admin dashboard.
 */
const SESSION_COOKIE_NAME = 'admin_session'

export async function setAdminSession() {
    (await cookies()).set({
        name: SESSION_COOKIE_NAME,
        value: 'authenticated',
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
    })
}

export async function clearAdminSession() {
    (await cookies()).delete(SESSION_COOKIE_NAME)
}

export async function checkAdminSession() {
    const cookieStore = await cookies()
    const val = cookieStore.get(SESSION_COOKIE_NAME)?.value
    return val === 'authenticated'
}
