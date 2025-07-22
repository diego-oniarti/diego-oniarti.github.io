document.addEventListener('DOMContentLoaded', ()=>{
    const box = document.getElementById("carousel");
    const pictures = document.getElementById("carousel_inside");
    const n_pictures = pictures.children.length;

    let displayed = 0;

    function advance() {
        displayed = (displayed+1)%n_pictures;
        pictures.style.left = `-${displayed*100}%`;
    }

    function goBack() {
        displayed = ((displayed-1)+n_pictures)%n_pictures;
        pictures.style.left = `-${displayed*100}%`;
    }

    // scroll every 3 seconds
    let a = setInterval(advance, 3000);
    // on click -> scroll once and reset the timer
    box.addEventListener('click', e=>{
        const bound = box.getBoundingClientRect();

        if (e.x>bound.x+bound.width/2) {
            advance();
        } else {
            goBack();
        }
        clearInterval(a);
        a = setInterval(advance, 3000);
    });
});
