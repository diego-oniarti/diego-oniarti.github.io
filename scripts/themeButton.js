document.getElementById('themeButton').addEventListener('click',e=>{
    document.getElementsByTagName('body')[0].classList.toggle('dark')
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

for (let bottone of document.getElementsByClassName('collapseButton')) {
    for (element of bottone.parentElement.parentElement.children) {
        if (element.classList.contains('section')) {
            element.style.maxHeight = element.scrollHeight + "px";
        }
    }
    
    bottone.addEventListener('click',e=>{
        bottone.children[0].classList.toggle('flipped')
        for (element of bottone.parentElement.parentElement.children) {
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