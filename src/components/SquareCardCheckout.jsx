import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { businessApi, ApiError } from '../services/api'

function loadSquareSdk(environment) {
  const isSandbox = environment !== 'production'
  const src = isSandbox
    ? 'https://sandbox.web.squarecdn.com/v1/square.js'
    : 'https://web.squarecdn.com/v1/square.js'

  if (window.Square) return Promise.resolve(window.Square)

  const existing = document.querySelector(`script[src="${src}"]`)
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(window.Square))
      existing.addEventListener('error', () => reject(new Error('Failed to load Square.js')))
      if (window.Square) resolve(window.Square)
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve(window.Square)
    script.onerror = () => reject(new Error('Failed to load Square.js'))
    document.head.appendChild(script)
  })
}

function formatMoneyAmount(cents) {
  const value = Math.max(0, Number(cents) || 0) / 100
  return value.toFixed(2)
}

function currencyToCountry(currency) {
  const code = String(currency || 'GBP').toUpperCase()
  if (code === 'GBP') return 'GB'
  if (code === 'EUR') return 'IE'
  if (code === 'USD') return 'US'
  if (code === 'CAD') return 'CA'
  if (code === 'AUD') return 'AU'
  return 'GB'
}

function splitName(fullName = '') {
  const parts = String(fullName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return { givenName: 'Customer', familyName: 'Account' }
  if (parts.length === 1) return { givenName: parts[0], familyName: 'Account' }
  return { givenName: parts[0], familyName: parts.slice(1).join(' ') }
}

function buildBillingContact({ buyerName, buyerEmail, currency }) {
  const { givenName, familyName } = splitName(buyerName)
  const countryCode = currencyToCountry(currency)
  return {
    givenName,
    familyName,
    email: buyerEmail || undefined,
    countryCode,
    ...(countryCode === 'GB'
      ? { city: 'London', postalCode: 'SW1A 1AA' }
      : { city: 'New York', postalCode: '10001' }),
  }
}

function formatPaymentMethod(method) {
  if (!method?.last4) return null
  const brand = String(method.brand || 'Card')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
  const exp =
    method.expMonth && method.expYear
      ? ` · Expires ${String(method.expMonth).padStart(2, '0')}/${String(method.expYear).slice(-2)}`
      : ''
  return `${brand} •••• ${method.last4}${exp}`
}

function isLocalHost() {
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]'
}

function canUseApplePayBrowser() {
  try {
    return (
      typeof window !== 'undefined' &&
      window.ApplePaySession &&
      typeof window.ApplePaySession.canMakePayments === 'function' &&
      window.ApplePaySession.canMakePayments()
    )
  } catch {
    return false
  }
}

