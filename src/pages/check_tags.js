import fs from 'fs';
const content = fs.readFileSync('./LaReinette.jsx', 'utf8');

const divOpen = (content.match(/<div/g) || []).length;
const divClose = (content.match(/<\/div>/g) || []).length;
const sectionOpen = (content.match(/<section/g) || []).length;
const sectionClose = (content.match(/<\/section>/g) || []).length;
const motionOpen = (content.match(/<motion\.[a-z0-9]+/g) || []).length;
const motionClose = (content.match(/<\/motion\.[a-z0-9]+>/g) || []).length;

console.log(`div: ${divOpen} / ${divClose}`);
console.log(`section: ${sectionOpen} / ${sectionClose}`);
console.log(`motion: ${motionOpen} / ${motionClose}`);

