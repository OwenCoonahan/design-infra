"use client"

import { Check } from "lucide-react"
import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ primitives */

/** One settings group: title + description on the left, a card of rows on the right. */
export function SettingsSection({
  title,
  description,
  footer,
  tone = "default",
  className,
  children,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  /** Rendered in the card's footer bar (save button, hint). */
  footer?: React.ReactNode
  tone?: "default" | "danger"
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn("grid gap-4 md:grid-cols-[14rem_1fr] md:gap-10 lg:grid-cols-[18rem_1fr]", className)}>
      <header>
        {/* not via cn(): tailwind-merge treats font-headline as a font-family and drops font-heading */}
        <h2
          className={`font-heading text-lg font-headline tracking-tight ${tone === "danger" ? "text-destructive" : "text-foreground"}`}
        >
          {title}
        </h2>
        {description ? <p className="mt-1 text-sm text-pretty text-muted-foreground">{description}</p> : null}
      </header>
      <div
        className={cn(
          "overflow-hidden rounded-xl border bg-card text-card-foreground",
          tone === "danger" && "border-destructive/40"
        )}
      >
        <div className="divide-y">{children}</div>
        {footer ? (
          <div className="flex items-center justify-end gap-3 border-t bg-muted/40 px-5 py-3">{footer}</div>
        ) : null}
      </div>
    </section>
  )
}

