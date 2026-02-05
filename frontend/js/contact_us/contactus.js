document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('the_form');
    const submitBtn = document.getElementById('submit_btn');
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s\-\+\(\)]+$/
    };

    const inputs = {
        firstName: document.getElementById('first_name'),
        familyName: document.getElementById('family_name'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message_text')
    };

    inputs.email.addEventListener('input', function() {
        validateEmail(this);
    });

    inputs.phone.addEventListener('input', function() {
        validatePhone(this);
    });
    
    function validateEmail(input) {
        const value = input.value.trim();
        if (value && !patterns.email.test(value)) {
            indicateError(input, 'Please enter a valid email address');
            return false;
        }
        clearError(input);
        return true;
    }
    function validatePhone(input) {
        const value = input.value.trim();
        if (value && !patterns.phone.test(value)) {
            indicateError(input, 'Please enter a valid phone number');
            return false;
        }
        clearError(input);
        return true;
    }
    function indicateError(input, message) {
        clearError(input);
        input.style.border = '1px solid #ef4444';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '4px';
        errorDiv.textContent = message;
        input.parentElement.appendChild(errorDiv);
    }
    function clearError(input) {
        input.style.border = '1px solid #f8fafc';
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            background: #10b981;
            color: white;
            padding: 16px;
            border-radius: 10px;
            margin-top: 16px;
            text-align: center;
            animation: slideIn 0.3s ease;
        `;
        successDiv.textContent = 'Message sent successfully! We\'ll get back to you soon.';
        
        form.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => successDiv.remove(), 300);
        }, 4000);
    }
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        Object.values(inputs).forEach(input => clearError(input));
        let isValid = true;
        if (!inputs.firstName.value.trim()) {
            indicateError(inputs.firstName, 'First name is required');
            isValid = false;
        }
        
        if (!inputs.familyName.value.trim()) {
            indicateError(inputs.familyName, 'Family name is required');
            isValid = false;
        }
        
        if (!inputs.email.value.trim()) {
            indicateError(inputs.email, 'Email is required');
            isValid = false;
        } else if (!validateEmail(inputs.email)) {
            isValid = false;
        }
        
        if (!inputs.subject.value.trim()) {
            indicateError(inputs.subject, 'Subject is required');
            isValid = false;
        }
        
        if (!inputs.message.value.trim()) {
            indicateError(inputs.message, 'Message is required');
            isValid = false;
        }
        
        if (inputs.phone.value.trim() && !validatePhone(inputs.phone)) {
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
        submitBtn.style.cursor = 'not-allowed';
        submitBtn.innerHTML = '<div>Sending...</div>';
        const formData = {
            firstName: inputs.firstName.value.trim(),
            familyName: inputs.familyName.value.trim(),
            email: inputs.email.value.trim(),
            phone: inputs.phone.value.trim(),
            subject: inputs.subject.value.trim(),
            message: inputs.message.value.trim(),
            timestamp: new Date().toISOString()
        };
        setTimeout(() => {
            console.log('Form submitted:', formData);
            showSuccessMessage();
            form.reset();
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
            submitBtn.innerHTML = `
                <div><svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_109_92)">
                        <path d="M10.1155 15.2574C10.1408 15.3205 10.1849 15.3744 10.2417 15.4117C10.2985 15.4491 10.3654 15.4682 10.4334 15.4665C10.5014 15.4647 10.5672 15.4422 10.6221 15.402C10.6769 15.3618 10.7181 15.3057 10.7402 15.2414L15.0735 2.57471C15.0948 2.51564 15.0989 2.45172 15.0852 2.39042C15.0716 2.32911 15.0407 2.27297 14.9963 2.22856C14.9519 2.18415 14.8958 2.15331 14.8345 2.13964C14.7732 2.12597 14.7092 2.13004 14.6502 2.15138L1.9835 6.48471C1.91917 6.50678 1.86312 6.54799 1.82289 6.60283C1.78265 6.65766 1.76015 6.72349 1.75841 6.79148C1.75667 6.85948 1.77577 6.92637 1.81314 6.9832C1.85052 7.04002 1.90438 7.08405 1.9675 7.10938L7.25417 9.22938C7.4213 9.29629 7.57314 9.39635 7.70055 9.52353C7.82796 9.65071 7.92829 9.80238 7.9955 9.96938L10.1155 15.2574Z" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14.994 2.23135L7.70068 9.52402" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_109_92">
                            <rect width="16" height="16" fill="white" transform="translate(0.424805 0.800049)"/>
                        </clipPath>
                    </defs>
                </svg></div>
                Send Message
            `;
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1500);
    });
    const maxChars = 500;
    inputs.message.addEventListener('input', function() {
        const remaining = maxChars - this.value.length;
        let counter = this.parentElement.querySelector('.char-counter');
        
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.cssText = 'font-size: 12px; color: #64748b; margin-top: 4px; text-align: right;';
            this.parentElement.appendChild(counter);
        }
        
        if (remaining < 0) {
            counter.style.color = '#ef4444';
            this.value = this.value.substring(0, maxChars);
            counter.textContent = '0 characters remaining';
        } else {
            counter.style.color = '#64748b';
            counter.textContent = `${remaining} characters remaining`;
        }
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-10px);
            }
        }
        
        input:focus, textarea:focus {
            transition: all 0.2s ease;
        }
    `;
    document.head.appendChild(style);
});