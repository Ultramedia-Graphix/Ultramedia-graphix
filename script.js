console.log("Ultramedia Graphix script connected.");

const SUPABASE_URL = "https://scsesxsnhzbkcrifosea.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjc2VzeHNuaHpia2NyaWZvc2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMjAxMjcsImV4cCI6MjEwMDg5NjEyN30.XswQAJQRn2zWX8jQpq74CIwbk0eKkmJ_fKR3HGbdFJA";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function setLoading(button, isLoading, labelWhenNotLoading) {
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span> Please wait...';
  } else {
    button.disabled = false;
    button.textContent = labelWhenNotLoading || button.dataset.originalText;
  }
}

function getToastContainer() {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  return container;
}

function showToast(message, type) {
  const container = getToastContainer();

  const toast = document.createElement("div");
  toast.className = "toast" + (type ? " " + type : "");

  const icon = document.createElement("span");
  icon.className = "toast-icon";
  icon.textContent = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";

  const message_el = document.createElement("span");
  message_el.className = "toast-message";
  message_el.textContent = message;

  const closeBtn = document.createElement("button");
  closeBtn.className = "toast-close";
  closeBtn.innerHTML = "&times;";
  closeBtn.addEventListener("click", function () {
    removeToast(toast);
  });

  toast.appendChild(icon);
  toast.appendChild(message_el);
  toast.appendChild(closeBtn);
  container.appendChild(toast);

  setTimeout(function () {
    removeToast(toast);
  }, 4000);
}

function removeToast(toast) {
  toast.classList.add("toast-out");
  setTimeout(function () {
    toast.remove();
  }, 250);
}

const loginForm = document.querySelector("#loginForm");

if (loginForm) {
  const emailInput = document.querySelector("#loginEmail");
  const passwordInput = document.querySelector("#loginPassword");
  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");

  loginForm.addEventListener("submit", async function (event) {
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

    if (!isValid) {
      return;
    }

    const submitButton = loginForm.querySelector("button[type='submit']");
    setLoading(submitButton, true);

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: emailValue,
      password: passwordValue
    });

    setLoading(submitButton, false, "Log In");

    if (error) {
      passwordError.textContent = error.message;
      return;
    }

    window.location.href = "dashboard.html";
  });
}

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

  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    let isValid = true;

    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;
    const confirmValue = confirmInput.value;

    if (nameValue === "") {
      nameError.textContent = "Please enter your name.";
      isValid = false;
    } else {
      nameError.textContent = "";
    }

    if (emailValue === "" || !emailValue.includes("@") || !emailValue.includes(".")) {
      emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    } else {
      emailError.textContent = "";
    }

    if (passwordValue.length < 8) {
      passwordError.textContent = "Password must be at least 8 characters.";
      isValid = false;
    } else {
      passwordError.textContent = "";
    }

    if (confirmValue !== passwordValue || confirmValue === "") {
      confirmError.textContent = "Passwords do not match.";
      isValid = false;
    } else {
      confirmError.textContent = "";
    }

    if (!isValid) {
      return;
    }

    const submitButton = registerForm.querySelector("button[type='submit']");
    setLoading(submitButton, true);

    const { data, error } = await supabaseClient.auth.signUp({
      email: emailValue,
      password: passwordValue,
      options: {
        data: { full_name: nameValue } 
      }
    });

    setLoading(submitButton, false, "Create Account");

    if (error) {
      emailError.textContent = error.message;
      return;
    }

    showToast("Account created! Check your email to confirm your address, then log in.", "success");
    registerForm.reset();
    window.location.href = "login.html";
  });
}


const googleSignupBtn = document.querySelector("#googleSignupBtn");

if (googleSignupBtn) {
  googleSignupBtn.addEventListener("click", async function () {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google"
    });

    if (error) {
      showToast("Google sign-in error: " + error.message, "error");
    }
  });
}

const resetForm = document.querySelector("#resetForm");

if (resetForm) {
  const resetEmailInput = document.querySelector("#resetEmail");
  const resetEmailError = document.querySelector("#resetEmailError");
  const resetSuccessMsg = document.querySelector("#resetSuccessMsg");

  resetForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const emailValue = resetEmailInput.value.trim();

    if (emailValue === "" || !emailValue.includes("@")) {
      resetEmailError.textContent = "Please enter a valid email address.";
      resetSuccessMsg.textContent = "";
      return;
    }

    resetEmailError.textContent = "";

    const { error } = await supabaseClient.auth.resetPasswordForEmail(emailValue, {
      redirectTo: window.location.origin + "/login.html"
    });

    if (error) {
      resetEmailError.textContent = error.message;
      return;
    }

    resetSuccessMsg.textContent = "Check your email for a link to reset your password.";
    resetForm.reset();
  });
}

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
      return
    }

    contactSuccessMsg.textContent = "Thanks, " + nameValue + "! Your message has been received.";
    contactForm.reset();
  });
}

const projectList = document.querySelector("#projectList");

if (projectList) {
  (async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (!session) {
      window.location.href = "login.html";
      return;
    }

    const welcomeMsg = document.querySelector("#welcomeMsg");
    if (welcomeMsg) {
      const name = session.user.user_metadata.full_name || session.user.email;
      welcomeMsg.textContent = "Welcome Back, " + name;
    }
  })();

  
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

const logoutBtn = document.querySelector("#logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async function (event) {
    event.preventDefault();
    await supabaseClient.auth.signOut();
    window.location.href = "index.html";
  });
}
