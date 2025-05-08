/**
 * Script to handle phone fields in athenaHealth application form
 * - Selects phone type (Mobile, Fax, etc.)
 * - Fills in phone number
 */
async function handlePhoneFields(phoneType = "Mobile", phoneNumber = "5555551234") {
    console.log(`Setting up phone information: ${phoneType} ${phoneNumber}`);

    // Step 1: Map of phone types to their data values
    const phoneTypeMap = {
        "Fax": "4578467d319e448eba3c755230ecdbba",
        "Mobile": "73218721052a4ce78cf10986b40b54d8",
        "Pager": "2ce42057215546228517e8f7b7e9628c",
        "Telephone": "72dc0213b7234c7896550de6a8653bf3"
    };

    // Verify the requested phone type exists
    if (!phoneTypeMap[phoneType]) {
        console.error(`Phone type "${phoneType}" not found in available options`);
        console.log(`Available options: ${Object.keys(phoneTypeMap).join(', ')}`);
        return false;
    }

    // Wait function
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    try {
        // Step 2: Click phone type dropdown to open it
        console.log(`Opening phone type dropdown...`);
        const phoneTypeButton = document.querySelector('#phoneNumber--phoneType');
        if (!phoneTypeButton) {
            console.error('Phone type dropdown button not found');
            return false;
        }

        phoneTypeButton.click();
        await wait(800);

        // Step 3: Find and click the matching option
        const optionValue = phoneTypeMap[phoneType];
        console.log(`Looking for phone type option with value: ${optionValue}`);

        const option = document.querySelector(`[data-value="${optionValue}"]`);
        if (option) {
            console.log(`Found option for "${phoneType}", clicking it...`);
            option.click();
            await wait(500);
        } else {
            // Try finding by ID
            const optionById = document.getElementById(optionValue);
            if (optionById) {
                console.log(`Found option by ID for "${phoneType}", clicking it...`);
                optionById.click();
                await wait(500);
            } else {
                console.error(`Could not find option for phone type: ${phoneType}`);
                return false;
            }
        }

        // Step 4: Fill phone number field
        console.log(`Filling phone number: ${phoneNumber}`);
        const phoneInput = document.querySelector('#phoneNumber--phoneNumber');
        if (!phoneInput) {
            console.error('Phone number input field not found');
            return false;
        }

        // Focus and clear the field
        phoneInput.focus();
        phoneInput.value = '';
        await wait(100);

        // Type the phone number
        for (let i = 0; i < phoneNumber.length; i++) {
            phoneInput.value += phoneNumber[i];
            phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
            await wait(30 + Math.random() * 30); // Random delay for natural typing
        }

        // Trigger React change event
        phoneInput.dispatchEvent(new Event('change', { bubbles: true }));

        console.log('✅ Phone information set successfully!');
        return true;

    } catch (error) {
        console.error('Error setting phone information:', error);
        return false;
    }
}

// Execute the function with Mobile and sample phone number
handlePhoneFields("Mobile", "5555551234");
