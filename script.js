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

    // Name check
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
        data: { full_name: nameValue } // stored alongside the user
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
      return;
    }

    contactSuccessMsg.textContent = "Thanks, " + nameValue + "! Your message has been received.";
    contactForm.reset();
  });
}

const projectList = document.querySelector("#projectList");

if (projectList) {

  (async function initDashboard() {
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

    const { data: projects, error: projectsError } = await supabaseClient
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (projectsError) {
      projectList.innerHTML = "";
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "Couldn't load projects: " + projectsError.message;
      projectList.appendChild(errorMsg);
      return;
    }

    if (!projects || projects.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.textContent = "No projects yet — check back once your project has started.";
      projectList.appendChild(emptyMsg);
      return;
    }

    const projectIds = projects.map(function (p) { return p.id; });

    const { data: files } = await supabaseClient
      .from("project_files")
      .select("*")
      .in("project_id", projectIds);

    projects.forEach(function (project) {
      const projectFiles = (files || [])
        .filter(function (f) { return f.project_id === project.id; })
        .map(function (f) { return { name: f.file_name, url: f.file_url }; });

      const dateLabel = new Date(project.created_at).toLocaleDateString("en-GB", {
        year: "numeric", month: "long"
      });

      projectList.appendChild(buildProjectCard({
        title: project.title,
        date: "Started " + dateLabel,
        status: project.status,
        statusLabel: project.status_label,
        files: projectFiles
      }));
    });
  })();

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
}

const logoutBtn = document.querySelector("#logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async function (event) {
    event.preventDefault();
    await supabaseClient.auth.signOut();
    window.location.href = "index.html";
  });
}

const faqList = document.querySelector("#faqList");

