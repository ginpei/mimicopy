test_helper_fireEvent = function(el, type, extention) {
	var event = document.createEvent('Events');  // instantiating via CustomEvent constructor is not supported in IE 11
	event.initEvent(type, true, true);
	gQuery.extend(event, extention);
	el.dispatchEvent(event);
};
