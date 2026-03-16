const auth = requireRole('admin');
document.getElementById('user-name').textContent = auth.name;

let institutes = JSON.parse(localStorage.getItem('chq-institutes') || '[]');
let allRequests = JSON.parse(localStorage.getItem('chq-all-requests') || '[]');

// TAB SWITCHING
document.querySelectorAll('.nav-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelector(`[data-panel="${tab}"]`).classList.add('active');
    if (tab === 'analytics') renderCharts();
  });
});

// DASHBOARD STATS
function updateStats() {
  document.getElementById('stat-institutes').textContent = institutes.length || 0;
  document.getElementById('stat-students').textContent = Math.floor(Math.random() * 500) + 100;
  document.getElementById('stat-teachers').textContent = Math.floor(Math.random() * 50) + 10;
  
  const today = new Date().toISOString().split('T')[0];
  const todayReqs = allRequests.filter(r => r.createdAt.split('T')[0] === today).length;
  document.getElementById('stat-requests').textContent = todayReqs;
}

updateStats();

// ALL REQUESTS
function renderAllRequests() {
  const list = document.getElementById('all-requests-list');
  const empty = document.getElementById('requests-empty');
  list.innerHTML = '';

  if (!allRequests.length) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  allRequests.forEach(r => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <strong>${r.eventName}</strong>
      <small>${r.studentName}</small>
      <small>${r.from} → ${r.to}</small>
      <small>Status: <span class="badge" style="background:${r.status === 'approved' ? '#10b981' : r.status === 'pending' ? '#f59e0b' : '#ef4444'}">${r.status}</span></small>
      <button class="btn-primary btn-sm" onclick="sendMailNotification('${r.id}')">Send Email to Institute</button>
    `;
    list.appendChild(card);
  });
}

function sendMailNotification(id) {
  const req = allRequests.find(r => r.id == id);
  if (req && req.status === 'approved') {
    alert(`Email would be sent to institute about ${req.eventName} for ${req.studentName}`);
    req.mailSent = true;
    req.mailSentAt = new Date().toISOString();
    localStorage.setItem('chq-all-requests', JSON.stringify(allRequests));
  }
}

renderAllRequests();

// INSTITUTES
function renderInstitutes() {
  const list = document.getElementById('inst-list');
  list.innerHTML = '';
  institutes.forEach((inst, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <strong>${inst.name}</strong>
      <small>${inst.location}</small>
      <small>Students: ${Math.floor(Math.random() * 300) + 50}</small>
      <small>Teachers: ${Math.floor(Math.random() * 30) + 5}</small>
      <button class="btn-secondary btn-sm" onclick="deleteInstitute(${idx})">Delete</button>
    `;
    list.appendChild(card);
  });
}

function deleteInstitute(idx) {
  institutes.splice(idx, 1);
  localStorage.setItem('chq-institutes', JSON.stringify(institutes));
  renderInstitutes();
}

document.getElementById('add-inst-btn').addEventListener('click', () => {
  document.getElementById('inst-form').style.display = 'block';
});

document.getElementById('cancel-inst-btn').addEventListener('click', () => {
  document.getElementById('inst-form').style.display = 'none';
});

document.getElementById('submit-inst-btn').addEventListener('click', () => {
  const name = document.getElementById('inst-name-input').value;
  const location = document.getElementById('inst-location-input').value;
  if (!name || !location) {
    alert('Please fill all fields');
    return;
  }
  institutes.push({ name, location });
  localStorage.setItem('chq-institutes', JSON.stringify(institutes));
  document.getElementById('inst-form').style.display = 'none';
  renderInstitutes();
  updateStats();
});

renderInstitutes();
/* doesnt work
// ANALYTICS CHARTS
function renderCharts() {
  // Users per day (mock)
  const usersCtx = document.getElementById('usersChart');
  if (usersCtx && !window.usersChart) {
    window.usersChart = new Chart(usersCtx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'New Users',
          data: [12, 19, 3, 5, 2, 3, 15],
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.4
        }]
      },
      options: { responsive: true, maintainAspectRatio: true }
    });
  }

  // Requests accepted (mock)
  const requestsCtx = document.getElementById('requestsChart');
  if (requestsCtx && !window.requestsChart) {
    window.requestsChart = new Chart(requestsCtx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Requests Accepted',
          data: [5, 8, 4, 7, 9, 6, 8],
          backgroundColor: '#10b981'
        }]
      },
      options: { responsive: true, maintainAspectRatio: true }
    });
  }
}
*/
// ANALYTICS CHARTS
function renderCharts() {
  const usersCtx = document.getElementById('usersChart');
  if (usersCtx) {
    new Chart(usersCtx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'New Users',
          data: [12, 19, 3, 5, 2, 3, 15],
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.4
        }]
      },
      options: { responsive: true, maintainAspectRatio: true }
    });
  }

  const requestsCtx = document.getElementById('requestsChart');
  if (requestsCtx) {
    new Chart(requestsCtx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Requests Accepted',
          data: [5, 8, 4, 7, 9, 6, 8],
          backgroundColor: '#10b981'
        }]
      },
      options: { responsive: true, maintainAspectRatio: true }
    });
  }
}

