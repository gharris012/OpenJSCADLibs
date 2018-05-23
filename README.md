# OpenJSCADLibs
A set of libraries used for building OpenJSCAD models

Also included, for free, a 'build script' that will initialize an empty directory, link in required libraries, and copy rendered models.

## Example Usage
```
$ mkdir NewModel
$ cd NewModel/
$ ../OpenJSCADLibs/build.sh
Found library in ../OpenJSCADLibs
linking build scripts
linking vscode config
creating skeleton src
 linking common.jscad
creating gcode directory
```
> edit main.jscad, include a new library, add some objects
```
$ ./build.sh
Found library in ../OpenJSCADLibs
 linking screws.jscad
```
> go to https://openjscad.org/  
> drop the src directory onto the `Add Supported Files` box  
> `Generate STL`  
> `Download STL`
```
$ ./build.sh
Found library in ../OpenJSCADLibs
getting stl file as NewModel
```
> `NewModel.stl` will be in the gcode directory  
> make some more edits, generate and download a new STL
```
$ ./build.sh v2
Found library in ../OpenJSCADLibs
getting stl file as NewModel-v2
```
> `NewModel-v2.stl` will be in the gcode directory
