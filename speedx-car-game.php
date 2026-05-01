<?php
/**
 * Plugin Name: SpeedX Car Game
 * Plugin URI: https://example.com/
 * Description: Adds a browser-based top-down car game using the [speedx_car_game] shortcode.
 * Version: 1.0.2
 * Author: SpeedX
 * License: GPLv2 or later
 * Text Domain: speedx-car-game
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('SpeedX_Car_Game_Plugin')) {
    final class SpeedX_Car_Game_Plugin {
        const VERSION = '1.0.2';

        public function __construct() {
            add_action('wp_enqueue_scripts', array($this, 'register_assets'));
            add_shortcode('speedx_car_game', array($this, 'render_shortcode'));
            add_shortcode('speedx_game', array($this, 'render_shortcode'));
        }

        public function register_assets() {
            $base_url = plugin_dir_url(__FILE__) . 'speedx-car-game/';

            wp_register_style(
                'speedx-car-game-style',
                $base_url . 'assets/css/speedx-car-game.css',
                array(),
                self::VERSION
            );

            wp_register_script(
                'speedx-car-game-script',
                $base_url . 'assets/js/speedx-car-game.js',
                array(),
                self::VERSION,
                true
            );
        }

        public function render_shortcode() {
            wp_enqueue_style('speedx-car-game-style');
            wp_enqueue_script('speedx-car-game-script');

            ob_start();
            ?>
            <div class="speedx-game-wrapper" data-game-root>
                <h2 class="speedx-title"><?php echo esc_html__('SpeedX Car Game', 'speedx-car-game'); ?></h2>

                <div class="speedx-start-screen" data-start-screen>
                    <p class="speedx-instruction"><?php echo esc_html__('Enter the unlock phrase to play.', 'speedx-car-game'); ?></p>
                    <label class="screen-reader-text" for="speedx-passphrase"><?php echo esc_html__('Passphrase', 'speedx-car-game'); ?></label>
                    <input id="speedx-passphrase" class="speedx-input" type="text" autocomplete="off" spellcheck="false" placeholder="<?php echo esc_attr__('Type dr driving to start', 'speedx-car-game'); ?>" data-passphrase-input />
                    <button class="speedx-start-btn" type="button" data-start-button disabled><?php echo esc_html__('Start Game', 'speedx-car-game'); ?></button>
                    <p class="speedx-helper" data-helper-text><?php echo esc_html__('Phrase is case-sensitive.', 'speedx-car-game'); ?></p>
                </div>

                <div class="speedx-game-ui is-hidden" data-game-ui>
                    <div class="speedx-stats">
                        <div><span><?php echo esc_html__('Timer', 'speedx-car-game'); ?>:</span> <strong data-timer>06:00</strong></div>
                        <div><span><?php echo esc_html__('Score', 'speedx-car-game'); ?>:</span> <strong data-score>0</strong></div>
                        <div><span><?php echo esc_html__('Speed', 'speedx-car-game'); ?>:</span> <strong data-speed>0</strong></div>
                    </div>
                    <canvas class="speedx-canvas" width="360" height="640" aria-label="<?php echo esc_attr__('SpeedX Car Game canvas', 'speedx-car-game'); ?>" data-game-canvas></canvas>
                    <div class="speedx-touch-controls" data-touch-controls>
                        <button type="button" data-touch="left"><?php echo esc_html__('Left', 'speedx-car-game'); ?></button>
                        <button type="button" data-touch="right"><?php echo esc_html__('Right', 'speedx-car-game'); ?></button>
                        <button type="button" data-touch="up"><?php echo esc_html__('Accelerate', 'speedx-car-game'); ?></button>
                        <button type="button" data-touch="down"><?php echo esc_html__('Brake', 'speedx-car-game'); ?></button>
                    </div>
                </div>

                <div class="speedx-game-over is-hidden" data-game-over>
                    <h3><?php echo esc_html__('Game Over', 'speedx-car-game'); ?></h3>
                    <p><?php echo esc_html__('Final Score', 'speedx-car-game'); ?>: <strong data-final-score>0</strong></p>
                    <button class="speedx-restart-btn" type="button" data-restart-button><?php echo esc_html__('Restart', 'speedx-car-game'); ?></button>
                </div>
            </div>
            <?php
            return ob_get_clean();
        }
    }
}

if (!isset($GLOBALS['speedx_car_game_plugin']) || !($GLOBALS['speedx_car_game_plugin'] instanceof SpeedX_Car_Game_Plugin)) {
    $GLOBALS['speedx_car_game_plugin'] = new SpeedX_Car_Game_Plugin();
}
