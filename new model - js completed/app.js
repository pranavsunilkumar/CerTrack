// ========== AUTHENTICATION ==========

// Mock user database
const users = {
  'student1@example.com': { password: 'pass123', role: 'student', name: 'Pranav', institute: 'DSATM' },
  'teacher1@example.com': { password: 'pass123', role: 'teacher', name: 'Dr. Sarvepalli Radhakrishnan', institute: 'DSI' },
  'admin1@example.com': { password: 'pass123', role: 'admin', name: 'Admin ji', institute: 'System' }
};

// Login form
const loginForm = document.querySelector("#login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = loginForm.elements.email.value.trim();
    const password = loginForm.elements.password.value.trim();
    const role = document.getElementById('role-select').value;

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    // Demo: authenticate
    if (users[email] && users[email].password === password && users[email].role === role) {
      // Save to localStorage
      localStorage.setItem('chq-auth', JSON.stringify({ email, role, name: users[email].name }));
      alert(`Welcome, ${users[email].name}!`);
      
      // Redirect based on role
      if (role === 'student') window.location.href = 'student-portal.html';
      else if (role === 'teacher') window.location.href = 'teacher-portal.html';
      else if (role === 'admin') window.location.href = 'admin-portal.html';
    } else {
      alert("OOPS,Invalid credentials or role mismatch.");
    }
  });
}

// Signup form
const signupForm = document.querySelector("#signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = signupForm.elements.name.value.trim();
    const email = signupForm.elements.email.value.trim();
    const password = signupForm.elements.password.value.trim();
    const role = document.getElementById('signup-role').value;

    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    // Demo: add user
    users[email] = { password, role, name, institute: 'Pending' };
    alert("Account created! Redirecting to login...");
    window.location.href = "login.html";
  });
}

// Forgot password
const forgotForm = document.querySelector("#forgot-form");
if (forgotForm) {
  forgotForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = forgotForm.elements.email.value.trim();
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    alert("Password reset link sent (demo).");
    window.location.href = "login.html";
  });
}

// ========== UTILITY FUNCTIONS ==========

function checkAuth() {
  const auth = localStorage.getItem('chq-auth');
  if (!auth) {
    window.location.href = 'login.html';
    return null;
  }
  return JSON.parse(auth);
}

function logout() {
  localStorage.removeItem('chq-auth');
  window.location.href = 'login.html';
}

function requireRole(expectedRole) {
  const auth = checkAuth();
  if (auth.role !== expectedRole) {
    alert("Access denied. You do not have permission to view this page.");
    window.location.href = 'login.html';
  }
  return auth;
}
