/**
 * Education Section Form Automation for athenaHealth Job Application
 * Updated: April 2025
 *
 * This comprehensive version finds the education section, clicks the Add button,
 * and properly fills all form fields including date inputs.
 */

// User education data to fill in
const educationData = {
    schoolName: "University of Technology",
    degree: "Masters",
    fieldOfStudy: "Computer Science",
    startYear: "2018",
    endYear: "2020"
};

// Utility functions for form automation
const educationFormFiller = {
    // Wait for specified milliseconds
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    // Wait for an element to appear with timeout
    waitForElement: async function(selector, timeoutMs = 5000) {
        console.log(`Waiting for element: ${selector}`);
        const startTime = Date.now();

        while (Date.now() - startTime < timeoutMs) {
            const element = document.querySelector(selector);
            if (element) {
                console.log(`Found element: ${selector}`);
                return element;
            }
            await this.delay(100);
        }

        console.error(`Timeout waiting for element: ${selector}`);
        return null;
    },

    // Find and focus on the education section
    findEducationSection: async function() {
        console.log('Looking for Education section...');

        // Find by section header
        const educationHeader = document.querySelector('h3#Education-section');
        if (educationHeader) {
            console.log('Found Education section by header ID');
            educationHeader.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await this.delay(500);
            return true;
        }

        // Try by text content
        const headers = Array.from(document.querySelectorAll('h2, h3'));
        const educationHeading = headers.find(h => h.textContent.trim() === 'Education');

        if (educationHeading) {
            console.log('Found Education section by heading text');
            educationHeading.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await this.delay(500);
            return true;
        }

        console.error('Could not find Education section');
        return false;
    },

    // Click the Add button in the Education section
    clickAddButton: async function() {
        console.log('Looking for Add button in Education section...');

        // Find the education section container
        const educationSection = document.querySelector('[role="group"][aria-labelledby="Education-section"]');

        if (!educationSection) {
            console.error('Education section container not found');
            // Try to find any Add button as fallback
            const anyAddButton = document.querySelector('[data-automation-id="add-button"]');
            if (anyAddButton) {
                console.log('Using fallback: clicking any Add button found');
                anyAddButton.click();
                return true;
            }
            return false;
        }

        // Find Add button within the education section
        const addButton = educationSection.querySelector('[data-automation-id="add-button"]');

        if (!addButton) {
            console.error('Add button not found in Education section');
            return false;
        }

        console.log('Found Add button, clicking...');
        addButton.click();
        await this.delay(2000); // Longer delay to ensure form appears
        return true;
    },

    // Get the correct education ID prefix (dynamic)
    getFormPrefix: function() {
        // Find the education section and extract the ID number
        const schoolInput = document.querySelector('[id^="education-"][id$="--schoolName"]');
        if (!schoolInput) {
            console.error('Could not find school input to determine form prefix');
            return 'education-17--'; // Fallback based on observed pattern
        }
        return schoolInput.id.split('--')[0] + '--';
    },

    // Fill standard text input field with fallback options
    fillTextField: async function(fieldName, value) {
        // Try using the direct prefix approach first
        const prefix = this.getFormPrefix();
        const selector = `#${prefix}${fieldName}`;
        console.log(`Attempting to fill: ${selector} with "${value}"`);

        let input = document.querySelector(selector);

        // If direct approach fails, try flexible selectors
        if (!input) {
            console.log(`Direct selector not found, trying alternatives for ${fieldName}`);

            // Try multiple selector variations to find the input
            const selectors = [
                `[id$="--${fieldName}"]`,
                `[data-automation-id="${fieldName}"]`,
                `[name="${fieldName}"]`,
                `input[aria-label*="${fieldName}" i]`
            ];

            // Try each selector pattern
            for (const selectorPattern of selectors) {
                input = document.querySelector(selectorPattern);
                if (input) {
                    console.log(`Found ${fieldName} using alternative selector: ${selectorPattern}`);
                    break;
                }
            }

            // If still not found, wait for it to appear
            if (!input) {
                console.log(`Input not found for ${fieldName}, waiting...`);
                input = await this.waitForElement(`[id$="--${fieldName}"]`, 3000);
            }
        }

        if (!input) {
            console.error(`Input field not found for ${fieldName} after all attempts`);
            return false;
        }

        try {
            console.log(`Found ${fieldName} element:`, input.id || input.name);

            // Focus the field
            input.focus();
            await this.delay(100);

            // Clear any existing value
            input.value = '';

            // Set value and trigger events
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('blur', { bubbles: true }));

            await this.delay(200);
            return true;
        } catch (error) {
            console.error(`Error filling field ${fieldName}:`, error);
            return false;
        }
    },

    // Fill year field for education dates with improved error handling
    fillYearField: async function(fieldName, year) {
        console.log(`Setting ${fieldName} to ${year}`);

        // First try direct ID approach
        const prefix = this.getFormPrefix();
        const yearInputId = `${prefix}${fieldName}-dateSectionYear-input`;
        let yearInput = document.querySelector(`#${yearInputId}`);

        // If not found, try alternative selectors
        if (!yearInput) {
            // Try various patterns to find the year input
            const selectors = [
                `[id*="${fieldName}"][id*="Year"]`,
                `[id*="${fieldName}-date"]`,
                `[aria-label*="${fieldName}" i][aria-label*="year" i]`,
                `input[id*="${fieldName}"]`
            ];

            // Try each selector
            for (const selector of selectors) {
                yearInput = document.querySelector(selector);
                if (yearInput) {
                    console.log(`Found year input using alternative selector: ${selector}`);
                    break;
                }
            }

            // If still not found, wait for it
            if (!yearInput) {
                console.log(`Year input not found for ${fieldName}, waiting...`);
                yearInput = await this.waitForElement(`[id*="${fieldName}"][id*="Year"]`, 3000);
            }
        }

        if (!yearInput) {
            console.error(`Year input not found for ${fieldName} after all attempts`);
            return false;
        }

        try {
            console.log(`Found year input: ${yearInput.id || yearInput.name}`);

            // Focus and fill year field
            yearInput.focus();
            yearInput.value = year;
            yearInput.dispatchEvent(new Event('input', { bubbles: true }));
            yearInput.dispatchEvent(new Event('change', { bubbles: true }));
            yearInput.dispatchEvent(new Event('blur', { bubbles: true }));

            // Try to update display value if it exists
            try {
                const yearDisplay = document.querySelector(`#${prefix}${fieldName}-dateSectionYear-display`);
                if (yearDisplay) {
                    yearDisplay.textContent = year;
                }
            } catch (e) {
                // Ignore errors updating display
            }

            await this.delay(300);
            return true;
        } catch (error) {
            console.error(`Error filling year field ${fieldName}:`, error);
            return false;
        }
    },

    // Select option from degree dropdown with comprehensive approach
    selectDegree: async function(degreeName) {
        console.log(`Attempting to select degree: ${degreeName}`);

        // First try direct approach
        const prefix = this.getFormPrefix();
        const selector = `#${prefix}degree`;
        let dropdown = document.querySelector(selector);

        // If not found, try alternative selectors
        if (!dropdown) {
            const dropdownSelectors = [
                'button[aria-haspopup="listbox"]',
                '[role="combobox"]',
                '[id$="--degree"]'
            ];

            for (const altSelector of dropdownSelectors) {
                dropdown = document.querySelector(altSelector);
                if (dropdown) {
                    console.log(`Found degree dropdown using alternative selector: ${altSelector}`);
                    break;
                }
            }

            // If still not found, wait for it
            if (!dropdown) {
                console.log('Dropdown not immediately found, waiting...');
                dropdown = await this.waitForElement('button[aria-haspopup="listbox"]', 3000);
            }
        }

        if (!dropdown) {
            console.error('Degree dropdown element not found after all attempts');
            return false;
        }

        // Click to open dropdown
        dropdown.click();
        console.log('Clicked dropdown to open options');
        await this.delay(1000); // Increased delay to ensure dropdown opens fully

        // Target the specific dropdown list element that contains the options
        const dropdownList = await this.waitForElement('ul[role="listbox"]', 3000);
        if (!dropdownList) {
            console.error('Could not find dropdown list container');
            return false;
        }

        // Look for degree options within this specific dropdown list
        const options = dropdownList.querySelectorAll('li[role="option"]');
        console.log(`Found ${options.length} dropdown options`);

        // For debugging, output all available options
        options.forEach(option => {
            const optionText = option.textContent.trim();
            const dataValue = option.getAttribute('data-value');
            console.log(`Option available: "${optionText}" with value: ${dataValue}`);
        });

        // Try to find our target option using various strategies

        // Strategy 1: Exact match
        for (const option of options) {
            const optionText = option.textContent.trim();
            if (optionText === degreeName) {
                console.log(`Found exact match: ${optionText}`);
                option.click();
                await this.delay(500);
                return true;
            }
        }

        // Strategy 2: Partial match
        for (const option of options) {
            const optionText = option.textContent.trim();
            if (optionText.includes(degreeName) ||
                (degreeName === "Masters" && optionText.includes("Master")) ||
                (degreeName.includes("Master") && optionText.includes("Master"))) {

                console.log(`Found related option: ${optionText}`);
                option.click();
                await this.delay(500);
                return true;
            }
        }

        // Strategy 3: Try looking for data-value
        if (degreeName === "Masters") {
            const mastersOption = dropdownList.querySelector('li[data-value="c7696be64aee407c81e913565ea97820"]');
            if (mastersOption) {
                console.log(`Found Masters option by data-value`);
                mastersOption.click();
                await this.delay(500);
                return true;
            }
        }

        // Strategy 4: Last resort - click option at common index
        if (options.length > 0) {
            const lastResortIndex = 7; // Masters is often the 8th option (index 7)
            if (options.length > lastResortIndex) {
                console.log(`Last resort: Trying option at index ${lastResortIndex}`);
                options[lastResortIndex].click();
                await this.delay(500);
                return true;
            }
        }

        console.error(`Could not find option matching "${degreeName}"`);
        document.body.click(); // Close dropdown
        return false;
    }
};

