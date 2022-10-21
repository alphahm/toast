const fs = require("fs")
const postcss = require("postcss")
const atImport = require("postcss-import")
const ts = require("typescript");
const tsConfig = require("./tsconfig.json");
const uglify = require('uglify-js');

/**
 * Create/re-create dist folder
 */
const dist = "dist"
fs.rmSync(dist, { recursive: true, force: true })
fs.mkdirSync(dist);

/**
 * CSS minification
 */
const cssnanoPlugin = require("cssnano")({
    preset: [
        "default",
        { discardComments: { removeAll: true } }
    ],
})

const css = fs.readFileSync("src/toast.css", "utf8")

postcss([cssnanoPlugin])
    .use(atImport())
    .process(css, {
        from: "src/main.css",
        map: false
    })
    .then((result) => {
        const { css } = result
        fs.writeFile(`${dist}/toast.css`, css, () => true)
    })


/**
 * Typescript transpiling and minification
 */
const { outputText } = ts.transpileModule(fs.readFileSync("src/toast.ts").toString(), {
    compilerOptions: tsConfig.compilerOptions,
});

const { code } = uglify.minify(outputText)

fs.writeFile(`${dist}/toast.js`, code, () => true)
