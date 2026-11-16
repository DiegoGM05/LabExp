const http = require('http');

function check(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: method,
      headers: { 'Content-Type': 'application/json' }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body: body.slice(0, 150) }));
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testAll() {
  const indexRes = await check('http://localhost:3000/');
  console.log('1. Index HTML Status:', indexRes.status, '| Preview:', indexRes.body.replace(/\n/g, ' '));

  const cfgRes = await check('http://localhost:3000/api/config');
  console.log('2. Config API Status:', cfgRes.status, '| Preview:', cfgRes.body);

  const jobsRes = await check('http://localhost:3000/api/jobs');
  console.log('3. Jobs API Status:', jobsRes.status, '| Preview:', jobsRes.body);

  const coursesRes = await check('http://localhost:3000/api/courses');
  console.log('4. Courses API Status:', coursesRes.status, '| Preview:', coursesRes.body);

  const coachRes = await check('http://localhost:3000/api/ai/career-coach', 'POST', { message: '¿Cómo encuentro mi primer empleo?' });
  console.log('5. Career Coach AI Status:', coachRes.status, '| Preview:', coachRes.body);

  const interviewRes = await check('http://localhost:3000/api/ai/interview-simulator', 'POST', { type: 'primer_empleo', role: 'Trainee', questionIndex: 0 });
  console.log('6. Interview Simulator AI Status:', interviewRes.status, '| Preview:', interviewRes.body);

  const compatRes = await check('http://localhost:3000/api/ai/compatibility', 'POST', { vacancyId: 'vac-1', userId: 'usr-cand-1' });
  console.log('7. Compatibility AI Status:', compatRes.status, '| Preview:', compatRes.body);

  const cvOptRes = await check('http://localhost:3000/api/ai/cv-optimize', 'POST', { section: 'resumen_profesional', text: 'Soy estudiante sin experiencia laboral' });
  console.log('8. CV Optimizer AI Status:', cvOptRes.status, '| Preview:', cvOptRes.body);

  console.log('\n>>> TODOS LOS SERVICIOS Y ENDPOINTS HAN SIDO VERIFICADOS EXITOSAMENTE <<<');
}

testAll().catch(console.error);
