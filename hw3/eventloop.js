function createTaskQueues() {
    console.log('Start');
    
    setTimeout(() => {
        console.log('1 finish');
        // микротаска
        Promise.resolve().then(() => { 
            console.log('1.1 finish');
        });
        
        // рендер таска
        Promise.resolve().then(() => {
            console.log('1.2 finish');
            const dummyElement = document.createElement('div');
            dummyElement.style.display = 'none';
            document.body.appendChild(dummyElement);
        });
    }, 0);
    
    setTimeout(() => {
        console.log('2. finish');
        
        // микротаска
        Promise.resolve().then(() => {
            console.log('2.1 finish');
        });
        
        // микротаска
        Promise.resolve().then(() => {
            console.log('2.2 finish');
        });
    }, 0);
    
    setTimeout(() => {
        console.log('3. finish');
        
        // микротаска
        Promise.resolve().then(() => {
            console.log('3.1 finish');
        });
        
        // рендер таска
        Promise.resolve().then(() => {
            console.log('3.2 finish');
            const dummyElement = document.createElement('div');
            dummyElement.textContent = 'Change';
            document.body.appendChild(dummyElement);
        });
    }, 0);
    
    console.log('End');
}

// второй вариант

function createTaskQueuesWithDOM() {
    console.log('Start');
    
    const testElement = document.createElement('div');
    testElement.id = 'test-element';
    testElement.innerHTML = '<p>Value</p>';
    document.body.appendChild(testElement);
    
    setTimeout(() => {
        console.log('1. finish');
        
        // микротаска
        Promise.resolve().then(() => {
            console.log('1.1 finish');
        });
        
        // рендер таска
        Promise.resolve().then(() => {
            console.log('1.2 finish');
            testElement.style.backgroundColor = 'lightblue';
            testElement.style.padding = '10px';
        });
    }, 0);
    
    setTimeout(() => {
        console.log('2. finish');
        
        // микротаска
        Promise.resolve().then(() => {
            console.log('2.1 finish');
        });
        
        // микротаска
        Promise.resolve().then(() => {
            console.log('2.2 finish');
        });
    }, 0);
    
    setTimeout(() => {
        console.log('3. finish');
        
        // микротаска
        Promise.resolve().then(() => {
            console.log('3.1 finish');
        });
        
        // рендер таска
        Promise.resolve().then(() => {
            console.log('3.2 finish');
            testElement.innerHTML += '<p>Change</p>';
        });
    }, 0);
    
    console.log('end');
}

// createTaskQueues();

createTaskQueuesWithDOM();