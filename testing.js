const excute = '02-18-1999 21:00:00';
const now = Date.now();
const delay = new Date(excute).getTime()- now;

console.log(new Date(excute).getTime());
console.log(now);
console.log(delay);

const hours = Math.floor(delay / (1000 * 60 * 60));
const days = Math.floor(delay / (1000 * 60 * 60 * 24));
const years = Math.floor(delay / (1000 * 60 * 60 * 24 * 365));

console.log('hours', hours);
console.log('days', days);