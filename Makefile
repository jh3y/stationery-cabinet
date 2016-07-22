MODULES = ./node_modules/.bin
STYLUS = $(MODULES)/stylus
BABEL = $(MODULES)/babel
POSTCSS = $(MODULES)/postcss
PUG = $(MODULES)/pug
BS = $(MODULES)/browser-sync

OUTPUT_DIR = public
DEPLOY_DIR = tmp
SRC_BASE = src

SCRIPT_FILE = script.js
STYLE_FILE = style.styl
MARKUP_FILE = index.pug
MARKUP_DEV_FILE = dev.pug
DEPLOY_OPTS_FILE = DEPLOY_OPTIONS.js

BOILERPLATE_MARKUP = boilerplate/markup.boilerplate.pug
BOILERPLATE_DEV_MARKUP = boilerplate/develop.boilerplate.pug
BOILERPLATE_SCRIPT = boilerplate/script.boilerplate.js
BOILERPLATE_STYLE = boilerplate/style.boilerplate.styl

SCRIPT_DEST = $(OUTPUT_DIR)/script.js

POSTCSS_OPTS = --use autoprefixer -d $(OUTPUT_DIR)/ $(OUTPUT_DIR)/*.css


SCRIPT_SRC = $(SRC_BASE)/$(PEN)/$(SCRIPT_FILE)
MARKUP_SRC = $(SRC_BASE)/$(PEN)/$(MARKUP_FILE)
MARKUP_COMPILE_SRC = $(SRC_BASE)/$(PEN)/
MARKUP_DEV_SRC = $(SRC_BASE)/$(PEN)/$(MARKUP_DEV_FILE)
STYLE_SRC  = $(SRC_BASE)/$(PEN)/$(STYLE_FILE)

help:
	@grep -E '^[a-zA-Z\._-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# target that checks for pen to be set
checkForPen:
ifndef PEN
	$(error PEN not set!!!)
endif

# Compile javascript using babel and copy to respective pen folder in public.
compile-script: checkForPen ## compiles scripts
	mkdir -pv $(OUTPUT_DIR)
	$(BABEL) $(SCRIPT_SRC) -o $(SCRIPT_DEST)

watch-script: checkForPen compile-script ## watch for script changes and compile
	$(BABEL) $(SCRIPT_SRC) --watch -o $(SCRIPT_DEST)


compile-style: checkForPen ## compiles styles
	$(STYLUS) $(STYLE_SRC) -o $(OUTPUT_DIR) && $(POSTCSS) $(POSTCSS_OPTS)

watch-style: checkForPen compile-style ## watches and compiles styles
	$(STYLUS) -w $(STYLE_SRC) -o $(OUTPUT_DIR)

compile-markup: checkForPen ## compiles markup
	$(PUG) -P $(MARKUP_COMPILE_SRC) -o $(OUTPUT_DIR)

watch-markup: checkForPen compile-markup ## watch and compile markup
	$(PUG) -wP $(MARKUP_COMPILE_SRC) -o $(OUTPUT_DIR)

setup: ## set up project for development
	npm install

watch: checkForPen ## run development watch
	make watch-script & make watch-style & make watch-markup

build: checkForPen ## build sources
	make compile-script && make compile-style && make compile-markup

serve: checkForPen build ## sets up browser-sync local static server with livereload
	$(BS) start --port 1987 --files $(OUTPUT_DIR)/ --server $(OUTPUT_DIR)

develop: checkForPen ## run development task for given PEN "make develop PEN=A"
	make serve & make watch

cleanup: ## tidy out any generated/deployed files
	rm -rf public tmp
	rm $(DEPLOY_OPTS_FILE)

deploy: checkForPen build ## generates POST page for pushing to Codepen
	echo "var SOURCE = {}; SOURCE.MARKUP = \``cat $(MARKUP_DEV_SRC)`\`; SOURCE.SCRIPT = \``cat $(SCRIPT_SRC)`\`; SOURCE.STYLE= \``cat $(STYLE_SRC)`\`; exports.SOURCE = SOURCE;" > $(DEPLOY_OPTS_FILE)
	$(PUG) -P deploy-template.pug -O $(DEPLOY_OPTS_FILE) -o tmp
	open tmp/deploy-template.html

create: checkForPen ## creates new source for pens by passing PEN variable
	mkdir -pv $(SRC_BASE)/$(PEN)
	cat $(BOILERPLATE_DEV_MARKUP) > $(MARKUP_SRC)
	cat $(BOILERPLATE_MARKUP) > $(MARKUP_DEV_SRC)
	cat $(BOILERPLATE_SCRIPT) > $(SCRIPT_SRC)
	cat $(BOILERPLATE_STYLE) > $(STYLE_SRC)
