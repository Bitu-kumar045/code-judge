async function testSolved() {
  // 1. Submit AC code to prob-3
  const subRes = await fetch('http://localhost:8080/api/v1/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      problemId: 'prob-3',
      language: 'PYTHON',
      sourceCode: 'print("Result")'
    })
  }).then(r => r.json());

  console.log('1. Submission Verdict:', subRes.data.verdict);

  // 2. Query user solved status
  const solvedRes = await fetch('http://localhost:8080/api/v1/user/solved').then(r => r.json());
  console.log('2. User Solved Count:', solvedRes.data.count);
  console.log('2. User Solved IDs:', solvedRes.data.solvedIds);

  // 3. Query prob-3 detail
  const probRes = await fetch('http://localhost:8080/api/v1/problems/prob-3').then(r => r.json());
  console.log('3. Problem 3 isSolved:', probRes.data.isSolved);

  // 4. Query status=SOLVED filter
  const listRes = await fetch('http://localhost:8080/api/v1/problems?status=SOLVED').then(r => r.json());
  console.log('4. Solved Problems in Filter:', listRes.data.totalElements);
  console.log('4. Solved Problems Content:', listRes.data.content.map(p => ({ no: p.no, title: p.title, isSolved: p.isSolved })));
}

testSolved().catch(console.error);

