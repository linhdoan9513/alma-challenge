# Alma - System Design Documentation

## 🏗️ System Architecture Overview

Alma is a full-stack lead management system designed for immigration law firms to collect and manage visa application leads. The system follows a modern microservices-inspired architecture with clear separation of concerns between frontend and backend.

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   Frontend      │ ◄──────────────► │    Backend      │
│   (Next.js)     │                  │   (Express.js)  │
└─────────────────┘                  └─────────────────┘
         │                                     │
         │                                     │
         ▼                                     ▼
┌─────────────────┐                  ┌─────────────────┐
│   Browser       │                  │   PostgreSQL    │
│   Storage       │                  │   Database      │
│   (localStorage)│                  └─────────────────┘
└─────────────────┘
```

## 🎯 System Goals & Requirements

### Functional Requirements

- **Public Lead Submission**: Allow potential clients to submit visa application inquiries
- **Admin Dashboard**: Provide administrators with lead management capabilities
- **Lead Status Tracking**: Track lead progression from submission to follow-up
- **Search & Filter**: Efficient lead discovery and organization
- **File Upload**: Resume/CV upload functionality - direct upload to local file system using Multer middleware for local deployment
- **Authentication**: Secure admin access

### Non-Functional Requirements

- **Performance**: Sub-second response times for UI interactions
- **Scalability**: Currently optimized for local deployment with limited concurrent users; scalable to more concurrent users with cloud storage integration (blob storage, S3, etc.)
- **Security**: JWT-based authentication, input validation, rate limiting
- **Maintainability**: Clean code architecture, comprehensive testing
- **Reliability**: Error handling, graceful degradation

## 🏛️ Backend Architecture

### Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Custom middleware with input sanitization
- **File Handling**: Multer for multipart/form-data
- **Security**: Helmet, CORS, Rate Limiting

### Architecture Patterns

#### 1. Layered Architecture

```
┌─────────────────────────────────────┐
│           Controllers               │ ← Request/Response handling
├─────────────────────────────────────┤
│           Middleware                │ ← Authentication, Validation
├─────────────────────────────────────┤
│           Routes                    │ ← Route definitions
├─────────────────────────────────────┤
│           Services                  │ ← Business logic (implicit)
├─────────────────────────────────────┤
│           Data Access              │ ← Prisma ORM
├─────────────────────────────────────┤
│           Database                  │ ← PostgreSQL
└─────────────────────────────────────┘
```

#### 2. Repository Pattern (via Prisma)

```typescript
// Data access layer abstraction
interface LeadRepository {
  create(lead: CreateLeadInput): Promise<Lead>;
  findMany(filters: LeadFilters): Promise<Lead[]>;
  update(id: string, data: UpdateLeadInput): Promise<Lead>;
  findById(id: string): Promise<Lead | null>;
}
```

### Database Design

#### Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐
│    User     │         │    Lead     │
├─────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)     │
│ email       │         │ firstName   │
│ password    │         │ lastName    │
│ role        │         │ email       │
│ createdAt   │         │ linkedin    │
│ updatedAt   │         │ country     │
└─────────────┘         │ visaType    │
                        │ resume      │
                        │ openInput   │
                        │ status      │
                        │ createdAt   │
                        │ updatedAt   │
                        └─────────────┘
```

#### Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      String   @default("admin")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Lead {
  id            String   @id @default(cuid())
  firstName     String
  lastName      String
  email         String
  linkedin      String
  country       String
  visaType      String
  resume        String?
  openInput     String?
  status        String   @default("PENDING")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### API Design

#### RESTful Endpoints

```
Authentication:
POST   /api/auth/login     - Admin login
GET    /api/auth/profile   - Get user profile

Lead Management:
POST   /api/leads/submit   - Submit new lead (public)
GET    /api/leads          - Get leads (admin, paginated)
PATCH  /api/leads/:id/status - Update lead status (admin)
```

#### Request/Response Patterns

```typescript
// Standard API Response Format
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Pagination Response
interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
```

### Security Architecture

