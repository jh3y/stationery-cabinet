PEN_PATH=src/$1

mkdir -pv $PEN_PATH

echo "h1 Hello world" > $PEN_PATH/markup.jade
echo "(function(){ console.info('Hello World!'); })();" > $PEN_PATH/script.js
echo "/* Hello styles */" > $PEN_PATH/style.styl
