EarthQuake.VList = function(ds,type) {
	if (type == 16) {
		var savepos = ds.position;
		var length = ds.readUint32(false);
		var numlength = ((length - 4) / 2);
		this.numbers = ds.readUint16Array(numlength,false);
	} else if (type == 32) {
		var savepos = ds.position;
		var length = ds.readUint32(false);
		var numlength = ((length - 4) / 4);
		this.numbers = ds.readUint32Array(numlength);
		ds.position += (length - 4);
	} else {
		// need to error here
		return;
	}
	var listlength = ds.readUint16(false);
	var listPos = ds.readUint32Array(listlength + 1,false);
	this.entries = [];
	for (var i=0; i < listlength; i++) {
		var entrylength = listPos[i + 1] - listPos[i];
		var buf = new ArrayBuffer(entrylength);
		var dst = new Uint8Array(buf);
		var src = ds.readUint8Array(entrylength);
		dst.set(src);
		this.entries.push(new DataStream(buf,0,false));
	}
}