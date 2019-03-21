EarthQuake.File = function(riff) {
	var format = EarthQuake.detectFormat(riff);
	var container = {};
	if (format == "Director") {
		container = new EarthQuake.ContainerDirector(riff);
	} else if (format == "Shockwave") {
		container = new EarthQuake.ContainerCompressed(riff);
	}
	this.container = container;
	this.format = format;

	this.init();
}
EarthQuake.File.prototype.init = function() {
	this.container.init();
}