#### Authentication Flow

```
1. Client Login Request
   POST /api/auth/login
   { email, password }

2. Server Validation
   - Query PostgreSQL database for user
   - Validate credentials against stored hash
   - Generate JWT token

3. Response
   { success: true, token: "jwt_token", user: {...} }

4. Client Storage
   localStorage.setItem('token', token) // Only JWT token stored

5. Subsequent Requests
   Authorization: Bearer <token>
   Server validates JWT and queries database for user data
```

#### Security Middleware Stack

```typescript
// Middleware execution order
app.use(helmet()); // Security headers
app.use(cors()); // CORS configuration
app.use(rateLimit()); // Rate limiting
app.use(express.json()); // Body parsing
app.use("/api/auth", authRoutes);
app.use("/api/leads", authenticateToken, leadRoutes);
```

#### Input Validation & Sanitization

```typescript
// Validation pipeline
1. Input Sanitization (remove HTML tags)
2. Schema Validation (required fields, formats)
3. Business Logic Validation (URL format, visa selection)
4. Database Constraints (unique emails, foreign keys)
```

### Backend Architectural Decisions

#### Data Processing Strategy

**Sorting and Filtering Implementation**: All sorting and filtering operations are implemented in the backend to handle large amounts of data efficiently. This decision provides several benefits:

- **Performance**: Database-level operations are faster than client-side processing
- **Scalability**: Can handle thousands of records without impacting frontend performance
- **Security**: Prevents exposure of sensitive data through client-side filtering
- **Consistency**: Ensures uniform data processing across all clients
- **Memory Efficiency**: Reduces frontend memory usage by only transferring filtered/sorted data

**Implementation Approach**:

- Query parameters for sorting (e.g., `?sortBy=createdAt&sortOrder=desc`)
- Filter parameters for data filtering (e.g., `?status=PENDING&country=Canada`)
- Pagination support for large datasets
- Database indexes on frequently filtered/sorted columns

## 🎨 Frontend Architecture

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Styled Components
- **State Management**: Redux Toolkit
- **UI Components**: Material-UI (ensures consistent, professional styling and saves development time)
- **Form Handling**: JsonForms (provides data-driven forms with consistent validation and styling)
- **Testing**: Jest + React Testing Library

### Architecture Patterns

#### 1. Component Architecture

```
┌─────────────────────────────────────┐
│           Pages                     │ ← Route-level components
├─────────────────────────────────────┤
│           Components                │ ← Reusable UI components
│  ├── Form Components               │
│  ├── Layout Components             │
│  └── UI Components                 │
├─────────────────────────────────────┤
│           Hooks                    │ ← Custom React hooks
├─────────────────────────────────────┤
│           Store                    │ ← Redux state management
├─────────────────────────────────────┤
│           Services                 │ ← API communication
└─────────────────────────────────────┘
```

#### 2. State Management Architecture

```typescript
// Redux Store Structure
interface RootState {
  lead: {
    formData: LeadFormData;
    isSubmitting: boolean;
    isSubmitted: boolean;
    error: string | null;
  };
  auth: {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
  };
}
```

#### 3. Component Hierarchy

```
App (layout.tsx)
├── Pages
│   ├── HomePage (page.tsx)
│   ├── LeadFormPage (/lead-form/page.tsx)
│   │   └── LeadForm
│   └── AdminPage (/admin/page.tsx)
│       ├── LoginForm (/admin/login/page.tsx)
│       ├── LeadList (embedded in admin page)
│       └── LeadDetail (embedded in admin page)
├── Components (Shared component can be reused across codebase)
│   ├── CountrySelect
│   ├── CountrySelectRenderer
│   ├── VisaCheckboxes
│   ├── CustomResumeUpload
│   ├── FileUploadRenderer
│   ├── SessionProvider


├── Store (Redux)
│   ├── leadSlice
│   └── store
├── Lib
│   ├── api
│   └── countries
└── Styles
    └── styled.d.ts
```

### User Experience & Interface Design

#### 1. Admin Dashboard UX Patterns

