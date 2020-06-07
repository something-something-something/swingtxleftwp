<?php

function swing_tx_left_theme_setup(){
	add_theme_support('post-thumbnails');
	add_theme_support('custom-logo');
	add_theme_support('title-tag');

}

function swing_tx_left_theme_reg_sidebars(){
	register_sidebar(array(
			'id'=>'missionstatment',
			'name' =>__('Mission Statment'),
			'description' =>__('Mission Statment'),
			'before_widget'=>'<div id="%1$s" class="%2$s mission-widget">',
			'after_widget'=>'</div>'
	));
	register_sidebar(array(
		'id'=>'emailsignup',
		'name' =>__('Email Signup'),
		'description' =>__('Email Signup'),
		'before_widget'=>'<div id="%1$s" class="%2$s email-widget">',
		'after_widget'=>'</div>'
));
}


function swing_tx_left_theme_reg_menus(){
	register_nav_menus(array(
		'swtxl-main-menu'=>__('Main Menu'),
		'swtxl-footer-menu'=>__('Footer Menu'),
	));
}

function swing_tx_left_theme_add_style(){
	wp_enqueue_style('style',get_stylesheet_Uri());
}
function swing_tx_left_theme_add_scripts(){
	wp_enqueue_script('script',get_template_directory_uri().'/js/theme.js');
}

add_action('init','swing_tx_left_theme_reg_menus');
add_action('widgets_init','swing_tx_left_theme_reg_sidebars');
add_action('after_setup_theme','swing_tx_left_theme_setup');
add_action('wp_enqueue_scripts','swing_tx_left_theme_add_style');
add_action('wp_enqueue_scripts','swing_tx_left_theme_add_scripts');

?>