/** A labelled row inside a SettingsSection. `inline` puts the control to the right (switches, buttons). */
export function SettingsRow({
  label,
  description,
  htmlFor,
  inline,
  className,
  children,
}: {
  label: React.ReactNode
  description?: React.ReactNode
  htmlFor?: string
  inline?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn("flex gap-3 px-5 py-4", inline ? "flex-row items-center justify-between" : "flex-col", className)}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <Label htmlFor={htmlFor}>{label}</Label>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ composed form */

export type SettingsValues = {
  name: string
  email: string
  username: string
  bio: string
  avatar?: string
  language: string
  timezone: string
  emailDigest: boolean
  productUpdates: boolean
  mentions: boolean
}

const DEFAULTS: SettingsValues = {
  name: "",
  email: "",
  username: "",
  bio: "",
  language: "en",
  timezone: "UTC",
  emailDigest: true,
  productUpdates: false,
  mentions: true,
}

/**
 * Ready-made account settings page: profile, preferences, notifications and a danger
 * zone. Compose your own from `SettingsSection` + `SettingsRow` when the fields differ.
 */
export function SettingsForm({
  defaultValues,
  languages = [
    { value: "en", label: "English" },
    { value: "de", label: "Deutsch" },
    { value: "fr", label: "Français" },
    { value: "ja", label: "日本語" },
  ],
  timezones = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Asia/Tokyo"],
  usernamePrefix = "acme.com/",
  onSave,
  onDeleteAccount,
  className,
}: {
  defaultValues?: Partial<SettingsValues>
  languages?: { value: string; label: string }[]
  timezones?: string[]
  usernamePrefix?: string
  onSave?: (values: SettingsValues) => void | Promise<void>
  onDeleteAccount?: () => void
  className?: string
}) {
  const initial = React.useMemo(() => ({ ...DEFAULTS, ...defaultValues }), [defaultValues])
  const [values, setValues] = React.useState<SettingsValues>(initial)
  const [saved, setSaved] = React.useState<SettingsValues>(initial)
  const [status, setStatus] = React.useState<"idle" | "saving" | "saved">("idle")
  const id = React.useId()
  const set = <K extends keyof SettingsValues>(k: K, v: SettingsValues[K]) => {
    setValues((s) => ({ ...s, [k]: v }))
    setStatus("idle")
  }
  const dirty = JSON.stringify(values) !== JSON.stringify(saved)

  const save = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setStatus("saving")
    await onSave?.(values)
    setSaved(values)
    setStatus("saved")
  }

  const footer = (
    <>
      {status === "saved" && !dirty ? (
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Check className="size-4" /> Saved
        </span>
      ) : dirty ? (
        <span className="text-sm text-muted-foreground">Unsaved changes</span>
      ) : null}
      <Button type="button" variant="ghost" disabled={!dirty} onClick={() => setValues(saved)}>
        Reset
      </Button>
      <Button type="submit" disabled={!dirty || status === "saving"}>
        {status === "saving" ? "Saving…" : "Save changes"}
      </Button>
    </>
  )

  return (
    <form onSubmit={save} className={cn("flex w-full flex-col gap-10", className)}>
      <SettingsSection title="Profile" description="How you appear to teammates across the workspace." footer={footer}>
        <SettingsRow label="Avatar" description="Square image, at least 256×256." inline>
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              {values.avatar ? <AvatarImage src={values.avatar} alt="" /> : null}
              <AvatarFallback>{(values.name || "?").slice(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button type="button" variant="outline" size="sm">
              Upload
            </Button>
          </div>
        </SettingsRow>
        <div className="grid gap-0 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <SettingsRow label="Display name" htmlFor={`${id}-name`}>
            <Input
              id={`${id}-name`}
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              autoComplete="name"
            />
          </SettingsRow>
          <SettingsRow label="Email" htmlFor={`${id}-email`}>
            <Input
              id={`${id}-email`}
              type="email"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              autoComplete="email"
            />
          </SettingsRow>
        </div>
        <SettingsRow label="Username" htmlFor={`${id}-username`} description="Lowercase letters, numbers and dashes.">
          <div className="flex h-8 w-full max-w-md items-center overflow-hidden rounded-lg border border-input focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
            <span className="flex h-full items-center border-r bg-muted px-2.5 text-sm text-muted-foreground">
              {usernamePrefix}
            </span>
            <input
              id={`${id}-username`}
              value={values.username}
              onChange={(e) => set("username", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm outline-none"
            />
          </div>
        </SettingsRow>
        <SettingsRow label="Bio" htmlFor={`${id}-bio`} description="A sentence or two. Shown on your profile.">
          <Textarea
            id={`${id}-bio`}
            value={values.bio}
            maxLength={280}
            onChange={(e) => set("bio", e.target.value)}
            className="min-h-24"
          />
          <p className="text-right text-xs text-muted-foreground tabular-nums">{values.bio.length}/280</p>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection
        title="Preferences"
        description="Language and region used for dates and numbers."
        footer={footer}
      >
        <div className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <SettingsRow label="Language" htmlFor={`${id}-lang`}>
            <Select value={values.language} onValueChange={(v) => set("language", v)}>
              <SelectTrigger id={`${id}-lang`} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingsRow>
          <SettingsRow label="Timezone" htmlFor={`${id}-tz`}>
            <Select value={values.timezone} onValueChange={(v) => set("timezone", v)}>
              <SelectTrigger id={`${id}-tz`} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingsRow>
        </div>
        <SettingsRow
          label="Weekly digest"
          description="A Monday summary of activity in your projects."
          htmlFor={`${id}-digest`}
          inline
        >
          <Switch id={`${id}-digest`} checked={values.emailDigest} onCheckedChange={(v) => set("emailDigest", v)} />
        </SettingsRow>
        <SettingsRow
          label="Mentions"
          description="Email me when someone @mentions me."
          htmlFor={`${id}-mentions`}
          inline
        >
          <Switch id={`${id}-mentions`} checked={values.mentions} onCheckedChange={(v) => set("mentions", v)} />
        </SettingsRow>
        <SettingsRow
          label="Product updates"
          description="Occasional news about new features."
          htmlFor={`${id}-updates`}
          inline
        >
          <Switch
            id={`${id}-updates`}
            checked={values.productUpdates}
            onCheckedChange={(v) => set("productUpdates", v)}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Danger zone" description="Irreversible actions. Take a breath first." tone="danger">
        <SettingsRow label="Delete account" description="Permanently remove your account and all of its data." inline>
          <Button type="button" variant="destructive" onClick={onDeleteAccount}>
            Delete account
          </Button>
        </SettingsRow>
      </SettingsSection>
    </form>
  )
}
