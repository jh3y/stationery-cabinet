MARKUP="cat src/$1/*.html"

echo $MARKUP

mkdir -pv deploy/

pug < deploy-template.pug > deploy/$1.html

open deploy/$1.html
