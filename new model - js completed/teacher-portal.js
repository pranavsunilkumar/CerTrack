const auth = requireRole('teacher');

document.getElementById('user-name').textContent = auth.name;

let allRequests = JSON.parse(localStorage.getItem('chq-all-requests') || '[]');
let approvedReqs = JSON.parse(
  localStorage.getItem('chq-teacher-approved-' + auth.email) || '[]'
);

// ===== TAB SWITCHING =====
document.querySelectorAll('.nav-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document
      .querySelectorAll('.nav-tab')
      .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const tab = btn.dataset.tab;
    document
      .querySelectorAll('.tab-panel')
      .forEach(p => p.classList.remove('active'));
    document.querySelector(`[data-panel="${tab}"]`).classList.add('active');
  });
});

// ===== HELPER: SYNC BACK TO STUDENT STORAGE =====
function syncStudentRequests(studentEmail) {
  const allReqs = JSON.parse(localStorage.getItem('chq-all-requests') || '[]');
  const studentReqs = allReqs.filter(r => r.studentEmail === studentEmail);
  localStorage.setItem(
    'chq-student-reqs-' + studentEmail,
    JSON.stringify(studentReqs)
  );
}

// ===== PENDING REQUESTS =====
function renderPending() {
  const list = document.getElementById('pending-list');
  const empty = document.getElementById('pending-empty');

  list.innerHTML = '';

  const pending = allRequests.filter(r => r.status === 'pending');

  if (!pending.length) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  pending.forEach(r => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <strong>${r.eventName}</strong>
      <small>${r.studentName} (${r.studentEmail})</small>
      <small>${r.from} → ${r.to}</small>
      <button class="btn-primary btn-sm" onclick="approveRequest(${r.id})">
        Approve
      </button>
      <button class="btn-secondary btn-sm" onclick="rejectRequest(${r.id})">
        Reject
      </button>
    `;
    list.appendChild(card);
  });
}

// ===== APPROVED REQUESTS =====
function renderApproved() {
  const list = document.getElementById('approved-list');
  const empty = document.getElementById('approved-empty');

  list.innerHTML = '';

  const approved = allRequests.filter(r => r.status === 'approved');

  if (!approved.length) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  approved.forEach(r => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <strong>${r.eventName}</strong>
      <small>${r.studentName}</small>
      <small>✅ Approved on ${new Date(r.approvedAt).toLocaleDateString()}</small>
    `;
    list.appendChild(card);
  });
}

// ===== ACTIONS: APPROVE / REJECT =====
function approveRequest(id) {
  const req = allRequests.find(r => r.id == id);
  if (req) {
    req.status = 'approved';
    req.approvedAt = new Date().toISOString();
    req.approvedBy = auth.name;

    localStorage.setItem('chq-all-requests', JSON.stringify(allRequests));

    approvedReqs.push(req);
    localStorage.setItem(
      'chq-teacher-approved-' + auth.email,
      JSON.stringify(approvedReqs)
    );

    // sync this student's copy
    syncStudentRequests(req.studentEmail);

    alert('Request approved!');
    renderPending();
    renderApproved();
  }
}

function rejectRequest(id) {
  const req = allRequests.find(r => r.id == id);
  if (req) {
    req.status = 'rejected';

    localStorage.setItem('chq-all-requests', JSON.stringify(allRequests));

    // sync this student's copy
    syncStudentRequests(req.studentEmail);

    alert('Request rejected');
    renderPending();
    renderApproved();
  }
}

// ===== INITIAL RENDER =====
renderPending();
renderApproved();

// ===== STUDENTS (mock data) =====
function renderStudents() {
  const list = document.getElementById('students-list');
  const mockStudents = [
    { name: 'Arjuna', email: 'arjuna@example.com', roll: '1' },
    { name: 'Leo Da ', email: 'ldv@example.com', roll: '2' }
  ];

  list.innerHTML = '';

  mockStudents.forEach(s => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <strong>${s.name}</strong>
      <small>${s.email}</small>
      <small>Roll: ${s.roll}</small>
    `;
    list.appendChild(card);
  });
}

renderStudents();

// ===== PROFILE =====
function loadTeacherProfile() {
  const profile = JSON.parse(
    localStorage.getItem('chq-teacher-profile-' + auth.email) || '{}'
  );

  document.getElementById('t-name').value = profile.name || auth.name;
  document.getElementById('t-email').value =
    profile.email || auth.email || '';
  document.getElementById('t-institute').value = profile.institute || '';

  document
    .getElementById('save-t-profile-btn')
    .addEventListener('click', () => {
      const profile = {
        name: document.getElementById('t-name').value,
        email: document.getElementById('t-email').value,
        institute: document.getElementById('t-institute').value
      };

      localStorage.setItem(
        'chq-teacher-profile-' + auth.email,
        JSON.stringify(profile)
      );
      alert('Profile saved!');
    });
}

loadTeacherProfile();
