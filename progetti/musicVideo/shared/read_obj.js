export function read_obj(righe, p) {
    const vertici = [], facce = [];
    for (const riga of righe) {
        const parti = riga.split(' ')
        if (parti[0] == 'v') {
            vertici.push(p.createVector(parti[1]/5, parti[2]/5, parti[3]/5))
        }
        if (parti[0] == 'f') { 
            facce.push( (parti.slice(1)).map(a => {return Number(a.split('/')[0])-1}) )
        }
    }
    return {vertici, facce};
}
