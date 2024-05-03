// --- RECAPTCHA V3

// Select all form blocks based on the specified attribute
const formBlocks = document.querySelectorAll(
  '[fs-recaptcha-element="form-block"]'
);

// Server URL and site key for ReCAPTCHA verification
// Server URL can be your backend server url or make webhook url
const serverUrl = "https://hook.us1.make.com/de93abjavf8n1ql663u2mnbul6yr5pp1";
const siteKey = "6LdUWM4pAAAAAPoYGM83vnS3tAxOmGzi9WgvLACg";

formBlocks.forEach((formBlock) => {
  // Select form and related elements within the block
  const form = formBlock.querySelector("form");
  const successBlock = formBlock.querySelector(
    '[fs-recaptcha-element="success"]'
  );
  const errorBlock = formBlock.querySelector('[fs-recaptcha-element="error"]');
  const submitButton = form.querySelector('[type="submit"]');

  // Handling loading text and original button text
  const loadingText =
    formBlock.getAttribute("fs-recaptcha-loadingtext") || "Loading...";
  const originalSubmitText = submitButton.value;

  // Hide the ReCAPTCHA badge if the attribute is set
  const hideBadge = formBlock.getAttribute("fs-recaptcha-badge") === "hide";
  if (hideBadge) {
    const style = document.createElement("style");
    style.innerHTML = ".grecaptcha-badge { visibility: hidden; }";
    document.head.appendChild(style);
  }

  // Event listener for form submission
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Function to handle the form submission process
    async function handleFormSubmission() {
      submitButton.value = loadingText; // Set the loading text

      try {
        // Execute ReCAPTCHA and retrieve the token
        const token = await grecaptcha.execute(siteKey, { action: "submit" });
        // console.log(token);

        // Serialize form data into a simple object
        let serializedData = {};
        new FormData(form).forEach((value, key) => {
          serializedData[key] = value;
        });

        // Send the token and serialized data to the server
        const response = await fetch(serverUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, formData: serializedData }),
        });

        const data = await response.json(); // Parse the JSON response

        submitButton.value = originalSubmitText; // Reset the button text

        // Display success or error messages based on the response
        if (data.formResponse && data.formResponse.success) {
          // successBlock.style.display = "block";
          // errorBlock.style.display = "none";

          window.location.href = window.location.origin + "/thank-you";
        } else {
          successBlock.style.display = "none";
          errorBlock.style.display = "block";
        }

        // Optionally log the response to the console
        if (formBlock.getAttribute("fs-recaptcha-showconsole") === "true") {
          console.log(data);
        }
      } catch (error) {
        submitButton.value = originalSubmitText; // Reset the button text on error
        console.error("Error:", error); // Log any error encountered during the process
      }
    }

    handleFormSubmission(); // Execute the form submission process
  });
});
