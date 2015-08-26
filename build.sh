# find library directory
libdir="OpenJSCADLibs"
libdirprefix=""
while [ ! -d "${libdirprefix}${libdir}" ]; do
    libdirprefix="../${libdirprefix}"
done
echo "Found library in ${libdirprefix}${libdir}"

find ./ -links +1 -type f | grep -q "$(basename $0)" || ( ln "$0" && echo "Linking build script" )

# copy in any library files we need
for i in $(grep -h 'include' *.jscad | sed -rn 's/include\("([^"]*)"\);/\1/p'); do
    echo -n "checking for $i"
    if [ -f "$i" ]; then
        echo " .. exists"
    elif [ -f "${libdirprefix}${libdir}/$i" ]; then
        echo " .. linking"
        ln "${libdirprefix}${libdir}/$i"
    fi
done

grep -q "gcode/" .gitignore &>/dev/null || echo "gcode/" >> .gitignore

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
