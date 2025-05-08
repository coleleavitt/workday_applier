// Configuration with your specified credentials
const userData = {
    email: 'cole@unwrap.rs'
};

// Enhanced form automation for React components (email only)
const reactFormFiller = {
    // Wait for specified milliseconds
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

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
    }
};

// Main function to fill email field only
async function fillEmailField() {
    try {
        console.log('Starting email field fill...');

        // Add a delay to ensure the form is fully loaded
        await reactFormFiller.delay(1000);

        // Fill email field with proper React state update
        console.log('Filling email...');
        await reactFormFiller.fillInput('#input-4', userData.email);

        console.log('✅ Email field filled!');
    } catch (error) {
        console.error('Error filling email field:', error);
    }
}

// Run the email filler
fillEmailField();
