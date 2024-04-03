const div = document.getElementById('final_sketch');
new p5(p=>{
    p.setup = function() {
        const lato = div.clientWidth;
        const canvas = p.createCanvas(lato,lato);
        canvas.class('bordered');
        canvas.parent('final_sketch');
        resizeCollapsable();
    }
});
