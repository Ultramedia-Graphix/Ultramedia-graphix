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
      alert("Login successful! Taking you to your dashboard. (Demo only — no real account system is connected yet.)");
      window.location.href = "dashboard.html";
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

// --- Contact form validation (only runs if #contactForm exists) ---

const contactForm = document.querySelector("#contactForm");

if (contactForm) {
  const contactNameInput = document.querySelector("#contactName");
  const contactEmailInput = document.querySelector("#contactEmail");
  const contactMessageInput = document.querySelector("#contactMessage");

  const contactNameError = document.querySelector("#contactNameError");
  const contactEmailError = document.querySelector("#contactEmailError");
  const contactMessageError = document.querySelector("#contactMessageError");
  const contactSuccessMsg = document.querySelector("#contactSuccessMsg");

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;

    const nameValue = contactNameInput.value.trim();
    const emailValue = contactEmailInput.value.trim();
    const messageValue = contactMessageInput.value.trim();

    if (nameValue === "") {
      contactNameError.textContent = "Please enter your name.";
      isValid = false;
    } else {
      contactNameError.textContent = "";
    }

    if (emailValue === "" || !emailValue.includes("@")) {
      contactEmailError.textContent = "Please enter a valid email.";
      isValid = false;
    } else {
      contactEmailError.textContent = "";
    }

    if (messageValue === "") {
      contactMessageError.textContent = "Please enter a message.";
      isValid = false;
    } else {
      contactMessageError.textContent = "";
    }

    if (!isValid) {
      contactSuccessMsg.textContent = "";
      return;
    }

    // ============================================================
    // In a real version, this is where you'd send the message
    // somewhere real — e.g. an email service, or storing it in
    // your Supabase database. For now, this just confirms locally.
    // ============================================================

    contactSuccessMsg.textContent = "Thanks, " + nameValue + "! Your message has been received (demo only — not actually sent anywhere yet).";
    contactForm.reset();
  });
}

// --- Client Dashboard (only runs if #projectList exists) ---

const projectList = document.querySelector("#projectList");

if (projectList) {

  // ============================================================
  // MOCK DATA — stands in for what would really come from Supabase.
  //
  // In a real version, once a client logs in, you'd fetch ONLY
  // their own projects from the database, e.g.:
  //
  //   const { data: projects } = await supabase
  //     .from("projects")
  //     .select("*")
  //     .eq("client_id", currentUser.id);
  //
  // Supabase's security rules ("Row Level Security") ensure a client
  // can only ever see their own rows — never another client's data,
  // even if they tried to guess a URL or ID. That protection has to
  // live in the database, not in this JS file.
  // ============================================================

  const mockProjects = [
    {
      title: "Brand Identity — Chikwawa Farmers Co-op",
      date: "Started June 2026",
      status: "in-progress",
      statusLabel: "In Progress",
      files: []
    },
    {
      title: "Church Website Redesign",
      date: "Started May 2026",
      status: "review",
      statusLabel: "Awaiting Your Review",
      files: [
        { name: "Homepage Draft v2.pdf", url: "#" },
        { name: "Invoice - May 2026.pdf", url: "#" }
      ]
    },
    {
      title: "Social Media Pack — Launch Campaign",
      date: "Completed April 2026",
      status: "completed",
      statusLabel: "Completed",
      files: [
        { name: "Final Graphics.zip", url: "#" },
        { name: "Invoice - April 2026.pdf", url: "#" }
      ]
    }
  ];

  function buildProjectCard(project) {
    const card = document.createElement("div");
    card.className = "project-card";

    const top = document.createElement("div");
    top.className = "project-card-top";

    const titleBlock = document.createElement("div");
    const titleEl = document.createElement("h3");
    titleEl.textContent = project.title;
    const dateEl = document.createElement("p");
    dateEl.className = "project-date";
    dateEl.textContent = project.date;
    titleBlock.appendChild(titleEl);
    titleBlock.appendChild(dateEl);

    const badge = document.createElement("span");
    badge.className = "status-badge status-" + project.status;
    badge.textContent = project.statusLabel;

    top.appendChild(titleBlock);
    top.appendChild(badge);
    card.appendChild(top);

    if (project.files.length > 0) {
      const filesWrapper = document.createElement("div");
      filesWrapper.className = "project-files";

      project.files.forEach(function (file) {
        const row = document.createElement("div");
        row.className = "file-row";

        const nameSpan = document.createElement("span");
        nameSpan.textContent = file.name;

        const link = document.createElement("a");
        link.href = file.url;
        link.textContent = "Download";

        row.appendChild(nameSpan);
        row.appendChild(link);
        filesWrapper.appendChild(row);
      });

      card.appendChild(filesWrapper);
    }

    return card;
  }

  mockProjects.forEach(function (project) {
    projectList.appendChild(buildProjectCard(project));
  });
}

// --- Logout button (demo) ---

const logoutBtn = document.querySelector("#logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function (event) {
    event.preventDefault();

    // ============================================================
    // REAL LOGOUT GOES HERE:
    //   await supabase.auth.signOut();
    //   window.location.href = "index.html";
    // ============================================================

    alert("Demo only: in a real version this would log you out and return you to the homepage.");
  });
}
