function randomNumberGenerator(number){
    const numbersArray = [];
    const numbersObj = {};

    for (let i = 0; i < number; i++){
        let count = 0
        const randomNumber = () =>{
            return Math.floor(Math.random() * (1000 - 1 + 1) + 1)
        }
        
        numbersArray.push(randomNumber());
        count += i;
    };

    numbersArray.forEach(function(x){
        numbersObj[x] = (numbersObj[x] || 0) + 1;
    });

    return numbersObj;
};

process.on('message', msg=> {
    console.log('procesando request en plano secundario');
    console.log(msg)
    const objRender = randomNumberGenerator(msg);
    process.send(objRender)
});