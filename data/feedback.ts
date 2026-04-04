export type FeedbackCategory =
  | 'Mental Health Resources'
  | 'Food Quality'
  | 'Safety'
  | 'Facilities'
  | 'School Policy'
  | 'Events & Activities'
  | 'Other';

export type FeedbackStatus = 'pending' | 'acknowledged' | 'resolved';

export interface FeedbackItem {
  id: string;
  category: FeedbackCategory;
  message: string;
  status: FeedbackStatus;
  submittedAt: string; // ISO date string
  adminNote?: string;
  resolvedAt?: string;
}

// Helper to get date N days ago
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const seedFeedback: FeedbackItem[] = [
  {
    id: 'fb-001',
    category: 'Mental Health Resources',
    message: 'It would really help if there were more drop-in counseling hours. Sometimes I really need to talk to someone during the school day but the schedule makes it hard to get an appointment quickly.',
    status: 'acknowledged',
    submittedAt: daysAgo(28),
    adminNote: 'We hear you. We are working on expanding drop-in hours starting next semester. Thank you for sharing this.',
  },
  {
    id: 'fb-002',
    category: 'Food Quality',
    message: 'The new veggie wrap option in the cafeteria is actually really good. Please keep it! It would be even better with more sauce options.',
    status: 'resolved',
    submittedAt: daysAgo(27),
    adminNote: 'Thank you! We have added two new sauce options as of this week.',
    resolvedAt: daysAgo(20),
  },
  {
    id: 'fb-003',
    category: 'Facilities',
    message: 'The bathrooms near the gym smell really bad most afternoons. They need more frequent cleaning, especially during and after PE classes.',
    status: 'resolved',
    submittedAt: daysAgo(26),
    adminNote: 'Janitorial schedule updated. Gym bathrooms now cleaned twice daily.',
    resolvedAt: daysAgo(18),
  },
  {
    id: 'fb-004',
    category: 'Safety',
    message: 'Students are consistently running through the hallways near the science wing during passing periods and it feels dangerous. I almost got knocked over twice this week.',
    status: 'acknowledged',
    submittedAt: daysAgo(25),
    adminNote: 'We are adding staff monitoring in the science wing hallway during passing periods.',
  },
  {
    id: 'fb-005',
    category: 'School Policy',
    message: 'The phone policy is confusing. Some teachers allow phones in class while others don\'t. It would be easier if there was one clear school-wide rule that everyone followed.',
    status: 'pending',
    submittedAt: daysAgo(24),
  },
  {
    id: 'fb-006',
    category: 'Events & Activities',
    message: 'Can we please have more cultural events? Like a multicultural fair where different clubs celebrate their heritage with food and performances. EHS is so diverse and we should celebrate that more.',
    status: 'acknowledged',
    submittedAt: daysAgo(23),
    adminNote: 'Great idea! We have shared this with ASB and the Activities Director. A cultural showcase is being planned for spring semester.',
  },
  {
    id: 'fb-007',
    category: 'Mental Health Resources',
    message: 'AP season is absolutely brutal. I wish the school had more structured study hall options or peer tutoring that was easier to access during finals prep.',
    status: 'acknowledged',
    submittedAt: daysAgo(22),
    adminNote: 'We are piloting an expanded peer tutoring program this semester. Stay tuned for announcements.',
  },
  {
    id: 'fb-008',
    category: 'Food Quality',
    message: 'The coffee cart near the library is a lifesaver but it runs out of the good stuff by 8:30am. Can they make more? Or add a second cart?',
    status: 'resolved',
    submittedAt: daysAgo(21),
    adminNote: 'Supply has been increased. The cart now stocks 40% more inventory in the mornings.',
    resolvedAt: daysAgo(14),
  },
  {
    id: 'fb-009',
    category: 'Facilities',
    message: 'The Wi-Fi in the 200s building drops constantly during 3rd and 4th period. It makes it really hard to do any classwork that requires internet access.',
    status: 'resolved',
    submittedAt: daysAgo(20),
    adminNote: 'IT installed two additional access points in the 200 building. Signal should be much improved.',
    resolvedAt: daysAgo(10),
  },
  {
    id: 'fb-010',
    category: 'School Policy',
    message: 'The dress code is enforced really inconsistently. Some students get sent to the office while others wearing the same thing don\'t. This feels unfair.',
    status: 'pending',
    submittedAt: daysAgo(19),
  },
  {
    id: 'fb-011',
    category: 'Mental Health Resources',
    message: 'I think EHS should have an anonymous peer support group. Sometimes it\'s easier to talk to other students who understand what high school stress is like rather than adults.',
    status: 'pending',
    submittedAt: daysAgo(18),
  },
  {
    id: 'fb-012',
    category: 'Events & Activities',
    message: 'The Winter Rally was so fun! Please do more spirit events like that. The senior skit was hilarious. Can we do class competitions more often?',
    status: 'resolved',
    submittedAt: daysAgo(17),
    adminNote: 'Glad you enjoyed it! ASB is planning monthly spirit events for the rest of the year.',
    resolvedAt: daysAgo(12),
  },
  {
    id: 'fb-013',
    category: 'Safety',
    message: 'The crosswalk on Dublin Blvd near the school entrance is really dangerous. Cars don\'t stop and students are having close calls in the morning. Can the school talk to the city about a crossing guard?',
    status: 'acknowledged',
    submittedAt: daysAgo(16),
    adminNote: 'Administration has contacted the City of Dublin. A traffic safety assessment is scheduled.',
  },
  {
    id: 'fb-014',
    category: 'Facilities',
    message: 'The outdoor seating area near the quad needs more picnic tables. At lunch there\'s nowhere to sit outside and students end up eating on the ground.',
    status: 'pending',
    submittedAt: daysAgo(15),
  },
  {
    id: 'fb-015',
    category: 'Food Quality',
    message: 'Please bring back the breakfast burritos! They removed them a few months ago and so many people miss them. They were the best option on the menu.',
    status: 'pending',
    submittedAt: daysAgo(14),
  },
  {
    id: 'fb-016',
    category: 'School Policy',
    message: 'The parking lot situation for students is a nightmare. There aren\'t enough spots and the lottery feels rigged. Can we get a fairer system?',
    status: 'acknowledged',
    submittedAt: daysAgo(13),
    adminNote: 'We are reviewing the parking permit process and will share updates by end of semester.',
  },
  {
    id: 'fb-017',
    category: 'Mental Health Resources',
    message: 'I\'m really struggling with test anxiety and I don\'t know where to get help at school. Can you make it clearer what resources exist and how to access them?',
    status: 'resolved',
    submittedAt: daysAgo(12),
    adminNote: 'A resource guide has been added to the school website and posted in all classrooms. Counselors also host a weekly stress management workshop on Thursdays at lunch.',
    resolvedAt: daysAgo(5),
  },
  {
    id: 'fb-018',
    category: 'Events & Activities',
    message: 'The club fair was amazing this year. So many options! I joined three clubs. The organization was really good and the booths were creative.',
    status: 'resolved',
    submittedAt: daysAgo(11),
    adminNote: 'Thank you for the kind words! We will share this with ASB.',
    resolvedAt: daysAgo(9),
  },
  {
    id: 'fb-019',
    category: 'Facilities',
    message: 'The computer lab in the library is outdated. Half the computers are slow or have broken keyboards. It\'s really hard to get work done in there.',
    status: 'acknowledged',
    submittedAt: daysAgo(10),
    adminNote: 'A technology upgrade request has been submitted to the district. We hope to have new equipment by next school year.',
  },
  {
    id: 'fb-020',
    category: 'Other',
    message: 'Thank you to whoever started the loaner umbrella station near the main office. It has saved me multiple times on rainy days. EHS is actually pretty thoughtful sometimes.',
    status: 'resolved',
    submittedAt: daysAgo(9),
    adminNote: 'So glad it helps! This was started by a student volunteer group. We will pass along your thanks.',
    resolvedAt: daysAgo(7),
  },
  {
    id: 'fb-021',
    category: 'Safety',
    message: 'There needs to be better lighting in the parking lot after dark. When we have evening events the lot is really dim and it feels unsafe walking to cars.',
    status: 'pending',
    submittedAt: daysAgo(8),
  },
  {
    id: 'fb-022',
    category: 'School Policy',
    message: 'Can we get more gender-neutral bathroom options on campus? There are some students who feel uncomfortable using gendered restrooms and there should be more inclusive options.',
    status: 'acknowledged',
    submittedAt: daysAgo(7),
    adminNote: 'We are working with the district facilities team to identify locations for all-gender restrooms. More updates coming.',
  },
  {
    id: 'fb-023',
    category: 'Food Quality',
    message: 'The lunch lines move so slowly. By the time you get your food you barely have time to eat. Can we have more serving stations or a pre-order option?',
    status: 'pending',
    submittedAt: daysAgo(5),
  },
  {
    id: 'fb-024',
    category: 'Events & Activities',
    message: 'I think EHS should have a hackathon or tech fair for CS students. Other schools in the district have them and it would be cool to compete and show our projects.',
    status: 'pending',
    submittedAt: daysAgo(3),
  },
  {
    id: 'fb-025',
    category: 'Mental Health Resources',
    message: 'Finals week is next month and I already feel behind. It would be great if teachers could coordinate so we don\'t have four finals on the same day. That is just cruel.',
    status: 'pending',
    submittedAt: daysAgo(1),
  },
];

export const feedbackCategories: FeedbackCategory[] = [
  'Mental Health Resources',
  'Food Quality',
  'Safety',
  'Facilities',
  'School Policy',
  'Events & Activities',
  'Other',
];
