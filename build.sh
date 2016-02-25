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

find ./ -links +1 -type f | grep -q "$(basename $0)" || ( ln "$0" && echo "Linking build script" )

echo -n "checking for src directory"
if [ ! -d 'src' ]; then
    echo " .. creating"
    mkdir src
    cp "${libdirprefix}${libdir}/template_main.jscad" "src/main.jscad"
else
    echo " .. exists"
fi
# copy in any library files we need
for i in $(grep -h 'include' src/*.jscad | sed -rn 's/include\("([^"]*)"\);/\1/p'); do
    echo -n "checking for $i"
    if [ -f "src/$i" ]; then
        echo " .. exists"
    elif [ -f "${libdirprefix}${libdir}/$i" ]; then
        echo " .. linking"
        ln "${libdirprefix}${libdir}/$i" "src"
    else
        echo " could not find $i in ${libdirprefix}${libdir}"
    fi
done

grep -q "gcode/" .gitignore &>/dev/null || echo "gcode/" >> .gitignore
grep -q "$libdircachefile" .gitignore &>/dev/null || echo "$libdircachefile" >> .gitignore

# add links to .gitignore
find * -links +1 -type f -print0 | xargs -0 -L 1 -I {} sh -c 'grep -q {} .gitignore && echo -n "" || echo {}' >> .gitignore

echo -n "checking for gcode directory"
# make gcode directory
if [ ! -d 'gcode' ]; then
    echo " .. creating"
    mkdir gcode
else
    echo " .. exists"
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
