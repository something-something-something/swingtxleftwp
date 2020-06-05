<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width">
		<?php
		
			wp_head();
		?>
	</head>

	<body>

		<header><div class="site-logo">
			<?php
			the_custom_logo();
			?>
			</div>
			
				<?php 
				wp_nav_menu(array(
					'theme_location'=>'swtxl-main-menu',
					'container'=>'nav',
				)); 
				?>
			
		</header>
		<?php
		if( have_posts()){
			while(have_posts()){
				the_post();
				if(has_post_thumbnail()){
					?><div class="feature-img" style="background-image:linear-gradient(#34C1F099,#ED5B6799), url(<?php esc_attr(the_post_thumbnail_url('full')); ?>);"><?php
					
				}
				else{
					?><div class="feature-img" style="background-image: linear-gradient(#34C1F0,#ED5B67);"><?php
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