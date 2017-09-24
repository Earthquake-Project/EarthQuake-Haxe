package brian151.earthquake.containers;
import brian151.riff.File;
import brian151.riff.LinkedSectionHandler;
import brian151.riff.Section;
import js.html.ArrayBuffer;
import js.html.DataView;
import js.html.Uint32Array;
import js.Browser;
import brian151.earthquake.containers.AssociationStructure;

/*
 Copyright {2017} {Brian151 (https://github.com/Brian151)}

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/**
 * ...
 * @author Brian151
 */
@:expose
#if (compileLvl=="libShockwave")
@:keep
#end
class Container extends File
{
	private var isProjector:Bool;
	private var ptrBuffer:ArrayBuffer;
	private var ptrs1:Uint32Array;
	private var ptrs2:Uint32Array;
	private var state:Int;
	private var sectionList:Array<AssociationStructure>;
	private var isCast:Bool;
	private var sectionListNotFree:Array<Int>;
	private var aTabOffset:Int;
	public function new(src:ArrayBuffer):Void {
		super(src);
		isProjector = false;
		isCast = false;
		state = 0;
		sectionList = new Array();
		sectionListNotFree = new Array();
	}
	// to-do: find all differnces between cast and movie file
	public function checkCast():Bool{
		var out:Bool = true;
		if (state >= 1) {
			for (i in 0...ptrs1.length) {
				var id = getFourCCAt(ptrs1[i]);
				if (id == "MCsL") {
					out = false;
					break;
				}
			}
		} else {
			Browser.window.console.log("cannot check as external cast, mmap not parsed");
		}
		Browser.window.console.log("is external cast : " + out);
		return out;
	}
	public function setProjector():Void{
		isProjector = true;
	}
	public function findMap():Int {
		var mapIndexChunk:Section = getSectionAt(0xc);
		var mapIndexHandler:DataView = mapIndexChunk.get_view();
		return mapIndexHandler.getUint32(4,true);
	}
	public function parseMap(offset:Int):Void{
		var mapChunk:Section = getSectionAt(offset);
		var id = mapChunk.get_ID();
		Browser.window.console.log("assumed memory map ID: " + id);
		Browser.window.console.log("selected format: " + formats[currentFormat]);
		if (id == "mmap") {
			var handler:DataView = mapChunk.get_view();
			var count:Int = handler.getUint32(4, true);
			var usedCount:Int = handler.getUint32(8, true);
			// ptrBuffer = new ArrayBuffer((usedCount * 4) + (count * 4));
			// ptrs1 = new Uint32Array(ptrBuffer, 0, usedCount);
			// ptrs2 = new Uint32Array(ptrBuffer, usedCount, count);
			for (i in 0...count) {
				var offset2:Int = (i * 0x14) + 0x18; // offset of entry
				var id:String = mapChunk.getString("FOURCC",4,offset2);
				if (formatByteOrder[currentFormat][0] == "L") {
					var tempID:String = "";
					for (i2 in 0...4) {
						var char:String = id.charAt(3 - i2);
						tempID += char;
					}
					id = tempID;
				}
				var offset3:Int = handler.getUint32(offset2 + 8, true); // offset of pointed chunk
				// Browser.window.console.log([toHex(offset2,"U32"),toHex(offset3,"U32"),id]);
				if (id == "RIFX" || id == "imap" || id == "mmap" || id == "KEY*") {
					var bufN = new ArrayBuffer(0xC);
					var viewN = new DataView(bufN);
					if (id != "RIFX") {
						var secStruct =  new AssociationStructure(new Section(bufN, 0, 4, id));
						secStruct.setType("root");
						sectionList.push(secStruct);
					}
					if (id == "KEY*")
						aTabOffset = offset3;
				} else if (id != "free" && id != "junk") {
					sectionListNotFree.push(i);
					var secStruct = new AssociationStructure(getSectionAt(offset3));
					var secType = "component";
					if (id == "CASt") {
						secType = "cast_member";
					} else if (id.substring(0, 2) == "VW" || id.substring(0, 2) == "DR") {
						secType = "view";
					} else if (id == "LctX" || id == "CAS*" || id == "Fmap" || id == "Cinf") {
						secType = "lib_linked";
					}
					sectionList.push(secStruct);
					secStruct.setType(secType);
				} else {
					var bufN = new ArrayBuffer(0xC);
					var viewN = new DataView(bufN);
					var secStruct = new AssociationStructure(new Section(bufN, 0, 4, id));
					sectionList.push(secStruct);
				}
			}
			state = 1;
			untyped __js__("$hx_exports.dbg = {}");
			untyped __js__("$hx_exports.dbg.secList = this.sectionList");
			untyped __js__("$hx_exports.dbg.secListNF = this.sectionListNotFree");
			
		}
	}
	public function parseSectionAssociationTable():/*Array<Section> Array<Dynamic>*/Void {
		//TODO: figure out how to handle stuff besides cast members
		//fix to use section array
		/*
		var aTabOffset:Int = 0;
		var foundATab:Bool = false;
		var out:Dynamic = [];
		for (i in 0...ptrs1.length) {
			var curr = getFourCCAt(ptrs1[i]);
			if (curr == "KEY*") {
				foundATab = true;
				aTabOffset = ptrs1[i];
				break;
			}
		}
		if (foundATab) {
			Browser.window.console.log("KEY* found at : " + toHex(aTabOffset, "U32"));
			var aTab:Section = getSectionAt(aTabOffset);
			var aTabHandler:LinkedSectionHandler = new LinkedSectionHandler(aTab, this);
			var sectionCount:Int = aTabHandler.getUIntAt(4, 2);
			var count2:Int = aTabHandler.getUIntAt(8, 2);
			for (i in 0...sectionCount) {
				var baseOffset:Int = (i * 0xc) + 0xc;
				var flag:Bool = (aTabHandler.getUShortAt(baseOffset + 4, true) == 1024);
				var sectionID:Int = aTabHandler.getUIntAt(baseOffset, 2);
				if (!flag) {
					var parentOffset:Int = ptrs1[aTabHandler.getUIntAt(baseOffset + 4, 2)];
					var foundParent:Bool = false;
					var pointer:Int = 0;
					for (i2 in 0...out.length) {
						if (out[i2].parent == parentOffset) {
							pointer = i2;
							foundParent = true;
							break;
						}
					}
					if (!foundParent) {
						pointer = out.length;
						out.push({
							parent : parentOffset,
							children : []
						});
					}
					out[pointer].children.push(ptrs2[sectionID]);
				} else {
					var libID:Int = aTabHandler.getUShortAt(baseOffset + 6, true);
					var foundLib:Bool = false;
					var pointer:Int = 0;
					for (i2 in 0...out.length) {
						if (out[i2].libID == libID) {
							pointer = i2;
							foundLib = true;
							break;
						}
					}
					if (!foundLib) {
						pointer = out.length;
						out.push({
							libID : libID,
							children : []
						});
					}
					out[pointer].children.push(ptrs2[sectionID]);
				}
			}
		} else {
			Browser.window.console.log("error ! cannot find KEY*");
		}
		untyped __js__("$hx_scope.shockwaveKeys = out");
		return out;
		*/
		var aTab:Section = getSectionAt(aTabOffset);
		
	}
}