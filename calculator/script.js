class Calculator {
    constructor() {
        this.reset();
        this.updateDisplay();
    }

    reset() {
        this.currentInput = '0';
        this.previousInput = null;
        this.operation = null;
        this.shouldResetInput = false;
    }

    appendNumber(number) {
        if (this.shouldResetInput) {
            this.currentInput = '0';
            this.shouldResetInput = false;
        }
        
        if (number === '.' && this.currentInput.includes('.')) return;
        
        this.currentInput = this.currentInput === '0' && number !== '.' 
            ? number.toString() 
            : this.currentInput + number.toString();
    }

    setOperation(operation) {
        if (this.currentInput === '0' && this.previousInput === null) return;
        
        if (this.previousInput !== null) {
            this.calculate();
        }
        
        this.operation = operation;
        this.previousInput = this.currentInput;
        this.shouldResetInput = true;
    }

    calculate() {
        if (this.previousInput === null || this.operation === null) return;
        
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        let result;
        
        switch (this.operation) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case '×': result = prev * current; break;
            case '÷': result = prev / current; break;
            default: return;
        }
        
        this.currentInput = result.toString();
        this.operation = null;
        this.previousInput = null;
    }

    percentage() {
        this.currentInput = (parseFloat(this.currentInput) / 100);
    }

    toggleSign() {
        this.currentInput = (parseFloat(this.currentInput) * -1).toString();
    }

    clear() {
        this.reset();
    }

    updateDisplay() {
        const screen = document.querySelector('.screen');
        screen.textContent = this.currentInput;
    }
}

const calculator = new Calculator();
const screen = document.querySelector('.screen');

document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.textContent);
        calculator.updateDisplay();
    });
});

document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        
        switch (action) {
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                calculator.setOperation(
                    action === 'add' ? '+' :
                    action === 'subtract' ? '-' :
                    action === 'multiply' ? '×' : '÷'
                );
                break;
            case 'calculate':
                calculator.calculate();
                break;
            case 'clear':
                calculator.clear();
                break;
            case 'percent':
                calculator.percentage();
                break;
            case 'sign':
                calculator.toggleSign();
                break;
        }
        
        calculator.updateDisplay();
    });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 9) {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    } else if (e.key === '.') {
        calculator.appendNumber('.');
        calculator.updateDisplay();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        calculator.setOperation(
            e.key === '+' ? '+' :
            e.key === '-' ? '-' :
            e.key === '*' ? '×' : '÷'
        );
        calculator.updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
        calculator.calculate();
        calculator.updateDisplay();
    } else if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    } else if (e.key === '%') {
        calculator.percentage();
        calculator.updateDisplay();
    }
});