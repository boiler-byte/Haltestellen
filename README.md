# Haltestellen v6

Mobile, dunkle ÖPNV-Haltestellen-App als statische Progressive Web App (PWA), ohne Backend und ohne Build-Schritt.

## Dateien

- `index.html` – komplette App inklusive CSS und JavaScript
- `manifest.webmanifest` – PWA-Name, Startadresse, Erscheinungsbild und Symbole
- `sw.js` – Service Worker zum Speichern der App-Oberfläche für Offline-Starts
- `icons/` – Icons für Browser, Homescreen und installierte App

Alle Dateien und der Ordner `icons` müssen **zusammen** veröffentlicht werden. Die Pfade funktionieren sowohl im Stammverzeichnis einer Website als auch in einem Unterordner.

## Auf Handy und Desktop installieren

1. Das ZIP-Archiv entpacken.
2. **Den Inhalt** des Ordners `haltestellen-v6` auf einem statischen **HTTPS-Webspace** bereitstellen, etwa per GitHub Pages, Netlify oder einem eigenen HTTPS-Server. Ein Backend ist nicht nötig.
3. Die veröffentlichte Adresse im Browser öffnen, während das Gerät online ist. Beim ersten Aufruf speichert der Service Worker die App-Oberfläche lokal.
4. In **Meine Haltestellen** ganz nach unten scrollen und **App installieren** betätigen.
5. In Chrome/Edge/unterstützten Android-Browsern erscheint bei erfüllten Browser-Voraussetzungen eine Installationsabfrage. Auf iOS/iPadOS die Website über das Teilen-Menü **Zum Home-Bildschirm** hinzufügen. Ist kein direkter Prompt verfügbar, zeigt der Button die manuellen Schritte.

**Wichtig:** Ein direkter Doppelklick auf `index.html` (`file://`) reicht nicht zur PWA-Installation oder zum Offline-Caching. Installierbare PWAs benötigen HTTPS oder eine lokale Entwicklungsadresse wie `localhost`.

### Lokal testen

Im entpackten Ordner:

```bash
python3 -m http.server 8000
```

Dann `http://localhost:8000` öffnen. Für eine dauerhafte, vom Handy erreichbare PWA ist eine HTTPS-Adresse zu empfehlen.

## Datensicherung

Ganz unten in **Meine Haltestellen**:

- **Export:** lädt eine lokale JSON-Datei herunter. Sie enthält Haltestellen (in der angeordneten Reihenfolge), Ortsangaben, feste Verbindungen und das Prioritätszeitfenster.
- **Import:** liest eine JSON-Datei lokal ein. Die App prüft die enthaltenen Daten und zeigt vor dem Ersetzen die Anzahl der Haltestellen und Verbindungen. **Der Import ersetzt die bestehenden Daten**, statt sie zusammenzuführen.

Die Sicherungsdatei wird nicht an einen Server übertragen. Sie enthält deine gespeicherten Orte und Wege; bewahre sie entsprechend auf.

Gespeicherte Haltestellen bleiben bei einem Update unter **derselben Website-Adresse** erhalten, solange der Browser-Speicher nicht gelöscht wurde. Beim Wechsel von einer früher direkt geöffneten HTML-Datei (`file://`) zu einer HTTPS-Domain wird Browser-Speicher **nicht automatisch** übertragen, weil die Herkunftsadresse unterschiedlich ist. Falls du Daten aus v5 übertragen willst, kannst du den bisherigen Eintrag `nextstop.v1` aus den Browser-Entwicklertools als JSON speichern und in v6 importieren.

## Offline-Betrieb

Nach einem vollständigen ersten Online-Aufruf lädt die PWA ihre **Oberfläche, Icons und Navigation** auch ohne Internet. Die gespeicherten Haltestellen, Reihenfolge und Verbindungen bleiben verfügbar, da sie im Browser gespeichert sind.

**Kein Offline-Fahrplan:** Die App speichert keine vermeintlich aktuellen Abfahrtszeiten für die Offline-Anzeige. Echtzeit-Abfahrten, Ankünfte, Haltestellensuche und Routenabfragen erfordern weiterhin Netzwerkzugang zur öffentlichen Transitous/MOTIS-API.

## Datenquelle und Betrieb

- Verkehrsdaten: [Transitous](https://transitous.org/), OpenStreetMap und jeweilige Verkehrsunternehmen
- API: `https://api.transitous.org` (öffentlich, ohne API-Key)
- Keine Drittbibliotheken, kein Backend, keine Cloud-Synchronisierung

Für eine dauerhafte öffentliche Nutzung die [Transitous-API-Nutzungsbedingungen](https://transitous.org/api/) beachten. Die HTML-App enthält die Datenquellen-Attribution.
