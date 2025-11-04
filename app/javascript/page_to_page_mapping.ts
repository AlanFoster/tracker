const pageIdentifierToPageComponent = {}
const pages = import.meta.glob('../views/**/*.{tsx,jsx}', {eager: true})

for (const key in pages) {
    if (pages.hasOwnProperty(key)) {
        const identifier = key.replace("../views/", "").split('.')[0];
        if (!pages[key].default) {
            throw new Error(`View ${identifier} did not export default component`)
        }
        pageIdentifierToPageComponent[identifier] = pages[key].default;
    }
}

console.log(JSON.stringify(Object.keys(pageIdentifierToPageComponent), null, 4));

export { pageIdentifierToPageComponent }
