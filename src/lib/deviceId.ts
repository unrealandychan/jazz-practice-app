/**
 * Generates and persists a device-scoped UUID in localStorage.
 * When Auth is enabled, call migrateDeviceToUser() to re-key all documents under the user's UID.
 */
const DEVICE_ID_KEY = 'jazz_device_id'

export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'ssr'

  let id = localStorage.getItem(DEVICE_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(DEVICE_ID_KEY, id)
  }
  return id
}
