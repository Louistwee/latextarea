var textareaList = $('textarea');
var mathFieldSpan = document.createElement('span');
var $mathFieldSpan = $(mathFieldSpan).addClass('latextarea-span').appendTo('body').hide().css({
	fontSize:20,
});
var activeTextarea = false;
var activePre = false;
var activeEnd = false;
var activeFocused = false;
var MQ = MathQuill.getInterface(2); // for backcompat
var mathField = MQ.MathField(mathFieldSpan, {
  spaceBehavesLikeTab: true, // configurable
  handlers: {
    edit: function() { // useful event handlers
    	if(activeTextarea && activePre !== false && activeEnd !== false && !activeFocused){
    		activeTextarea.value = activePre + mathField.latex() + activeEnd;
    	}
    }
  }
});
var matthTextarea = $mathFieldSpan.find('textarea').blur(function(){
	$mathFieldSpan.hide();
	activeTextarea = false;
	activePre = false;
	activeEnd = false;
})[0];
$(document).on('selectionchange',function(e){
	if(!activeFocused)return;
	var s = $(activeTextarea).prop("selectionStart");
	var e = $(activeTextarea).prop("selectionEnd");
	var v = activeTextarea.value;
	activePre = v.slice(0,s);
	activeEnd = v.slice(e);
	mathField.latex(v.slice(s,e));
})
textareaList.focus(function(){
	$mathFieldSpan.show();
	console.log(this);
	var l = $(this).offset();
	var t = l.top - $(window).scrollTop() + $(this).outerHeight();
	l = l.left;
	$mathFieldSpan.css({
		top:t,
		left:l,
		width:$(this).outerWidth(),
	});
	activeTextarea = this;
	activeFocused = true;
}).blur(function(e){
	if(e.originalEvent.relatedTarget !== matthTextarea){
		$mathFieldSpan.hide();
		activeTextarea = false;
		activePre = false;
		activeEnd = false;
	}
	activeFocused = false;
})