'use strict';
//note requires https://github.com/markdown-it/markdown-it in order to run


window.addEventListener('DOMContentLoaded',async ()=>{

	if(document.getElementById('swingtxleft-events-container')!==null && document.getElementById('swingtxleft-events-filter-container')!==null){

		document.getElementById('swingtxleft-events-container').classList.add('swingtxleft-events-container');
		document.getElementById('swingtxleft-events-filter-container').classList.add('swingtxleft-events-filter-container');

		//writeZipCodeFilterControls();
		//writeFilterByDateControls();
		//writeFilterResetControls();
		
		let data=await getSwingLeftEvents(mobilizeURL);
	
		addHcdpCalender(data,document.getElementById('swingtxleft-events-container'));
		//writeFilterByTypeControls(data);
		//writeFilterByTagControls(data);
		//writeFilterByVirtualStatusControls(data);


		//new

		createSwingLeftEventsControlForm(data,document.getElementById('swingtxleft-events-filter-container'),document.getElementById('swingtxleft-events-container'));
	}
	else{
		console.log('no events placeholder');
	}
});

let mobilizeURL='https://api.mobilize.us/v1/organizations/210/events?timeslot_end=gte_now';

if(fetchAllEventsModeOn()){
	mobilizeURL='https://api.mobilize.us/v1/organizations/210/events?per_page=200';
}


function isDebugModeOn(){
	let searchParams=new URL(document.location).searchParams
	return searchParams.get('debug')==='yes';
}


function fetchAllEventsModeOn(){
	let searchParams=new URL(document.location).searchParams
	return searchParams.get('allevents')==='yes';
}


async function getSwingLeftEvents(queryURL){
	let theData=await getData(queryURL);
	console.log(theData);
	let swingtxleftEvents=theData.filter(filterOnlySwingTXLeft);
	return swingtxleftEvents;
}



function splitEventsIntoTimeSlot(events){
	let timeSlotArray=[]
	for(let e of events){
		for(let ets of e.timeslots){
			let timeSlotObj={
				timeslot:ets,
				event:e
			};
			timeSlotArray.push(timeSlotObj);
		}
	}
	return timeSlotArray.sort((fel,sel)=>{
		return fel.timeslot.start_date-sel.timeslot.start_date;
	});
}

//form
async function createSwingLeftEventsControlForm(data,formContainer,eventsContainer){

	let filterHideBox=document.createElement('details');
	filterHideBox.classList.add('swingtx-left-hide-box-filter-form');
	let filterHideBoxSummary=elementWithText('summary','Filters');
	filterHideBox.appendChild(filterHideBoxSummary);

	let controlForm=document.createElement('form');
	
	let filterOptionsContainer=document.createElement('div');
	filterOptionsContainer.classList.add('swing-tx-left-filter-form-options');

	filterOptionsContainer.appendChild(writeFilterByTypeControls(data));
	filterOptionsContainer.appendChild(writeFilterByVirtualStatusControls(data));
	filterOptionsContainer.appendChild( writeZipCodeFilterControls());
	filterOptionsContainer.appendChild(writeFilterByDateControls());

	controlForm.appendChild(filterOptionsContainer);

	let resetButton=document.createElement('input');
	resetButton.setAttribute('type','reset');

	let submitButton=document.createElement('button');
	submitButton.textContent='Filter';
	submitButton.setAttribute('type','button');
	
	submitButton.addEventListener('click',()=>{
		let d=new FormData(controlForm);
		for(let e of d.entries()){
			console.log(e);
		}

		reAddCalanderWithFiltering(controlForm,eventsContainer);

	})

	let errorBar=document.createElement('div');
	errorBar.classList.add('swing-tx-left-event-filter-errors');


	let fieldsetForButtons=document.createElement('fieldset');
	fieldsetForButtons.classList.add('swing-tx-left-filter-form-control-buttons');


	fieldsetForButtons.appendChild(resetButton);
	fieldsetForButtons.appendChild(submitButton);
	controlForm.appendChild(fieldsetForButtons);


	controlForm.appendChild(errorBar);


	filterHideBox.appendChild(controlForm);

	formContainer.appendChild(filterHideBox);


}