export default function SquareCardCheckout({
  open,
  mode = 'subscribe',
  planKey,
  planName,
  priceLabel,
  amountCents = 0,
  currency = 'GBP',
  businessId,
  buyerEmail = '',
  buyerName = '',
  currentPaymentMethod = null,
  onClose,
  onSuccess,
}) {
  const cardRef = useRef(null)
  const applePayRef = useRef(null)
  const googlePayRef = useRef(null)
  const payLockRef = useRef(false)
  const verificationRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [applePayReady, setApplePayReady] = useState(false)
  const [googlePayReady, setGooglePayReady] = useState(false)
  const [applePayHint, setApplePayHint] = useState('')
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [sandbox, setSandbox] = useState(true)

  const isUpdate = mode === 'update'

  useEffect(() => {
    verificationRef.current = {
      intent: 'STORE',
      customerInitiated: true,
      sellerKeyedIn: false,
      billingContact: buildBillingContact({ buyerName, buyerEmail, currency }),
    }
  }, [buyerName, buyerEmail, currency])

  useEffect(() => {
    if (!open) return undefined

    let cancelled = false
    let cardInstance = null
    let googlePayInstance = null

    const setup = async () => {
      setReady(false)
      setApplePayReady(false)
      setGooglePayReady(false)
      setApplePayHint('')
      setError('')
      try {
        const config = await businessApi.getSquareConfig()
        if (cancelled) return
        if (!config?.cardPaymentsEnabled || !config.applicationId || !config.locationId) {
          throw new Error(
            'Add SQUARE_APPLICATION_ID to the backend .env (Square Developer Dashboard → Application ID).',
          )
        }

        setSandbox(config.environment !== 'production')
        const Square = await loadSquareSdk(config.environment)
        if (cancelled) return
        if (!Square) throw new Error('Square payments SDK failed to load')

        const payments = Square.payments(config.applicationId, config.locationId)
        const currencyCode = String(currency || 'GBP').toUpperCase()
        const amountRaw = formatMoneyAmount(amountCents)
        const amount = amountRaw === '0.00' ? '0.01' : amountRaw

        const buildRequest = () =>
          payments.paymentRequest({
            countryCode: currencyToCountry(currencyCode),
            currencyCode,
            total: {
              amount,
              label: planName || 'Check A Review subscription',
            },
          })

        cardInstance = await payments.card()
        await cardInstance.attach('#square-card-container')
        cardRef.current = cardInstance
        if (!cancelled) setReady(true)

        // Apple Pay: Safari only, HTTPS domain registered with Square (not localhost).
        if (isLocalHost()) {
          setApplePayHint(
            'Apple Pay cannot run on localhost. Deploy on HTTPS and register the domain in Square Developer Dashboard → Apple Pay.',
          )
        } else if (!canUseApplePayBrowser()) {
          setApplePayHint(
            'Apple Pay needs Safari on a Mac/iPhone with Apple Pay set up (Wallet + card).',
          )
        } else {
          try {
            const applePayInstance = await payments.applePay(buildRequest())
            applePayRef.current = applePayInstance
            if (!cancelled) {
              setApplePayReady(true)
              setApplePayHint('')
            }
          } catch (err) {
            applePayRef.current = null
            if (!cancelled) {
              setApplePayReady(false)
              setApplePayHint(
                err?.message ||
                  'Apple Pay is unavailable. Register this HTTPS domain in Square → Apple Pay (Sandbox/Production) and host /.well-known/apple-developer-merchantid-domain-association.',
              )
            }
          }
        }

        try {
          googlePayInstance = await payments.googlePay(buildRequest())
          await googlePayInstance.attach('#square-google-pay-button', {
            buttonColor: 'black',
            buttonType: 'long',
            buttonSizeMode: 'fill',
          })
          googlePayRef.current = googlePayInstance
          const googleBtn = document.getElementById('square-google-pay-button')
          if (googleBtn) {
            googleBtn.onclick = () => {
              if (!payLockRef.current) submitGooglePay()
            }
          }
          if (!cancelled) setGooglePayReady(true)
        } catch {
          googlePayRef.current = null
          if (!cancelled) setGooglePayReady(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : err.message || 'Could not load payment form')
        }
      }
    }

    setup()

    return () => {
      cancelled = true
      const googleBtn = document.getElementById('square-google-pay-button')
      if (googleBtn) googleBtn.onclick = null
      try {
        cardInstance?.destroy?.()
      } catch {
        /* ignore */
      }
      try {
        googlePayInstance?.destroy?.()
      } catch {
        /* ignore */
      }
      cardRef.current = null
      applePayRef.current = null
      googlePayRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, amountCents, currency, planName])

  const title = isUpdate ? 'Change payment method' : 'Checkout'
  const subtitle = isUpdate
    ? 'Add a new card for future renewals. Your current plan stays the same.'
    : `${planName || planKey || ''}${priceLabel ? ` · ${priceLabel}` : ''}`
  const submitLabel = paying
    ? 'Processing…'
    : isUpdate
      ? 'Save new card'
      : 'Pay with card'

  const finishWithToken = async (tokenResult) => {
    if (tokenResult.status !== 'OK' || !tokenResult.token) {
      const detail = tokenResult.errors?.[0]?.message || 'Payment was cancelled or failed'
      throw new Error(detail)
    }

    const updated = isUpdate
      ? await businessApi.updatePaymentMethod(
          businessId,
          tokenResult.token,
          tokenResult.verificationToken || undefined,
        )
      : await businessApi.payWithCard(
          businessId,
          planKey,
          tokenResult.token,
          tokenResult.verificationToken || undefined,
        )
    onSuccess?.(updated)
  }

  const submitApplePay = async (event) => {
    event?.preventDefault?.()
    if (!applePayRef.current || !businessId || payLockRef.current) return
    if (!isUpdate && !planKey) return

    // Apple requires tokenize() as the first async call inside the click handler.
    payLockRef.current = true
    setPaying(true)
    setError('')
    try {
      const tokenResult = await applePayRef.current.tokenize(verificationRef.current)
      await finishWithToken(tokenResult)
    } catch (err) {
      if (!/cancel/i.test(err?.message || '')) {
        setError(err instanceof ApiError ? err.message : err.message || 'Apple Pay failed')
      }
    } finally {
      payLockRef.current = false
      setPaying(false)
    }
  }

  const submitGooglePay = async () => {
    if (!googlePayRef.current || !businessId || payLockRef.current) return
    if (!isUpdate && !planKey) return

    payLockRef.current = true
    setPaying(true)
    setError('')
    try {
      const tokenResult = await googlePayRef.current.tokenize(verificationRef.current)
      await finishWithToken(tokenResult)
    } catch (err) {
      if (!/cancel/i.test(err?.message || '')) {
        setError(err instanceof ApiError ? err.message : err.message || 'Google Pay failed')
      }
    } finally {
      payLockRef.current = false
      setPaying(false)
    }
  }

  const handleCardPay = async (e) => {
    e.preventDefault()
    if (!cardRef.current || !businessId || payLockRef.current) return
    if (!isUpdate && !planKey) return

    payLockRef.current = true
    setPaying(true)
    setError('')
    try {
      const tokenResult = await cardRef.current.tokenize(verificationRef.current)
      await finishWithToken(tokenResult)
    } catch (err) {
      if (!/cancel/i.test(err?.message || '')) {
        setError(err instanceof ApiError ? err.message : err.message || 'Payment failed')
      }
    } finally {
      payLockRef.current = false
      setPaying(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <style>{`
        #apple-pay-button {
          display: ${applePayReady ? 'inline-block' : 'none'};
          -webkit-appearance: -apple-pay-button;
          -apple-pay-button-type: plain;
          -apple-pay-button-style: black;
          width: 100%;
          height: 48px;
          border-radius: 999px;
          cursor: pointer;
          border: none;
          background: #000;
        }
        #apple-pay-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-slate-200 p-2 text-slate-400 hover:text-slate-700"
            onClick={onClose}
            disabled={paying}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          {isUpdate && currentPaymentMethod?.last4 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Current payment method</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {formatPaymentMethod(currentPaymentMethod)}
              </p>
              <p className="mt-1 text-xs text-slate-500">Enter a new card below to replace this one.</p>
            </div>
          ) : null}

          {sandbox ? (
            <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
              Sandbox — card: <strong>4111 1111 1111 1111</strong>. Apple Pay needs Safari + registered HTTPS domain
              (not localhost).
            </p>
          ) : null}

          {applePayHint ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {applePayHint}
            </p>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="space-y-3">
            <button
              id="apple-pay-button"
              type="button"
              onClick={submitApplePay}
              disabled={paying || !applePayReady}
              aria-label="Pay with Apple Pay"
            />

            <div
              id="square-google-pay-button"
              className={
                googlePayReady ? `min-h-[48px] w-full ${paying ? 'pointer-events-none opacity-50' : ''}` : 'hidden'
              }
            />

            {(applePayReady || googlePayReady) && (
              <div className="relative py-1 text-center text-xs uppercase tracking-wide text-slate-400">
                <span className="relative z-10 bg-white px-2">or pay with card</span>
                <span className="absolute inset-x-0 top-1/2 border-t border-slate-200" />
              </div>
            )}
          </div>

          <form onSubmit={handleCardPay} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Card details</label>
              <div
                id="square-card-container"
                className="min-h-[90px] rounded-xl border border-slate-200 bg-white px-3 py-3"
              />
              {!ready && !error ? (
                <p className="mt-2 text-xs text-slate-400">Loading secure card form…</p>
              ) : null}
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={paying}
                className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!ready || paying}
                className="rounded-full bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
