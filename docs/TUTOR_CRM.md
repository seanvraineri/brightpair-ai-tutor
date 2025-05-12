# BrightPair Tutor CRM

The Tutor CRM is a comprehensive system designed to help tutors manage their students, track sessions, take notes, and generate progress reports.

## Features

### Tutor Dashboard
- **Student Management:** View all assigned students, filter by grade, subject, or status
- **Session Tracking:** Schedule and monitor upcoming and past tutoring sessions
- **Quick Stats:** Get an overview of student count, recent activities, and upcoming sessions

### Student Management
- **Student Profiles:** Detailed student information including academic needs, goals, and learning preferences
- **Progress Tracking:** Monitor student improvement over time with visual progress indicators
- **Note Taking:** Add session notes and observations about each student
- **Academic Records:** Track test scores, homework completion, and milestone achievements

### Parent Relationship Management
- **Parent Profiles:** View and manage parent contact information and communication preferences
- **AI-Enhanced Messaging:** Send personalized communications with AI assistance to improve tone and effectiveness
- **Report Sharing:** Easily share student progress reports with parents through secure, expiring links
- **Message Templates:** Access pre-built templates for common communications that can be personalized with AI
- **Communication History:** Track all interactions with parents in a centralized conversation view

### Session Tracking
- **Schedule Management:** Create, view, and edit tutoring sessions
- **Attendance Records:** Log student attendance and session durations
- **Session Notes:** Document what was covered in each session and next steps
- **Homework Assignments:** Assign and track homework completion

### Note Taking
- **Session-specific Notes:** Document observations during each tutoring session
- **Long-term Observations:** Track patterns in student learning over time
- **Media Attachments:** Attach images, files, and links to notes for better context

### Progress Reports
- **AI-Assisted Report Generation:** Create comprehensive reports with AI guidance
- **Customizable Templates:** Choose from various report formats based on grade level and subject
- **Parent Sharing Controls:** Easily share reports with parents with customizable permissions and expiration dates
- **Visual Progress Indicators:** Include charts and graphs showing student improvement
- **Personalized Recommendations:** Provide tailored advice for continued improvement

## Technical Implementation

### Database Schema
The Tutor CRM uses Supabase as its database and includes the following key tables:
- `tutors`: Information about tutors
- `student_profiles`: Student details linked to tutors
- `tutor_notes`: Notes created by tutors about students
- `tutor_sessions`: Records of tutoring sessions
- `student_progress_reports`: Reports on student progress
- `parent_profiles`: Information about parents/guardians
- `parent_student_relationships`: Links between parents and students
- `messages`: Communication between tutors and parents
- `report_sharing_settings`: Controls for how reports are shared

### Key Components
- `TutorDashboard`: Main interface for tutors to access all features
- `StudentTable`: Component for displaying and filtering student lists
- `StudentDetail`: Detailed view of individual student information
- `SessionTracker`: Interface for managing tutoring sessions
- `NoteEditor`: Rich text editor for creating student notes
- `ReportGenerator`: AI-assisted tool for creating progress reports
- `MessageComposer`: AI-enhanced communication tools for personalized parent messaging
- `ReportShareOptions`: Controls for sharing reports with customizable permissions

### Data Flow
1. Tutors log in and are authenticated via Supabase Auth
2. Dashboard loads student data and provides access to all CRM features
3. Actions in the CRM (adding notes, scheduling sessions, etc.) are saved to Supabase in real-time
4. AI features utilize the OpenAI API for generating content and enhancing communications
5. Real-time notifications alert tutors about important events and parent responses

## Getting Started

### For Developers
1. Ensure you have access to the Supabase project
2. Review the database schema and component structure
3. Set up environment variables for Supabase and OpenAI
4. Run the application locally with `npm run dev`

### For Tutors
1. Log in to your tutor account
2. Navigate to the Tutor Dashboard to see your assigned students
3. Set up your first student or review existing student profiles
4. Begin tracking sessions, taking notes, and monitoring progress
5. Use the AI-enhanced messaging system to communicate with parents
6. Generate and share progress reports with parents at regular intervals

## Future Enhancements

### Calendar Integration
- Sync with popular calendar apps (Google Calendar, Outlook, etc.)
- Send automated session reminders to tutors, students, and parents

### Billing and Payments
- Track billable hours and generate invoices
- Process payments and manage payment history

### Student/Parent Portals
- Provide dedicated login areas for students and parents
- Allow students to access homework and learning resources
- Give parents visibility into their child's progress

### Enhanced AI Features
- Personalized learning plan generation
- Automated content recommendations based on student needs
- Sentiment analysis of parent communications

### Mobile App
- Develop a companion mobile app for on-the-go access
- Add push notifications for important alerts

## Support

For support with the Tutor CRM, please contact:
- Technical support: tech@brightpair.edu
- Feature requests: product@brightpair.edu
- General inquiries: support@brightpair.edu 