function writeFilterByTypeControls(swingtxleftEvents){
	//document.getElementById('swingleftTypeOptions').innerHTML='';
	let typeFilterContainer=document.createElement('fieldset');
	
	typeFilterContainer.appendChild(document.createTextNode('Filter by Event Type: '));
	let eventTypes=getEventTypesAvailable(swingtxleftEvents);
	typeFilterContainer.appendChild(document.createElement('br'));

	for(let et of eventTypes){
		let typeLabel=elementWithText('label',humanizeEventType(et));
		
		let checkbox=document.createElement('input');
		checkbox.setAttribute('value',et);
		checkbox.setAttribute('name','event-type');
		checkbox.setAttribute('type','checkbox');
		let checkboxID='swing-tx-left-checkbox-event-type-'+et+'-'+Math.random();

		checkbox.setAttribute('id',checkboxID);
		typeLabel.setAttribute('for',checkboxID);
		typeFilterContainer.appendChild(checkbox);
		typeFilterContainer.appendChild(typeLabel);
		typeFilterContainer.appendChild(document.createElement('br'));
		
	}

	return typeFilterContainer;

}


function writeFilterByVirtualStatusControls(){
	let virtualStatusFilterContainer=document.createElement('fieldset');
	
	virtualStatusFilterContainer.appendChild(document.createTextNode('Filter by Virtual Status: '));
	virtualStatusFilterContainer.appendChild(document.createElement('br'));
	let statusArr=[
		{name:'Virtual', value:'true'},
		{name:'In Person',value:'false'}
	]
	for(let s of statusArr){
		let label=elementWithText('label',s.name);

		let checkbox=document.createElement('input');

		checkbox.setAttribute('name','event-virtual-status');
		checkbox.setAttribute('value',s.value);
		checkbox.setAttribute('type','checkbox');
		
		let checkboxID='swing-tx-left-checkbox-event-virtual-status-'+s.value+'-'+Math.random();
		checkbox.setAttribute('id',checkboxID);
		label.setAttribute('for',checkboxID);

		// button.classList.add('virtualStatusFilterButton');
		//button.addEventListener('click',filterButtonClick);
		virtualStatusFilterContainer.appendChild(checkbox);
		virtualStatusFilterContainer.appendChild(label);
		virtualStatusFilterContainer.appendChild(document.createElement('br'));

	}
	return virtualStatusFilterContainer;
}


function writeZipCodeFilterControls(){
	
	let zipFilterContainer=document.createElement('fieldset');

	//Zipcode: <input id="zipCodeForFilter" type="text"> Distance: <input id="distanceForFilter" type="text"> Miles

	// zipFilterContainer.appendChild(document.createTextNode('Zipcode: '));





	let locationFilterCheckbox=document.createElement('input');
	locationFilterCheckbox.setAttribute('type','checkbox');
	locationFilterCheckbox.setAttribute('name','event-filter-location');
	locationFilterCheckbox.setAttribute('value','yes');
	locationFilterCheckbox.classList.add('swingtx-left-checkbox-for-hiding-options');

	let locationLabel=elementWithText('label','Filter by location');

	let locationFilterCcheckboxID='swing-tx-left-checkbox-event-filter-location-'+Math.random();
	locationFilterCheckbox.setAttribute('id',locationFilterCcheckboxID);
	locationLabel.setAttribute('for',locationFilterCcheckboxID);

	zipFilterContainer.appendChild(locationFilterCheckbox)
	zipFilterContainer.appendChild(locationLabel);


	let hideExtraInputContainer=document.createElement('div');
	hideExtraInputContainer.classList.add('swingtx-left-container-for-hiding-options');

	let zipLabel=elementWithText('label',' Zip Code:');
	let zipInput=document.createElement('input');
	zipInput.setAttribute('name','event-zip-code');
	zipInput.setAttribute('type','text');
	zipInput.setAttribute('pattern','\\d{5}');
	// zipInput.addEventListener('blur',whenFilterLocationEnabledReAddCalanderWithFiltering);
	
	zipLabel.appendChild(zipInput);
	hideExtraInputContainer.appendChild(zipLabel);


	let distanceLabel=elementWithText('label',' Maximum Distance: ');
	let distianceInput=document.createElement('input');
	distianceInput.setAttribute('name','event-max-distance');
	distianceInput.setAttribute('type','number');
	distianceInput.setAttribute('Placeholder','Miles');
	// distianceInput.addEventListener('blur',whenFilterLocationEnabledReAddCalanderWithFiltering);
	
	distanceLabel.appendChild(distianceInput);
	hideExtraInputContainer.appendChild(distanceLabel);

	zipFilterContainer.appendChild(hideExtraInputContainer);

	// zipFilterButton.addEventListener('click',filterButtonClick);
	//zipFilterContainer.appendChild(zipFilterButton);

	return zipFilterContainer;
	
}
function whenFilterLocationEnabledReAddCalanderWithFiltering(){
	if(document.querySelectorAll('.locationFilterButton.eventFilterButtonSelected').length>0){
		reAddCalanderWithFiltering();
	}
	
}




