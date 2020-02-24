const validationErrorClass = 'validation-error'
const parentErrorClass = 'has-validation-error'
//const inputs = document.querySelectorAll('[required]');
const inputs = document.querySelectorAll('input,select,textarea');
inputs.forEach(function (input) {
  function checkValidity (options) {
    const insertError = options.insertError
    const parent = input.parentNode
    //const error = parent.querySelector(`.${validationErrorClass}`)
    const error = parent.querySelector('.validation-error') || document.createElement('div');

    if (!input.validity.valid && input.validationMessage) {
      error.className = validationErrorClass
      //error.textContent = input.validationMessage
      error.textContent = getCustomMessage(input);

      if (insertError) {
        input.classList.add('invalidField')
        input.insertAdjacentElement("afterend", error);
        //parent.insertBefore(error, input)
        parent.classList.add(parentErrorClass);
        //querySelector returns first element
        input.closest('form').querySelector(".invalidField").scrollIntoView({block: 'center',behavior: 'smooth'});
      }
    } else {
    	parent.classList.remove(parentErrorClass)
    	input.classList.remove('invalidField')
    	if(isIE()) {
    		parent.removeChild(error);
    	} else {
    		error.remove();
    	}
    }
  }
  
  if(isIE()) {
	  //for ie, event 'input' is 'change'
	  input.addEventListener('change', function () {
		  checkValidity({insertError: false})
	  });
  } else {
	  input.addEventListener('input', function () {
		  // update the error or hide it on input.
		  // Otherwise it will show when typing.
		  checkValidity({insertError: false})
	  });
  }
  
  input.addEventListener('invalid', function (e) {
      // prevent showing the default display
      e.preventDefault()
      // only insert error to required fields that don't have class 'hiddenRequiredField'
      // (fields that are required but not visible on the form until a checkbox/radio/select selected)
      if(!input.classList.contains("hiddenRequiredField")) {
    	  // create the error in invalid.
    	  checkValidity({insertError: true})
      } else {
    	  //required field has class 'hiddenRequiredField', 
    	  //means the field is hidden and it's not required, remove attribute 'required'
    	  //so that the form can skip validate this field and continue on
    	  input.removeAttribute("required");
      }
  });
});
function getCustomMessage(input) {
	var errMsg = '';
	if(input.type=="email") {
		errMsg = "Please enter a valid email";
	} else {
		errMsg = input.validationMessage;
	}
	return errMsg;
}
function scrollElementIntoView(ele) {
	document.getElementById(ele).scrollIntoView({block: 'center',behavior: 'smooth'});
}
function clearFieldError(input) {
	if(typeof input !== 'undefined') {
		var inputs = [];
		if(!Array.isArray(input)) inputs.push(input);
		else inputs = input;		
		for(var i=0;i<inputs.length;i++) {
			const input = document.getElementById(inputs[i]);
			if(input.classList.contains("invalidField")) {
				const parent = input.parentNode
				const error = parent.querySelector('.validation-error')
				
				parent.classList.remove('has-validation-error')
			    input.classList.remove('invalidField')
			    error.remove();
				if(isIE()) {
		    		parent.removeChild(error);
		    	} else {
		    		error.remove();
		    	}
			}
		}
	}
}
function addRequired(input) {
	if(typeof input !== 'undefined') {
		var inputs = [];
		if(!Array.isArray(input)) inputs.push(input);
		else inputs = input;
		console.log(inputs);
		for(var i=0;i<inputs.length;i++) {
			if(document.getElementById(inputs[i]) && document.getElementById(inputs[i]).classList.contains("hiddenRequiredField")){
				//$("#"+inputs[i]).removeClass("hiddenRequiredField").prop("required",true);
				document.getElementById(inputs[i]).classList.remove("hiddenRequiredField");
				document.getElementById(inputs[i]).required = true;
			}
		}
	}
}
function removeRequired(input) {
	if(typeof input !== 'undefined') {
		var inputs = [];
		if(!Array.isArray(input)) inputs.push(input);
		else inputs = input;
		console.log(inputs);
		for(var i=0;i<inputs.length;i++) {
			//$("#"+inputs[i]).addClass("hiddenRequiredField").prop("required",false);
			if(document.getElementById(inputs[i]) && !document.getElementById(inputs[i]).classList.contains("hiddenRequiredField")){
				document.getElementById(inputs[i]).classList.add("hiddenRequiredField");
				document.getElementById(inputs[i]).required = false;
				clearFieldError(inputs[i]);
			}
		}
	}
}
function isIE() {
    var ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object
    var msie = ua.indexOf('MSIE '); // IE 10 or older
    var trident = ua.indexOf('Trident/'); //IE 11

    return (msie > 0 || trident > 0);
}
