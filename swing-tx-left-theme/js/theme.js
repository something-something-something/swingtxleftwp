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
	let backDrop=document.createElement('div');
	backDrop.classList.add('hamburger-backdrop');
	backDrop.addEventListener('click',hamburgerMenuHideAndShow);
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

	if(mainHeader.offsetHeight*1.1<mainHeader.scrollHeight){
		// mainHeader.style.backgroundColor='red';
		hamburgerButton.classList.add('hamburger-button-show');
	}
	else{
		// mainHeader.style.backgroundColor=null;
	}

}