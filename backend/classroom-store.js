/**
 * Classroom Store & Auto-Grading Engine for Colleges & Universities
 */

export const SAMPLE_CLASSES = [
  {
    id: 'class-cse301',
    code: 'CSE-301',
    name: 'CS301: Advanced Data Structures & Algorithms',
    instructor: 'Prof. Ramesh Sharma',
    department: 'Computer Science & Engineering',
    semester: 'Fall 2026',
    enrolledCount: 48,
    assignments: [
      {
        id: 'asg-1',
        title: 'Lab 1: Hash Maps & Two Sum Optimization',
        deadline: '2026-11-05T23:59:59Z',
        problemSlug: 'two-sum',
        maxMarks: 100,
        submissionsCount: 42,
        examMode: false,
      },
      {
        id: 'asg-2',
        title: 'Lab Exam 1: Dynamic Programming & Sliding Window (Strict Exam Mode)',
        deadline: '2026-11-10T16:00:00Z',
        problemSlug: 'longest-substring-without-repeating-characters',
        maxMarks: 100,
        submissionsCount: 38,
        examMode: true, // Strict exam mode with fullscreen & anti-cheat
      }
    ],
    students: [
      { id: 'std-1', rollNo: '23CSE001', name: 'Aarav Patel', score: 98, status: 'SUBMITTED', tabSwitches: 0 },
      { id: 'std-2', rollNo: '23CSE002', name: 'Diya Sharma', score: 100, status: 'SUBMITTED', tabSwitches: 0 },
      { id: 'std-3', rollNo: '23CSE003', name: 'Rohan Gupta', score: 85, status: 'SUBMITTED', tabSwitches: 1 },
      { id: 'std-4', rollNo: '23CSE004', name: 'Ananya Verma', score: 92, status: 'SUBMITTED', tabSwitches: 0 },
      { id: 'std-5', rollNo: '23CSE005', name: 'Vikram Singh', score: 40, status: 'FLAGGED', tabSwitches: 4 }, // Anti-cheat flag
    ]
  },
  {
    id: 'class-cse201',
    code: 'CSE-201',
    name: 'CS201: Object Oriented Programming & C++ STL',
    instructor: 'Dr. Priya Sundaram',
    department: 'Computer Science & Engineering',
    semester: 'Fall 2026',
    enrolledCount: 62,
    assignments: [
      {
        id: 'asg-3',
        title: 'Lab 2: Priority Queues & Dijkstra',
        deadline: '2026-11-08T23:59:59Z',
        problemSlug: 'two-sum',
        maxMarks: 100,
        submissionsCount: 51,
        examMode: false,
      }
    ],
    students: [
      { id: 'std-11', rollNo: '24CSE010', name: 'Kavya Nair', score: 95, status: 'SUBMITTED', tabSwitches: 0 },
      { id: 'std-12', rollNo: '24CSE011', name: 'Siddharth Rao', score: 90, status: 'SUBMITTED', tabSwitches: 0 },
    ]
  }
];

export function exportGradebookCsv(classId) {
  const cls = SAMPLE_CLASSES.find(c => c.id === classId) || SAMPLE_CLASSES[0];
  const headers = ['Roll Number', 'Student Name', 'Total Marks', 'Status', 'Tab Switches (Anti-Cheat)'];
  const rows = cls.students.map(s => [s.rollNo, `"${s.name}"`, s.score, s.status, s.tabSwitches]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  return csvContent;
}

