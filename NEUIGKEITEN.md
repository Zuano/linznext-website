# Neuigkeiten eintragen

`neuigkeiten.json` ist die **einzige Quelle** für alle Neuerungen von LinzNext. Aus ihr entstehen:

| Wo | Wie |
|----|-----|
| Versionsseite der Website | `neuigkeiten.html` (DE) und `en/whats-new.html` (EN) lesen die Datei direkt — nach dem Push ist die Seite aktuell |
| Neuigkeiten-Fenster in der App | byte-gleiche Kopie in der iPhone-App (`LinzNext/neuigkeiten.json`) und der Android-App (`app/src/main/assets/neuigkeiten.json`) |
| Store-Texte | App Store („Was ist neu") und Google Play („Neuerungen") erzeugen die Release-Skripte aus der Kopie (`.claude/release/neuigkeiten.py` im jeweiligen App-Repo) |

## Bei jedem Release

1. Hier in `neuigkeiten.json` **oben** einen Eintrag für die neue Version anlegen.
2. Committen und pushen → Versionsseite ist online.
3. Die Datei byte-gleich in beide App-Repos kopieren (Pfade oben) und dort mitcommitten.
4. Prüfen: im App-Repo `python3 .claude/release/neuigkeiten.py --pruefen X.Y.Z`.

Ohne Eintrag bricht das Release-Skript ab, und am iPhone wird der Test `WhatsNewTests.testCurrentAppVersionHasEntry` rot.

## Aufbau eines Eintrags

```json
{
  "version": "2.4.0",
  "datum": "2026-10-15",
  "popup": true,
  "punkte": [
    { "de": "Jetzt auch S-Bahn und Regionalbusse in der Kernzone Linz.", "en": "Now with S-Bahn and regional buses in the Linz core zone." },
    { "de": "Apple Watch: …", "en": "Apple Watch: …", "plattformen": ["watch"] }
  ]
}
```

- **`punkte`:** kurz und aus Sicht der Nutzer — was sie sehen oder können, keine Technik. Eine Zeile pro Punkt, keine Emojis (VoiceOver/TalkBack lesen sie vor). Lieber 2–4 Punkte als 8.
- **`plattformen`** (optional): `"apple"` (iPhone, iPad, Mac), `"watch"` (Apple Watch), `"android"`. Fehlt es, gilt der Punkt überall. Die iPhone-App zeigt `apple` + `watch`, die Android-App `android`.
- **`popup`:** `false` bei reinen Fehlerbehebungen — dann kein Fenster in der App, aber der Eintrag steht auf der Website und im Store.
- **`datum`:** Tag der Einreichung, Format `JJJJ-MM-TT`.
- Google Play erlaubt höchstens 500 Zeichen je Sprache — das Android-Skript bricht sonst ab.
