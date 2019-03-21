EarthQuake.detectFormat = function(riff) {
	var out = "";
	if (riff.formtype == "MV93") {
		out = "Director";
	} else if (riff.formtype == "FGDM") {
		out = "Shockwave";
	}
	trace("detected type as " + out,"EARTHQUAKE","INFO");
	return out;
}