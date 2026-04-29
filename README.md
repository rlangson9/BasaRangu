# ServiceHub - Multi-Role Marketplace Platform

A comprehensive web-based marketplace platform combining **home services**, **errands**, and **job recruitment** (BOSS Zhipin style) in a single application.

## 🎯 Platform Overview

ServiceHub is a full-featured marketplace with 5 distinct user roles, each with dedicated UIs and functionality:

### 1. **User/Seeker** (Home Services & Errands)
- Dark theme UI (BOSS Zhipin Job Seeker style)
- Post jobs/errands with budget and location
- Browse available workers
- In-app chat with moderation
- Escrow payment system
- Rate and review workers

### 2. **Service Provider** (Skilled Workers)
- Dark theme UI (BOSS Zhipin Recruiter style)
- Browse available jobs by category
- Submit quotes and proposals
- Track active jobs and earnings
- Withdraw to bank account
- ID/skill verification

### 3. **Errand Runner** (Task Assistants)
- Dark theme UI (Hybrid style)
- Accept nearby errands
- Route optimization ready
- Track completed tasks
- Real-time earnings dashboard
- Quick withdrawal

### 4. **Recruiter/Company** (Job Recruitment)
- **Light theme UI** (BOSS Zhipin Company style)
- Post full-time/part-time jobs
- Browse candidate profiles
- Direct chat with candidates
- View resumes and portfolios
- Hiring analytics dashboard

### 5. **Admin** (Desktop Only)
- Comprehensive dashboard
- User management
- Job/errand monitoring
- Transaction oversight
- Platform analytics
- Dispute resolution

## 🚀 Key Features

### Authentication & Security
- Phone OTP login/registration
- Multi-role support (users can have multiple roles)
- Seamless role switching via role icon
- Secure token-based authentication

### Job & Errand Management
- Post jobs with photos, budget, and approximate location
- Search, filter, and category browsing
- Application/quote system
- Status tracking (open → in_progress → completed)

### Chat System
- Real-time in-app messaging
- **Automated moderation** (blocks phone/email/WhatsApp sharing)
- Violation warnings
- Per-job chat rooms

### Payment & Escrow
- Escrow payment system
- Exact location revealed only after payment
- 15% platform commission
- Secure payout to providers
- Transaction history

### Location Privacy
- Approximate location shown before payment
- Exact address revealed after payment confirmation
- Prevents early contact outside platform

### Verification
- ID verification for workers
- Company verification for recruiters
- Skill certification system
- Verified badges

### Reviews & Ratings
- Two-way rating system
- Detailed reviews
- Average rating calculation
- Review count tracking

## 📱 Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router 7** (Data mode routing)
- **Tailwind CSS v4** for styling
- **shadcn/ui** components
- **Lucide Icons**
- **Sonner** for toasts
- Responsive design (mobile-first)

### Backend
- **Hono** web framework (Deno)
- **Supabase** Edge Functions
- **KV Store** for data persistence
- RESTful API architecture

### State Management
- React hooks (useState, useEffect)
- LocalStorage for auth tokens
- Real-time polling for chat

## 🎨 UI/UX Design

### BOSS Zhipin-Inspired Design System

#### Dark Theme (User/Provider/Runner)
- Background: `zinc-950`
- Cards: `zinc-900` with `zinc-800` borders
- Primary color: `teal-500`
- Text: white/zinc-300/zinc-400
- Bottom navigation with 4 tabs
- Active state: teal
- Badge notifications: red

#### Light Theme (Recruiter/Company)
- Background: `zinc-50`
- Cards: `white` with `zinc-200` borders
- Primary color: `teal-500`
- Text: zinc-900/zinc-600/zinc-400
- Professional, clean interface
- Hiring-focused layouts

#### Admin Theme (Desktop)
- Dark sidebar navigation
- Data-rich dashboard
- Table-based interfaces
- Desktop-optimized (min-width: 1024px)

## 📂 Project Structure

```
/src
  /app
    /components
      - BottomNav.tsx          # Mobile bottom navigation
      - RoleSwitcher.tsx       # Role switching dropdown
      - JobCard.tsx            # Job listing card
      /ui                      # shadcn/ui components
    /pages
      - LoginPage.tsx          # Phone OTP authentication
      - JobDetail.tsx          # Job details & applications
      - PostJob.tsx            # Create new job/errand
      - ChatPage.tsx           # In-app messaging
      /user                    # Service seeker pages
      /provider                # Service provider pages
      /runner                  # Errand runner pages
      /recruiter               # Company/recruiter pages
      /admin                   # Admin dashboard pages
    - App.tsx                  # Root redirect logic
    - routes.tsx               # React Router configuration
  /styles
    - tailwind.css             # Tailwind imports
    - theme.css                # Custom theme tokens
/supabase/functions/server
  - index.tsx                  # API routes & logic
  - kv_store.tsx              # Database utilities

```

## 🔐 Security & Moderation

### Chat Moderation
The system automatically blocks messages containing:
- Phone numbers
- Email addresses
- WhatsApp mentions
- External contact information
- URLs ending in `.com`
- Phrases like "call me", "contact me"

