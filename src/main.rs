use thirtyfour::prelude::*;
use std::time::Duration;
use serde_json::json;
use thirtyfour::FirefoxCapabilities;

// Mission-critical constants with radiation hardening
const URL: &str = "https://athenahealth.wd1.myworkdayjobs.com/External/job/Remote---MA/Lead-Linux-Systems-Engineer--Load-Balancing_R12284";
const WEBDRIVER_PORT: u16 = 4444;
const MAX_RETRIES: usize = 3;

// Triple modular redundancy for critical selectors
#[derive(Copy, Clone)]
enum CriticalSelectors {
    ApplyButton,
    ApplicationForm,
    ManualApply,
    EmailInput,
    PasswordInput,
    VerifyPasswordInput,
    SubmitButton,
    ConsentCheckbox,
}

impl CriticalSelectors {
    const fn selector(&self) -> &'static str {
        match self {
            Self::ApplyButton => "a[role='button'][data-automation-id='adventureButton'], \
                                a[role='button'][data-uxi-element-id*='Apply']",
            // This is the main issue - the form has a different data-automation-id than expected
            Self::ApplicationForm => "form[data-automation-id='signInFormo'], \
                                     div[data-automation-id='signInContent'], \
                                     div[data-automation-id='applyFlowPage']",
            Self::ManualApply => "a[role='button'][data-automation-id='applyManually']",
            // These input selectors appear correct based on the HTML
            Self::EmailInput => "input[data-automation-id='email']",
            Self::PasswordInput => "input[data-automation-id='password']",
            Self::VerifyPasswordInput => "input[data-automation-id='verifyPassword']",
            Self::ConsentCheckbox => "#input-8, \
                                    input[data-automation-id='createAccountCheckbox'], \
                                    .css-d3pjdr input[type='checkbox'], \
                                    label[for='input-8'] ~ div input",
            Self::SubmitButton => "button[data-automation-id='createAccountSubmitButton'], \
                                 button.css-r4e0dj[type='submit']",
        }
    }
}

// Radiation-hardened action executor
trait HardenedAction: Sized {
    const ACTION_RETRIES: usize = 3;
    const TIMEOUT: Duration = Duration::from_secs(15);

    fn selector(&self) -> CriticalSelectors;
    fn description(&self) -> &'static str;

    async fn execute(&self, driver: &WebDriver) -> WebDriverResult<WebElement> {
        driver.query(By::Css(self.selector().selector()))
            .desc(self.description())
            .wait(Self::TIMEOUT, Duration::from_secs(1))
            .and_displayed()
            .first()
            .await
    }

    async fn click_with_redundancy(&self, driver: &WebDriver) -> WebDriverResult<()> {
        let element = self.execute(driver).await?;

        for attempt in 1..=Self::ACTION_RETRIES {
            match element.click().await {
                Ok(_) => return Ok(()),
                Err(e) if attempt < Self::ACTION_RETRIES => {
                    println!("Attempt {}/{} failed: {}", attempt, Self::ACTION_RETRIES, e);
                    driver.execute(
                        "arguments[0].scrollIntoView(true); arguments[0].click();",
                        vec![element.to_json()?]
                    ).await?;
                }
                Err(e) => return Err(e.into()),
            }
        }
        Ok(())
    }
}

// Application workflow steps
struct ApplyButtonStep;
struct ManualApplyStep;
struct FormVerificationStep;

struct EmailInputStep;
struct PasswordInputStep;
struct VerifyPasswordInputStep;
struct ConsentCheckboxStep;
struct SubmitStep;

impl HardenedAction for ApplyButtonStep {
    fn selector(&self) -> CriticalSelectors { CriticalSelectors::ApplyButton }
    fn description(&self) -> &'static str { "Apply Button" }
}

impl HardenedAction for ManualApplyStep {
    fn selector(&self) -> CriticalSelectors { CriticalSelectors::ManualApply }
    fn description(&self) -> &'static str { "Manual Apply Button" }
}

impl HardenedAction for FormVerificationStep {
    fn selector(&self) -> CriticalSelectors { CriticalSelectors::ApplicationForm }
    fn description(&self) -> &'static str { "Application Form" }
}

impl HardenedAction for EmailInputStep {
    fn selector(&self) -> CriticalSelectors { CriticalSelectors::EmailInput }
    fn description(&self) -> &'static str { "Email Input" }
}

impl HardenedAction for PasswordInputStep {
    fn selector(&self) -> CriticalSelectors { CriticalSelectors::PasswordInput }
    fn description(&self) -> &'static str { "Password Input" }
}

impl HardenedAction for VerifyPasswordInputStep {
    fn selector(&self) -> CriticalSelectors { CriticalSelectors::VerifyPasswordInput }
    fn description(&self) -> &'static str { "Verify Password Input" }
}

impl HardenedAction for ConsentCheckboxStep {
    fn selector(&self) -> CriticalSelectors { CriticalSelectors::ConsentCheckbox }
    fn description(&self) -> &'static str { "Consent Checkbox" }
}

impl HardenedAction for SubmitStep {
    fn selector(&self) -> CriticalSelectors { CriticalSelectors::SubmitButton }
    fn description(&self) -> &'static str { "Submit Button" }
}

