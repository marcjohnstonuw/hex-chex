$(document).ready(function () {
	$('body').append('<div class="overlay"><div class="controls"></div></div>')
	$('.controls').append('<div class="map-editor"><p>Controls</p>' + 
		'<label>Camera</label><input type="radio" name="control-group" name="map-edit" value="camera" checked/><br/>' + 
		'<label>Terraform</label><input type="radio" name="control-group" name="map-edit" value="terraform"/><br/>' + 
		'<label>Paint</label><input type="radio" name="control-group" name="map-edit" value="paint"/>' + 
		'</div>')
	$('.controls').append('<div class="palette"></div>');
	updatePalette();
	$($("input[name='color']")[0]).attr('checked', 'checked');

	$("input[name='control-group']").change(function (evt) {
		var val = evt.target.value;
		resetControls();
		switch (val) {
			case 'camera':
				initCameraControls();
				break;
			case 'terraform':
				initTerraformControls();
				break;
			case 'paint':
				initPaintControls();
				break;
		}
	})
});

function updatePalette () {
	var palette = $('.palette');
	palette.html('');
	for (var i = 0; i < Materials.colors.length; i++) {
		palette.append('<div class="color"><label>' + Materials.colors[i].name + '</label><input type="radio" name="color" value="' + i + '" /><div class="swatch" style="background-color:' + Materials.colors[i].color + '"></div></div>')
	}

	$("input[name='color']").change(function (evt) {
		var val = evt.target.value;
		SELECTED_COLOR = val;
	})
}