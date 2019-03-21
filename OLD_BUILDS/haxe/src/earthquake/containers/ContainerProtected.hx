package earthquake.containers;
import riff.File;
import js.html.ArrayBuffer;

/**
 * ...
 * @author Brian151
 */
@:expose
#if (compileLvl=="libShockwave")
@:keep
#end
class ContainerProtected extends File
{
	private var isProjector:Bool;
	public function new(src:ArrayBuffer):Void 
	{
		super(src);
		isProjector = false;
	}
	public function checkCast():Bool{
		return false;
	}
	public function setProjector():Void{
		isProjector = true;
	}
}