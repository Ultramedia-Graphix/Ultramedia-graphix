// ===================================
// ULTRAMEDIA GRAPHIX — SHARED SCRIPT
// This one file is linked on every page. Each page only has the
// HTML elements relevant to it, so querySelector calls for elements
// that don't exist on the current page will just return null —
// that's why we check "if (element)" before using page-specific code.
// ===================================

console.log("Ultramedia Graphix script connected.");

// --- Login form validation (only runs if #loginForm exists on this page) ---

const loginForm = document.querySelector("#loginForm");

if (loginForm) {
  const emailInput = document.querySelector("#loginEmail");
  const passwordInput = document.querySelector("#loginPassword");
  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    if (emailValue === "" || !emailValue.includes("@")) {
      emailError.textContent = "Please enter a valid email.";
      isValid = false;
    } else {
      emailError.textContent = "";
    }

    if (passwordValue === "") {
      passwordError.textContent = "Password is required.";
      isValid = false;
    } else {
      passwordError.textContent = "";
    }

    if (isValid) {
      alert("Login successful! (This is a demo — no real account system is connected yet.)");
      loginForm.reset();
    }
  });
}

// --- Register form validation (only runs if #registerForm exists) ---

const registerForm = document.querySelector("#registerForm");

if (registerForm) {
  const nameInput = document.querySelector("#regName");
  const emailInput = document.querySelector("#regEmail");
  const passwordInput = document.querySelector("#regPassword");
  const confirmInput = document.querySelector("#regConfirmPassword");

  const nameError = document.querySelector("#regNameError");
  const emailError = document.querySelector("#regEmailError");
  const passwordError = document.querySelector("#regPasswordError");
  const confirmError = document.querySelector("#regConfirmError");

  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;

    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;
    const confirmValue = confirmInput.value;

    // Name check
    if (nameValue === "") {
      nameError.textContent = "Please enter your name.";
      isValid = false;
    } else {
      nameError.textContent = "";
    }

    // Email format check (NOT a uniqueness check — see note below)
    if (emailValue === "" || !emailValue.includes("@") || !emailValue.includes(".")) {
      emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    } else {
      emailError.textContent = "";
    }

    // Basic password strength check
    if (passwordValue.length < 8) {
      passwordError.textContent = "Password must be at least 8 characters.";
      isValid = false;
    } else {
      passwordError.textContent = "";
    }

    // Confirm password matches
    if (confirmValue !== passwordValue || confirmValue === "") {
      confirmError.textContent = "Passwords do not match.";
      isValid = false;
    } else {
      confirmError.textContent = "";
    }

    if (!isValid) {
      return;
    }

    // ============================================================
    // REAL BACKEND GOES HERE (not possible with plain JS alone):
    //
    // 1. Check if emailValue already exists in your database.
    //    If it does -> show "This email is already registered."
    // 2. If not, send {name, email, password} to your auth service
    //    (e.g. Supabase: supabase.auth.signUp({ email, password }))
    //    which hashes the password server-side and stores the user.
    // 3. On success, redirect to login.html or straight into the app.
    //
    // Example with Supabase (once you set up a project):
    //
    //   const { data, error } = await supabase.auth.signUp({
    //     email: emailValue,
    //     password: passwordValue
    //   });
    //   if (error) { emailError.textContent = error.message; return; }
    //
    // ============================================================

    alert("Demo only: in a real version, your account would now be created securely on the server.");
    registerForm.reset();
  });
}

// --- Google signup button (placeholder) ---

const googleSignupBtn = document.querySelector("#googleSignupBtn");

if (googleSignupBtn) {
  googleSignupBtn.addEventListener("click", function () {
    // ============================================================
    // REAL GOOGLE SIGN-IN GOES HERE:
    // Requires a registered app in Google Cloud Console + an auth
    // service (Supabase/Firebase) configured with your Google
    // Client ID. Example with Supabase:
    //
    //   await supabase.auth.signInWithOAuth({ provider: "google" });
    //
    // ============================================================
    alert("Demo only: Google sign-in requires backend setup (see code comments in script.js).");
  });
}

// --- Forgot password form (only runs if #resetForm exists) ---

const resetForm = document.querySelector("#resetForm");

if (resetForm) {
  const resetEmailInput = document.querySelector("#resetEmail");
  const resetEmailError = document.querySelector("#resetEmailError");
  const resetSuccessMsg = document.querySelector("#resetSuccessMsg");

  resetForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const emailValue = resetEmailInput.value.trim();

    if (emailValue === "" || !emailValue.includes("@")) {
      resetEmailError.textContent = "Please enter a valid email address.";
      resetSuccessMsg.textContent = "";
      return;
    }

    resetEmailError.textContent = "";

    // ============================================================
    // REAL PASSWORD RESET GOES HERE:
    // A backend/auth service generates a secure, time-limited reset
    // link and emails it. Example with Supabase:
    //
    //   const { error } = await supabase.auth.resetPasswordForEmail(emailValue);
    //
    // ============================================================

    resetSuccessMsg.textContent = "Demo only: in a real version, a reset link would be emailed to " + emailValue + ".";
    resetForm.reset();
  });
}
