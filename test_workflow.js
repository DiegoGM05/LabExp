const http = require('http');

function post(url, data) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve(JSON.parse(b)));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function put(url, data) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve(JSON.parse(b)));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('Testing Candidate Application Flow:');
  const applyRes = await post('http://localhost:3000/api/applications', {
    vacancyId: 'vac-3', // Analista Trainee Grupo Financiero Aurora
    userId: 'usr-cand-1',
    coverNote: 'Me interesa mucho el análisis financiero y he tomado materias de probabilidad y finanzas corporativas.'
  });
  console.log('Application Result:', applyRes.success, '| App ID:', applyRes.application?.id, '| Status:', applyRes.application?.status);

  console.log('\nTesting Recruiter Pipeline Status Update:');
  const updateRes = await put(`http://localhost:3000/api/applications/${applyRes.application.id}/status`, {
    status: 'Entrevista programada',
    recruiterNotes: 'Perfil cuantitativo sólido. Se cita a primera entrevista técnica con Director de Riesgos.',
    interviewScheduledFor: '2026-11-25T16:00:00Z',
    interviewType: 'Videollamada técnica'
  });
  console.log('Update Result:', updateRes.success, '| New Status:', updateRes.application?.status);
}

run().catch(console.error);
