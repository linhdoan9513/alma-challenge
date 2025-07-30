"use client";

import { ArrowDownward, ArrowUpward, Search } from "@mui/icons-material";
import {
  FormControl,
  MenuItem,
  Pagination,
  Select,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

// Types
interface Lead {
  id: string;
  name: string;
  submitted: string;
  status: "PENDING" | "REACHED_OUT";
  country: string;
  email: string;
  linkedin: string;
  visaCategories: string[];
  additionalInfo?: string;
  resumePath?: string;
  resumeFileName?: string;
}

interface ApiSubmission {
  id: string;
  timestamp: string;
  data: {
    firstName: string;
    lastName: string;
    email: string;
    linkedin: string;
    country: string;
    o1Visa: boolean;
    eb1aVisa: boolean;
    eb2NiwVisa: boolean;
    dontKnowVisa: boolean;
    openInput?: string;
    resumePath?: string;
    resumeFileName?: string;
  };
  status: string;
}

interface ApiResponse {
  submissions: ApiSubmission[];
  total: number;
  limit: number;
  offset: number;
}

// Styled Components
const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 350px;
  background: linear-gradient(180deg, #d9dea6 0%, #ffffff 20%);
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const SidebarHeader = styled.div`
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const Logo = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: black;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Navigation = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: row;
    gap: 1rem;
    margin-bottom: 1rem;
  }
`;

const NavLink = styled.a.withConfig({
  shouldForwardProp: prop => prop !== "active",
})<{ active?: boolean }>`
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: black;
  font-weight: ${props => (props.active ? "700" : "400")};
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    flex: 1;
    text-align: center;
  }
`;

const SidebarFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: auto;

  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 0.5rem;
  }
`;

const AdminAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: #666;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: black;
  margin: 0 0 1.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
  }
`;

const SearchFilterBar = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: none;
  }
`;

const StyledSearchTextField = styled(TextField)`
  max-width: 300px;

  .MuiOutlinedInput-root {
    border-radius: 8px;
    font-size: 0.875rem;

    .MuiOutlinedInput-notchedOutline {
      border-color: #e0e0e0;
    }

    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: #bdbdbd;
    }

    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #007bff;
    }
  }

  .MuiInputBase-input {
    padding: 0.75rem 1rem 0.75rem 1rem;
  }

  .MuiInputAdornment-root {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
`;

const StyledFilterFormControl = styled(FormControl)`
  min-width: 120px;
  width: 120px;

  .MuiOutlinedInput-root {
    border-radius: 8px;
    font-size: 0.875rem;
    color: #666;

    .MuiOutlinedInput-notchedOutline {
      border-color: #e0e0e0;
    }

    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: #bdbdbd;
    }

    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #1976d2;
    }
  }

  .MuiSelect-select {
    padding: 0.75rem 1rem;
    color: #666;
  }

  .MuiPaper-root {
    width: 120px !important;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #f0f0f0;

  @media (max-width: 768px) {
    margin: 0 -1rem;
    border-radius: 0;
  }
`;

const Table = styled.table`
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
  table-layout: fixed;
`;

const TableHeader = styled.thead`
  border-bottom: 1px solid #e0e0e0;
`;

const TableHeaderCell = styled.th`
  padding: 1.25rem 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--primary-color);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  font-size: 0.875rem;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }
`;

const SortIcon = styled.span`
  display: inline-block;
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: inherit;
  vertical-align: middle;
`;

// Dynamic sort icon component
const SortIconComponent: React.FC<{
  field: keyof Lead;
  currentSortField: keyof Lead;
  currentSortDirection: "asc" | "desc";
}> = ({ field, currentSortField, currentSortDirection }) => {
  const isActive = field === currentSortField;

  if (!isActive) {
    return <ArrowDownward />;
  }

  return currentSortDirection === "asc" ? <ArrowUpward /> : <ArrowDownward />;
};

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1.25rem 1rem;
  color: black;
  text-align: left;
  vertical-align: middle;
  font-size: 1rem;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }
`;

