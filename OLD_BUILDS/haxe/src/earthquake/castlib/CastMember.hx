package brian151.earthquake.castlib;
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
class CastMember 
{
	static var types:Array<String> = [
		"Invalid" ,         // 0x00 | 0
		"Bitmap" ,          // 0x01 | 1
		"Film Loop" ,       // 0x02 | 2
		"Styled Text" ,     // 0x03 | 3
		"Palette" ,         // 0x04 | 4
		"Picture" ,         // 0x05 | 5
		"Sound" ,           // 0x06 | 6
		"Button" ,          // 0X07 | 7
		"Vector Shape" ,    // 0x08 | 8
		"Movie" ,           // 0x09 | 9
		"Digital Video" ,   // 0x0A | 10
		"Script" ,          // 0x0B | 11
		"Rich Text (RTF)" , // 0x0C | 12
		"OLE" ,             // 0x0D | 13
		"Transition" ,      // 0x0E | 14
		"Xtra" ,            // 0x0F | 15
	];
	private var name:String;
	private var typeID:Int;
	public function new(type:String,nameText:String) {
		typeID = resolveType(type);
		name = nameText;
	}
	private function resolveType(type:String):Int {
		var out = 15; // just default to xtra...
		for (i in 0...CastMember.types.length) {
			var curr = CastMember.types[i];
			if (curr == type) {
				out = i;
				break;
			}
		}
		return out;
	}
	public function getType():String {
		return CastMember.types[typeID];
	}
}