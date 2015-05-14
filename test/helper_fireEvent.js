test_helper_fireEvent = function(el, type) {
	var event = document.createEvent('Events');  // instantiating via CustomEvent constructor is not supported in IE 11
	event.initEvent(type, true, true);
	el.dispatchEvent(event);
};
