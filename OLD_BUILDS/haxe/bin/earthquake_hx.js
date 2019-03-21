(function (console, $hx_exports) { "use strict";
var brian151 = $hx_exports.brian151 = $hx_exports.brian151 || {};
$hx_exports.brian151.riff = $hx_exports.brian151.riff || {};
;$hx_exports.brian151.earthquake = $hx_exports.brian151.earthquake || {};
$hx_exports.brian151.earthquake.containers = $hx_exports.brian151.earthquake.containers || {};
;$hx_exports.brian151.earthquake.castlib = $hx_exports.brian151.earthquake.castlib || {};
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var brian151_earthquake_Movie = $hx_exports.brian151.earthquake.Movie = function(src) {
	var header = new DataView(src,0,12);
	this.getType(header);
	if(this.isValid) {
		if(this.isCompressed) this.dataFile = new brian151_earthquake_containers_ContainerCompressed(src); else if(this.isProtected || this.isProjector) {
			this.dataFile = new brian151_earthquake_containers_ContainerProtected(src);
			if(this.isProjector) this.dataFile.setProjector();
		} else this.dataFile = new brian151_earthquake_containers_Container(src);
		this.dataFile.setFormat(this.riffType);
		var mapO = this.dataFile.findMap();
		this.dataFile.parseMap(mapO);
		if(this.isValid) this.dataFile.parseSectionAssociationTable();
	}
};
brian151_earthquake_Movie.prototype = {
	getType: function(hint) {
		var head = hint.getUint32(0);
		var formType = hint.getUint32(8);
		var len = 0;
		this.isValid = true;
		switch(head) {
		case 1481001298:
			this.riffType = "XFIR";
			len = hint.getUint32(4,true);
			break;
		case 1380533848:
			this.riffType = "RIFX";
			len = hint.getUint32(4,false);
			break;
		default:
			this.isValid = false;
		}
		if(hint.buffer.byteLength - 8 != len) this.isValid = false;
		this.isCompressed = false;
		this.isProtected = false;
		this.isProjector = false;
		switch(formType) {
		case 859395661:
			if(this.riffType != "XFIR") this.isValid = false;
			break;
		case 1297496371:
			if(this.riffType != "RIFX") this.isValid = false;
			break;
		case 1296320326:
			if(this.riffType != "XFIR") this.isValid = false;
			this.isCompressed = true;
			break;
		case 1179075661:
			if(this.riffType != "RIFX") this.isValid = false;
			this.isCompressed = true;
			break;
		case 1280331841:
			if(this.riffType != "XFIR") this.isValid = false;
			this.isProjector = true;
			break;
		case 1095782476:
			if(this.riffType != "RIFX") this.isValid = false;
			this.isProjector = true;
			break;
		default:
			this.isValid = false;
		}
	}
};
var brian151_earthquake_castlib_Cast = $hx_exports.brian151.earthquake.castlib.Cast = function(type,nameText) {
	this.storageType = type;
	this.name = nameText;
};
var brian151_earthquake_castlib_CastMember = $hx_exports.brian151.earthquake.castlib.CastMember = function(type,nameText) {
	this.typeID = this.resolveType(type);
	this.name = nameText;
};
brian151_earthquake_castlib_CastMember.prototype = {
	resolveType: function(type) {
		var out = 15;
		var _g1 = 0;
		var _g = brian151_earthquake_castlib_CastMember.types.length;
		while(_g1 < _g) {
			var i = _g1++;
			var curr = brian151_earthquake_castlib_CastMember.types[i];
			if(curr == type) {
				out = i;
				break;
			}
		}
		return out;
	}
	,getType: function() {
		return brian151_earthquake_castlib_CastMember.types[this.typeID];
	}
};
var brian151_earthquake_containers_Container = $hx_exports.brian151.earthquake.containers.Container = function(src) {
	brian151.riff.File.call(this,src);
	this.isProjector = false;
	this.isCast = false;
	this.state = 0;
	this.sectionList = [];
	this.sectionListNotFree = [];
};
brian151_earthquake_containers_Container.__super__ = brian151.riff.File;
brian151_earthquake_containers_Container.prototype = $extend(brian151.riff.File.prototype,{
	checkCast: function() {
		var out = true;
		if(this.state >= 1) {
			var _g1 = 0;
			var _g = this.ptrs1.length;
			while(_g1 < _g) {
				var i = _g1++;
				var id = this.getFourCCAt(this.ptrs1[i]);
				if(id == "MCsL") {
					out = false;
					break;
				}
			}
		} else window.console.log("cannot check as external cast, mmap not parsed");
		window.console.log("is external cast : " + (out == null?"null":"" + out));
		return out;
	}
	,setProjector: function() {
		this.isProjector = true;
	}
	,findMap: function() {
		var mapIndexChunk = this.getSectionAt(12);
		var mapIndexHandler = mapIndexChunk.get_view();
		return mapIndexHandler.getUint32(4,true);
	}
	,parseMap: function(offset) {
		var mapChunk = this.getSectionAt(offset);
		var id = mapChunk.get_ID();
		window.console.log("assumed memory map ID: " + id);
		window.console.log("selected format: " + this.formats[this.currentFormat]);
		if(id == "mmap") {
			var handler = mapChunk.get_view();
			var count = handler.getUint32(4,true);
			var usedCount = handler.getUint32(8,true);
			var _g = 0;
			while(_g < count) {
				var i = _g++;
				var offset2 = i * 20 + 24;
				var id1 = mapChunk.getString("FOURCC",4,offset2);
				if(this.formatByteOrder[this.currentFormat][0] == "L") {
					var tempID = "";
					var _g1 = 0;
					while(_g1 < 4) {
						var i2 = _g1++;
						var $char = id1.charAt(3 - i2);
						tempID += $char;
					}
					id1 = tempID;
				}
				var offset3 = handler.getUint32(offset2 + 8,true);
				if(id1 != "free" && id1 != "junk") {
					this.sectionListNotFree.push(i);
					this.sectionList.push(this.getSectionAt(offset3));
				} else {
				}
			}
			this.state = 1;
			$hx_exports.dbg = {}
			$hx_exports.dbg.secList = this.sectionList;
			$hx_exports.dbg.secListNF = this.sectionListNotFree;
		}
	}
	,parseSectionAssociationTable: function() {
	}
});
var brian151_earthquake_containers_ContainerCompressed = $hx_exports.brian151.earthquake.containers.ContainerCompressed = function(src) {
	brian151.riff.File.call(this,src);
	this.isProjector = false;
};
brian151_earthquake_containers_ContainerCompressed.__super__ = brian151.riff.File;
brian151_earthquake_containers_ContainerCompressed.prototype = $extend(brian151.riff.File.prototype,{
	checkCast: function() {
		return false;
	}
	,setProjector: function() {
		this.isProjector = true;
	}
});
var brian151_earthquake_containers_ContainerProtected = $hx_exports.brian151.earthquake.containers.ContainerProtected = function(src) {
	brian151.riff.File.call(this,src);
	this.isProjector = false;
};
brian151_earthquake_containers_ContainerProtected.__super__ = brian151.riff.File;
brian151_earthquake_containers_ContainerProtected.prototype = $extend(brian151.riff.File.prototype,{
	checkCast: function() {
		return false;
	}
	,setProjector: function() {
		this.isProjector = true;
	}
});
brian151_earthquake_castlib_CastMember.types = ["Invalid","Bitmap","Film Loop","Styled Text","Palette","Picture","Sound","Button","Vector Shape","Movie","Digital Video","Script","Rich Text (RTF)","OLE","Transition","Xtra"];
})(typeof console != "undefined" ? console : {log:function(){}}, typeof $hx_scope != "undefined" ? $hx_scope : $hx_scope = {});
