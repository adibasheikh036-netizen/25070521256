// Demo content for the dashboard cards. The account details and the numbers
// in the stat cards come from the server; these lists are sample data.

export const courses = [
  { code: 'CS201', title: 'Data Structures', teacher: 'Dr. R. Mehta', progress: 72, tone: 'violet', icon: 'binary' },
  { code: 'CS204', title: 'Database Systems', teacher: 'Prof. S. Sharma', progress: 58, tone: 'pink', icon: 'database' },
  { code: 'CS210', title: 'Web Development', teacher: 'Ms. N. Khan', progress: 86, tone: 'cyan', icon: 'code' },
  { code: 'MA202', title: 'Discrete Mathematics', teacher: 'Dr. A. Rao', progress: 41, tone: 'amber', icon: 'sigma' },
];

export const schedule = [
  { start: '09:00', end: '10:00', title: 'Data Structures', place: 'Room 204', type: 'Lecture' },
  { start: '11:00', end: '12:30', title: 'Web Development Lab', place: 'Lab 3', type: 'Lab' },
  { start: '14:00', end: '15:00', title: 'Discrete Mathematics', place: 'Room 110', type: 'Tutorial' },
  { start: '16:00', end: '17:00', title: 'Coding Club Meetup', place: 'Seminar Hall', type: 'Event' },
];

export const notices = [
  { title: 'Mid-term exams begin on 10 November', meta: '2 hours ago', tone: 'pink', tag: 'Exams' },
  { title: 'Hackathon 2026 registrations are open', meta: 'Yesterday', tone: 'violet', tag: 'Event' },
  { title: 'Library stays open till 10 PM this week', meta: '2 days ago', tone: 'cyan', tag: 'Campus' },
];
