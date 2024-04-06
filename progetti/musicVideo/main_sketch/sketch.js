import { read_obj } from "../shared/read_obj.js";

const div = document.getElementById('final_sketch');
let song;

const sketch = p=>{
    let FFT;

    let song_loaded, song_promise = new Promise(r=>song_loaded=r);
    let obj, obj_loaded, obj_promise = new Promise(r=>obj_loaded=r);
    let XOR, xor_loaded, xor_promise = new Promise(r=>xor_loaded=r);
    let POST, post_loaded, post_promise = new Promise(r=>post_loaded=r);

    const vertici = [], facce = [];

    let old_frame, next_frame, changes;
    let final_frame;

    function energy(ranges) {
        return ranges.reduce((acc,range)=>acc+FFT.getEnergy(range), 0) / (ranges.length*255)
    }

    p.preload = function() {
        song = p.loadSound('./music/Major_Crimes.mp3', song_loaded);
        obj = p.loadStrings('./objs/pesce.obj', obj_loaded);
        XOR = p.loadShader('./shaders/XOR/shader.vert','./shaders/XOR/shader.frag', xor_loaded);
        POST = p.loadShader('./shaders/POST/shader.vert','./shaders/POST/shader.frag', post_loaded);
    }

    p.setup = async function() {
        await Promise.all([song_promise, obj_promise]);
        const lato = div.clientWidth;
        const canvas = p.createCanvas(lato,lato);
        canvas.class('bordered');
        canvas.parent('final_sketch');
        resizeCollapsable();

        old_frame = p.createGraphics(lato,lato);
        old_frame.background(255);
        next_frame = p.createGraphics(lato,lato, p.WEBGL);
        old_frame = p.createGraphics(lato,lato);
        final_frame = p.createGraphics(lato,lato, p.WEBGL);
        changes = p.createGraphics(lato,lato);

        const obj_parsed = read_obj(obj,p);
        vertici.push(...obj_parsed.vertici);
        facce.push(...obj_parsed.facce);

        FFT = new p5.FFT();
        song.amp(0.1);
        song.disconnect();
        FFT.setInput(song);
    }

    p.draw = function() {
        if (!FFT || !changes ||  !final_frame || !song) return;
        const spectrum = FFT.analyze();

        changes.background(255);
        changes.strokeWeight(p.width*4./1024);
        changes.stroke(0);
        const speed_rot = energy(["mid","lowMid"]);
        const A = p.PI*0.005;
        for (const vertice of vertici) {
            let oldx = vertice.x;
            let oldz = vertice.z;
            vertice.x = oldx*p.cos(A*(speed_rot*2+1)) - oldz * p.sin(A*(speed_rot*2+1));
            vertice.z = oldx*p.sin(A*(speed_rot*2+1)) + oldz * p.cos(A*(speed_rot*2+1));
            let oldy = vertice.y;
            oldz = vertice.z;
            vertice.y = oldy*p.cos(A*speed_rot*10*(p.noise(p.frameCount/50)*2-1)) - oldz * p.sin(A*speed_rot*10*(p.noise(p.frameCount/50)*2-1));
            vertice.z = oldy*p.sin(A*speed_rot*10*(p.noise(p.frameCount/50)*2-1)) + oldz * p.cos(A*speed_rot*10*(p.noise(p.frameCount/50)*2-1));
        }

        const punti_proj = [];
        const expand = 0.5 + energy(["bass","lowMid"]);
        const mid_screen = p.createVector(p.width/2, p.height/2);
        for (const vertice of vertici) {
            const a = p5.Vector.mult(vertice, expand);
            const p_scale = 1/p.tan(p.PI/4); 
            const a_space = p.createVector(a.x*p_scale, a.y*p_scale, a.z+2);
            const a2 = p.createVector(a_space.x/a_space.z, a_space.y/a_space.z);
            a2.mult(p.width/2);
            a2.add(mid_screen);
            punti_proj.push(a2);
        }
        for (const faccia of facce) {
            for (let i=0; i<faccia.length; i++) {
                const a = punti_proj[faccia[i]];
                const b = punti_proj[faccia[(i+1)%faccia.length]];
                changes.line(a.x,a.y,b.x,b.y);
            }
        }

        const sner_max = 8;
        const sner = energy(["highMid","treble"]) * sner_max;
        if (p.frameCount%sner_max<=sner_max-sner) {
            old_frame.background(255);
        }

        next_frame.shader(XOR);
        XOR.setUniform('old_frame', old_frame);
        XOR.setUniform('changes', changes);
        next_frame.rect(0,0,p.width/2,p.width/2);

        old_frame.image(next_frame, 0,0,p.width,p.height);

        const col = [205, 26, 77];

        final_frame.shader(POST);
        POST.setUniform('frame', next_frame);
        POST.setUniform('boom', sner/sner_max);
        POST.setUniform('mode', Number(document.getElementById('mode_slider').value));
        POST.setUniform('tint', col.map(a=>a/256));
        final_frame.rect(0,0,p.width,p.height);

        p.image(final_frame,0,0);
    }

    p.windowResized = function() {
        const lato = div.clientWidth;
        p.resizeCanvas(lato,lato);
        old_frame.resizeCanvas(lato,lato);
        next_frame.resizeCanvas(lato,lato);
        final_frame.resizeCanvas(lato,lato);
        changes.resizeCanvas(lato,lato);
        resizeCollapsable();
    }
};
new p5(sketch);

window.onSpotifyIframeApiReady = IFrameAPI=>{
    const element = document.getElementById('spotify_embed');
    const options = {
        uri: 'spotify:track:3nh5RSXnRSHWuQbOJvQr0g',
        width: '100%',
        height: '200',
    };
    const callback = EmbedController => {
        EmbedController.addListener('playback_update', e=>{
            if (e.data.isPaused && song.isPlaying()) song.pause();
            else if (!e.data.isPaused && !song.isPlaying()) song.play();
            song.jump(e.data.position/1000);
        });
    };
    IFrameAPI.createController(element, options, callback);
};
