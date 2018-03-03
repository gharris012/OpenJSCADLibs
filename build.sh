#!/bin/bash

# find library directory
libdir="OpenJSCADLibs"
libdirprefix=""
libdircachefile=".libdircache"

# try dirname of the build script first
if [ -f "$libdircachefile" ]; then
    libdirprefix=$(<"$libdircachefile")
else
    # try build script location first
    tmpdir="$(dirname $(dirname "$0"))/"
    if [ -d "${tmpdir}${libdir}" ]; then
        libdirprefix=$tmpdir
    else
        while [ ! -d "${libdirprefix}${libdir}" ]; do
            libdirprefix="../${libdirprefix}"
        done
    fi
fi

if [ -d "${libdirprefix}${libdir}" ]; then
    echo "Found library in ${libdirprefix}${libdir}"
    echo "$libdirprefix" > "$libdircachefile"
else
    echo "could not find libdir"
    exit
fi

find ./ -links +1 -type f | grep -q "$(basename $0)" || ( ln "$0" && ln "${0%.sh}.cmd" && echo "linking build scripts" )

if [ ! -d '.vscode' ]; then
    echo "linking vscode config"
    mkdir ".vscode"
fi
find "${libdirprefix}${libdir}/.vscode" -type f -exec sh -c '[ -f .vscode/$(basename $1) ] || ln {} .vscode' _ {} \;

grep -q ".vscode/" .gitignore &>/dev/null || echo ".vscode/" >> .gitignore

if [ ! -d 'src' ]; then
    echo "creating skeleton src"
    mkdir src
    cp "${libdirprefix}${libdir}/skel/"* "src/"
fi

# copy in any library files we need
for i in $(grep -h 'include' src/*.jscad | sed -rn 's/include\("([^"]*)"\);/\1/p'); do
    if [ -f "src/$i" ]; then
        # echo " .. exists"
        :
    elif [ -f "${libdirprefix}${libdir}/$i" ]; then
        echo " linking $i"
        ln "${libdirprefix}${libdir}/$i" "src"
    else
        echo " could not find $i in ${libdirprefix}${libdir}"
    fi
done

grep -q "gcode/" .gitignore &>/dev/null || echo "gcode/" >> .gitignore
grep -q "$libdircachefile" .gitignore &>/dev/null || echo "$libdircachefile" >> .gitignore

# add links to .gitignore
find * -links +1 -type f -print0 | xargs -0 -L 1 -I {} sh -c 'grep -q {} .gitignore && echo -n "" || echo {}' >> .gitignore

# make gcode directory
if [ ! -d 'gcode' ]; then
    echo "creating gcode directory"
    mkdir gcode
fi

project="$(basename $0)"
project=$(dirname "$PWD/$project")
project=$(basename "$project")

ext=""
if [ -n "$1" ]; then
    ext="-$1"
fi

if [ -f "$HOME/Downloads/output.stl" ]; then
    echo "getting stl file as $project$ext"
    mv "$HOME/Downloads/output.stl" "gcode/$project$ext.stl"
fi

if [ -f "gcode/output.stl" ]; then
    echo "renaming stl file to $project$ext"
    mv "gcode/output.stl" "gcode/$project$ext.stl"
fi
