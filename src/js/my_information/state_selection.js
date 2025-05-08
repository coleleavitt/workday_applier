/**
 * Targeted dropdown selection script for selecting a US state
 * in the athenaHealth application form
 */
async function selectStateDropdownOption(stateName) {
    console.log(`Attempting to select state: "${stateName}"...`);

    // First, open the dropdown if it's not already open
    const dropdownButton = document.querySelector('#address--countryRegion');
    if (dropdownButton) {
        dropdownButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Opened state selection dropdown');
    }

    // Complete mapping of all US states to their data-value attributes
    const stateMap = {
        "Alabama": "31475924e5494080a8a458bf4fa293ed",
        "Alaska": "c8891443252c4c4ea9427be64d755b9f",
        "American Samoa": "c89eea109e00414ebd2bcf86c3657443",
        "Arizona": "c7b20b0d4bc04711a00900569e9afabd",
        "Arkansas": "cea6c5355e1b4983b5fd0640310385b5",
        "California": "ec3d210e4240442e99a28fa70419aec5",
        "Colorado": "a83d6eabae3b49718c4ce09eeb66fd0b",
        "Connecticut": "bffb3e4c9a4a4542bc6bd075a4c26247",
        "Delaware": "18b4cf9ddb4e4542a39614cb55b4dde7",
        "District of Columbia": "0d2bcd0308f541938f3ae29e7cc69ae0",
        "Florida": "9c1a239b35bd4598856e5393b249b8a1",
        "Georgia": "dec8eabbb13d45bdb159b8e25d896110",
        "Hawaii": "e7634111501844fe83a0b316b16beb08",
        "Massachusetts": "c66d738416b74fb180376cf59cc7ec8f",
        "New York": "9819bf0148e54f89adb255aa7bead635",
        "Texas": "fc77e3a1ab36487f9646d14f7242dd77",
        "Washington": "de9b48948ef8421db97ddf4ea206e931"
        // Other states omitted for brevity, but would be included in a full implementation
    };

    // Check if state exists in our mapping
    if (!stateMap[stateName]) {
        console.error(`State "${stateName}" not found in available options`);
        console.log(`Available states include: Alabama, Alaska, California, Massachusetts, New York, etc.`);
        return false;
    }

    const stateValue = stateMap[stateName];

    try {
        // Method 1: Find option by data-value attribute and click it
        const option = document.querySelector(`[data-value="${stateValue}"]`);
        if (option) {
            console.log(`Found state option with value "${stateValue}"`);

            // Highlight that we're clicking this option
            option.style.backgroundColor = "rgba(25, 112, 199, 0.2)";
            await new Promise(resolve => setTimeout(resolve, 300));

            // Click the option
            option.click();
            console.log(`Selected state: ${stateName}`);
            return true;
        }

        // Method 2: Try with ID
        const optionById = document.getElementById(stateValue);
        if (optionById) {
            console.log(`Found state element by ID "${stateValue}"`);
            optionById.click();
            console.log(`Selected state by ID: ${stateName}`);
            return true;
        }

        // Method 3: Find the hidden input and force value change
        const hiddenInput = document.querySelector('#address--countryRegion + input[type="text"]');
        if (hiddenInput) {
            console.log('Setting state value directly on hidden input');

            // Get the React props key
            const reactPropsKey = Object.keys(hiddenInput).find(key =>
                key.startsWith('__reactProps$') || key.startsWith('__reactEventHandlers$')
            );

            if (reactPropsKey && hiddenInput[reactPropsKey].onChange) {
                // Create a synthetic React event
                const syntheticEvent = {
                    target: {
                        value: stateValue,
                        name: hiddenInput.name || 'countryRegion'
                    },
                    currentTarget: hiddenInput,
                    bubbles: true,
                    preventDefault: () => {},
                    stopPropagation: () => {}
                };

                // Call React's onChange handler
                hiddenInput[reactPropsKey].onChange(syntheticEvent);
                console.log(`Set state through React onChange: ${stateName}`);

                // Also set the DOM value for good measure
                hiddenInput.value = stateValue;
                return true;
            }
        }

        console.error('All methods failed to select the state');
        return false;

    } catch (error) {
        console.error('Error selecting state:', error);
        return false;
    }
}

// Example usage: Select Massachusetts
selectStateDropdownOption('Massachusetts');
