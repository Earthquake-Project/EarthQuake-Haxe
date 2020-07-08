package externs;
import js.html.*;

@:native("DataStream") extern class Datastream 
{
	public var endianness : Bool;
	public var position : Int;

	public function new(src:ArrayBuffer, offset:Int, endian:Bool);
	
	public function readUint8(endian:Bool):Int;
	public function readUint16(endian:Bool):Int;
	public function readUint32(endian:Bool):Int;
	public function readInt8(endian:Bool):Int;
	public function readInt16(endian:Bool):Int;
	public function readInt32(endian:Bool):Int;
	
	public function readUint8Array(length:Int, endian:Bool):Uint8Array;
	public function readUint16Array(length:Int, endian:Bool):Uint16Array;
	public function readUint32Array(length:Int, endian:Bool):Uint16Array;
	public function readInt8Array(length:Int, endian:Bool):Int8Array;
	public function readInt16Array(length:Int, endian:Bool):Int16Array;
	public function readInt32Array(length:Int, endian:Bool):Int32Array;
	
	public function readFloat32(endian:Bool):Float;
	public function readFloat64(endian:Bool):Float;
	public function readFloat32Array(endian:Bool):Float32Array;
	public function readFloat64Array(endian:Bool):Float64Array;
	
	// write methods later
}