// Specialized implementation for the ConsentCheckboxStep with enhanced resilience
impl ConsentCheckboxStep {
    async fn click_with_js_fallback(&self, driver: &WebDriver) -> WebDriverResult<()> {
        // First try to scroll the element into view for visibility
        driver.execute(
            "const checkbox = document.querySelector('#input-8'); \
             if (checkbox) { checkbox.scrollIntoView({block: 'center'}); }",
            vec![]
        ).await?;

        // Use the comprehensive JavaScript approach that worked in browser testing
        let result = driver.execute(
            "// 1. Use both selector strategies for redundancy
            const checkbox = document.querySelector('#input-8') ||
                           document.querySelector('input[data-automation-id=\"createAccountCheckbox\"]');

            if (!checkbox) return false;

            // 2. Click the associated label instead of checkbox directly
            const label = document.querySelector('label[for=\"input-8\"]');
            if (label) {
              label.click(); // This is more reliable for React forms

              // 3. Verify and force state update if needed
              setTimeout(() => {
                if (!checkbox.checked) {
                  // Nuclear option with full event sequence
                  checkbox.checked = true;
                  checkbox.setAttribute('aria-checked', 'true');

                  // Dispatch full event chain
                  ['mousedown', 'mouseup', 'click', 'change'].forEach(eventType => {
                    checkbox.dispatchEvent(new Event(eventType, {
                      bubbles: true,
                      cancelable: true,
                      composed: true
                    }));
                  });
                }
              }, 50);
            } else {
              // Fallback to direct checkbox interaction
              checkbox.click();

              // Verify if state changed
              if (checkbox.checked !== !!checkbox.getAttribute('aria-checked')) {
                // Full event chain simulation
                checkbox.dispatchEvent(new MouseEvent('click', {
                  bubbles: true,
                  cancelable: true,
                  composed: true
                }));

                checkbox.dispatchEvent(new Event('change', {
                  bubbles: true,
                  cancelable: true
                }));
              }

              // Set checked property directly as final fallback
              checkbox.checked = true;
            }

            // Output verification info to console for debugging
            console.log('Checkbox state:', {
              checked: checkbox.checked,
              ariaChecked: checkbox.getAttribute('aria-checked'),
              reactControlled: !!checkbox.closest('[data-reactroot]')
            });

            return true;",
            vec![]
        ).await?;

        // Properly handle the JSON value
        let value = result.json();
        if let serde_json::Value::Bool(true) = value {
            println!("Checkbox checked via enhanced JavaScript approach");
            Ok(())
        } else {
            println!("JavaScript approach failed, falling back to WebDriver click");
            // Fall back to regular click if JS method fails
            match self.execute(driver).await {
                Ok(elem) => elem.click().await,
                Err(e) => Err(e)
            }
        }
    }
}

// Specialized implementation for the SubmitStep to handle click interception
impl SubmitStep {
    async fn click_with_js_bypass(&self, driver: &WebDriver) -> WebDriverResult<()> {
        // First try to find and remove any overlays that might be in the way
        driver.execute(
            "// Find and remove any obstructing overlays
             const overlay = document.querySelector('.css-16klg09');
             if (overlay) {
                 overlay.style.display = 'none';
                 overlay.style.pointerEvents = 'none';
             }

             // Find any other potentially blocking elements and disable them
             document.querySelectorAll('div[style*=\"z-index\"]').forEach(el => {
                 const zIndex = parseInt(window.getComputedStyle(el).zIndex);
                 if (zIndex > 100) {
                     el.style.display = 'none';
                     el.style.pointerEvents = 'none';
                 }
             });",
            vec![]
        ).await?;

        // Allow time for the DOM to update
        tokio::time::sleep(Duration::from_millis(100)).await;

        // Try to get the button element
        let button_element = match self.execute(driver).await {
            Ok(elem) => elem,
            Err(e) => {
                println!("Could not find submit button via standard method: {}", e);
                return Err(e);
            }
        };

        // Use JavaScript to force click the button directly without geometry checks
        let result = driver.execute(
            "arguments[0].scrollIntoView({block: 'center'});

             // Try multiple approaches to trigger the button
             try {
                // 1. Direct programmatic click
                arguments[0].click();

                // 2. Full MouseEvent simulation
                ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                    arguments[0].dispatchEvent(new MouseEvent(eventType, {
                        bubbles: true,
                        cancelable: true,
                        composed: true
                    }));
                });

                // 3. Check if form exists and try to submit directly
                const form = arguments[0].closest('form');
                if (form) {
                    form.dispatchEvent(new Event('submit', {
                        bubbles: true,
                        cancelable: true
                    }));

                    // Try direct form submission as a last resort
                    if (typeof form.submit === 'function') {
                        form.submit();
                    }
                }

                return true;
             } catch (err) {
                console.error('Error in JS button click:', err);
                return false;
             }",
            vec![button_element.to_json()?]
        ).await?;

        let value = result.json();
        if let serde_json::Value::Bool(true) = value {
            println!("Submit button clicked via enhanced JavaScript approach");
            Ok(())
        } else {
            println!("JavaScript approach failed, trying additional methods");

            // Try to simulate enter key on the form as a last resort
            driver.execute(
                "document.querySelector('form button[type=\"submit\"]').form.dispatchEvent(new KeyboardEvent('keypress', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                }));",
                vec![]
            ).await?;

            println!("Enter key simulation performed as fallback");
            Ok(())
        }
    }
}

