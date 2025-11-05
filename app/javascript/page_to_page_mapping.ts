const pageIdentifierToPageComponent = {};
const pages = import.meta.glob('../views/**/*.{tsx,jsx}', { eager: true });

for (const [key, value] of Object.entries(pages)) {
  const identifier = key.replace('../views/', '').split('.')[0];
  if (!(value && value.default)) {
    throw new Error(`View ${identifier} did not export default component`);
  }
  pageIdentifierToPageComponent[identifier] = value.default;
}

// eslint-disable-next-line no-console
console.log(
  JSON.stringify(Object.keys(pageIdentifierToPageComponent), null, 4),
);

export { pageIdentifierToPageComponent };
