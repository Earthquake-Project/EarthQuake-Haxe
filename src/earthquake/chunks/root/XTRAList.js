EarthQuake.XtraList = function(src) { // NEEDS WORK
	this.xtras = [];
	if (src.id == "XTRl") {
		var data = src.bytes;
		console.log(src);
		this.unknown = data.readUint32();
		var xtraCount = data.readUint32(false);
		for (var i=0; i < xtraCount; i++) {
			var length = data.readUint32(false);
			var vlist = new EarthQuake.VList(data,16);
			var id = this.readGUID(vlist);
			/*
				keep consistent with lingo naming so potential player doesn't need to add conversion
				but then again, reading this as-is grants access to what probably are internal/hidden
				values.

				allowed properties for lingo:
				#filename,
				#packageurl,
				#packagefiles [
					#name,
					#version
				]

				may consider disabling the undocumented properties...
			*/
			var xtraentry = { 
				GUID : id,
				filename : "",
				name : "",
				version : "",
				packageurl : "",
				packagefiles : {
					filename : "",
					name : "",
					version : ""
				}
			}
			console.log("XTRA[" + i +"]");
			/*
				unknowns are likely bitfields for things like if xtra is marked for download
				more research is required
			*/
			console.log("UNK nums: " + this.toHex(vlist.numbers[0],16) + " " + this.toHex(vlist.numbers[1],16) );
			for (var i2=0; i2 < vlist.entries.length; i2++) {
				var curr = vlist.entries[i2];
				var infotype = curr.readUint16();
				var infolength = curr.readUint8();
				var info = this.readString(curr,infolength);
				switch (infotype) {
					case 0x0100 : 
						xtraentry.packageurl = info;
						break;
					case 0x0602 :
						xtraentry.name = info;
						break;
					case 0x0605 :
						xtraentry.filename = info;
						break;
					case 0x2202 :
						xtraentry.version = info;
						break;
					case 0x4105 :
						xtraentry.packagefiles.filename = info;
						break;
					case 0x0000 :
						xtraentry.packagefiles.name = info;
						break;
					case 0x4205 :
						xtraentry.packagefiles.version = info;
						break;
					default :
						trace("PROP ID :" + infotype + " is unknown, skipping","EARTHQUAKE.XTRALIST","WARNING");
						trace("UNKNOWN PROPERTY DATA : " + info,"EARTHQUAKE.XTRALIST","INFO");
						break;
				}
			}
			this.xtras.push(xtraentry);
		}
	}
}
EarthQuake.XtraList.prototype.readGUID = function(vlist) {
	// {00000000-0000-0000-00-00-00-00-00-00-00-00}
	var arr = vlist.numbers;
	// there is not really any nice way to read the GUID
	// seems to be reading wrong values under certain circumstances
	return ("{" +
		this.toHex(arr[2],16) + this.toHex(arr[3],16) +  "-" +
		this.toHex(arr[4],16) +  "-" +
		this.toHex(arr[5],16) +  "-" +
		this.toHex(((arr[6] & 0xff00) >> 8),8) +  "-" + this.toHex((arr[6] & 0xff00,8)) + "-" +
		this.toHex(((arr[7] & 0xff00) >> 8),8) +  "-" + this.toHex((arr[7] & 0xff00,8)) + "-" +
		this.toHex(((arr[8] & 0xff00) >> 8),8) +  "-" + this.toHex((arr[8] & 0xff00,8)) + "-" +
		this.toHex(((arr[9] & 0xff00) >> 8),8) +  "-" + this.toHex((arr[9] & 0xff00,8)) +
	"}");
}
EarthQuake.XtraList.prototype.toHex = function(num,bits) { // todo : UTIL function
	var nibbles = Math.ceil(bits / 4);
	var out = "";
	var hex = num.toString(16);
	if (hex.length < nibbles) {
		var count = nibbles - hex.length;
		for (var i=0; i < count; i++) {
			out += "0";
		}
		return out + hex;
	} else {
		return hex;
	}
}
EarthQuake.XtraList.prototype.readString =function(data,length) { // todo : util function
	var out = "";
	for (var i=0; i < length; i++) {
		var char = data.readUint8();
		if (char >= 32) {
			out += String.fromCharCode(char);
		}
	}
	return out;
}