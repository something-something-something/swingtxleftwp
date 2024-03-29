<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width">
		<script src="https://cdnjs.cloudflare.com/ajax/libs/markdown-it/11.0.0/markdown-it.min.js" integrity="sha256-3mv+NUxFuBg26MtcnuN2X37WUxuGunWCCiG2YCSBjNc=" crossorigin="anonymous"></script>

		<link href="https://fonts.googleapis.com/css2?family=Audiowide&family=Bungee+Shade&display=swap" rel="stylesheet">

		<link href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">

		<link href="https://fonts.googleapis.com/css2?family=Finger+Paint&family=Permanent+Marker&display=swap" rel="stylesheet">

		<?php
		
			wp_head();
		?>
	</head>

	<body <?php body_class(); ?>>

		<header id="main-header"><div class="site-logo">
			<?php
			the_custom_logo();
			?>
			</div>
				<button aria-label="navigation menu" id="hamburger-button"></button>
				<?php 
				wp_nav_menu(array(
					'theme_location'=>'swtxl-main-menu',
					'container'=>'nav',
					'container_id'=>'main-menu'
				)); 
				?>
			
		</header>
		<?php
		if( have_posts()){
			while(have_posts()){
				the_post();
				if(has_post_thumbnail()){
					if(is_front_page()){
						?><div class="feature-img" style="background-image: url(<?php esc_attr(the_post_thumbnail_url('full')); ?>);"><?php
					}
					else{
						?><div class="feature-img" style="background-image: url(<?php esc_attr(the_post_thumbnail_url('full')); ?>);min-height:40vh;background-attachment:scroll;"><?php
					}
		
				}
				else{
					?><div class="feature-img" style="background-image: linear-gradient(to right,var(--site-white),var(--logo-blue), var(--site-white) );min-height:20vh;"><?php
				}
					
			

				if(is_front_page()){
					dynamic_sidebar('missionstatment');
					dynamic_sidebar('otherbuttons');
				}
					
				?></div>
			
				<main id="main">	<?php 
				if(!is_front_page()||true){
					the_title('<h1 class="pageTitle">','</h1>'); 
				}
					
					
				?>
					<?php the_content(); ?>
				</main><?php
			}
		}
		?>

		<footer>
		<?php 
				wp_nav_menu(array(
					'theme_location'=>'swtxl-footer-menu',
					'container'=>'nav',
				)); 
		?>
		</footer>
		<?php wp_footer(); ?>
	</body>

</html>