**Inline Status Management**: Status buttons are embedded directly within the data grid for better user experience. This design decision provides several benefits:

- **Contextual Actions**: Users can update lead status without navigating away from the list view
- **Reduced Cognitive Load**: No need to open separate modals or forms for simple status changes
- **Faster Workflow**: One-click status updates streamline the lead management process
- **Visual Feedback**: Immediate visual confirmation of status changes
- **Responsive Design**: Status dropdowns adapt to different screen sizes with appropriate column widths

**Implementation Details**:

- Material-UI Select components embedded in table cells
- Optimistic UI updates for immediate feedback
- Proper column width allocation (20% for status column) to prevent text truncation
- Real-time API calls with error handling and rollback on failure

#### 2. Form Design Patterns

**Progressive Disclosure**: Complex forms are broken down into logical sections to reduce cognitive load and improve completion rates.

**Validation Feedback**: Real-time validation with clear error messages and visual indicators.

### Data Flow Architecture

#### 1. Form Submission Flow

```
User Input → Form Validation → Redux State → API Call → Success/Error → UI Update
     ↓              ↓              ↓           ↓           ↓           ↓
  JsonForms    Client-side    Dispatch    submitLeadForm  Response   Success/Error
  Components   Validation     Actions                     Handling    Components
```

#### 2. State Management Flow

```typescript
// Action Flow
User Action → Redux Action → Reducer → State Update → Component Re-render

// Example: Form field update
fireEvent.change(input, { target: { value: 'John' } })
  ↓
dispatch(updateFormData({ firstName: 'John' }))
  ↓
leadSlice.reducer(state, action)
  ↓
newState.formData.firstName = 'John'
  ↓
Component re-renders with new value
```

### Component Design Patterns

#### 1. Container/Presentational Pattern

```typescript
// Container Component (LeadForm)
const LeadForm: React.FC = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.lead.formData);

  return (
    <LeadFormUI
      formData={formData}
      onSubmit={handleSubmit}
      onChange={handleChange}
    />
  );
};

// Presentational Component (LeadFormUI)
const LeadFormUI: React.FC<LeadFormUIProps> = ({
  formData,
  onSubmit,
  onChange,
}) => {
  return <form onSubmit={onSubmit}>...</form>;
};
```

#### 2. Custom Hooks Pattern

```typescript
// Custom hook for form logic
const useLeadForm = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.lead.formData);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      // Form submission logic
    },
    [dispatch, formData]
  );

  return { formData, handleSubmit };
};
```

### Styling Architecture

#### 1. Styled Components Structure

```typescript
// Component-level styling so styling can be reused - example <Icon />
const StyledButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 12px 24px;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;
```

#### 2. Styling Approach

The project uses styled-components for component-level styling without a formal theme system:

- **Component-scoped styling**: Each component defines its own styles
- **Hardcoded design values**: Colors, spacing, and other design tokens are defined inline
- **Global styles**: CSS reset and Material-UI overrides in globals.css
- **No theme provider**: No centralized theme configuration or design tokens - Currently, this has not been implemented, but this should be considered as an enhancement for styling consistency
- **Material-UI integration**: Leverages Material-UI components for consistent form styling and validation
- **JsonForms framework**: Uses JsonForms for data-driven form generation with built-in validation and styling consistency

## 🔄 Data Flow & Communication

### Client-Server Communication

#### 1. API Communication Layer

```typescript
// API client abstraction
class ApiClient {
  private baseURL: string;
  private token: string | null;

  async request<T>(endpoint: string, options: RequestOptions): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.statusText, response.status);
    }

    return response.json();
  }
}
```

#### 2. Error Handling Strategy

```typescript
// Centralized error handling
const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
};
```

### State Synchronization

#### 1. Optimistic Updates