function writeFilterByDateControls(){
	
	let dateFilterContainer=document.createElement('fieldset');

	



	let dateFilterCheckbox=document.createElement('input');
	dateFilterCheckbox.setAttribute('type','checkbox');
	dateFilterCheckbox.setAttribute('name','event-filter-date');
	dateFilterCheckbox.setAttribute('value','yes');
	dateFilterCheckbox.classList.add('swingtx-left-checkbox-for-hiding-options');

	let dateLabel=elementWithText('label','Filter by Date');

	let dateFilterCcheckboxID='swing-tx-left-checkbox-event-filter-date-'+Math.random();
	dateFilterCheckbox.setAttribute('id',dateFilterCcheckboxID);
	dateLabel.setAttribute('for',dateFilterCcheckboxID);

	dateFilterContainer.appendChild(dateFilterCheckbox);
	dateFilterContainer.appendChild(dateLabel);

	let hideExtraInputContainer=document.createElement('div');
	hideExtraInputContainer.classList.add('swingtx-left-container-for-hiding-options');


	let startInput=document.createElement('input');
	startInput.setAttribute('type','date');
	startInput.setAttribute('placeholder','yyyy-mm-dd');
	startInput.setAttribute('pattern','\\d\\d\\d\\d-\\d\\d-\\d\\d');
	startInput.setAttribute('name','event-start-date');
	//startInput.addEventListener('blur',whenFilterDateEnabledReAddCalanderWithFiltering);
	
	let startInputID='swing-tx-left-event-start-date-'+Math.random();
	startInput.setAttribute('id',startInputID);
	let startlabel=elementWithText('label',' Start Date: ');
	startlabel.setAttribute('for',startInputID);

	hideExtraInputContainer.appendChild(startlabel);
	hideExtraInputContainer.appendChild(startInput);

	

	let endInput=document.createElement('input');
	endInput.setAttribute('type','date');
	endInput.setAttribute('placeholder','yyyy-mm-dd');
	endInput.setAttribute('pattern','\\d\\d\\d\\d-\\d\\d-\\d\\d');
	endInput.setAttribute('name','event-end-date');
	//endInput.addEventListener('blur',whenFilterDateEnabledReAddCalanderWithFiltering);

	let endInputID='swing-tx-left-event-end-date-'+Math.random();
	endInput.setAttribute('id',endInputID);
	let endlabel=elementWithText('label',' End Date: ');
	endlabel.setAttribute('for',endInputID);

	hideExtraInputContainer.appendChild(endlabel);
	hideExtraInputContainer.appendChild(endInput);

	dateFilterContainer.appendChild(hideExtraInputContainer);

	// let dateFilterButton=elementWithText('button','Filter by Date');
	// dateFilterButton.classList.add('dateFilterButton');
	// dateFilterButton.addEventListener('click',filterButtonClick);
	// dateFilterContainer.appendChild(dateFilterButton);

	return dateFilterContainer;
}

