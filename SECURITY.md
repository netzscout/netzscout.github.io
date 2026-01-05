# Sicherheitshinweise

## ⚠️ WICHTIG: API-Key wurde kompromittiert

**Der Etsy API-Key wurde versehentlich auf GitHub hochgeladen und ist öffentlich sichtbar.**

### Sofortige Maßnahmen erforderlich:

1. **API-Key widerrufen/neu erstellen:**
   - Gehen Sie zu https://www.etsy.com/developers/
   - Widerrufen Sie den alten API-Key: `Ylod13esnlkgzlk3o92r8cr19`
   - Erstellen Sie einen neuen API-Key

2. **Neuen API-Key sicher verwenden:**
   - Kopieren Sie `js/config.example.js` zu `js/config.js`
   - Fügen Sie Ihren neuen API-Key in `js/config.js` ein
   - **WICHTIG:** `js/config.js` wird NICHT auf GitHub hochgeladen (siehe `.gitignore`)

3. **In index.html einbinden:**
   Falls Sie die Etsy-Integration verwenden, binden Sie die config.js VOR etsy-integration.js ein:
   ```html
   <script src="js/config.js"></script>
   <script src="js/etsy-integration.js"></script>
   ```

## Was wurde geändert?

- ✅ `.gitignore` erstellt - verhindert zukünftige Uploads von sensiblen Dateien
- ✅ API-Key aus dem Code entfernt
- ✅ Sichere Konfigurationslösung implementiert
- ⚠️ **Alter API-Key muss noch widerrufen werden!**

## Best Practices für die Zukunft

1. **Niemals API-Keys direkt im Code speichern**
2. **Immer `.gitignore` verwenden** für:
   - `.env` Dateien
   - `config.js` Dateien mit Secrets
   - Private Schlüssel (`.key`, `.pem`)
   - Backup-Dateien

3. **Vor jedem Commit prüfen:**
   ```bash
   git status
   git diff
   ```

4. **Verwenden Sie Beispiel-Dateien:**
   - `config.example.js` (ohne echte Werte) → wird committed
   - `config.js` (mit echten Werten) → wird NICHT committed