if (faqList) {
  const questions = faqList.querySelectorAll(".faq-question");

  questions.forEach(function (question) {
    question.addEventListener("click", function () {
      const answer = question.nextElementSibling;
      const isOpen = question.classList.contains("open");

      if (isOpen) {
        question.classList.remove("open");
        answer.style.maxHeight = null;
      } else {
        question.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

const adminContent = document.querySelector("#adminContent");

if (adminContent) {
  const notAdminMsg = document.querySelector("#notAdminMsg");
  const adminProjectList = document.querySelector("#adminProjectList");
  const addProjectForm = document.querySelector("#addProjectForm");

  (async function initAdmin() {
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (!session) {
      window.location.href = "login.html";
      return;
    }

    const { data: adminRow } = await supabaseClient
      .from("admins")
      .select("user_id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (!adminRow) {
      notAdminMsg.style.display = "block";
      return;
    }

    adminContent.style.display = "block";
    loadAllProjects();
  })();

  async function loadAllProjects() {
    adminProjectList.innerHTML = "";

    const { data: projects, error } = await supabaseClient
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      adminProjectList.textContent = "Error loading projects: " + error.message;
      return;
    }

    if (!projects || projects.length === 0) {
      adminProjectList.textContent = "No projects yet — add one above.";
      return;
    }

    const fileProjectSelect = document.querySelector("#fileProjectSelect");
    fileProjectSelect.innerHTML = '<option value="">Select a project...</option>';
    projects.forEach(function (project) {
      const option = document.createElement("option");
      option.value = project.id;
      option.textContent = project.title;
      fileProjectSelect.appendChild(option);
    });

    const projectIds = projects.map(function (p) { return p.id; });
    const { data: files } = await supabaseClient
      .from("project_files")
      .select("*")
      .in("project_id", projectIds);

    projects.forEach(function (project) {
      const card = document.createElement("div");
      card.className = "project-card";

      const top = document.createElement("div");
      top.className = "project-card-top";

      const titleBlock = document.createElement("div");
      const titleEl = document.createElement("h3");
      titleEl.textContent = project.title;
      titleBlock.appendChild(titleEl);

      const badge = document.createElement("span");
      badge.className = "status-badge status-" + project.status;
      badge.textContent = project.status_label;

      top.appendChild(titleBlock);
      top.appendChild(badge);
      card.appendChild(top);

      const projectFiles = (files || []).filter(function (f) {
        return f.project_id === project.id;
      });

      if (projectFiles.length > 0) {
        const filesWrapper = document.createElement("div");
        filesWrapper.className = "project-files";

        projectFiles.forEach(function (file) {
          const row = document.createElement("div");
          row.className = "file-row";

          const nameSpan = document.createElement("span");
          nameSpan.textContent = file.file_name;

          const link = document.createElement("a");
          link.href = file.file_url;
          link.target = "_blank";
          link.rel = "noopener";
          link.textContent = "View";

          row.appendChild(nameSpan);
          row.appendChild(link);
          filesWrapper.appendChild(row);
        });

        card.appendChild(filesWrapper);
      }

      adminProjectList.appendChild(card);
    });
  }

  const addFileForm = document.querySelector("#addFileForm");

  addFileForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fileProjectSelect = document.querySelector("#fileProjectSelect");
    const fileNameInput = document.querySelector("#fileName");
    const fileUrlInput = document.querySelector("#fileUrl");
    const fileProjectError = document.querySelector("#fileProjectError");
    const fileNameError = document.querySelector("#fileNameError");
    const fileUrlError = document.querySelector("#fileUrlError");

    const projectIdValue = fileProjectSelect.value;
    const fileNameValue = fileNameInput.value.trim();
    const fileUrlValue = fileUrlInput.value.trim();

    let isValid = true;

    if (projectIdValue === "") {
      fileProjectError.textContent = "Select a project.";
      isValid = false;
    } else {
      fileProjectError.textContent = "";
    }

    if (fileNameValue === "") {
      fileNameError.textContent = "Enter a file name.";
      isValid = false;
    } else {
      fileNameError.textContent = "";
    }

    if (fileUrlValue === "" || !fileUrlValue.startsWith("http")) {
      fileUrlError.textContent = "Enter a valid link (starting with http:// or https://).";
      isValid = false;
    } else {
      fileUrlError.textContent = "";
    }

    if (!isValid) return;

    const submitButton = addFileForm.querySelector("button[type='submit']");
    setLoading(submitButton, true);

    const { error } = await supabaseClient
      .from("project_files")
      .insert({
        project_id: projectIdValue,
        file_name: fileNameValue,
        file_url: fileUrlValue
      });

    setLoading(submitButton, false, "Attach File");

    if (error) {
      showToast("Couldn't attach file: " + error.message, "error");
      return;
    }

    showToast("File attached successfully!", "success");
    addFileForm.reset();
    loadAllProjects();
  });

  addProjectForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const clientIdInput = document.querySelector("#clientId");
    const projectTitleInput = document.querySelector("#projectTitle");
    const projectStatusSelect = document.querySelector("#projectStatus");
    const clientIdError = document.querySelector("#clientIdError");
    const projectTitleError = document.querySelector("#projectTitleError");

    const clientIdValue = clientIdInput.value.trim();
    const titleValue = projectTitleInput.value.trim();
    const statusValue = projectStatusSelect.value;

    let isValid = true;

    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(clientIdValue)) {
      clientIdError.textContent = "Enter a valid User ID (copy it from Supabase → Authentication → Users).";
      isValid = false;
    } else {
      clientIdError.textContent = "";
    }

    if (titleValue === "") {
      projectTitleError.textContent = "Enter a project title.";
      isValid = false;
    } else {
      projectTitleError.textContent = "";
    }

    if (!isValid) return;

    const statusLabels = {
      "in-progress": "In Progress",
      "review": "Awaiting Client Review",
      "completed": "Completed"
    };

    const submitButton = addProjectForm.querySelector("button[type='submit']");
    setLoading(submitButton, true);

    const { error } = await supabaseClient
      .from("projects")
      .insert({
        client_id: clientIdValue,
        title: titleValue,
        status: statusValue,
        status_label: statusLabels[statusValue]
      });

    setLoading(submitButton, false, "Add Project");

    if (error) {
      showToast("Couldn't add project: " + error.message, "error");
      return;
    }

    showToast("Project added successfully!", "success");
    addProjectForm.reset();
    loadAllProjects();
  });
}
