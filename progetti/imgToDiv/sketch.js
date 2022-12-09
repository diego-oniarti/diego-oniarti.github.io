let run=false, immagine, regioni;

function generaImmagine(form) {
    if (form.immagine.value == '') return false;

    larghezza = (form.larghezza.value != '') ? form.larghezza.value : null;
    altezza = (form.altezza.value != '') ? form.altezza.value : null;
    limite = (form.threshold.value != '') ? form.threshold.value : null;
    
    immagine = loadImage(form.immagine.value, ()=>{
        main(immagine, larghezza, altezza, limite)
    });

    return false;
}


function setup() {
    createCanvas(1, 1).parent('canvas');
}

function main(immagine,larghezza,altezza,limite) {
    imageWidth = larghezza || immagine.width;
    imageHeight = altezza || immagine.height;
    limite = limite || 50;
    salva = true;

    resizeCanvas(imageWidth, imageHeight * 2);
    immagine.resize(imageWidth, imageHeight);
    immagine.loadPixels();

    regioni = [];
    visitati = new Set();

    let indice = 0;
    while (indice < imageWidth * imageHeight) {
        if (!visitati.has(indice)) {
            let stack = [indice];
            nuovaRegione = {
                r: 0,
                g: 0,
                b: 0,
                coordinate: new Set()
            }
            while (stack.length > 0) {
                let corrente = stack.pop();
                visitati.add(corrente)
                nuovaRegione.coordinate.add(corrente)
                nuovaRegione.r += immagine.pixels[corrente * 4 + 0]
                nuovaRegione.g += immagine.pixels[corrente * 4 + 1]
                nuovaRegione.b += immagine.pixels[corrente * 4 + 2]
                for (let i = 0; i < 4; i++) {
                    let x = corrente % imageWidth + (i == 0 ? 1 : (i == 1 ? -1 : 0));
                    let y = Math.floor(corrente / imageWidth) + (i == 2 ? 1 : (i == 3 ? -1 : 0))
                    if (!stack.includes(x + y * imageWidth) && !visitati.has(x + y * imageWidth) && x >= 0 && x < imageWidth && y >= 0 && y < imageHeight && abs(immagine.pixels[indice * 4] - immagine.pixels[(x + y * imageWidth) * 4]) + abs(immagine.pixels[indice * 4 + 1] - immagine.pixels[(x + y * imageWidth) * 4 + 1]) + abs(immagine.pixels[indice * 4 + 2] - immagine.pixels[(x + y * imageWidth) * 4 + 2]) < limite) {
                        stack.push(x + y * imageWidth)
                    }
                }
            }
            nuovaRegione.r /= nuovaRegione.coordinate.size;
            nuovaRegione.g /= nuovaRegione.coordinate.size;
            nuovaRegione.b /= nuovaRegione.coordinate.size;
            nuovaRegione.colore = color(nuovaRegione.r, nuovaRegione.g, nuovaRegione.b)
            regioni.push(nuovaRegione)
        }

        indice++;
    }
    run=true;
    if (salva) {
        saveCSS();
    }
}

function draw() {
    if (!run) return;

    background(0);
    image(immagine, 0, 0)
    loadPixels();
    for (let regione of regioni) {
        for (let coordinata of regione.coordinate) {
            set(coordinata % imageWidth, Math.floor(coordinata / imageWidth) + imageHeight, regione.colore)
        }
    }
    updatePixels();
    noLoop();
}

function saveCSS() {
    let linee = [`<div style="position:relative;width:${imageWidth}px; height:${imageHeight}px; background-color:black;">`];

    for (let regione of regioni) {
        let segmenti = [];
        for (let coordinata of regione.coordinate) {
            let x = coordinata % imageWidth;
            let y = Math.floor(coordinata / imageWidth);
            if (x == 0 || !regione.coordinate.has(x - 1 + y * imageWidth))
                segmenti.push({ x1: x, y1: y, x2: x, y2: y + 1 })
            if (y == 0 || !regione.coordinate.has(x + (y - 1) * imageWidth))
                segmenti.push({ x1: x, y1: y, x2: x + 1, y2: y })
            if (x == imageWidth - 1 || !regione.coordinate.has(x + 1 + y * imageWidth))
                segmenti.push({ x1: x + 1, y1: y, x2: x + 1, y2: y + 1 })
            if (y == imageHeight - 1 || !regione.coordinate.has(x + (y + 1) * imageWidth))
                segmenti.push({ x1: x, y1: y + 1, x2: x + 1, y2: y + 1 })
        }

        while (segmenti.length > 0) {
            let testo = `<div style="width:100%;height:100%;position:absolute;top:0;left:0; background-color:${cth(regione.colore)}; clip-path:polygon(`
            let first = segmenti.pop();
            // testo+=`${(first.x1/imageWidth*100).toFixed(2)}% ${(first.y1/imageHeight*100).toFixed(2)}%,`;
            testo += `${(first.x2 / imageWidth * 100).toFixed(2)}% ${(first.y2 / imageHeight * 100).toFixed(2)}%,`;
            let last = { x: first.x2, y: first.y2 };

            while (segmenti.length > 0) {
                let tmp = segmenti.filter(s => { return (s.x1 == last.x && s.y1 == last.y) || (s.x2 == last.x && s.y2 == last.y) })[0];
                if (!tmp) break;
                segmenti.splice(segmenti.indexOf(tmp), 1)
                last = { x: tmp.x1 != last.x ? tmp.x1 : tmp.x2, y: tmp.y1 != last.y ? tmp.y1 : tmp.y2 }
                testo += `${(last.x / imageWidth * 100).toFixed(2)}% ${(last.y / imageHeight * 100).toFixed(2)}%,`;
            }
            testo = testo.slice(0, -1);
            testo += ')"></div>';
            linee.push(testo)
        }
    }

    linee.push('</div>');

    let button = document.getElementById('download')
    button.addEventListener('click', ()=>{
        saveStrings(linee, "div.txt");
    });
}

function cth(c) {
    return `#${Math.floor(red(c)).toString(16).padStart(2, '0')}${Math.floor(green(c)).toString(16).padStart(2, '0')}${Math.floor(blue(c)).toString(16).padStart(2, '0')}`
}
