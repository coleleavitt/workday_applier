/**
 * Work Experience Form Automation for athenaHealth Job Application
 * For: Lead Linux Systems Engineer- Load Balancing position
 * Updated: April 2025
 */

// User work experience data to fill in
const experienceData = {
    jobTitle: "Lead Linux Systems Engineer",
    company: "XYZ Technologies",
    location: "Remote",
    currentlyWorkHere: false,
    startDate: {
        month: "01",
        year: "2020"
    },
    endDate: {
        month: "03",
        year: "2025"
    },
    roleDescription: "• Managed enterprise-scale load balancing infrastructure using Citrix NetScaler\n• Administered Linux systems supporting critical healthcare applications\n• Implemented automation solutions using Terraform, Consul, and Python\n• Maintained 99.99% uptime across all production environments\n• Led team of 3 junior engineers in global load balancing optimization\n• Designed and implemented disaster recovery solutions for AWS-hosted services",
    // New function to click the Add button
    async clickAddButton() {
        console.log('Looking for Add button...');
        const addButton = document.querySelector('[data-automation-id="add-button"]');
        if (!addButton) {
            console.error('Add button not found');
            return false;
        }
        console.log('Clicking Add button...');
        addButton.click();
        await this.delay(1000); // Wait for form to appear
        return true;
    },
};


// Utility functions for form automation
const experienceFormFiller = {
    // Wait for specified milliseconds
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    // Get the correct work experience ID prefix (dynamic)
    getFormPrefix() {
        // Find the work experience section and extract the ID number
        const jobTitleInput = document.querySelector('[id^="workExperience-"][id$="--jobTitle"]');
        if (!jobTitleInput) {
            console.error('Could not find job title input to determine form prefix');
            return 'workExperience-6--'; // Default fallback
        }
        return jobTitleInput.id.split('--')[0] + '--';
    },

    // Fill standard text input field
    async fillTextField(fieldName, value) {
        const prefix = this.getFormPrefix();
        const selector = `#${prefix}${fieldName}`;
        console.log(`Filling text field: ${selector} with "${value}"`);

        const input = document.querySelector(selector);
        if (!input) {
            console.error(`Input field not found: ${selector}`);
            return false;
        }

        try {
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
            console.error(`Error filling field ${selector}:`, error);
            return false;
        }
    },

    // Fill textarea field
    async fillTextArea(fieldName, value) {
        const prefix = this.getFormPrefix();
        const selector = `#${prefix}${fieldName}`;
        console.log(`Filling textarea: ${selector}`);

        const textarea = document.querySelector(selector);
        if (!textarea) {
            console.error(`Textarea not found: ${selector}`);
            return false;
        }

        try {
            textarea.focus();
            textarea.value = value;

            // Trigger standard events
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
            textarea.dispatchEvent(new Event('blur', { bubbles: true }));

            await this.delay(200);
            return true;
        } catch (error) {
            console.error(`Error filling textarea ${selector}:`, error);
            return false;
        }
    },

    // Set checkbox state
    async setCheckbox(fieldName, checked) {
        const prefix = this.getFormPrefix();
        const selector = `#${prefix}${fieldName}`;
        console.log(`Setting checkbox ${selector} to ${checked}`);

        const checkbox = document.querySelector(selector);
        if (!checkbox) {
            console.error(`Checkbox not found: ${selector}`);
            return false;
        }

        try {
            // Only change if needed
            if ((checkbox.checked && !checked) || (!checkbox.checked && checked)) {
                checkbox.click(); // Use click instead of setting checked directly
            }

            await this.delay(200);
            return true;
        } catch (error) {
            console.error(`Error setting checkbox ${selector}:`, error);
            return false;
        }
    },

    // Handle date picker fields (month/year)
    async fillDateField(fieldName, month, year) {
        const prefix = this.getFormPrefix();
        const baseId = `${prefix}${fieldName}`;
        console.log(`Setting date field ${baseId} to ${month}/${year}`);

        try {
            // Get the month input
            let monthInput = document.querySelector(`#${baseId}-dateSectionMonth-input`);
            if (!monthInput) {
                console.error(`Month input not found: #${baseId}-dateSectionMonth-input`);

                // Try to find it without the prefix pattern
                const alternateMonthInput = document.querySelector(`[id$="-dateSectionMonth-input"][id*="${fieldName}"]`);
                if (!alternateMonthInput) {
                    return false;
                }
                console.log(`Found alternate month input: ${alternateMonthInput.id}`);
                monthInput = alternateMonthInput;
            }

            // Get the year input
            let yearInput = document.querySelector(`#${baseId}-dateSectionYear-input`);
            if (!yearInput) {
                console.error(`Year input not found: #${baseId}-dateSectionYear-input`);

                // Try to find it without the prefix pattern
                const alternateYearInput = document.querySelector(`[id$="-dateSectionYear-input"][id*="${fieldName}"]`);
                if (!alternateYearInput) {
                    return false;
                }
                console.log(`Found alternate year input: ${alternateYearInput.id}`);
                yearInput = alternateYearInput;
            }

            // Fill month field
            monthInput.focus();
            monthInput.value = month;
            monthInput.dispatchEvent(new Event('input', { bubbles: true }));
            monthInput.dispatchEvent(new Event('change', { bubbles: true }));
            await this.delay(300);

            // Fill year field
            yearInput.focus();
            yearInput.value = year;
            yearInput.dispatchEvent(new Event('input', { bubbles: true }));
            yearInput.dispatchEvent(new Event('change', { bubbles: true }));

            // Try to update the display values for month/year
            const monthDisplay = document.querySelector(`#${baseId}-dateSectionMonth-display`);
            const yearDisplay = document.querySelector(`#${baseId}-dateSectionYear-display`);

            if (monthDisplay) {
                monthDisplay.textContent = month;
            }

            if (yearDisplay) {
                yearDisplay.textContent = year;
            }

            await this.delay(300);
            return true;
        } catch (error) {
            console.error(`Error filling date field ${fieldName}:`, error);
            return false;
        }
    },

    // Handle file upload
    async uploadResume() {
        console.log('Attempting to upload resume...');
        const fileInput = document.querySelector('input[type="file"]');

        if (!fileInput) {
            console.error('File upload input not found');
            return false;
        }

        // Note: actual file upload requires user interaction due to security restrictions
        // This just highlights the file upload area to prompt the user
        const dropZone = document.querySelector('[data-automation-id="file-upload-drop-zone"]');
        if (dropZone) {
            dropZone.style.boxShadow = '0 0 10px 2px #0875e1';
            console.log('Please manually select your resume file - automated file upload is restricted');
            await this.delay(2000);
            dropZone.style.boxShadow = '';
        } else {
            console.log('Resume upload area not found. Please manually upload your resume if needed.');
        }

        return true;
    },

    // Click button with given automation-id
    async clickButton(automationId) {
        const button = document.querySelector(`[data-automation-id="${automationId}"]`);
        if (!button) {
            console.error(`Button with automation-id "${automationId}" not found`);
            return false;
        }

        console.log(`Clicking button: ${automationId}`);
        button.click();
        await this.delay(300);
        return true;
    }
};

