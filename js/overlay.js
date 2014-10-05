$(document).ready(function () {
	$('body').append('<div class="overlay"><div class="controls"></div></div>')
	$('.controls').append('<div class="map-editor"><p>Controls</p>' + 
		'<label>Camera</label><input type="radio" name="control-group" name="map-edit" value="camera" checked/><br/>' + 
		'<label>Terraform</label><input type="radio" name="control-group" name="map-edit" value="terraform"/><br/>' + 
		'<label>Paint</label><input type="radio" name="control-group" name="map-edit" value="paint"/>' + 
		'</div>')

	$("input[name='control-group']").change(function (evt) {
		console.log('hi mom!');
		var val = evt.target.value;
		resetControls();
		switch (val) {
			case 'camera':
				initCameraControls()
				break;
			case 'terraform':
				break;
			case 'paint':
				break;
		}
	})
});