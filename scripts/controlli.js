document.getElementById('themeButton').addEventListener('click',e=>{
    if (document.getElementsByTagName('body')[0].classList.contains('dark')) {
        document.getElementById('themeButton').innerHTML='◐';
    }else{
        document.getElementById('themeButton').innerHTML='◑';
    }
    const body = document.getElementsByTagName('body')[0];
    body.classList.toggle('dark');
    document.cookie = `mode=${body.classList.contains('dark')}`;
    console.log(`mode=${body.classList.contains('dark')?'dark':'light'};`)
});
window.addEventListener("load", (event) => {
    const cookie = document.cookie;
    mode = cookie.match('mode=(?<mode>light|dark)')?.groups['mode'];
    if (mode==="light") {
        document.getElementsByTagName('body')[0].classList.remove('dark');
    }
});

document.getElementById('navCollapse').addEventListener('click',e=>{
    for (element of document.getElementsByClassName('navCollapsible')) {
        if (element.style.maxHeight){
            element.style.maxHeight = null;
        } else {
            element.style.maxHeight = element.scrollHeight + "px";
        }
    }
});

function resizeCollapsable () {
    for (element of document.getElementsByClassName('section')) {
        if (element.style.maxHeight!='0px')
            element.style.maxHeight = element.scrollHeight + "px";
    }
}
resizeCollapsable();
window.addEventListener('resize', ()=>{
    resizeCollapsable();
})

for (let bottone of document.getElementsByClassName('collapseButton')) {    
    bottone.addEventListener('click',e=>{
        bottone.children[1].classList.toggle('flipped')
        for (element of bottone.parentElement.children) {
            if (element.style.backgroundColor=='transparent') 
                element.style.backgroundColor=''
            else
                element.style.backgroundColor='transparent'
            
            if (element.classList.contains('section')) {
                if (element.style.maxHeight!='0px'){
                    element.style.maxHeight = '0px';
                } else {
                    element.style.maxHeight = element.scrollHeight + "px";
                }
            }
        }
    });
}