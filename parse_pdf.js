const fs = require('fs');

async function main() {
    try {
        let pdf = require('pdf-parse');
        if (typeof pdf !== 'function' && typeof pdf.default === 'function') {
            pdf = pdf.default; // Handle ES6 default syntax
        }
        console.log("PDF function type: ", typeof pdf);

        let dataBuffer = fs.readFileSync('C:/Users/01-135231-001/Downloads/Resume_Abdullah.pdf');

        const data = await pdf(dataBuffer);
        fs.writeFileSync('resume.txt', data.text);
        console.log("PDF Parsing Complete");
    } catch (e) {
        console.error(e.message || e);
    }
}
main();
