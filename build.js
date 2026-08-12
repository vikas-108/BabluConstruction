const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");

/*
|--------------------------------------------------------------------------
| Utility
|--------------------------------------------------------------------------
*/

function ensureDir(dir) {
    fs.mkdirSync(dir, {
        recursive: true
    });
}

function getFiles(dir, extension) {
    if (!fs.existsSync(dir)) {
        return [];
    }

    return fs
        .readdirSync(dir)
        .filter(file => file.endsWith(extension));
}


/*
|--------------------------------------------------------------------------
| JavaScript configuration
|--------------------------------------------------------------------------
*/

const jsRootFiles = [
    "web.js",
    "login.js"
];

const jsFolders = [
    "js"
];

const dataFolders = [
    "data"
];


/*
|--------------------------------------------------------------------------
| CSS configuration
|--------------------------------------------------------------------------
*/

const cssFolders = [
    "css"
];


/*
|--------------------------------------------------------------------------
| Build single JavaScript file
|--------------------------------------------------------------------------
*/

async function buildJS(input, output) {

    ensureDir(path.dirname(output));

    await esbuild.build({
        entryPoints: [input],

        bundle: false,

        minify: true,

        sourcemap: false,

        outfile: output
    });

    console.log(
        `✅ JS: ${path.relative(ROOT, input)} → ${path.relative(ROOT, output)}`
    );
}

async function buildData(input, output) {
    ensureDir(path.dirname(output));

    await esbuild.build({
        entryPoints: [input],

        // IMPORTANT:
        // Do NOT bundle data files.
        // They need to remain global variables.
        bundle: false,

        minify: true,

        sourcemap: false,

        outfile: output
    });

    console.log(
        `✅ DATA: ${path.relative(ROOT, input)} → ${path.relative(ROOT, output)}`
    );
}
/*
|--------------------------------------------------------------------------
| Build single CSS file
|--------------------------------------------------------------------------
*/

async function buildCSS(input, output) {

    ensureDir(path.dirname(output));

    await esbuild.build({
        entryPoints: [input],

        minify: true,

        sourcemap: false,

        outfile: output
    });

    console.log(
        `✅ CSS: ${path.relative(ROOT, input)} → ${path.relative(ROOT, output)}`
    );
}


/*
|--------------------------------------------------------------------------
| Build root JS files
|--------------------------------------------------------------------------
*/

async function buildRootJS() {

    for (const file of jsRootFiles) {

        const input = path.join(ROOT, file);

        if (!fs.existsSync(input)) {

            console.log(
                `⚠️ JS file not found: ${file}`
            );

            continue;
        }

        const output = path.join(
            DIST,
            file.replace(
                /\.js$/,
                ".min.js"
            )
        );

        await buildJS(
            input,
            output
        );
    }
}


/*
|--------------------------------------------------------------------------
| Build JS folders
|--------------------------------------------------------------------------
*/

async function buildJSFolders() {

    for (const folder of jsFolders) {

        const inputDir = path.join(
            ROOT,
            folder
        );

        if (!fs.existsSync(inputDir)) {

            console.log(
                `⚠️ Folder not found: ${folder}`
            );

            continue;
        }

        const outputDir = path.join(
            DIST,
            folder
        );

        ensureDir(outputDir);

        const files = getFiles(
            inputDir,
            ".js"
        );

        for (const file of files) {

            const input = path.join(
                inputDir,
                file
            );

            const output = path.join(
                outputDir,
                file.replace(
                    /\.js$/,
                    ".min.js"
                )
            );

            await buildJS(
                input,
                output
            );
        }
    }
}
// it craete data js folder
async function buildDataFolders() {

    for (const folder of dataFolders) {

        const inputDir = path.join(ROOT, folder);

        if (!fs.existsSync(inputDir)) {
            console.log(`⚠️ Data folder not found: ${folder}`);
            continue;
        }

        const outputDir = path.join(DIST, folder);

        ensureDir(outputDir);

        const files = getFiles(inputDir, ".js");

        for (const file of files) {

            const input = path.join(
                inputDir,
                file
            );

            const output = path.join(
                outputDir,
                file.replace(/\.js$/, ".min.js")
            );

            await buildData(input, output);
        }
    }
}
/*
|--------------------------------------------------------------------------
| Build CSS folders
|--------------------------------------------------------------------------
*/

