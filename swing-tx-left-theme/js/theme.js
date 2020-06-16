'use strict';


//hamburger
document.addEventListener('DOMContentLoaded',()=>{
	hamburgerButtonHideAndShow();
	document.getElementById('hamburger-button').addEventListener('click',hamburgerMenuHideAndShow)

	window.addEventListener('resize',()=>{
		hamburgerButtonHideAndShow();
	})

});


function hamburgerMenuHideAndShow(){
	let mainNav=document.getElementById('main-menu');

	mainNav.classList.toggle('hamnav');
	if(mainNav.classList.contains('hamnav')){
		document.getElementsByTagName('body')[0].appendChild(hamburgerBackdropElement());

	}
	else{
		closeHamburgerMenuBackdrops();
	}

}

function hamburgerBackdropElement(){
	let backDrop=document.createElement('button');
	backDrop.classList.add('hamburger-backdrop');
	backDrop.addEventListener('click',hamburgerMenuHideAndShow);
	backDrop.setAttribute('aria-label','Close');
	return backDrop;
}

function closeHamburgerMenuBackdrops(){
	let backDrops=document.getElementsByClassName('hamburger-backdrop');
	for(let el of backDrops){
		el.remove();
	}

}

function hamburgerButtonHideAndShow(){
	let mainNav=document.getElementById('main-menu');
	let hamburgerButton=document.getElementById('hamburger-button');
	let mainHeader=document.getElementById("main-header");

	mainNav.classList.remove('hamnav');
	hamburgerButton.classList.remove('hamburger-button-show');
	closeHamburgerMenuBackdrops();

	if(mainHeader.offsetHeight*1.5<mainHeader.scrollHeight){
		// mainHeader.style.backgroundColor='red';
		hamburgerButton.classList.add('hamburger-button-show');
	}
	else{
		// mainHeader.style.backgroundColor=null;
	}

}


//mail chimp
document.addEventListener('DOMContentLoaded',()=>{
	let subscribeButtons=document.querySelectorAll('.mailchimp-subscribe-button');
	for(let b of subscribeButtons){
		b.addEventListener('click',showMailchimpSignup);
	}
});

function showMailchimpSignup(){
	let signUp=document.querySelector('.mailchimp-subscribe-form');
	if(signUp===null){
		console.log('add Signup form in between a div with class mailchimp-subscribe-form');
		return;
	}
	signUp.classList.add('mailchimp-display-form');
	let backdropButton=document.createElement('button');
	backdropButton.classList.add('mailchimp-subscribe-backdrop');
	backdropButton.addEventListener('click',hideMailChimpSignup);
	document.getElementsByTagName('body')[0].appendChild(backdropButton);
}
function hideMailChimpSignup(){
	let mailChimpBackdrops=document.querySelectorAll('.mailchimp-subscribe-backdrop');
	for(let b of mailChimpBackdrops){
		b.remove();

	}
	let signUp=document.querySelector('.mailchimp-subscribe-form');
	if(signUp===null){
		console.log('add Signup form in between a div with class mailchimp-subscribe-form');
		return;
	}
	signUp.classList.remove('mailchimp-display-form');
}