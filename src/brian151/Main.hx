package brian151;
import brian151.earthquake.Movie;
import js.Lib;
import js.html.XMLHttpRequest;
import js.Browser;

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

class Main 
{
	static var mov:Movie;
	static var xhr:XMLHttpRequest;
	static var test:Bool;
	static function main() {
		test = false;
		xhr = new XMLHttpRequest();
		untyped __js__("brian151_Main.xhr.responseType = \"arraybuffer\"");
		xhr.open("GET", "redbluesquare.dir", true); // spybot_8007_sw
		xhr.send();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					mov = new Movie(xhr.response);
				}
			}
		}
	}
	
}