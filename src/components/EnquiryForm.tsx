import { useRef, useState, type FormEvent } from 'react'
import { classOptions, school, whatsappUrl } from '../data'
import { useLanguage } from '../i18n'
import { cn } from '../lib/cn'
import { Icon } from './Icon'

type Fields = {
  parentName: string
  studentName: string
  phone: string
  email: string
  classSeeking: string
  message: string
}

const initialFields: Fields = {
  parentName: '',
  studentName: '',
  phone: '',
  email: '',
  classSeeking: '',
  message: '',
}

type Status = 'idle' | 'opening' | 'opened'

export function EnquiryForm({ className }: { className?: string }) {
  const { t } = useLanguage()
  const [values, setValues] = useState<Fields>(initialFields)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [waHref, setWaHref] = useState('')

  const parentRef = useRef<HTMLInputElement>(null)
  const studentRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const classRef = useRef<HTMLSelectElement>(null)

  const update = (key: keyof Fields) => (value: string) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
    if (status === 'opened') setStatus('idle')
  }

  const validate = () => {
    const next: Partial<Record<keyof Fields, string>> = {}
    if (!values.parentName.trim()) next.parentName = t('form.required')
    if (!values.studentName.trim()) next.studentName = t('form.required')

    const phone = values.phone.replace(/[\s-]/g, '').replace(/^\+91/, '')
    if (!phone) next.phone = t('form.required')
    else if (!/^[6-9]\d{9}$/.test(phone)) next.phone = t('form.invalidPhone')

    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
      next.email = t('form.invalidEmail')
    }
    if (!values.classSeeking) next.classSeeking = t('form.required')

    return next
  }

  const buildMessage = () =>
    [
      'Admission enquiry — Royal Public School',
      `Parent: ${values.parentName.trim()}`,
      `Student: ${values.studentName.trim()}`,
      `Phone: ${values.phone.trim()}`,
      values.email.trim() ? `Email: ${values.email.trim()}` : null,
      `Class: ${values.classSeeking}`,
      values.message.trim() ? `Message: ${values.message.trim()}` : null,
    ]
      .filter(Boolean)
      .join('\n')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.parentName) parentRef.current?.focus()
      else if (nextErrors.studentName) studentRef.current?.focus()
      else if (nextErrors.phone) phoneRef.current?.focus()
      else if (nextErrors.email) emailRef.current?.focus()
      else if (nextErrors.classSeeking) classRef.current?.focus()
      return
    }

    const href = whatsappUrl(buildMessage())
    setWaHref(href)
    setStatus('opening')
    window.open(href, '_blank', 'noopener,noreferrer')
    window.setTimeout(() => setStatus('opened'), 700)
  }

  return (
    <div className={cn('card-surface relative overflow-hidden p-6 sm:p-8', className)}>
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-deep via-gold to-gold-light" />

      {status === 'opened' && (
        <div role="status" className="mb-6 rounded-xl border border-emerald-600/20 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-emerald-900">
            <Icon name="check" className="h-4 w-4" />
            {t('form.openedTitle')}
          </p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-emerald-900/75">
            {t('form.openedBody')}
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-800 hover:text-emerald-950"
            >
              {t('form.openAgain')}
              <Icon name="arrowUpRight" className="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-800/70 hover:text-emerald-950"
            >
              {t('form.edit')}
            </button>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="parentName" className="field-label">
            {t('form.parentName')} <span className="text-gold-deep">*</span>
          </label>
          <input
            ref={parentRef}
            id="parentName"
            name="parentName"
            type="text"
            autoComplete="name"
            required
            value={values.parentName}
            onChange={(event) => update('parentName')(event.target.value)}
            aria-invalid={Boolean(errors.parentName)}
            aria-describedby={errors.parentName ? 'parentName-error' : undefined}
            className={cn('field', errors.parentName && 'field-error')}
          />
          {errors.parentName && (
            <p id="parentName-error" className="mt-1.5 text-[11px] font-medium text-red-600">
              {errors.parentName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="studentName" className="field-label">
            {t('form.studentName')} <span className="text-gold-deep">*</span>
          </label>
          <input
            ref={studentRef}
            id="studentName"
            name="studentName"
            type="text"
            autoComplete="off"
            required
            value={values.studentName}
            onChange={(event) => update('studentName')(event.target.value)}
            aria-invalid={Boolean(errors.studentName)}
            aria-describedby={errors.studentName ? 'studentName-error' : undefined}
            className={cn('field', errors.studentName && 'field-error')}
          />
          {errors.studentName && (
            <p id="studentName-error" className="mt-1.5 text-[11px] font-medium text-red-600">
              {errors.studentName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="field-label">
            {t('form.phone')} <span className="text-gold-deep">*</span>
          </label>
          <input
            ref={phoneRef}
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="+91"
            value={values.phone}
            onChange={(event) => update('phone')(event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            className={cn('field', errors.phone && 'field-error')}
          />
          {errors.phone && (
            <p id="phone-error" className="mt-1.5 text-[11px] font-medium text-red-600">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="field-label">
            {t('form.emailOptional')}
          </label>
          <input
            ref={emailRef}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => update('email')(event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={cn('field', errors.email && 'field-error')}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-[11px] font-medium text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="classSeeking" className="field-label">
            {t('form.classSeeking')} <span className="text-gold-deep">*</span>
          </label>
          <select
            ref={classRef}
            id="classSeeking"
            name="classSeeking"
            required
            value={values.classSeeking}
            onChange={(event) => update('classSeeking')(event.target.value)}
            aria-invalid={Boolean(errors.classSeeking)}
            aria-describedby={errors.classSeeking ? 'classSeeking-error' : undefined}
            className={cn('field', errors.classSeeking && 'field-error')}
          >
            <option value="" disabled>
              {t('form.selectClass')}
            </option>
            {classOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.classSeeking && (
            <p id="classSeeking-error" className="mt-1.5 text-[11px] font-medium text-red-600">
              {errors.classSeeking}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="field-label">
            {t('form.message')}
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={values.message}
            onChange={(event) => update('message')(event.target.value)}
            className="field resize-none"
          />
        </div>

        <div className="sm:col-span-2">
          <button type="submit" disabled={status === 'opening'} className="btn-gold w-full">
            {status === 'opening' ? t('form.opening') : t('form.submit')}
            <Icon name="whatsapp" className="h-4 w-4" />
          </button>
          <p className="mt-3 flex items-start gap-2 text-[10.5px] leading-relaxed text-ink/45">
            <Icon name="shield" className="mt-px h-3.5 w-3.5 shrink-0 text-gold-deep" />
            {t('form.whatsappNote')}
          </p>
          <p className="mt-4 text-center text-[11px] text-ink/50">
            {t('form.callInstead')}{' '}
            <a href={school.phoneHref} className="font-semibold text-royal hover:text-gold-deep">
              {school.phoneDisplay}
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}