### Location Privacy
1. Users see only approximate location (e.g., "Downtown, San Francisco")
2. Payment required to unlock exact address
3. Prevents off-platform contact before transaction

### Payment Security
- Escrow system holds funds until job completion
- User confirms completion before release
- Platform commission (15%) deducted automatically
- Dispute resolution available via admin

## 🌐 API Endpoints

### Authentication
- `POST /auth/send-otp` - Send OTP to phone
- `POST /auth/verify-otp` - Verify OTP & login/register
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile
- `POST /auth/switch-role` - Switch active role

### Jobs & Errands
- `POST /jobs` - Create job/errand
- `GET /jobs` - List jobs (filterable)
- `GET /jobs/:id` - Get job details
- `POST /jobs/:id/apply` - Apply to job
- `POST /jobs/:id/accept/:applicantId` - Accept applicant
- `POST /jobs/:id/complete` - Mark job complete

### Payments
- `POST /payments` - Create escrow payment
- `POST /jobs/:id/complete` - Complete & release payment

### Chat
- `POST /chat/:jobId/messages` - Send message
- `GET /chat/:jobId/messages` - Get messages

### Reviews
- `POST /reviews` - Submit review

### Admin
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/users` - List all users

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Access the application:
   - Frontend: `http://localhost:5173`
   - Backend: Supabase Edge Functions

### First Login

1. Navigate to `/login`
2. Enter a phone number (e.g., `+1 234 567 8900`)
3. Click "Send OTP"
4. The OTP will be displayed in the console (development mode)
5. Enter the OTP and login
6. You'll start with the "User" role by default

### Switching Roles

1. Click the role icon in the top-right corner
2. Select a different role from the dropdown
3. The UI will instantly switch to match that role's theme

### Testing Different Roles

**As User:**
- Post a home service job (e.g., plumbing repair)
- Browse available workers

**As Provider:**
- Switch to provider role
- Browse available jobs
- Apply with a quote

**As Runner:**
- Switch to runner role
- Look for errand tasks
- Accept and complete tasks

**As Recruiter:**
- Switch to recruiter role (light theme)
- Post a job opening
- Browse candidate profiles

**As Admin (Desktop):**
- Switch to admin role
- Access `/admin` dashboard
- View users, jobs, and transactions

## 📊 Data Flow

### Job Posting Flow
1. User posts job → Stored in KV with `job:` prefix
2. Added to user's job list → `userJobs:{userId}`
3. Appears in provider/runner feeds
4. Status: `open`

### Application Flow
1. Provider applies → Application added to job
2. Stored separately → `application:{id}`
3. User reviews applicants
4. User accepts → Status changes to `in_progress`

### Payment Flow
1. User makes payment → Escrow created
2. Payment linked to job → `paymentId` field
3. Job status → `paid`
4. Location revealed to provider
5. User confirms completion → `completed`
6. Payment released → Commission deducted
7. Funds added to provider wallet

### Review Flow
1. Job completed
2. Both parties submit reviews
3. Ratings calculated
4. User profiles updated

## 🎯 Business Logic

### Commission Structure
- Platform fee: **15%** of job budget
- Deducted upon completion
- Example: $100 job = $85 to provider, $15 to platform

### Status Lifecycle
```
open → paid → in_progress → completed
```

### Role Permissions
- **User**: Post jobs, pay, confirm completion
- **Provider/Runner**: Apply, accept, complete work
- **Recruiter**: Post jobs, browse candidates, hire
- **Admin**: Full platform access, moderation

## 🔧 Customization

### Adding New Job Categories
Edit `/src/app/pages/PostJob.tsx`:
```typescript
const categories = {
  service: ["Cleaning", "Plumbing", "YourNewCategory"],
  // ...
}
```

### Changing Commission Rate
Edit `/supabase/functions/server/index.tsx`:
```typescript
const commission = payment.amount * 0.15; // Change 0.15 to your rate
```

### Modifying Chat Moderation Rules
Edit `/supabase/functions/server/index.tsx`:
```typescript
const forbidden = ["whatsapp", "phone", "email", "YourWord"];
```

## 🐛 Known Limitations

1. **Mobile App**: This is a web application, not a native iOS/Android app
2. **Real-time Chat**: Currently uses polling (3s interval), not WebSockets
3. **Payment Integration**: Mock payment system (integrate Stripe/PayPal for production)
4. **SMS OTP**: OTP is logged to console (integrate Twilio for production)
5. **File Uploads**: Not implemented (add Supabase Storage for production)
6. **Push Notifications**: Not available in web context

## 📈 Future Enhancements

- [ ] Real-time chat with WebSockets
- [ ] File/image uploads for jobs
- [ ] Payment gateway integration (Stripe)
- [ ] SMS OTP service (Twilio)
- [ ] Push notifications (PWA)
- [ ] Advanced search and filters
- [ ] Calendar integration
- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] Offline mode (PWA)

## 📄 License

MIT License - See LICENSE file for details

## 👥 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ using React, Tailwind CSS, and Supabase**
