current active codebase may be found under src/haxe
the flashdevelop project file is EarthQuake.hxproj

up-to-date completed builds may or may not be included in commits
most of the documented functionality is not implemented fully
almost every line of code is for debugging purposes to verify anything is happening at all
the file format is time-consuming, tedious, and difficult to work with
i would much rather deliever a functioning, stable product than something that was just hacked-together 
  with the usual R.A.D practices/tools. that takes time, especially for a format that is ~30 something years old!

my irl also unfortunately sucks time/energy right out of me, and coding absolutely requires both!

src/earthquake was another attempt at a pure javascript implementation
like OLD_BUILDS, it exists for reference purposes only
the code is not officially supported at any capacity and issues pertaining to it will be ignored

src/3rdparty are a few very nice external javascript libraries to deal with very boring and repetitive lower-level stuff
  [incomplete] haxe bindings/externs should be under src/haxe/src/externs
  these are not strictly required, but the code at this moment in time shall be designed around them, and thus is dependent on them
  currently, DataStream.js is done to make dealing with arraybuffers/dataviews easier, and Zlib.js is used for compression/decompression

building:
requires flashdevelop 5.3.3.1 and haxe 3.4.4 at least

known compiler errors:
js.html.ArrayBuffer, js.html.Uint8Array, js.html.DataView, etc... are depreciated in favor of js.lib.ArrayBuffer, ...
  in newer versions of haxe/flashdevelop
  honestly, this makes perfect sense as they have pratically nothing to do with HTML itself

known bugs:
Xtra List chunks possibly not always parsed correctly
  specifically, errors reading the GUID were observed

