# SpeedX Car Game — Clear install fix for “binary file not supported”

If your panel/chat/git viewer says **"binary file not supported"** or **"binary file not shown"**, it means it cannot preview ZIP files.
This is a viewer limitation, **not** a WordPress plugin code error.

## Correct fix (recommended)
Build the ZIP on your own machine/server, then upload to WordPress.

### 1) Generate the plugin ZIP
Run in this project folder:

```bash
./build-plugin-zip.sh
```

This creates:

- `speedx-car-game.zip`

### 2) Upload in WordPress Admin
- Go to **Plugins → Add New → Upload Plugin**
- Select `speedx-car-game.zip`
- Click **Install Now**, then **Activate**

## If your hosting panel blocks ZIP upload
Use FTP/File Manager manual install:

1. Extract `speedx-car-game.zip`
2. Upload folder `speedx-car-game/` to:
   `wp-content/plugins/`
3. In WordPress Admin → Plugins, activate **SpeedX Car Game**

## Shortcode
Use this on any page/post:

```text
[speedx_car_game]
```