function whenFilterDateEnabledReAddCalanderWithFiltering(){
	if(document.querySelectorAll('.dateFilterButton.eventFilterButtonSelected').length>0){
		reAddCalanderWithFiltering();
	}
	
}

// function writeFilterResetControls(){
	
// 	let resetFilterContainer=document.getElementById('swingleftResetFilters');

// 	resetFilterContainer.appendChild(document.createTextNode('Reset Filters: '));

// 	let resetFilterButton=elementWithText('button','Show All');
// 	resetFilterButton.addEventListener('click',resetFilters);
// 	resetFilterContainer.appendChild(resetFilterButton);

// }
// function resetFilters(){
// 	let selectedFiltersButtons=document.querySelectorAll('.eventFilterButtonSelected');
// 	for(let b of selectedFiltersButtons){
// 		b.classList.remove('eventFilterButtonSelected');
// 	}
// 	reAddCalanderWithFiltering();
// }

// function writeFilterByTagControls(swingtxleftEvents){
// 	let tagFilterContainer=document.getElementById('swingleftTagOptions');
// 	tagFilterContainer.appendChild(document.createTextNode('Filter by Tags: '));
// 	let tagArray=[];


// 	for(let e of swingtxleftEvents){
// 		if(e.tags.length>0){
// 			for(let t of e.tags){
// 				if(!tagArray.some((el)=>{ return t.id === el.id})){
// 					tagArray.push({id:t.id,name:t.name});
// 				}
// 			}
// 		}
// 	}


// 	console.log(tagArray);

	
// 	for(let tag of tagArray){
// 		let tagButton=elementWithText('button',tag.name);
// 		tagButton.setAttribute('data-tag-id',tag.id);
// 		tagButton.classList.add('tagFilterButton');
// 		tagButton.addEventListener('click',filterButtonClick);

// 		tagFilterContainer.appendChild(tagButton);
// 	}


// }

// function getEventTagsAvailable(){}

function filterButtonClick(ev){
	if(ev.currentTarget.classList.contains('eventFilterButtonSelected')){
		ev.currentTarget.classList.remove('eventFilterButtonSelected');
	}
	else{
		ev.currentTarget.classList.add('eventFilterButtonSelected');
	}
	reAddCalanderWithFiltering();
}



async function addHcdpCalender(swingtxleftEvents,eventsContainer){
	
	//document.getElementById('calInsert').innerText=JSON.stringify(theData);
	
	// console.log(swingtxleftEvents.filter(filterUpcomingEvents));
	// document.getElementById('futureEvents').innerHTML='';
	// writeEvents(swingtxleftEvents.filter(filterUpcomingEvents),document.getElementById('futureEvents'));
	// document.getElementById('pastEvents').innerHTML='';
	// writeEvents(swingtxleftEvents.filter(filterPastEvents).reverse(),document.getElementById('pastEvents'));
	eventsContainer.innerHTML='';
	writeEvents(swingtxleftEvents,eventsContainer);

}