// Main function to fill education form
async function fillEducationForm() {
    try {
        console.log('Starting education form automation...');

        // Find and focus on the education section
        const foundSection = await educationFormFiller.findEducationSection();
        if (!foundSection) {
            throw new Error('Could not locate Education section');
        }

        // Click the Add button to display the form
        const addButtonClicked = await educationFormFiller.clickAddButton();
        if (!addButtonClicked) {
            throw new Error('Could not click Add button to display the form');
        }

        // Wait for the form to appear - longer delay
        await educationFormFiller.delay(2000);

        // Fill School Name (required)
        await educationFormFiller.fillTextField('schoolName', educationData.schoolName);

        // Select Degree from dropdown
        await educationFormFiller.selectDegree(educationData.degree);

        // Fill Field of Study
        await educationFormFiller.fillTextField('fieldOfStudy', educationData.fieldOfStudy);

        // Education dates - only use years
        await educationFormFiller.fillYearField('firstYearAttended', educationData.startYear);
        await educationFormFiller.fillYearField('lastYearAttended', educationData.endYear);

        console.log('✅ Education form filled successfully!');
        console.log('Please review the information and click the Continue button when ready.');

    } catch (error) {
        console.error('❌ Error filling education form:', error);
        console.log('Please fill in the remaining fields manually.');
    }
}

// Run the form filler
fillEducationForm();