async function buildCSSFolders() {

    for (const folder of cssFolders) {

        const inputDir = path.join(
            ROOT,
            folder
        );

        if (!fs.existsSync(inputDir)) {

            console.log(
                `⚠️ CSS folder not found: ${folder}`
            );

            continue;
        }

        const outputDir = path.join(
            DIST,
            folder
        );

        ensureDir(outputDir);

        const files = getFiles(
            inputDir,
            ".css"
        );

        for (const file of files) {

            const input = path.join(
                inputDir,
                file
            );

            const output = path.join(
                outputDir,
                file.replace(
                    /\.css$/,
                    ".min.css"
                )
            );

            await buildCSS(
                input,
                output
            );
        }
    }
}


/*
|--------------------------------------------------------------------------
| Build everything
|--------------------------------------------------------------------------
*/

async function buildAll() {

    console.log("");
    console.log("================================");
    console.log("🚀 BUILDING FRONTEND");
    console.log("================================");
    console.log("");

    ensureDir(DIST);

    await buildRootJS();

     await buildJSFolders();

     await buildDataFolders();

     await buildCSSFolders();

    console.log("");
    console.log("================================");
    console.log("🎉 BUILD COMPLETE");
    console.log("================================");
    console.log("");
}


/*
|--------------------------------------------------------------------------
| Watch mode
|--------------------------------------------------------------------------
*/

async function watchFile(
    input,
    output,
    type
) {

    ensureDir(path.dirname(output));

    const ctx = await esbuild.context({

        entryPoints: [input],

        bundle: type === "js",

        minify: true,

        sourcemap: false,

        outfile: output
    });

    await ctx.watch();

    console.log(
        `👀 Watching: ${path.relative(ROOT, input)}`
    );
}


/*
|--------------------------------------------------------------------------
| Start watch mode
|--------------------------------------------------------------------------
*/

async function watchAll() {

    console.log("");
    console.log("================================");
    console.log("👀 WATCH MODE");
    console.log("================================");
    console.log("");

    ensureDir(DIST);


    // Root JS

    for (const file of jsRootFiles) {

        const input = path.join(
            ROOT,
            file
        );

        if (!fs.existsSync(input)) {
            continue;
        }

        const output = path.join(
            DIST,
            file.replace(
                /\.js$/,
                ".min.js"
            )
        );

        await watchFile(
            input,
            output,
            "js"
        );
    }


    // JS folders

    for (const folder of jsFolders) {

        const inputDir = path.join(
            ROOT,
            folder
        );

        if (!fs.existsSync(inputDir)) {
            continue;
        }

        const outputDir = path.join(
            DIST,
            folder
        );

        ensureDir(outputDir);

        const files = getFiles(
            inputDir,
            ".js"
        );

        for (const file of files) {

            const input = path.join(
                inputDir,
                file
            );

            const output = path.join(
                outputDir,
                file.replace(
                    /\.js$/,
                    ".min.js"
                )
            );

            await watchFile(
                input,
                output,
                "js"
            );
        }
    }
    //data
    for (const folder of dataFolders) {

         const inputDir = path.join(ROOT, folder);

        if (!fs.existsSync(inputDir)) {
          continue;
        }

        const outputDir = path.join(DIST, folder);

        ensureDir(outputDir);

         const files = getFiles(inputDir, ".js");

        for (const file of files) {

            const input = path.join(
               inputDir,
               file
             );

              const output = path.join(
                 outputDir,
                 file.replace(/\.js$/, ".min.js")
                );

             await watchFile(
              input,
               output,
               "data"
            );
       }
    }

    // CSS

    for (const folder of cssFolders) {

        const inputDir = path.join(
            ROOT,
            folder
        );

        if (!fs.existsSync(inputDir)) {
            continue;
        }

        const outputDir = path.join(
            DIST,
            folder
        );

        ensureDir(outputDir);

        const files = getFiles(
            inputDir,
            ".css"
        );

        for (const file of files) {

            const input = path.join(
                inputDir,
                file
            );

            const output = path.join(
                outputDir,
                file.replace(
                    /\.css$/,
                    ".min.css"
                )
            );

            await watchFile(
                input,
                output,
                "css"
            );
        }
    }

    console.log("");
    console.log("🔥 Watching JS + DATA + CSS");
    console.log("🔥 Save a file → automatically rebuilt");
    console.log("");
}


/*
|--------------------------------------------------------------------------
| Command
|--------------------------------------------------------------------------
*/

const command = process.argv[2];

if (command === "watch") {

    watchAll().catch(error => {

        console.error(
            "❌ Watch failed:",
            error
        );

        process.exit(1);
    });

} else {

    buildAll().catch(error => {

        console.error(
            "❌ Build failed:",
            error
        );

        process.exit(1);
    });
}