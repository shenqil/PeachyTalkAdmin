const files = import.meta.globEager("./*.ts")
const modules: Array<any> = [];

for (const key in files) {
    if (Object.prototype.hasOwnProperty.call(files, key)) {
        modules.push(files[key].default)
    }
}

export default modules;