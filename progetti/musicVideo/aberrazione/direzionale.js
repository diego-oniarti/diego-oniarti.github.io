new p5(p=>{
    const div = document.getElementById("aberrazione_direzionale");

    let running = true;

    let ABERRAZIONE, aber_loaded, aber_promise = new Promise(r=>aber_loaded=r);
    let SFONDO, sfondo_loaded, sfondo_promise = new Promise(r=>sfondo_loaded=r);

    let buffer;

    p.preload = function() {
        ABERRAZIONE = p.loadShader("./shaders/ABERRAZIONE_DIR/shader.vert","./shaders/ABERRAZIONE_DIR/shader.frag", aber_loaded);
        SFONDO = p.loadImage("./images/paesaggio.jpg", sfondo_loaded);
    }

    p.setup = async function() {
        await Promise.all([aber_promise,sfondo_promise]);
        const lato = div.clientWidth;
        const canvas = p.createCanvas(lato,lato);
        buffer = p.createGraphics(lato,lato,p.WEBGL);
        canvas.parent("aberrazione_direzionale");
        canvas.class("bordered");
        resizeCollapsable(); 

    }

    p.draw = function() {
        if (!SFONDO || !buffer) return;

        buffer.shader(ABERRAZIONE);
        ABERRAZIONE.setUniform('sfondo', SFONDO);
        ABERRAZIONE.setUniform('intensita', p.sin(p.frameCount/50)*0.5+0.5);
        buffer.rect(0,0,p.width,p.height);
        p.image(buffer,0,0,p.width,p.height);
    }

    p.mousePressed = function() {
        running = !running;
        if (running) p.loop();
        else p.noLoop();
    }

    p.windowResized = function() {
        const lato = div.clientWidth;
        p.resizeCanvas(lato,lato);
        buffer.resizeCanvas(lato,lato);
        resizeCollapsable();
    }
});

