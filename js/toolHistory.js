const QUICK_TOOLS_KEY = "buildskil_quick_tools";
const MAX_QUICK_TOOLS = 10;


/*
|--------------------------------------------------------------------------
| Add / update a tool
|--------------------------------------------------------------------------
*/

function trackTool(tool) {

    if (!tool || !tool.id || !tool.name || !tool.url) {
        return;
    }

    let tools = [];

    try {
        tools = JSON.parse(
            localStorage.getItem(QUICK_TOOLS_KEY) || "[]"
        );
    } catch (err) {
        tools = [];
    }


    /*
    Remove existing copy of this tool.
    This makes the newest used tool move to the front.
    */

    tools = tools.filter(
        item => item.id !== tool.id
    );


    /*
    Add latest tool at beginning.
    */

    tools.unshift({

        id: tool.id,

        name: tool.name,

        url: tool.url,

        icon: tool.icon || "fa-solid fa-toolbox",

        usedAt: Date.now()

    });


    /*
    Keep only latest 10.
    */

    tools = tools.slice(
        0,
        MAX_QUICK_TOOLS
    );


    localStorage.setItem(
        QUICK_TOOLS_KEY,
        JSON.stringify(tools)
    );
}


/*
|--------------------------------------------------------------------------
| Get tools
|--------------------------------------------------------------------------
*/

function getQuickTools() {

    try {

        return JSON.parse(
            localStorage.getItem(
                QUICK_TOOLS_KEY
            ) || "[]"
        );

    } catch (err) {

        return [];

    }
}


/*
|--------------------------------------------------------------------------
| Remove one tool
|--------------------------------------------------------------------------
*/

function removeQuickTool(toolId) {

    const tools =
        getQuickTools().filter(
            tool => tool.id !== toolId
        );

    localStorage.setItem(
        QUICK_TOOLS_KEY,
        JSON.stringify(tools)
    );
}


/*
|--------------------------------------------------------------------------
| Clear all
|--------------------------------------------------------------------------
*/

function clearQuickTools() {

    localStorage.removeItem(
        QUICK_TOOLS_KEY
    );

}