async function reAddCalanderWithFiltering(theForm,eventsContainer){
	let queryURL=mobilizeURL;

	let fData=new FormData(theForm);
	
	let errorBar=theForm.querySelector('.swing-tx-left-event-filter-errors');
	errorBar.innerHTML='';

	for(let t of fData.getAll('event-type')){
		queryURL=queryURL+'&event_types='+ t;
	}

	// let filterTagButtonsSelected=document.querySelectorAll('.tagFilterButton.eventFilterButtonSelected');

	// for(let b of filterTagButtonsSelected){
	// 	queryURL=queryURL+'&tag_id='+ b.getAttribute('data-tag-id');
	// }
	
	if(fData.has('event-filter-location')){
		console.log('geo filtering');
		let shouldAddToQuery=true;
		if(fData.get('event-zip-code')===''){
			errorBar.appendChild(document.createTextNode(' Zip Code Missing '));
			shouldAddToQuery=false;
		}
		if(fData.get('event-max-distance')===''){
			errorBar.appendChild(document.createTextNode(' Distance Missing '));
			shouldAddToQuery=false;
		}
		if(shouldAddToQuery){
				let zipcode=fData.get('event-zip-code');
				let distance=fData.get('event-max-distance');
			queryURL=queryURL+'&zipcode='+zipcode+'&max_dist='+distance;
		}
	
	}


	if(fData.has('event-filter-date')){
		console.log('date filtering');
		let shouldAddToQuery=true;
		if(fData.get('event-start-date')==''){
			errorBar.appendChild(document.createTextNode(' Start Date Missing '));
			shouldAddToQuery=false;
		}
		if(fData.get('event-end-date')==''){
			errorBar.appendChild(document.createTextNode(' End Date Missing '));
			shouldAddToQuery=false;
		}
		if(shouldAddToQuery){
			let startDateArr=fData.get('event-start-date').split('-').map((el)=>{
				return parseInt(el,10);
			});
			let endDateArr=fData.get('event-end-date').split('-').map((el)=>{
				return parseInt(el,10);
			});
		
			console.log({
				s:startDateArr,
				e:endDateArr
			});

			let startDate=new Date(startDateArr[0],startDateArr[1]-1,startDateArr[2]);

			let endDate=new Date(endDateArr[0],endDateArr[1]-1,endDateArr[2]);

			console.log({
		
				ss:startDate.toLocaleString(),
				es:endDate.toLocaleString()
			})

			let startSec=Math.floor(startDate.getTime()/1000);

			let endSec=Math.floor(endDate.getTime()/1000)+(24*60*60);

			

			queryURL=queryURL+'&timeslot_start=gte_'+startSec+'&timeslot_start=lte_'+endSec;
		}
	}



	console.log(queryURL);

	let data=await getSwingLeftEvents(queryURL);
	
	//todo write this a bit better
	let filterVirtualStatusButtonsSelected=document.querySelectorAll('.virtualStatusFilterButton.eventFilterButtonSelected');
	if(filterVirtualStatusButtonsSelected.length>0){
		data=data.filter((el)=>{
				for(let b of filterVirtualStatusButtonsSelected){
					if(el.is_virtual.toString()===b.getAttribute('data-virtual-status')){
						return true;
					}
				}
			return false;
		});
	}
	
	addHcdpCalender(data,eventsContainer);
}

function getEventTypesAvailable(swingtxleftEvents){
	//todo see if can simplify
	let eventTypeArray=[];
	
	for(let e of swingtxleftEvents){
		if(!eventTypeArray.includes(e.event_type)){
			eventTypeArray.push(e.event_type);
		}
	}
	return eventTypeArray;
}

function filterOnlySwingTXLeft(event,index,arr){
	let swingtxleftRegExp=/swing\s*tx\s*left/i;
	let stxlRegExp=/STXL/i;
	if(event.title.search(swingtxleftRegExp)!==-1||event.title.search(stxlRegExp)!==-1){
		return true;
	}
	else if(event.description.search(swingtxleftRegExp)!==-1||event.description.search(stxlRegExp)!==-1){
		return true;
	}
	return false;
}



// function filterUpcomingEvents(event,index,arr){
// 	return event.timeslots.some((time)=>{
// 		return time.end_date>Math.floor(Date.now()/1000);
// 	})
// }

// function filterPastEvents(event,index,arr){
// 	return event.timeslots.some((time)=>{
// 		return time.end_date<Math.floor(Date.now()/1000);
// 	})
// }

