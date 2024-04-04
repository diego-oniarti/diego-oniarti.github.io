const div = document.getElementById('final_sketch');
new p5(p=>{
    let FFT;

    p.setup = function() {
        const lato = div.clientWidth;
        const canvas = p.createCanvas(lato,lato);
        canvas.class('bordered');
        canvas.parent('final_sketch');
        resizeCollapsable();

        FFT = new p5.FFT();
    }

    p.draw = function() {
        const spec = FFT.analyze();
        for (let i=0; i<spec.length; i++) {
            p.line(i/spec.length*p.width, 0, i/spec.length*p.width, spec[i]/255*p.height+100);
        }
    }

    p.windowResized = function() {
        const lato = div.clientWidth;
        p.resizeCanvas(lato,lato);
        resizeCollapsable();
    }
});