const StyledFormControl = styled(FormControl)`
  min-width: 70px;
  width: 50%;

  .MuiOutlinedInput-root {
    border-radius: 6px;
    font-size: 0.875rem;

    .MuiOutlinedInput-notchedOutline {
      border-color: #e0e0e0;
    }

    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: #bdbdbd;
    }

    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #1976d2;
    }
  }

  .MuiSelect-select {
    padding: 0.5rem 2rem 0.5rem 0.75rem;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 2rem;
`;

const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const Error = styled.div`
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

// Component
// Client-only wrapper to prevent hydration mismatches
const ClientOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  return <>{children}</>;
};

const AdminPage: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (!storedToken) {
      router.push("/admin/login");
      return;
    }
    setToken(storedToken);
  }, [router]);

  // State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Lead>("submitted");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const fetchLeads = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      // Build query parameters for backend sorting and filtering
      const params = new URLSearchParams({
        limit: "10",
        offset: ((currentPage - 1) * 10).toString(),
        sortField: sortField === "submitted" ? "createdAt" : sortField,
        sortDirection: sortDirection,
      });

      if (debouncedSearchTerm) {
        params.append("search", debouncedSearchTerm);
      }

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"
        }/leads?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          router.push("/admin/login");
          return;
        }
        setError(
          `Failed to fetch leads: ${response.statusText || "Unknown error"}`
        );
        return;
      }

      const data: ApiResponse = await response.json();

      // Transform the data to match our interface
      const transformedLeads: Lead[] = data.submissions.map(submission => ({
        id: submission.id,
        name: `${submission.data.firstName} ${submission.data.lastName}`,
        submitted: new Date(submission.timestamp).toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        status: submission.status as "PENDING" | "REACHED_OUT",
        country: submission.data.country,
        email: submission.data.email,
        linkedin: submission.data.linkedin,
        visaCategories: [
          submission.data.o1Visa && "O-1",
          submission.data.eb1aVisa && "EB-1A",
          submission.data.eb2NiwVisa && "EB-2 NIW",
          submission.data.dontKnowVisa && "I don't know",
        ].filter(Boolean) as string[],
        additionalInfo: submission.data.openInput,
        resumePath: submission.data.resumePath,
        resumeFileName: submission.data.resumeFileName,
      }));

      setLeads(transformedLeads);
      setTotalLeads(data.total);
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? String(err.message)
          : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    token,
    router,
    sortField,
    sortDirection,
    debouncedSearchTerm,
    statusFilter,
  ]);

  // Effects
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Event Handlers
  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Debounced search effect
  useEffect(() => {
    setSearching(true);
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setSearching(false);
    }, 500); // Wait 500ms after user stops typing

    return () => {
      clearTimeout(timeoutId);
      setSearching(false);
    };
  }, [searchTerm]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleStatusUpdate = async (
    leadId: string,
    newStatus: "PENDING" | "REACHED_OUT"
  ) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"
        }/leads/${leadId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Status update failed:",
          response.status,
          response.statusText
        );
        console.error("Error response:", errorText);
        setError("Failed to update status");
        return;
      }

      // Update local state
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update lead status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/admin/login");
  };

  // State for total count from backend
  const [totalLeads, setTotalLeads] = useState(0);

  // Computed Values
  const totalPages = Math.ceil(totalLeads / 10);

  // Loading State
  if (loading) {
    return (
      <ClientOnly>
        <AdminContainer>
          <Sidebar>
            <SidebarHeader>
              <Logo>alma</Logo>
            </SidebarHeader>
            <Navigation>
              <NavLink active={true}>Leads</NavLink>
              <NavLink>Settings</NavLink>
            </Navigation>
            <SidebarFooter>
              <AdminAvatar>A</AdminAvatar>
              <span>Admin</span>
            </SidebarFooter>
          </Sidebar>
          <MainContent>
            <Loading>Loading leads...</Loading>
          </MainContent>
        </AdminContainer>
      </ClientOnly>
    );
  }

  // Main Render
  return (
    <ClientOnly>
      <AdminContainer>
        <Sidebar>
          <SidebarHeader>
            <Logo>alma</Logo>
          </SidebarHeader>
          <Navigation>
            <NavLink active={true} onClick={() => router.push("/")}>
              Leads
            </NavLink>
            <NavLink>Settings</NavLink>
          </Navigation>
          <SidebarFooter>
            <AdminAvatar>A</AdminAvatar>
            <span>Admin</span>
            <button
              onClick={handleLogout}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                color: "#666",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </SidebarFooter>
        </Sidebar>

        <MainContent>
          <PageHeader>
            <PageTitle>Leads</PageTitle>

            <SearchFilterBar>
              <SearchContainer>
                <StyledSearchTextField
                  size="small"
                  variant="outlined"
                  placeholder={searching ? "Searching..." : "Search"}
                  value={searchTerm}
                  onChange={e => handleSearchChange(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <Search
                        style={{
                          color: searching ? "#007bff" : "#999",
                          fontSize: "1.25rem",
                        }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: searching ? "#f8f9fa" : "white",
                    },
                  }}
                />
              </SearchContainer>

              <StyledFilterFormControl size="small" variant="outlined">
                <Select
                  value={statusFilter}
                  onChange={e => handleStatusFilterChange(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="all">Status</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="REACHED_OUT">Reached Out</MenuItem>
                </Select>
              </StyledFilterFormControl>
            </SearchFilterBar>
          </PageHeader>

          {error && <Error>{error}</Error>}

          <TableContainer>
            <Table>
              <colgroup>
                <col style={{ width: "25%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "25%" }} />
              </colgroup>
              <TableHeader>
                <tr>
                  <TableHeaderCell onClick={() => handleSort("name")}>
                    <span>Name</span>
                    <SortIcon>
                      <SortIconComponent
                        field="name"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                      />
                    </SortIcon>
                  </TableHeaderCell>
                  <TableHeaderCell onClick={() => handleSort("submitted")}>
                    <span>Submitted</span>
                    <SortIcon>
                      <SortIconComponent
                        field="submitted"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                      />
                    </SortIcon>
                  </TableHeaderCell>
                  <TableHeaderCell onClick={() => handleSort("status")}>
                    <span>Status</span>
                    <SortIcon>
                      <SortIconComponent
                        field="status"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                      />
                    </SortIcon>
                  </TableHeaderCell>
                  <TableHeaderCell onClick={() => handleSort("country")}>
                    <span>Country</span>
                    <SortIcon>
                      <SortIconComponent
                        field="country"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                      />
                    </SortIcon>
                  </TableHeaderCell>
                  <TableHeaderCell>
                    <span>Resume</span>
                  </TableHeaderCell>
                </tr>
              </TableHeader>
              <TableBody>
                {leads.map(lead => (
                  <TableRow key={lead.id}>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.submitted}</TableCell>
                    <TableCell>
                      <StyledFormControl size="small" variant="outlined">
                        <Select
                          value={lead.status}
                          onChange={e =>
                            handleStatusUpdate(
                              lead.id,
                              e.target.value as "PENDING" | "REACHED_OUT"
                            )
                          }
                        >
                          <MenuItem value="PENDING">Pending</MenuItem>
                          <MenuItem value="REACHED_OUT">Reached Out</MenuItem>
                        </Select>
                      </StyledFormControl>
                    </TableCell>
                    <TableCell>{lead.country}</TableCell>
                    <TableCell>
                      {lead.resumePath ? (
                        <a
                          href={`${
                            process.env.NEXT_PUBLIC_API_URL ||
                            "http://localhost:5001/api"
                          }/../uploads/resumes/${lead.resumePath
                            .split("/")
                            .pop()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#007bff",
                            textDecoration: "underline",
                          }}
                        >
                          {lead.resumeFileName || "View Resume"}
                        </a>
                      ) : (
                        <span style={{ color: "#999" }}>No resume</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <PaginationContainer>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              shape="rounded"
              size="large"
            />
          </PaginationContainer>
        </MainContent>
      </AdminContainer>
    </ClientOnly>
  );
};

export default AdminPage;
