// Configuration with your specified credentials
const userData = {
    email: 'cole@unwrap.rs',
    password: 'Fuck@YouMommas1234!'  // Meets all password requirements
};

// Enhanced form automation for React components
const reactFormFiller = {
    // Wait for specified milliseconds
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    // Find React fiber node to access internal state
    getReactFiber: (element) => {
        const key = Object.keys(element).find(key =>
            key.startsWith('__reactFiber$') ||
            key.startsWith('__reactInternalInstance$')
        );
        return key ? element[key] : null;
    },

    // Fill input with proper React state updates
    async fillInput(selector, value) {
        const input = document.querySelector(selector);
        if (!input) {
            console.error(`Element not found: ${selector}`);
            return false;
        }

        // Focus and clear current value
        input.focus();

        // Find React props for this input
        const reactPropKey = Object.keys(input).find(key =>
            key.startsWith('__reactProps$')
        );

        if (reactPropKey && input[reactPropKey].onChange) {
            // Get the React onChange handler
            const changeHandler = input[reactPropKey].onChange;

            // Create synthetic event
            const event = {
                target: {
                    value: value,
                    name: input.name || input.id
                },
                currentTarget: input,
                bubbles: true,
                preventDefault: () => {},
                stopPropagation: () => {},
                persist: () => {}
            };

            // Clear any existing value
            input.value = '';

            // Call React's onChange with our synthetic event
            changeHandler(event);

            // Wait for React to process
            await this.delay(50);

            // For extra certainty, also set the DOM value directly
            input.value = value;

            // Fire native events as backup
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));

            // Blur the field to trigger validation
            await this.delay(300);
            input.blur();

            return true;
        } else {
            // Fallback to traditional approach
            console.warn(`React props not found for ${selector}, using fallback`);
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            await this.delay(200);
            return true;
        }
    },

    // Handle checkbox with React state updates
    async checkCheckbox(selector) {
        const checkbox = document.querySelector(selector);
        if (!checkbox) {
            console.error(`Checkbox not found: ${selector}`);
            return false;
        }

        // Find React props
        const reactPropKey = Object.keys(checkbox).find(key =>
            key.startsWith('__reactProps$')
        );

        if (reactPropKey && checkbox[reactPropKey].onChange) {
            // Create synthetic change event
            const event = {
                target: {
                    checked: true,
                    type: 'checkbox',
                    name: checkbox.name || checkbox.id
                },
                currentTarget: checkbox,
                bubbles: true,
                preventDefault: () => {},
                stopPropagation: () => {},
                persist: () => {}
            };

            // Call React's onChange handler
            checkbox[reactPropKey].onChange(event);

            // Set DOM properties too
            checkbox.checked = true;
            checkbox.setAttribute('aria-checked', 'true');
            await this.delay(100);
            return true;
        } else {
            // Fallback
            checkbox.checked = true;
            checkbox.setAttribute('aria-checked', 'true');
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            await this.delay(100);
            return true;
        }
    },

    // Click an element with proper React event handling
    async clickButton(selector) {
        const button = document.querySelector(selector);
        if (!button) {
            console.error(`Button not found: ${selector}`);
            return false;
        }

        // Find React props
        const reactPropKey = Object.keys(button).find(key =>
            key.startsWith('__reactProps$')
        );

        if (reactPropKey && button[reactPropKey].onClick) {
            // Create synthetic click event
            const event = {
                target: button,
                currentTarget: button,
                bubbles: true,
                preventDefault: () => {},
                stopPropagation: () => {},
                persist: () => {}
            };

            // Call React's onClick handler
            button[reactPropKey].onClick(event);
        }

        // Also do native click for backup
        button.click();
        await this.delay(300);
        return true;
    }
};

// Main form filling function
async function fillAccountForm() {
    try {
        console.log('Starting form fill...');

        // Add a delay to ensure the form is fully loaded
        await reactFormFiller.delay(1000);

        // Fill email field with proper React state update
        console.log('Filling email...');
        await reactFormFiller.fillInput('#input-4', userData.email);

        // Short pause between fields
        await reactFormFiller.delay(500);

        // Fill password field
        console.log('Filling password...');
        await reactFormFiller.fillInput('#input-5', userData.password);

        await reactFormFiller.delay(300);

        // Fill verify password field
        console.log('Filling verify password...');
        await reactFormFiller.fillInput('#input-6', userData.password);

        await reactFormFiller.delay(300);

        // Check the agreement checkbox if not already checked
        if (document.querySelector('#input-8').getAttribute('aria-checked') !== 'true') {
            console.log('Checking agreement checkbox...');
            await reactFormFiller.checkCheckbox('#input-8');
        }

        await reactFormFiller.delay(500);

        // Click the submit button
        console.log('Submitting form...');
        await reactFormFiller.clickButton('[data-automation-id="click_filter"]');

        console.log('✅ Form submission attempted!');
    } catch (error) {
        console.error('Error filling form:', error);
    }
}

// Run the form filler
fillAccountForm();
