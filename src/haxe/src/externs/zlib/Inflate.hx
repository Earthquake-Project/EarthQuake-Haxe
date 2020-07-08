package externs.zlib;
import js.html.Uint8Array;

@:native("zlib.Inflate") extern class Inflate 
{
	
	
	public function new(src:Uint8Array) 
	public function decompress():Uint8Array;
}