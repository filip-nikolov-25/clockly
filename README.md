<h1>Clockly</h1>

<p>
Modern employee management and leave tracking platform built with a clean UI,
real-time notifications, and smart absence management, and time tracking for employees.
</p>

<h2>Overview</h2>

<p>
Clockly is a full-stack web application designed to help companies manage employees,track working hours on employees,
absences, notifications, and internal HR workflows in a simple and modern way.
</p>
<p>
The application supports a multi-company architecture, allowing multiple companies to operate independently within the same system. Each company can have its own administrators and employees, with fully isolated data and workflows.
</p>

<p>
It provides separate experiences for administrators and employees per company, including leave request management, time tracking for employees, email notifications, role-based access control, dashboards, employee statistics, calendars, weekly work schedules, and much more.
</p>

<hr />

<h1>Features</h1>

<h2>Authentication &amp; Security</h2>

<ul>
  <li>Secure user authentication</li>
  <li>Login and registration system</li>
  <li>Forgot password functionality</li>
  <li>Protected routes</li>
  <li>Cookie-based authentication</li>
  <li>Role-based access control</li>
  <li>Admin and employee permissions</li>
  <li>Rate limiting for API protection</li>
  <li>Secure backend validation</li>
</ul>

<hr />

<h2>Employee Management</h2>

<ul>
  <li>Create and manage employees</li>

  <li>
    Track monthly logged working hours for each employee
  </li>
  <li>
    Employee directory with search and filtering functionality
  </li>
  <li>
    View detailed employee information in a structured dashboard
  </li>
  <li>
    Manage and update employee free days with admin confirmation
  </li>
  <li>
    Monitor work hours across the company in real time
  </li>
  <li>
    Secure admin-only controls for sensitive employee updates
  </li>
</ul>

<hr />

<h2>Week Calendar</h2>

<ul>
  <li>Track employee work schedules throughout the entire week</li>

  <li>
    Monitor how much time each employee has logged during working days
  </li>

  <li>
    Track employee absences independently, including Vacation,
    Personal Leave, and Sick Leave
  </li>

  <li>
    Automatically display public holidays based on the employee’s
    registered country
  </li>

  <li>
    Weekly calendar overview with real-time employee availability tracking
  </li>

  <li>
    Visual distinction between working days, weekends, holidays,
    and leave requests
  </li>

  <li>
    Dynamic work-hour calculations with daily logged time summaries
  </li>

  <li>
    Smart employee scheduling interface with responsive calendar design
  </li>
</ul>

<hr />

<h2>Monthly calendar view for tracking employee schedules and availability</h2>
<ul>

  <li>
    Navigate between months to view past and upcoming schedules
  </li>

  <li>
    Filter public holidays by country (MK, CH, DE or all countries); currently have public holidays only for these 3 countries
  </li>

  <li>
    Display country-specific public holidays automatically based on configuration
  </li>

  <li>
    Highlight holidays directly inside each calendar day
  </li>
  <li>
    Visual distinction between today, normal days, and holiday events
  </li>
  <li>
    Clean UI with hover effects and tooltips for holiday details
  </li>
</ul>

<h2>Leave &amp; Absence Management</h2>

<ul>
  <li>Request leave/absence</li>
  <li>Multiple leave types</li>
  <li>Approve or decline requests</li>
  <li>Leave request history</li>
  <li>Remaining free days calculation</li>
  <li>Vacation tracking</li>
  <li>Sick leave support</li>
  <li>Calendar integration</li>
  <li>Date validations</li>
  <li>Conflict prevention for requests</li>
</ul>

<hr />

<h2>Notifications System</h2>

<ul>
  <li>Real-time notifications</li>
  <li>Employee notifications</li>
  <li>Admin notifications</li>
  <li>Read/unread notifications</li>
  <li>Notification pagination</li>
  <li>Optimized notification queries</li>
  <li>Email notifications for leave requests directly send to all ADMIN accounts</li>
  <li>Email notifications for approved/declined requests</li>
</ul>

<hr />

<h2>Email Integration</h2>

<ul>
  <li>Automated email sending</li>
  <li>Admin email alerts</li>
  <li>Employee status emails || APPROVED OR DECLINED</li>
  <li>Resend email integration</li>
  <li>Branded email templates</li>
</ul>

<hr />

<h2>Dashboard &amp; Analytics</h2>

<ul>
  <li>Employee overview dashboard</li>
  <li>Leave statistics</li>
  <li>Company insights</li>
  <li>Work hour summaries</li>
  <li>Absence tracking analytics</li>
</ul>

<hr />

<h2>UI / UX</h2>

<ul>
  <li>Responsive design</li>
  <li>Modern clean interface</li>
  <li>Tailwind CSS styling</li>
  <li>Smooth animations</li>
  <li>Mobile-friendly experience</li>
  <li>Sidebar navigation</li>
  <li>Interactive tables</li>
  <li>Beautiful modals and forms</li>
  <li>Dark modern design language</li>
</ul>

<hr />

<h1>Tech Stack</h1>

<h2>Frontend</h2>

<ul>
  <li>React</li>
  <li>TypeScript</li>
  <li>React Router</li>
  <li>Tailwind CSS</li>
  <li>Axios</li>
  <li>Lucide React Icons</li>
</ul>

<h2>Backend Packages</h2>

<ul>
  <li><strong>jsonwebtoken</strong> — Authentication with JWT tokens</li>
  <li><strong>bcryptjs</strong> — Password hashing</li>
  <li><strong>cookie-parser</strong> — Cookie handling middleware</li>
  <li><strong>cors</strong> — Cross-origin request handling</li>
  <li><strong>express-rate-limit</strong> — API rate limiting and security</li>
  <li><strong>resend</strong> — Email sending service</li>
</ul>

<h2>Backend</h2>

<ul>
  <li>Node.js</li>
  <li>Express.js</li>
  <li>PostgreSQL</li>
</ul>

<h2>Other services</h2>

<ul>
  <li>Resend (email service)</li>
</ul>

<hr />

<h1>Main Functionalities</h1>

<h2>Admin</h2>

<ul>
  <li>Manage employees</li>
  <li>Track employee's working hours</li>
  <li>Approve or reject leave requests</li>
  <li>View all notifications</li>
  <li>Track employee absences</li>
  <li>Update employee free days</li>
  <li>View dashboards and analytics</li>
  <li>Manage company workflow</li>
</ul>

<h2>Employee</h2>

<ul>
  <li>Submit leave requests</li>
  <li>Employee's can log their working time daily</li>
  <li>Track request status</li>
  <li>Receive notifications</li>
  <li>View remaining free days</li>
  <li>Manage personal profile</li>
  <li>Check full absence history</li>
</ul>

<hr />

<h1>API Features</h1>

<ul>
  <li>REST API architecture</li>
  <li>Pagination support</li>
  <li>Optimized SQL queries</li>
  <li>Authentication middleware</li>
  <li>Validation middleware</li>
  <li>Secure cookie handling</li>
</ul>

<hr />

<h1>Performance Optimizations</h1>

<ul>
  <li>Optimized database queries</li>
  <li>Infinite scrolling support</li>
  <li>Pagination for notifications</li>
  <li>Debounced requests for password reset functionality</li>
  <li>Efficient state management</li>
  <li>Responsive rendering</li>
</ul>

<hr />

<h1>Deployed</h1>

<h2>Frontend</h2>

<ul>
  <li>Vercel</li>
</ul>

<h2>Backend</h2>

<ul>
  <li>Render</li>
</ul>

<hr />

<h1>Author</h1>

<p>Made by Filip Nikolov</p>
<hr />
