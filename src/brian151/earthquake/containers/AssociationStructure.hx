package brian151.earthquake.containers;
import brian151.riff.Section;

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

class AssociationStructure 
{
	private var type:String; // "cast_member" , "lib_linked" , "view" , "component", "garbage", "free", "junk" , "root"
	private var root:Section;
	private var components:Array<Int>; // use MMAP ID's here...
	public function new(parent:Section) {
		root = parent;
		components = new Array();
		setType("unknown");
	}
	public function setType(t:String):Void{
		if (t == "cast_member" || t == "lib_linked" || t == "view" || t == "free" || t == "junk" || t == "root") {
			type = t;
		} else {
			type = "component";
		}
	}
	public function markForDeletion():Void{
		type = "garbage"; // would be used when editing a file
		// if type is "garbage", some function looping the array backwards should delete this object
	}
}