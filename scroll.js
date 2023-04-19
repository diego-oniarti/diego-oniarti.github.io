const sleep = async (t)=>{
    let res;
    const prom = new Promise(resolve=>{res=resolve});
    setTimeout(res,t);
    await prom;
}

const checkScroll = async (limit)=>{
    for (let scheda of document.getElementsByClassName('scheda')){
        const rect = scheda.getBoundingClientRect();
        if (
            rect.top >= 0 &&
            rect.top + limit <= (window.innerHeight || document.documentElement.clientHeight)
        ) {
            scheda.classList.remove('nascondi');
            await sleep(50);
        }
    }
}

