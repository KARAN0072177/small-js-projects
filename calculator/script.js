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

    deleteLastChar() {
        this.currentInput = this.currentInput.length > 1 
            ? this.currentInput.slice(0, -1) 
            : '0';
    }

    updateDisplay() {
        const screen = document.querySelector('.screen');
        screen.textContent = this.currentInput;
        
        // Highlight active operation button
        document.querySelectorAll('.operation').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (this.operation) {
            const activeOpBtn = document.querySelector(`[data-action="${this.getActionFromOperation()}"]`);
            if (activeOpBtn) activeOpBtn.classList.add('active');
        }
    }

    getActionFromOperation() {
        switch (this.operation) {
            case '+': return 'add';
            case '-': return 'subtract';
            case '×': return 'multiply';
            case '÷': return 'divide';
            default: return '';
        }
    }
}

// Initialize calculator
const calculator = new Calculator();

// Button event listeners
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.textContent);
        calculator.updateDisplay();
    });
});

document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        handleAction(action);
    });
});

function handleAction(action) {
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
        case 'delete':
            calculator.deleteLastChar();
            break;
    }
    calculator.updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (!e.repeat) { // Prevent key repeat from triggering multiple times
        if ((e.key >= 0 && e.key <= 9) || e.key === '.') {
            calculator.appendNumber(e.key);
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
        } else if (e.key === '_' || e.key === '±') {
            calculator.toggleSign();
            calculator.updateDisplay();
        } else if (e.key === 'Backspace') {
            calculator.deleteLastChar();
            calculator.updateDisplay();
        }
    }
});

// Add visual feedback for keyboard presses
document.addEventListener('keydown', (e) => {
    const key = e.key;
    let button;
    
    if (key >= 0 && key <= 9) {
        button = document.querySelector(`[data-number="${key}"]`);
    } else if (key === '.') {
        button = document.querySelector('[data-number="."]');
    } else if (key === '+') {
        button = document.querySelector('[data-action="add"]');
    } else if (key === '-') {
        button = document.querySelector('[data-action="subtract"]');
    } else if (key === '*') {
        button = document.querySelector('[data-action="multiply"]');
    } else if (key === '/') {
        button = document.querySelector('[data-action="divide"]');
    } else if (key === 'Enter' || key === '=') {
        button = document.querySelector('[data-action="calculate"]');
    } else if (key === 'Escape') {
        button = document.querySelector('[data-action="clear"]');
    } else if (key === '%') {
        button = document.querySelector('[data-action="percent"]');
    } else if (key === '_' || key === '±') {
        button = document.querySelector('[data-action="sign"]');
    } else if (key === 'Backspace') {
        button = document.querySelector('[data-action="delete"]');
    }
    
    if (button) {
        button.classList.add('key-press');
        setTimeout(() => button.classList.remove('key-press'), 100);
    }
});