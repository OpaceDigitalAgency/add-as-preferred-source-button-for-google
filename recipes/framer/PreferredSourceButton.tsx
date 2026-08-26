import { useCallback, useEffect, useState, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * Google Preferred Sources button — Framer code component.
 * Self-contained: loads Google's SDK once (deduped against any existing tag),
 * renders a styled trigger, and falls back to the documented deeplink when
 * the SDK is blocked. Google's SDK exposes only init({theme, lang}) and
 * addPreferredSource(); there is no completion callback, so any analytics you
 * wire to clicks count clicks, never confirmed adds.
 */

const SDK_URL = "https://news.google.com/swg/js/v1/publisher.js"

type Status = "idle" | "loading" | "ready" | "blocked"

let loadPromise: Promise<Status> | null = null

function loadSdk(theme: string, lang: string): Promise<Status> {
    if (typeof window === "undefined") return Promise.resolve("blocked")
    const w = window as unknown as {
        PREFERRED_SOURCE?: Array<(ps: { init(o: object): void }) => void>
    }
    ;(w.PREFERRED_SOURCE = w.PREFERRED_SOURCE || []).push((ps) => {
        const init: Record<string, string> = { theme }
        if (lang) init.lang = lang
        ps.init(init)
    })
    if (loadPromise) return loadPromise
    loadPromise = new Promise((resolve) => {
        const existing = document.querySelector(
            'script[src^="https://news.google.com/swg/js/v1/publisher"]'
        )
        const script = existing ?? document.createElement("script")
        if (!existing) {
            const s = script as HTMLScriptElement
            s.async = true
            s.setAttribute("preferred-sources-control", "manual")
            s.src = SDK_URL
            document.head.appendChild(s)
        }
        const timer = setTimeout(() => resolve("blocked"), 5000)
        script.addEventListener("load", () => {
            clearTimeout(timer)
            resolve("ready")
        })
        script.addEventListener("error", () => {
            clearTimeout(timer)
            resolve("blocked")
        })
    })
    return loadPromise
}

export default function PreferredSourceButton(props: {
    theme: "light" | "dark"
    lang: string
    label: string
    variant: "google-default" | "google-colours" | "neutral"
    domain: string
}) {
    const { theme, lang, label, variant, domain } = props
    const [status, setStatus] = useState<Status>("idle")

    useEffect(() => {
        setStatus("loading")
        loadSdk(theme, lang).then(setStatus)
    }, [theme, lang])

    const host =
        domain || (typeof location !== "undefined" ? location.hostname : "")
    const deeplink = `https://www.google.com/preferences/source?q=${encodeURIComponent(host.toLowerCase())}`

    const onClick = useCallback(() => {
        if (status === "ready") {
            const w = window as unknown as {
                PREFERRED_SOURCE?: Array<(ps: { addPreferredSource(): void }) => void>
            }
            ;(w.PREFERRED_SOURCE = w.PREFERRED_SOURCE || []).push((ps) =>
                ps.addPreferredSource()
            )
        } else {
            window.open(deeplink, "_blank", "noopener")
        }
    }, [status, deeplink])

    const base: CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5em",
        cursor: "pointer",
        textDecoration: "none",
        fontFamily: "Roboto, system-ui, sans-serif",
        fontSize: "0.875rem",
        fontWeight: 500,
        padding: "0.55em 1.1em",
        lineHeight: 1.2,
    }
    const variants: Record<string, CSSProperties> = {
        "google-default":
            theme === "dark"
                ? { background: "#202124", color: "#e8eaed", border: "1px solid #5f6368", borderRadius: 4 }
                : { background: "#ffffff", color: "#1f1f1f", border: "1px solid #dadce0", borderRadius: 4 },
        "google-colours": { background: "#4285F4", color: "#ffffff", border: "none", borderRadius: 9999 },
        neutral: { background: "transparent", color: "inherit", border: "1px solid currentColor", borderRadius: 4 },
    }
    const style = { ...base, ...variants[variant] }

    if (status === "blocked") {
        return (
            <a href={deeplink} target="_blank" rel="noopener noreferrer" style={style}>
                {label}
            </a>
        )
    }
    return (
        <button type="button" onClick={onClick} style={style}>
            {label}
        </button>
    )
}

PreferredSourceButton.defaultProps = {
    theme: "light",
    lang: "",
    label: "Add as a preferred source on Google",
    variant: "google-default",
    domain: "",
}

addPropertyControls(PreferredSourceButton, {
    theme: { type: ControlType.Enum, options: ["light", "dark"], defaultValue: "light" },
    lang: { type: ControlType.String, title: "Language", defaultValue: "" },
    label: { type: ControlType.String, defaultValue: "Add as a preferred source on Google" },
    variant: {
        type: ControlType.Enum,
        options: ["google-default", "google-colours", "neutral"],
        defaultValue: "google-default",
    },
    domain: { type: ControlType.String, title: "Domain (blank = this site)", defaultValue: "" },
})