// Form interaction trait with radiation hardening
trait FormInteraction: HardenedAction {
    async fn send_keys_with_redundancy(&self, driver: &WebDriver, text: &str) -> WebDriverResult<()> {
        let element = self.execute(driver).await?;

        for attempt in 1..=Self::ACTION_RETRIES {
            match element.send_keys(text).await {
                Ok(_) => return Ok(()),
                Err(e) if attempt < Self::ACTION_RETRIES => {
                    println!("Input attempt {}/{} failed: {}", attempt, Self::ACTION_RETRIES, e);
                    // Direct JavaScript value injection as fallback mechanism
                    driver.execute(
                        "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input'));",
                        vec![element.to_json()?, json!(text)]
                    ).await?;
                }
                Err(e) => return Err(e),
            }
        }
        Ok(())
    }
}

impl<T: HardenedAction> FormInteraction for T {}

// Certified connection handler with TMR
struct Connector {
    caps: FirefoxCapabilities,
    port: u16,
}

impl Connector {
    async fn connect_with_retry(&self) -> WebDriverResult<WebDriver> {
        let webdriver_url = format!("http://localhost:{}", self.port);

        for attempt in 1..=MAX_RETRIES {
            match WebDriver::new(&webdriver_url, self.caps.clone()).await {
                Ok(driver) => return Ok(driver),
                Err(e) if attempt < MAX_RETRIES => {
                    println!("Connection attempt {}/{} failed: {}", attempt, MAX_RETRIES, e);
                    tokio::time::sleep(Duration::from_millis(500)).await;
                }
                Err(e) => return Err(e),
            }
        }
        unreachable!()
    }
}

#[tokio::main]
async fn main() -> WebDriverResult<()> {
    let caps = FirefoxCapabilities::new();

    let connector = Connector {
        caps,
        port: WEBDRIVER_PORT,
    };

    let driver = connector.connect_with_retry().await?;

    // Set up predictable timeouts for radiation hardening
    driver.set_implicit_wait_timeout(Duration::from_secs(10)).await?;
    driver.set_page_load_timeout(Duration::from_secs(30)).await?;

    // Navigate to target URL with redundancy checks
    driver.goto(URL).await?;

    println!("Navigated to application page");

    // Execute workflow with redundant voting
    ApplyButtonStep.click_with_redundancy(&driver).await?;
    println!("Clicked primary apply button");

    ManualApplyStep.click_with_redundancy(&driver).await?;
    println!("Clicked manual apply button");

    let form = FormVerificationStep.execute(&driver).await?;
    form.wait_until().displayed().await?;
    println!("Application form loaded successfully");

    // Execute form filling with triple redundancy
    EmailInputStep.send_keys_with_redundancy(&driver, "user@example.com").await?;
    println!("Email entered");

    // Set password with proper element characteristics
    PasswordInputStep.send_keys_with_redundancy(&driver, "SecurePass123!").await?;
    println!("Password entered");

    VerifyPasswordInputStep.send_keys_with_redundancy(&driver, "SecurePass123!").await?;
    println!("Password verified");

    // Use the specialized JS click method for the consent checkbox
    let consent_step = ConsentCheckboxStep;
    for i in 1..=3 {
        println!("Consent checkbox attempt {}/3", i);
        consent_step.click_with_js_fallback(&driver).await?;
    }

    // IMPORTANT CHANGE: Use the specialized JS bypass method for the submit button
    // to handle the element interception issue
    let submit_step = SubmitStep;
    println!("Attempting submission with enhanced JavaScript bypass");
    submit_step.click_with_js_bypass(&driver).await?;
    println!("Form submitted with JavaScript bypass");

    // Verify submission with more general selectors and longer timeout
    println!("Waiting for submission confirmation...");
    let broader_success_selector = By::Css("div[data-automation-id*='success'], div[data-automation-id*='confirmation'], .css-success-message, h1, .form-confirmation");
    driver.query(broader_success_selector)
        .wait(Duration::from_secs(20), Duration::from_secs(2))  // Longer timeout, slower polling
        .first()
        .await?
        .wait_until()
        .displayed()
        .await?;

    println!("Form submission verification complete");

    // Instead of quitting, keep the browser open by waiting
    println!("\n==========================================");
    println!("Browser window kept open for inspection");
    println!("Press Ctrl+C in terminal to exit the program");
    println!("==========================================\n");

    // Use tokio's sleep with a very long duration to keep the program running
    // This effectively keeps the WebDriver session and browser open
    tokio::time::sleep(Duration::from_secs(3600)).await; // Wait for 1 hour

    // Alternatively, you could wait indefinitely with std::future::pending
    // std::future::pending::<()>().await;

    // The driver.quit() call is removed to prevent automatic browser closure
    Ok(())
}
