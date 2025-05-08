/**
 * Targeted dropdown selection script for athenaHealth application form
 * Works with the specific React implementation shown in the DOM
 */
async function selectDropdownOption(optionName = "Indeed") {
    console.log(`Attempting to select "${optionName}" from dropdown...`);

    // Option value mapping from the visible dropdown
    const optionMap = {
        "Corporate Website": "3e9cc48c033e010a10025b0ba1014ba8",
        "Glassdoor": "3e9cc48c033e01834779dc0ba101b2a8",
        "Indeed": "3e9cc48c033e010ff41ddc0ba101ada8",
        "LinkedIn": "2572fde58623011bde26ec2557014704",
        "Naukri": "3e9cc48c033e016aff8adc0ba101b3a8",
        "Other": "d0fffe161dae4ddd8b519ace2f6f14c4",
        "Recruiting Event": "3e9cc48c033e012c9e05a00ba10170a8"
    };

    // Check if option exists in our mapping
    if (!optionMap[optionName]) {
        console.error(`Option "${optionName}" not found in available options`);
        console.log(`Available options: ${Object.keys(optionMap).join(', ')}`);
        return false;
    }

    const optionValue = optionMap[optionName];

    try {
        // Method 1: Find option by data-value attribute and click it
        const option = document.querySelector(`[data-value="${optionValue}"]`);
        if (option) {
            console.log(`Found option element with value "${optionValue}"`);

            // Highlight that we're clicking this option
            option.style.backgroundColor = "rgba(25, 112, 199, 0.2)";
            await new Promise(resolve => setTimeout(resolve, 300));

            // Click the option
            option.click();
            console.log(`Clicked on option: ${optionName}`);
            return true;
        }

        // Method 2: If dropdown is still open, try with ID
        const optionById = document.getElementById(optionValue);
        if (optionById) {
            console.log(`Found option element by ID "${optionValue}"`);
            optionById.click();
            console.log(`Clicked on option by ID: ${optionName}`);
            return true;
        }

        // Method 3: Find the hidden input and force value change
        const hiddenInput = document.querySelector('#source--source + input[type="text"]');
        if (hiddenInput) {
            console.log('Setting value directly on hidden input');

            // Get the React props key
            const reactPropsKey = Object.keys(hiddenInput).find(key =>
                key.startsWith('__reactProps$') || key.startsWith('__reactEventHandlers$')
            );

            if (reactPropsKey && hiddenInput[reactPropsKey].onChange) {
                // Create a synthetic React event
                const syntheticEvent = {
                    target: {
                        value: optionValue,
                        name: hiddenInput.name || 'source'
                    },
                    currentTarget: hiddenInput,
                    bubbles: true,
                    preventDefault: () => {},
                    stopPropagation: () => {}
                };

                // Call React's onChange handler
                hiddenInput[reactPropsKey].onChange(syntheticEvent);
                console.log(`Set value through React onChange: ${optionName}`);

                // Also set the DOM value for good measure
                hiddenInput.value = optionValue;
                return true;
            }
        }

        console.error('All methods failed to select the option');
        return false;

    } catch (error) {
        console.error('Error selecting option:', error);
        return false;
    }
}

// Execute the function with "Indeed" as the target option
selectDropdownOption('Indeed');
