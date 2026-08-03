const PENDING_LOGO_KEY = 'pending_business_logo'

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

function base64ToUint8Array(base64) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

/** Store a logo File so it can be uploaded after email verification. */
export async function stashPendingBusinessLogo(file) {
  if (!file) {
    clearPendingBusinessLogo()
    return
  }
  const buffer = await file.arrayBuffer()
  const payload = {
    name: file.name || 'logo.png',
    type: file.type || 'image/png',
    data: arrayBufferToBase64(buffer),
  }
  try {
    sessionStorage.setItem(PENDING_LOGO_KEY, JSON.stringify(payload))
  } catch {
    // Quota exceeded — skip stash; user can upload from profile later
    clearPendingBusinessLogo()
  }
}

export function clearPendingBusinessLogo() {
  try {
    sessionStorage.removeItem(PENDING_LOGO_KEY)
  } catch {
    /* ignore */
  }
}

/** Rebuild File from stash, or null if missing. */
export function takePendingBusinessLogo() {
  try {
    const raw = sessionStorage.getItem(PENDING_LOGO_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.data) return null
    const bytes = base64ToUint8Array(parsed.data)
    const file = new File([bytes], parsed.name || 'logo.png', {
      type: parsed.type || 'image/png',
    })
    clearPendingBusinessLogo()
    return file
  } catch {
    clearPendingBusinessLogo()
    return null
  }
}
