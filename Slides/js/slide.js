export default class Slide {
    constructor(slide, wrapper) { 
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        this.dist = { // Distância
            finalPosition: 0,
            startX: 0,
            movement: 0,
        }
    }

    moveSlide(distX) {
        this.dist.movePosition = distX;
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
    }

    // Atualiza a posição do Slide
    updatePosition(clientX) {
        this.dist.movement = (this.dist.startX - clientX) * 1.6; // Velocidade do slide
        return this.dist.finalPosition - this.dist.movement;
    }

    onStart(event) {
        let movetype;
        if (event.type === 'mousedown') {
            event.preventDefault();
            this.dist.startX = event.clientX;
            movetype = 'mousemove';
        } else {
            this.dist.startX = event.changedTouches[0].clientX;
            movetype = 'touchmove';
        }
        this.wrapper.addEventListener(movetype, this.onMove);
    }

    onMove(event) {
        const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
        const finalPosition = this.updatePosition(pointerPosition);
        this.moveSlide(finalPosition);
    }

    onEnd(event) {
        this.wrapper.removeEventListener('mousemove', this.onMove);
        this.wrapper.removeEventListener('touchmove', this.onMove);
        this.dist.finalPosition = this.dist.movePosition; // Assim que tirar o mouse de cima, salva a posição final do slide
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('touchstart', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd); // Quando o mouse for solto
        this.wrapper.addEventListener('touchend', this.onEnd);
    }

    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.onMove = this.onMove.bind(this);
    }

    //Slides Config

    slidePosition(slide) {
        const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
        return -(slide.offsetLeft - margin);
    }
    

    slideConfig() {
        this.slideArray = [...this.slide.children].map((element) =>{
            const position = this.slidePosition(element)
            return { 
                position,
                element,
            }
        });
    }

    slidesIndexNav(index) {
        const last = this.slideArray.length - 1
        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index === last ? undefined: index + 1,
        }
    }

    changeSlide(index) {
        const activeSlide = this.slideArray[index];
        this.moveSlide(activeSlide.position);
        this.slidesIndexNav(index);
        this.dist.finalPosition = activeSlide.position
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();
        this.slideConfig(); // Configura os slides antes de qualquer mudança
        this.changeSlide(0); // Inicia com o primeiro slide
        return this;
    }
    
}
