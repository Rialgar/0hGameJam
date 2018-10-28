window.addEventListener('load', () => {

    const game = document.createElement('div');
    game.className = "game";
    document.body.appendChild(game);

    let cars = [];
    let frog = {
        lane: -1,
        dom: document.createElement('div')
    };
    frog.dom.className = "frog";
    frog.dom.style.top = `185px`;
    frog.dom.style.left = `${35 + frog.lane * 30}px`;
    game.appendChild(frog.dom);

    let last = -4000;
    let lastCar = -Infinity;

    const addCar = function () {
        let x = Math.floor(Math.random() * 6);
        while(cars.some(old => old.x === x && old.y < 70)){
            x = Math.floor(Math.random() * 6);
        }
        const car = {
            x,
            y: 0,
            dom: document.createElement('div')
        }
        car.dom.className = "car";        
        car.dom.style.top = `${car.y - 30}px`;
        car.dom.style.left = `${30 + car.x * 30}px`;

        game.appendChild(car.dom);
        cars.push(car);
    }

    let jumping = 0;
    let jumpDir = 0;
    let lost = true;
    let down = {};

    const init = t => {
        while(last + 16 < t){
            update(last + 16);
        }
        last = t;
        lost = false;
        window.requestAnimationFrame(update);
    }    

    const update = t => {        
        const d = t - last;
        last = t;
        if(t-lastCar > 300){
            addCar();
            lastCar = t;
        }
        cars.forEach(car => {
            car.y += d / 10;
            car.dom.style.top = `${car.y - 30}px`;
            car.dom.style.left = `${30 + car.x * 30}px`;
        });
        cars = cars.filter(car => car.y < 420);
        if(jumping <= 0){
            if(frog.lane >= 0 && (down['a'] || down['ArrowLeft'])){
                jumping = 300;
                jumpDir = -1;
            }
            if(frog.lane < 6 && (down['d'] || down['ArrowRight'])){
                jumping = 300;
                jumpDir = 1;
            }
        } else {
            jumping -= d;
            if(jumping <= 0){
                frog.lane += jumpDir;
                jumping = 0;
                jumpDir = 0;
            }
            frog.x = frog.lane + jumpDir * (300-jumping)/300;
            frog.dom.style.left = `${35 + frog.x * 30}px`;
        }

        if(cars.some(car => {
            const lane = car.x === frog.lane || car.x === frog.lane + jumping;
            return lane && car.y > 185 && car.y < 235;
        })){
            console.log(lost);
            frog.dom.style.backgroundColor = 'red';
            lost = true;
            window.setTimeout(()=>{
                alert('You lost!');
                window.location = window.location;
            }, 0);
        } else if(frog.lane > 5){
            frog.dom.style.backgroundColor = 'gold';
            lost = true;
            window.setTimeout(()=>{
                alert('You won!');
                window.location = window.location;
            }, 0);
        }
        !lost && window.requestAnimationFrame(update);
    };    

    window.addEventListener('keydown', ev => {
        down[ev.key] = true;
        console.log(ev.key);
    });
    window.addEventListener('keyup', ev => down[ev.key] = false);

    window.requestAnimationFrame(init);
});