// Main function to fill work experience form
async function fillWorkExperienceForm() {
    try {
        console.log('Starting to fill work experience section...');
        await experienceFormFiller.delay(1000);

        // Get form prefix for dynamic ID targeting
        const prefix = experienceFormFiller.getFormPrefix();
        console.log(`Detected form prefix: ${prefix}`);

        // Fill Job Title (required)
        await experienceFormFiller.fillTextField('jobTitle', experienceData.jobTitle);

        // Fill Company (required)
        await experienceFormFiller.fillTextField('companyName', experienceData.company);

        // Fill Location (optional)
        if (experienceData.location) {
            await experienceFormFiller.fillTextField('location', experienceData.location);
        }

        // Set "Currently work here" checkbox if needed
        await experienceFormFiller.setCheckbox('currentlyWorkHere', experienceData.currentlyWorkHere);

        // Fill start date (MM/YYYY)
        await experienceFormFiller.fillDateField('startDate',
            experienceData.startDate.month,
            experienceData.startDate.year);

        // Fill end date (MM/YYYY) - only if not currently working there
        if (!experienceData.currentlyWorkHere) {
            await experienceFormFiller.fillDateField('endDate',
                experienceData.endDate.month,
                experienceData.endDate.year);
        }

        // Fill Role Description (optional)
        if (experienceData.roleDescription) {
            await experienceFormFiller.fillTextArea('roleDescription', experienceData.roleDescription);
        }

        // Prompt to upload resume
        await experienceFormFiller.uploadResume();

        console.log('✅ Work experience form filled successfully!');
        console.log('Please review the information and click the Continue button when ready.');

    } catch (error) {
        console.error('❌ Error filling work experience form:', error);
        console.log('Please fill in the remaining fields manually.');
    }
}

// Run the form filler
fillWorkExperienceForm();