function writeEvents(events,elementContainer){
	let eventTimeSlots=splitEventsIntoTimeSlot(events);


	let eventTimeSlotsGroupedByDay=eventTimeSlots.reduce((groupedArr,curVal)=>{
		
		let etsStart=new Date(curVal.timeslot.start_date*1000).toDateString();
		let dateExistAlready=groupedArr.some((el)=>{
			return el.dayStr===etsStart;
		});
		if(dateExistAlready){
			let dateLocation=groupedArr.findIndex((el)=>{
				return el.dayStr===etsStart
			});
			groupedArr[dateLocation].etsArr.push(curVal);
		}
		else{
			groupedArr.push({dayStr:etsStart,etsArr:[curVal]});
		}
		return groupedArr;
	},[]);
	console.log(eventTimeSlotsGroupedByDay);

	
	for(let day of eventTimeSlotsGroupedByDay){
		let dayContainer=document.createElement('div');
		dayContainer.classList.add('swtxl-events-day');
		let dayDisplay=elementWithText('h2',day.dayStr); 
		dayDisplay.classList.add('swtxl-events-big-day');

		dayContainer.appendChild(dayDisplay);

		for(let ets of day.etsArr){
			dayContainer.appendChild(eventTimeSlotHTML(ets));
		}

		elementContainer.appendChild(dayContainer);
	}


	// for(let ets of eventTimeSlots){
		
	// 	elementContainer.appendChild(eventTimeSlotHTML(ets));
	// }
}
function unixTimeStampToDate(){

}

function formatEventDate(){

}

function eventTimeSlotHTML(eventTimeSlot){
	let event=eventTimeSlot.event;
	let eventDiv=document.createElement('div');
	eventDiv.classList.add('swingtxleft-event');
	eventDiv.setAttribute('id','eventid-'+event.id+'-'+eventTimeSlot.timeslot.start_date+'-'+eventTimeSlot.timeslot.end_date);

	eventDiv.appendChild(elementWithText('h3',event.title));
	// if(event.summary!==''){
	// 	eventDiv.appendChild(eventFieldHTML('Summary',event.summary));
	// }

	if(event.is_virtual){
		eventDiv.appendChild(elementWithText('div','Virtual Event'));
	}

	eventDiv.appendChild(eventFieldHTML('Type',humanizeEventType(event.event_type)));


	let dateFormater=new Intl.DateTimeFormat(undefined,{
		weekday:'long',
		//era:'short',
		year:'numeric',
		month:'long',
		day:'numeric',
		hour:'numeric',
		minute:'2-digit',
		timeZoneName:'short'

	});
	let startDate=new Date(eventTimeSlot.timeslot.start_date*1000);
	let endDate=new Date(eventTimeSlot.timeslot.end_date*1000)
	
	


	eventDiv.appendChild(eventFieldHTML('Starts',dateFormater.format(startDate)));
	
	eventDiv.appendChild(eventFieldHTML('Ends',dateFormater.format(endDate)));
	//eventDiv.appendChild(eventTimeSlotsHTML(event.timeslots));

	if(event.timeslots.length>1){
		let showMoreTimesContainer=document.createElement('details');

		let showMoreTimesButton=elementWithText('summary','Show More Times');
		showMoreTimesContainer.appendChild(showMoreTimesButton);
		
		let showMoreTimesList=document.createElement('ul');
		for (let t of event.timeslots) {
			if (t.start_date !== eventTimeSlot.timeslot.start_date && t.end_date !== eventTimeSlot.timeslot.end_date) {

				let sdate = new Date(t.start_date * 1000);
				let edate = new Date(t.end_date * 1000);
				let timeText = dateFormater.format(sdate) + ' to ' + dateFormater.format(edate);
				let li=document.createElement('li');
				let link=elementWithText('a', timeText);
				link.setAttribute('href','#eventid-'+event.id+'-'+t.start_date+'-'+t.end_date);

				li.appendChild(link);
				showMoreTimesList.appendChild(li);
			}
		}	
		showMoreTimesContainer.appendChild(showMoreTimesList);
		eventDiv.appendChild(showMoreTimesContainer);

	}

	if(event.location!==null){
		
		eventDiv.appendChild(eventFieldHTML('Location',event.location.venue));
		if(event.address_visibility==='PUBLIC'){
			let googlemapurl='https://www.google.com/maps/dir/?api=1';
			let address=event.location.address_lines.join(' ')+' '+event.location.locality+', '+event.location.region+' '+event.location.postal_code
			googlemapurl=googlemapurl+'&destination='+encodeURIComponent(address);

			let mapLink=document.createElement('a');
			mapLink.setAttribute('href',googlemapurl);
			mapLink.setAttribute('target','_blank');
			mapLink.appendChild(document.createTextNode('Directions'));
			eventDiv.appendChild(mapLink);
		}
		
		eventDiv.appendChild(elementWithText('div',event.location.address_lines.join('\n')));
		eventDiv.appendChild(elementWithText('div',event.location.locality+', '+event.location.region+' '+event.location.postal_code));
	}

	let descriptionPreviewLength=2;
	let descriptionLines=event.description.split('\n\n');

	let descriptionField=document.createElement('div');
	

	let markdownIt=window.markdownit({
		linkify:true
	});

	if(descriptionLines.length>descriptionPreviewLength){
		let showMoreClicker=elementWithText('a',' ...Click to Show More');
		descriptionField.innerHTML=markdownIt.render(descriptionLines.slice(0,descriptionPreviewLength).join('\n\n'));
		showMoreClicker.addEventListener('click',(ev)=>{
			descriptionField.innerHTML=markdownIt.render(event.description);
			ev.currentTarget.remove();
		});


		descriptionField.appendChild(showMoreClicker);
	}
	else{
		descriptionField.innerHTML=markdownIt.render(event.description);
	}
	eventDiv.appendChild(descriptionField);


	// let eventLink=document.createElement('a');

	// eventLink.setAttribute('href',event.browser_url);
	// eventLink.setAttribute('target','_blank');
	// eventLink.appendChild(document.createTextNode('Sign Up -> New Tab'));

	// eventDiv.appendChild(eventLink);

	let signUpButton=elementWithText('button','Sign Up');
	signUpButton.addEventListener('click',overlaySignUp);
	signUpButton.setAttribute('data-sign-up-url',event.browser_url);

	eventDiv.appendChild(signUpButton);

	// if(event.tags.length>0){
	// 	let tagContainer=document.createElement('div');
	// 	tagContainer.classList.add('containerOfEventTags')
	// 	for (let t of event.tags){

			
	// 		tagContainer.appendChild(makeTagHTML(t));
	// 	}
	// 	eventDiv.appendChild(tagContainer);
	// }
	if(isDebugModeOn()){
		let debugtext=document.createElement('pre');
		debugtext.textContent='FOR DEBUG DATA FROM MOBILIZE AMERICA: \n\n'+JSON.stringify(event,null,'\t');
		eventDiv.appendChild(debugtext);
	}

	return eventDiv;
}


