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
  onClose,
  onSuccess,
}) {
  const cardRef = useRef(null)
  const applePayRef = useRef(null)
  const googlePayRef = useRef(null)
  const payLockRef = useRef(false)
  const payWithWalletRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [applePayReady, setApplePayReady] = useState(false)
  const [googlePayReady, setGooglePayReady] = useState(false)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [sandbox, setSandbox] = useState(true)

  useEffect(() => {
    if (!open) return undefined

    let cancelled = false
    let cardInstance = null
    let googlePayInstance = null

    const setup = async () => {
      setReady(false)
      setApplePayReady(false)
      setGooglePayReady(false)
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
        const paymentRequest = payments.paymentRequest({
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

        try {
          const applePayInstance = await payments.applePay(paymentRequest)
          applePayRef.current = applePayInstance
          if (!cancelled) setApplePayReady(true)
        } catch {
          applePayRef.current = null
          if (!cancelled) setApplePayReady(false)
        }

        try {
          googlePayInstance = await payments.googlePay(paymentRequest)
          await googlePayInstance.attach('#square-google-pay-button', {
            buttonColor: 'black',
            buttonType: 'long',
            buttonSizeMode: 'fill',
          })
          googlePayRef.current = googlePayInstance
          const googleBtn = document.getElementById('square-google-pay-button')
          if (googleBtn) {
            googleBtn.onclick = () => {
              if (!payLockRef.current) payWithWalletRef.current?.('google')
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

  const verificationDetails = {
    intent: 'STORE',
    customerInitiated: true,
    sellerKeyedIn: false,
    billingContact: buildBillingContact({ buyerName, buyerEmail, currency }),
  }

  const isUpdate = mode === 'update'
  const title = isUpdate ? 'Change payment method' : 'Checkout'
  const subtitle = isUpdate
    ? 'Add a new card for future renewals. Your current plan stays the same.'
    : `${planName || planKey || ''}${priceLabel ? ` · ${priceLabel}` : ''}`
  const submitLabel = paying
    ? 'Processing…'
    : isUpdate
      ? 'Save new card'
      : 'Pay with card'

  const payWithTokenSource = async (tokenizeFn) => {
    if (!businessId || payLockRef.current) return
    if (!isUpdate && !planKey) return
    payLockRef.current = true
    setPaying(true)
    setError('')
    try {
      const tokenResult = await tokenizeFn()
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
    } catch (err) {
      if (!/cancel/i.test(err?.message || '')) {
        setError(err instanceof ApiError ? err.message : err.message || 'Payment failed')
      }
    } finally {
      payLockRef.current = false
      setPaying(false)
    }
  }

  payWithWalletRef.current = (method) => {
    if (method === 'apple' && applePayRef.current) {
      return payWithTokenSource(() => applePayRef.current.tokenize(verificationDetails))
    }
    if (method === 'google' && googlePayRef.current) {
      return payWithTokenSource(() => googlePayRef.current.tokenize(verificationDetails))
    }
    return undefined
  }

  const handleCardPay = async (e) => {
    e.preventDefault()
    if (!cardRef.current) return
    await payWithTokenSource(() => cardRef.current.tokenize(verificationDetails))
  }

  const handleApplePay = async () => {
    await payWithWalletRef.current?.('apple')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
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
          {sandbox ? (
            <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
              Sandbox — test card <strong>4111 1111 1111 1111</strong>. Apple Pay needs Safari; Google Pay needs
              Chrome with a wallet set up.
            </p>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="space-y-3">
            {applePayReady ? (
              <button
                type="button"
                onClick={handleApplePay}
                disabled={paying}
                className="w-full rounded-full bg-black px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                Pay with Apple Pay
              </button>
            ) : null}

            <div
              id="square-google-pay-button"
              className={googlePayReady ? `min-h-[48px] w-full ${paying ? 'pointer-events-none opacity-50' : ''}` : 'hidden'}
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
