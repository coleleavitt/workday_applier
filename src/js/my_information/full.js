/**
 * full.js - Complete athenaHealth Job Application Form Automator
 * Works with the April 2025 version of the athenaHealth application portal
 */

// Configuration with user information for form filling
const userData = {
    // Personal Info
    source: "Indeed",              // How Did You Hear About Us?
    previousWorker: false,         // Have previously worked at athenahealth?
    firstName: "Cole",             // First Name
    lastName: "Developer",         // Last Name
    phoneType: "Mobile",           // Phone Device Type
    phoneNumber: "(520) 870-0922", // Phone number in parentheses format

    // Address Info
    addressLine1: "123 Main Street",
    city: "Tucson",
    state: "Arizona",
    stateDataValue: "c7b20b0d4bc04711a00900569e9afabd", // Arizona's specific data-value
    postalCode: "85701"
};

// Main form automation utilities
const formAutomation = {
    // Delay helper function
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    // Fill text input with proper React event handling
    async fillReactInput(selector, value) {
        console.log(`Filling field: ${selector} with "${value}"`);

        const input = document.querySelector(selector);
        if (!input) {
            console.error(`Field not found: ${selector}`);
            return false;
        }

        try {
            // Focus on the input field
            input.focus();
            await this.delay(100);

            // Clear existing value
            input.value = '';

            // Get React props key
            const reactProps = Object.keys(input).find(k => k.startsWith('__reactProps$'));

            if (reactProps && input[reactProps].onInput) {
                // Set value
                input.value = value;

                // Create React synthetic event
                const event = {
                    target: input,
                    currentTarget: input,
                    value: value,
                    bubbles: true,
                    preventDefault: () => {},
                    stopPropagation: () => {},
                    persist: () => {},
                    nativeEvent: new InputEvent('input')
                };

                // Trigger React's onInput handler
                input[reactProps].onInput(event);

                // Also trigger blur to complete the input
                if (input[reactProps].onBlur) {
                    await this.delay(150);
                    input[reactProps].onBlur(event);
                }

                return true;
            } else {
                // Fallback to standard DOM manipulation
                input.value = value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new Event('blur', { bubbles: true }));

                return true;
            }
        } catch (error) {
            console.error(`Error filling ${selector}:`, error);
            return false;
        }
    },

    // Enhanced dropdown selection with data-value support
    async selectDropdownOption(selector, optionText, dataValue = null) {
        console.log(`Selecting "${optionText}" from dropdown: ${selector}`);

        // Find and click the dropdown button to open options
        const dropdownButton = document.querySelector(selector);
        if (!dropdownButton) {
            console.error(`Dropdown not found: ${selector}`);
            return false;
        }

        // Click to open dropdown
        dropdownButton.click();
        await this.delay(800);

        // Find all options in the opened dropdown
        const options = Array.from(document.querySelectorAll('[role="option"]'));
        console.log(`Found ${options.length} options`);

        let targetOption;

        // First try by data-value if provided
        if (dataValue) {
            targetOption = options.find(opt => opt.getAttribute('data-value') === dataValue);
            if (targetOption) {
                console.log(`Found option by data-value: ${dataValue}`);
            }
        }

        // If no data-value match, try by text content
        if (!targetOption) {
            targetOption = options.find(opt =>
                opt.textContent.includes(optionText) ||
                opt.querySelector('div')?.textContent.includes(optionText)
            );
        }

        if (targetOption) {
            console.log(`Clicking option: ${targetOption.textContent.trim()}`);
            targetOption.click();
            await this.delay(500);
            return true;
        }

        // Close dropdown by clicking elsewhere if option not found
        document.body.click();
        console.error(`Option "${optionText}" not found in dropdown`);
        return false;
    },

    // Select radio button
    async selectRadioButton(value) {
        console.log(`Selecting radio button with value: ${value}`);

        // Find radio input with matching value
        const radioSelector = value === "true"
            ? 'input[name="candidateIsPreviousWorker"][value="true"]'
            : 'input[name="candidateIsPreviousWorker"][value="false"]';

        const radio = document.querySelector(radioSelector);

        if (!radio) {
            // Try finding by ID (IDs might be dynamic)
            const radioButtons = document.querySelectorAll('input[type="radio"][name="candidateIsPreviousWorker"]');
            const targetRadio = Array.from(radioButtons).find(r => r.value === value);

            if (targetRadio) {
                targetRadio.click();
                await this.delay(300);
                return true;
            }

            console.error(`Radio button with value ${value} not found`);
            return false;
        }

        radio.click();
        await this.delay(300);
        return true;
    },

    // Click the submit/next button
    async clickSubmitButton() {
        console.log("Looking for submit button...");

        // Try multiple selectors to find the button
        const buttonSelectors = [
            '[data-automation-id="pageFooterNextButton"]',
            '.css-1axl4gh',
            'button[aria-label*="Continue"]',
            'button[data-automation-id*="next"]'
        ];

        for (const selector of buttonSelectors) {
            const button = document.querySelector(selector);
            if (button) {
                console.log(`Found submit button using selector: ${selector}`);
                button.click();
                return true;
            }
        }

        // Try finding by text content
        const allButtons = Array.from(document.querySelectorAll('button'));
        const submitButton = allButtons.find(btn =>
            btn.textContent.includes('Save and Continue') ||
            btn.textContent.includes('Next') ||
            btn.textContent.includes('Continue')
        );

        if (submitButton) {
            console.log(`Found submit button by text: ${submitButton.textContent}`);
            submitButton.click();
            return true;
        }

        console.error("Submit button not found");
        return false;
    },

    // Fill address section fields
    async fillAddressSection() {
        console.log("=== Filling Address Section ===");

        // Find and scroll to address section
        const addressHeader = document.querySelector('h3#Address-section');
        if (addressHeader) {
            addressHeader.scrollIntoView({ behavior: 'smooth' });
            await this.delay(500);
        }

        // Fill Address Line 1
        let addressLine1Filled = false;
        for (let attempt = 1; attempt <= 3 && !addressLine1Filled; attempt++) {
            console.log(`Attempt ${attempt} to fill address line 1`);
            addressLine1Filled = await this.fillReactInput('#address--addressLine1', userData.addressLine1);
            if (!addressLine1Filled) await this.delay(500);
        }

        // Fill City
        let cityFilled = false;
        for (let attempt = 1; attempt <= 3 && !cityFilled; attempt++) {
            console.log(`Attempt ${attempt} to fill city`);
            cityFilled = await this.fillReactInput('#address--city', userData.city);
            if (!cityFilled) await this.delay(500);
        }

        // Select State (using data-value)
        let stateSelected = false;
        for (let attempt = 1; attempt <= 3 && !stateSelected; attempt++) {
            console.log(`Attempt ${attempt} to select state`);
            stateSelected = await this.selectDropdownOption(
                '#address--countryRegion',
                userData.state,
                userData.stateDataValue
            );
            if (!stateSelected) await this.delay(500);
        }

        // Fill Postal Code
        let postalCodeFilled = false;
        for (let attempt = 1; attempt <= 3 && !postalCodeFilled; attempt++) {
            console.log(`Attempt ${attempt} to fill postal code`);
            postalCodeFilled = await this.fillReactInput('#address--postalCode', userData.postalCode);
            if (!postalCodeFilled) await this.delay(500);
        }

        console.log("✅ Address section completed");
        return true;
    },

    // Helper methods for personal information section
    async handleSourceSelection() {
        let sourceSelected = false;
        for (let attempt = 1; attempt <= 3 && !sourceSelected; attempt++) {
            console.log(`Attempt ${attempt} to select source`);
            sourceSelected = await this.selectDropdownOption('#source--source', userData.source);
            if (!sourceSelected) await this.delay(500);
        }
        return sourceSelected;
    },

    async handlePreviousWorkerStatus() {
        let radioSelected = false;
        for (let attempt = 1; attempt <= 3 && !radioSelected; attempt++) {
            console.log(`Attempt ${attempt} to select previous worker status`);
            radioSelected = await this.selectRadioButton(userData.previousWorker ? "true" : "false");
            if (!radioSelected) await this.delay(500);
        }
        return radioSelected;
    },

    async fillNameFields() {
        // Fill First Name
        let firstNameFilled = false;
        for (let attempt = 1; attempt <= 3 && !firstNameFilled; attempt++) {
            console.log(`Attempt ${attempt} to fill first name`);
            firstNameFilled = await this.fillReactInput('#name--legalName--firstName', userData.firstName);
            if (!firstNameFilled) await this.delay(500);
        }

        // Fill Last Name
        let lastNameFilled = false;
        for (let attempt = 1; attempt <= 3 && !lastNameFilled; attempt++) {
            console.log(`Attempt ${attempt} to fill last name`);
            lastNameFilled = await this.fillReactInput('#name--legalName--lastName', userData.lastName);
            if (!lastNameFilled) await this.delay(500);
        }

        return firstNameFilled && lastNameFilled;
    },

    async handlePhoneInfo() {
        // Select Phone Type
        let phoneTypeSelected = false;
        for (let attempt = 1; attempt <= 3 && !phoneTypeSelected; attempt++) {
            console.log(`Attempt ${attempt} to select phone type`);
            phoneTypeSelected = await this.selectDropdownOption('#phoneNumber--phoneType', userData.phoneType);
            if (!phoneTypeSelected) await this.delay(500);
        }

        // Fill Phone Number
        let phoneNumberFilled = false;
        for (let attempt = 1; attempt <= 3 && !phoneNumberFilled; attempt++) {
            console.log(`Attempt ${attempt} to fill phone number`);
            phoneNumberFilled = await this.fillReactInput('#phoneNumber--phoneNumber', userData.phoneNumber);
            if (!phoneNumberFilled) await this.delay(500);
        }

        return phoneTypeSelected && phoneNumberFilled;
    }
};

// Main function to fill the entire form
async function fillApplicationForm() {
    try {
        console.log("🚀 Starting athenaHealth application form automation...");

        // Wait for form to fully load
        await formAutomation.delay(2000);

        // 1. Fill personal information section
        await formAutomation.handleSourceSelection();
        await formAutomation.handlePreviousWorkerStatus();
        await formAutomation.fillNameFields();
        await formAutomation.handlePhoneInfo();

        // 2. Submit first page and wait for address section
        console.log("✅ Personal information completed, submitting first page...");
        await formAutomation.clickSubmitButton();
        await formAutomation.delay(3000); // Wait for next page to load

        // 3. Fill address section
        await formAutomation.fillAddressSection();

        // 4. Submit address form
        console.log("✅ All required fields completed, submitting form...");
        await formAutomation.delay(500);
        await formAutomation.clickSubmitButton();

        console.log("✅ Form submitted successfully!");
        return true;
    } catch (error) {
        console.error("❌ Error filling application form:", error);
        return false;
    }
}

// Run the form automator with a slight delay to ensure page is fully loaded
console.log("Form automation initialized, starting in 2 seconds...");
setTimeout(() => fillApplicationForm(), 2000);