function makeTagHTML(t){
	let tagEl=document.createElement('div');
	tagEl.classList.add('eventTag');
	let theColor=makeStringToColorBorder(t.name);

	tagEl.style.borderColor='hsl('+theColor.hue+','+theColor.sat+'%,'+theColor.lum+'%)';

	let theColorB=makeStringToColorBackground(t.name);
	tagEl.style.backgroundColor='hsl('+theColorB.hue+','+theColorB.sat+'%,'+theColorB.lum+'%)';

	let theColorC=makeStringToColorBottomBorder(t.name);
	tagEl.style.borderBottomColor='hsl('+theColorC.hue+','+theColorC.sat+'%,'+theColorC.lum+'%)';
	tagEl.textContent=t.name;


	return tagEl

}


function overlaySignUp(ev){
	let signUpContainer=document.createElement('div');

	signUpContainer.setAttribute('style','z-index:900000000;top:0;left:0;position:fixed;width:100%;height:100%;background-color:rgba(0,0,0,0.5);');

	let signUpIframe=document.createElement('iframe');
	signUpIframe.setAttribute('src',ev.currentTarget.getAttribute('data-sign-up-url'));
	signUpIframe.setAttribute('style','top:10%;left:10%;position:fixed;width:80%;height:80%;');

	signUpContainer.appendChild(signUpIframe);

	let signUpCloseButton=elementWithText('span','X');
	signUpCloseButton.setAttribute('style','top:0;right:0;position:fixed;height:10vmin;width:10vmin;text-align:center;font-size:8vmin;line-height:normal;color:red;background-color:black;border-radius:50%;padding:1vmin;');
	signUpCloseButton.addEventListener('click',()=>{
		signUpContainer.remove();
	})

	signUpContainer.appendChild(signUpCloseButton);


	signUpContainer.addEventListener('click',()=>{
		signUpContainer.remove();
	})

	document.body.appendChild(signUpContainer);

}


