# SpeedX Car Game Plugin (Ready)

Use this plugin file structure exactly as provided in this repository.

## Main plugin file

- `speedx-car-game.php` (root-level entry file used by WordPress)

## Build upload ZIP

1. Run:
   ```bash
   ./build-plugin-zip.sh
   ```
2. Upload this exact file in WordPress:
   - `dist/speedx-car-game.zip`
3. Activate **SpeedX Car Game**.
4. Add shortcode:
   ```text
   [speedx_car_game]
   ```

## Important

- Do **not** upload repository source ZIPs such as `shahzain-game-plugin-main.zip`.
- Upload only `dist/speedx-car-game.zip`.
- If WordPress Plugin Editor shows "Unable to communicate back with site", upload the ZIP via Plugins → Add New → Upload Plugin instead of editing active plugin PHP in the browser editor.
