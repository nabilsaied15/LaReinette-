import fs from 'fs';
const content = fs.readFileSync('./Navbar.jsx', 'utf8');

const divOpen = (content.match(/<div/g) || []).length;
const divClose = (content.match(/<\/div>/g) || []).length;
const navOpen = (content.match(/<nav/g) || []).length;
const navClose = (content.match(/<\/nav>/g) || []).length;

console.log(`div: ${divOpen} / ${divClose}`);
console.log(`nav: ${navOpen} / ${navClose}`);