function eventFieldHTML(fieldName,text){
	let fieldContainer=document.createElement('div');

	let fieldNameHTML=document.createElement('b');
	fieldNameHTML.textContent=fieldName+': ';

	fieldContainer.appendChild(fieldNameHTML);

	fieldContainer.appendChild(elementWithText('span',text));

	return fieldContainer;
}

// function eventTimeSlotsHTML(timeslots){
// 	let timeslotContainer=document.createElement('div');
// 	let timeslotList=document.createElement('ul');

// 	timeslotContainer.appendChild(timeslotList);

// 	for(let t of timeslots){
// 		let startDate=new Date(t.start_date*1000);
		
// 		let endDate=new Date(t.end_date*1000)
// 		timeslotList.appendChild(elementWithText('li',startDate.toLocaleString()+' to '+endDate.toLocaleString()));

// 	}

// 	return timeslotContainer;
// }

function elementWithText(element,text){
	let el=document.createElement(element);
	el.innerText=text;

	return el;
}

function humanizeEventType(eventType){
	if(eventType==='MEET_GREET'){
		return 'Meet & Greet'
	}

	let words=eventType.split('_');

	words=words.map((w)=>{
		w=w.toLowerCase();
		w=w[0].toUpperCase()+w.substring(1);
		return w;
	});

	return words.join(' ');


}

async function getData(url){
	let res=await fetch(url,{
		referrerPolicy:'no-referrer'
	});
	let eventArr=[];
	let theJson=await res.json();
	console.log(theJson);
	eventArr=theJson.data;
	if(theJson.next!==null){
		console.log('fetching more');
		eventArr=eventArr.concat(await getData(theJson.next));
	}
	else{
		console.log('fetched all');
	}
	return eventArr;
}

function makeStringToColor(str,hueDiv,hueAdd,satDiv,satAdd,lumDiv,lumAdd,bInt=true){
	
	let stringNumber=stringToBigInt(str,bInt);

	if(typeof BigInt==='function'&&bInt){
		hueDiv=BigInt(hueDiv);
		hueAdd=BigInt(hueAdd);
		satDiv=BigInt(satDiv);
		satAdd=BigInt(satAdd);
		lumDiv=BigInt(lumDiv);
		lumAdd=BigInt(lumAdd);
	}

	let colorObj= {
		hue:(stringNumber%hueDiv)+hueAdd,
		sat:(stringNumber%satDiv)+satAdd,
		lum:(stringNumber%lumDiv)+lumAdd
	}

	//console.log(colorObj);

	return colorObj;
}

function stringToBigInt(str,bInt=true){
	let numStr='';

	for(let i=0;i<str.length;i++ ){
		let valueofChar=str.codePointAt(i).toString(16).padStart(4,'0');
		numStr=numStr+valueofChar;
	}
	
	let stringIntVal;
	if(typeof BigInt==='function'&&bInt){
		
		stringIntVal=BigInt('0x'+numStr);
	}
	else{
		
		stringIntVal=parseInt('0x'+numStr);
	}

	return stringIntVal;
}

function makeStringToColorBorder(str,bInt=true){

	return makeStringToColor(str,359,0,83,17,59,20,bInt);

}

function makeStringToColorBottomBorder(str,bInt=true){

	return makeStringToColor(str.split('').reverse().join(''),7829,100,17,83,20,40,bInt);

}

function makeStringToColorBackground(str,bInt=true){

	let col= makeStringToColor(str,3,0,23,4,19,70,bInt);
	let col2= makeStringToColor(str.split('').reverse().join(''),113,300,73,0,1,0,bInt);
	let hue;
	if(typeof BigInt==='function'&&bInt){
		hue=col2.hue+(col.hue*BigInt(120));
	}
	else{
		hue=col2.hue+(col.hue*120);
	}
	return {
		hue:hue,
		sat:col.sat+col2.sat,
		lum:col.lum,
	};
}
