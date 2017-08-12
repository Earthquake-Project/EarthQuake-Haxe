package brian151.riff;
import js.Error.RangeError;
import js.html.ArrayBuffer;
import js.html.DataView;

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


//to-do: recover lost progress

/**
 * ...
 * @author Brian151
 */
@:expose
#if (compileLvl=="libRIFF")
@:keep
#end
class Section 
{
	private var secID:String;
	private var view:DataView;
	private var length:Int;
	private var realLength:Int;
	public function new(src:ArrayBuffer,offset,len:Int,id:String):Void {
		var buf = new ArrayBuffer(len);
		var tempview:DataView = new DataView(src, offset + 8, len);
		view = new DataView(buf);
		for (i in 0...len) {
			var tempByte:Int = tempview.getUint8(i);
			view.setUint8(i, tempByte);
		}
		length = len;
		realLength = length + 8;
		secID = id;
	}
	public function get_length():Int{
		return length;
	}
	public function get_realLength():Int{
		return realLength;
	}
	public function get_view():DataView{
		return view;
	}
	public function get_ID():String{
		return secID;
	}
	public function getString(type, len, offset):String {
		var out = "";
		if (type == "ASCII") {
			for (i in 0...len) {
				var offset2 = offset + i;
				if (offset2 < length) {
					var charByte = view.getUint8(offset2);
					out += String.fromCharCode(charByte);
				} else {
					throw new RangeError("specified string exceeds length of section!");
				}
			}
		} else if (type == "FOURCC") {
			out += getString("ASCII",4,offset);
		}
		return out;
	}
}