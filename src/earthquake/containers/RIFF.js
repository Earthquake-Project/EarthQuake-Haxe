var RIFF = function(srcbin) {
	this.bytes = new DataStream(srcbin,0,true);
	this.buffer = srcbin;
	this.subformat = "RIFF";
	this.endianness = true;
	this.formtype = "";
	this.getSubTypeAndEndianness();
}
RIFF.prototype.getSubTypeAndEndianness = function() {
	var subformat = this.readFourCC();
	if (subformat != "RIFF") {
		this.subformat = subformat;
		if (subformat == "RIFX") {
			this.endianness = false;
		}
	}
	this.bytes.position += 4; // skip length
	this.formtype = this.readFourCC();
}
RIFF.prototype.readFourCC = function() {
	var fourcc = "";
	var charArray = [];
	for (var i=0; i < 4; i++) {
		var char = this.bytes.readUint8();
		if (char >= 32) {
			charArray.push(String.fromCharCode(char));
		} else {
			// need to error
			charArray.push(" ");
		}
	}
	fourcc = charArray.join("");
	if (this.subformat == "XFIR") {
		fourcc = charArray.reverse().join("");
	}
	return fourcc;
}
RIFF.prototype.readChunk = function(offset) {
	var savepos = this.bytes.position;
	this.bytes.position = offset;

	var id = this.readFourCC();
	var length = this.bytes.readUint32();
	var buf = new ArrayBuffer(length);
  	var dst = new Uint8Array(buf);
  	var src = new Uint8Array(this.buffer, offset + 8, length);
  	dst.set(src);

  	this.bytes.position = savepos;
  	return {
  		id : id,
  		bytes : new DataStream(buf,0,this.endianness)
  	}
}