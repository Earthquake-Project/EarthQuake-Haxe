EarthQuake.ContainerCompressed = function(riff) {
	// these are...special and don't exactly obey RIFF specs
	this.bytes = new DataStream(riff.buffer,0,riff.endianness);
	this.subformat = riff.subformat;
	this.buffer = riff.buffer;
}
EarthQuake.ContainerCompressed.prototype.init = function() {
	var vers = this.readChunk(0xc,0,true,true,true);
	console.log(vers);
	console.log(this.bytes.position.toString(16));
	var errmsg = this.readChunk(this.bytes.position,0,true,false,true);
	var str = new TextDecoder("UTF-8").decode(new Uint8Array(errmsg.bytes._buffer));
	console.log(errmsg);
	//trace("FCDR : " + str,"EARTHQUAKE.COMPRESSED","INFO");
	console.log(this.bytes.position.toString(16));
	this.readafterBurnerMap();
	this.readILS();
}
EarthQuake.ContainerCompressed.prototype.readFourCC = function() {
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
EarthQuake.ContainerCompressed.prototype.readChunk = function(offset,length,haschunkheader,isnotcompressed,skipPos) {
	var savepos = this.bytes.position;
	this.bytes.position = offset;
	var id = "    ";
	var data = {}

	if (haschunkheader) {
		id = this.readFourCC();
		length = this.readVarint(0);
	}

	if (!isnotcompressed) {
		var comp = new Uint8Array(this.buffer,this.bytes.position,length);
		// console.log(comp);
		var decomp = new Zlib.Inflate(comp).decompress();
		// console.log(decomp.byteOffset + " " + decomp.length + " " + decomp.buffer.byteLength);
		var buf = new ArrayBuffer(decomp.length);
		var dst = new Uint8Array(buf);
		var src = new Uint8Array(decomp.buffer, 0, decomp.length);
		dst.set(src);
		data = new DataStream(buf,0,this.endianness);
		console.log(length.toString(16));
		// length = decomp.length;
	} else {
		var buf = new ArrayBuffer(length);
		var dst = new Uint8Array(buf);
		var src = new Uint8Array(this.buffer, this.bytes.position, length);
		dst.set(src);
		data = new DataStream(buf,0,this.endianness);
	}

	if (!skipPos) {
		this.bytes.position = savepos;
	} else {
		this.bytes.position += length;
	}
  	
  	return {
  		id : id,
  		bytes : data,
  		length : length
  	}
}
EarthQuake.ContainerCompressed.prototype.readafterBurnerMap = function() {
	var abmpid = this.readFourCC();
	var length = this.readVarint(0);
	var afterburnermap = {}
	var count = 0;
	var pos = this.bytes.position;
	if (abmpid == "ABMP") {
		var v2 = this.readVarint(0);
		count = this.readVarint(0);
		var newpos = this.bytes.position;
		var dist = newpos - pos;
		console.log(dist);
		console.log(length.toString(16) + " " + v2.toString(16) + " " + count.toString(16));
		afterburnermap = this.readChunk(this.bytes.position,length - dist,false,false,true);
		console.log(afterburnermap);
		afterburnermap.id = abmpid;
		afterburnermap.subformat = this.subformat;
		var dataheader = this.readFourCC();
		var datasize = this.readVarint(); // pretty consistently is zero
		if (dataheader == "FGEI") {
			this.dataOffset = this.bytes.position;
			console.log("DATA @" + this.dataOffset.toString(16));
		}
	}
	if (typeof afterburnermap.id == "string") {
		afterburnermap.readVarint = this.readVarint;
		afterburnermap.readFourCC = this.readFourCC;
		
		afterburnermap.bytes.position = 0;
		var bleh = afterburnermap.readVarint(0);
		var reslength = afterburnermap.readVarint(0);
		var realcount = afterburnermap.readVarint(0);

		this.map = {
				map : [],
				header : {
					unk1 : bleh,
					reslength : reslength,
					realcount : realcount
			}
		}

		for (var i=0; i < realcount; i++) {
			this.map.map.push({
				id : afterburnermap.readVarint(0),
				offset : afterburnermap.readVarint(0),
				compressedSize : afterburnermap.readVarint(0),
				decompressedSize : afterburnermap.readVarint(0),
				compressionMode : afterburnermap.readVarint(0),
				chunkID : afterburnermap.readFourCC()
			});
		}

		console.log(this.map);
	}

}
EarthQuake.ContainerCompressed.prototype.readVarint = function(previous) {
	// console.log("read verint from : " + this.bytes.position.toString(16));
	var src = this.bytes.readUint8()
	var value = src & 0b01111111;
	// console.log(src.toString(16)); 
	//console.log(this.bytes.position.toString(16));
	var hasnext = src & 0b010000000;
	value |= previous;
	if (hasnext != 0) {
		value <<= 7;
		return this.readVarint(value);
	} else {
		return value;
	}
}
EarthQuake.ContainerCompressed.prototype.readILS = function() {
	for (var i=0; i < this.map.map.length; i++) {
		var curr = this.map.map[i];
		var currID = curr.chunkID;
		/*
			TODO : 
				proper dump (prob filesaver.js?)
				parse
		*/
		if (currID == "ILS ") {
			this.bytes.offset = curr.offset;
			var ILS = this.readChunk(this.dataOffset + curr.offset,curr.compressedSize,false,false,false);
			var dumpstr = "";
			var dump = new Uint8Array(ILS.bytes._buffer);
			for (var i2=0; i2 < dump.length; i2++) {
				var hx = dump[i2];
				if (hx < 16) {
					dumpstr += "0" + hx.toString(16);
				} else {
					dumpstr += hx.toString(16);
				}
			}
			// trace(dumpstr,"EARTHQUAKE.COMPRESSED","DUMP"); // fairly expensive process
			console.log(ILS);
			break;
		}
	}
}