```typescript
// Optimistic UI updates for better UX
const updateLeadStatus = async (leadId: string, status: string) => {
  // Optimistic update
  dispatch(updateLeadStatusOptimistic({ id: leadId, status }));

  try {
    await api.updateLeadStatus(leadId, status);
    dispatch(updateLeadStatusSuccess({ id: leadId, status }));
  } catch (error) {
    // Rollback on error
    dispatch(updateLeadStatusError({ id: leadId, originalStatus }));
  }
};
```

## 🧪 Testing Architecture

### Testing Strategy

#### 1. Testing Pyramid

```
        /\
       /  \     E2E Tests (Not available at the moment - enhancement)
      /____\
     /      \   Integration Tests (Not available at the moment - enhancement)
    /________\
   /          \ Unit Tests (Many) - Currently using Jest for testing in both front end and backend to cover happy path
  /____________\
```

#### 2. Test Coverage Goals

- **Unit Tests**: 80%+ coverage for most test
- **E2E Tests**: Key business scenarios

### Testing Implementation

#### 1. Frontend Testing

```typescript
// Component testing with React Testing Library
describe("LeadForm", () => {
  it("submits form with valid data", async () => {
    render(<LeadForm />);

    // Fill form
    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: "John" },
    });

    // Submit form
    fireEvent.click(screen.getByText("Submit"));

    // Assert success
    await waitFor(() => {
      expect(screen.getByText("Thank You")).toBeInTheDocument();
    });
  });
});
```

#### 2. Backend Testing

```typescript
// API endpoint testing with Supertest
describe("POST /api/leads/submit", () => {
  it("creates new lead with valid data", async () => {
    const response = await request(app)
      .post("/api/leads/submit")
      .send(validLeadData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.firstName).toBe("John");
  });
});
```

## 🚀 Performance & Scalability

### Performance Optimizations

#### 1. Frontend Optimizations

- **Code Splitting**: ✅ Next.js automatic code splitting (implemented)
- **Image Optimization**: ❌ Not implemented - using regular img tags instead of Next.js Image component
- **Bundle Analysis**: ❌ Not implemented - no bundle analyzer configured
- **Lazy Loading**: ❌ Not implemented - enhancement for heavy components and better performance

#### 2. Backend Optimizations

- **Database Indexing**: Proper indexes on frequently queried fields
- **Query Optimization**: Efficient Prisma queries
- **Caching**: Redis for session storage (future)
- **Connection Pooling**: Database connection management

### Scalability Considerations

#### 1. Horizontal Scaling

```
Load Balancer → Multiple Backend Instances → Shared Database
     ↓                    ↓                        ↓
  Nginx/HAProxy    Node.js Clusters         PostgreSQL Cluster
```

#### 2. Database Scaling

- **Read Replicas**: For read-heavy operations
- **Sharding**: By lead submission date
- **Connection Pooling**: PgBouncer for connection management
- **Blob Storage Integration**: Resume files stored in cloud blob storage (AWS S3, Azure Blob Storage, or Google Cloud Storage) instead of local file system
  - **Benefits**:
    - Scalable file storage independent of database size
    - Better performance for file uploads/downloads
    - Reduced database storage costs
    - Global CDN access for faster file delivery
    - Automatic backup and redundancy
  - **Implementation**:
    - Database stores only file metadata (URL, filename, size)
    - Direct upload to blob storage with signed URLs
    - File access through secure, time-limited URLs

## 📈 Future Enhancements

### Planned Features

#### 1. Advanced Lead Management

- **Follow-up Automation**: Email sequences and reminders

#### 2. Technical Improvements

- **Theme System**: Implement centralized theme with design tokens for consistent styling across components
- **Lazy Loading**: Implement React.lazy() and Suspense for component-level code splitting
- **Real-time Updates**: WebSocket integration for admin view
- **File Processing**: Resume parsing and analysis
- **Email Integration**: SMTP for notifications

#### 3. Scalability Enhancements

- **Microservices**: Service decomposition
- **CDN**: Static asset delivery optimization

## 📚 Conclusion

The Alma system demonstrates a modern, scalable architecture that balances simplicity with extensibility. The clear separation between frontend and backend, combined with robust testing and security measures, provides a solid foundation for future growth and feature development.
