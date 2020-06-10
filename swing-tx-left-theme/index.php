<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width">
		<script src="https://cdnjs.cloudflare.com/ajax/libs/markdown-it/11.0.0/markdown-it.min.js" integrity="sha256-3mv+NUxFuBg26MtcnuN2X37WUxuGunWCCiG2YCSBjNc=" crossorigin="anonymous"></script>


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
					?><div class="feature-img" style="background-image:linear-gradient(to bottom right,rgb(var(--logo-blue-red),var(--logo-blue-green),var(--logo-blue-blue), 0.6) 40%,rgb(var(--logo-pink-red),var(--logo-pink-green),var(--logo-pink-blue), 0.6) 60% 100%), url(<?php esc_attr(the_post_thumbnail_url('full')); ?>);"><?php
					
				}
				else{
					?><div class="feature-img" style="background-image: linear-gradient(to bottom right,var(--logo-blue) 40% , var(--logo-pink) 60% 100%);"><?php
				}
					
			

				if(is_front_page()){
					dynamic_sidebar('missionstatment');
					dynamic_sidebar('emailsignup');
				}
					the_title('<h1 class="pageTitle">','</h1>');
				?></div>
				<main>
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