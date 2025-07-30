'use client';

import {
  ArrowDownward,
  ArrowUpward,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Search
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

// Types
interface Lead {
  id: string;
  name: string;
  submitted: string;
  status: 'PENDING' | 'REACHED_OUT';
  country: string;
  email: string;
  linkedin: string;
  visaCategories: string[];
  additionalInfo?: string;
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
  background-color: #f5f5f5;
`;

const Sidebar = styled.div`
  width: 250px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
`;

const SidebarHeader = styled.div`
  margin-bottom: 2rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`;

const Navigation = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavLink = styled.a.withConfig({
  shouldForwardProp: prop => prop !== 'active',
})<{ active?: boolean }>`
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: ${props => (props.active ? '#333' : '#666')};
  font-weight: ${props => (props.active ? '600' : '400')};
  border-radius: 8px;
  background: ${props => (props.active ? '#f0f0f0' : 'transparent')};
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
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
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 1.5rem 0;
`;

const SearchFilterBar = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.875rem;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #333;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 1.25rem;
`;

const StatusFilter = styled.select`
  padding: 0.75rem 2rem 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1rem;

  &:focus {
    outline: none;
    border-color: #333;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const TableHeader = styled.thead`
  background: #f8f9fa;
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;

  &:hover {
    background: #f0f0f0;
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
  currentSortDirection: 'asc' | 'desc';
}> = ({ field, currentSortField, currentSortDirection }) => {
  const isActive = field === currentSortField;

  if (!isActive) {
    return <ArrowDownward />;
  }

  return currentSortDirection === 'asc' ? <ArrowUpward /> : <ArrowDownward />;
};

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #f0f0f0;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #333;
  text-align: left;
  vertical-align: middle;
`;

const StatusSelect = styled.select`
  padding: 0.25rem 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
  font-size: inherit;
  color: #333;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.25rem center;
  background-size: 0.75rem;
  padding-right: 1.5rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button.withConfig({
  shouldForwardProp: prop => prop !== 'active',
})<{ active?: boolean }>`
  padding: 0.5rem 0.75rem;
  border: 1px solid #e0e0e0;
  background: ${props => (props.active ? '#333' : 'white')};
  color: ${props => (props.active ? 'white' : '#333')};
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    background: ${props => (props.active ? '#333' : '#f0f0f0')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
const AdminPage: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (!storedToken) {
      router.push('/admin/login');
      return;
    }
    setToken(storedToken);
  }, [router]);

  // State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Lead>('submitted');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // API Functions
  const fetchLeads = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      // Build query parameters for backend sorting and filtering
      const params = new URLSearchParams({
        limit: '10',
        offset: ((currentPage - 1) * 10).toString(),
        sortField: sortField === 'submitted' ? 'createdAt' : sortField,
        sortDirection: sortDirection,
      });

      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/leads?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          router.push('/admin/login');
          return;
        }
        setError(`Failed to fetch leads: ${response.statusText || 'Unknown error'}`);
        return;
      }

      const data: ApiResponse = await response.json();

      // Transform the data to match our interface
      const transformedLeads: Lead[] = data.submissions.map(submission => ({
        id: submission.id,
        name: `${submission.data.firstName} ${submission.data.lastName}`,
        submitted: new Date(submission.timestamp).toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        status: submission.status as 'PENDING' | 'REACHED_OUT',
        country: submission.data.country,
        email: submission.data.email,
        linkedin: submission.data.linkedin,
        visaCategories: [
          submission.data.o1Visa && 'O-1',
          submission.data.eb1aVisa && 'EB-1A',
          submission.data.eb2NiwVisa && 'EB-2 NIW',
          submission.data.dontKnowVisa && "I don't know",
        ].filter(Boolean) as string[],
        additionalInfo: submission.data.openInput,
      }));

      setLeads(transformedLeads);
      setTotalLeads(data.total);
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === 'object' && 'message' in err
          ? String(err.message)
          : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, token, router, sortField, sortDirection, debouncedSearchTerm, statusFilter]);

  // Effects
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Event Handlers
  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
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
    newStatus: 'PENDING' | 'REACHED_OUT'
  ) => {
    if (!token) return;

    console.log('Updating status for lead:', leadId, 'to:', newStatus);
    console.log('Using token:', token.substring(0, 20) + '...');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/leads/${leadId}/status`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Status update failed:', response.status, response.statusText);
        console.error('Error response:', errorText);
        setError('Failed to update status');
        return;
      }

      // Update local state
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update lead status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/admin/login');
  };

  // State for total count from backend
  const [totalLeads, setTotalLeads] = useState(0);

  // Computed Values
  const totalPages = Math.ceil(totalLeads / 10);

  // Loading State
  if (loading) {
    return (
      <AdminContainer>
        <Sidebar>
          <SidebarHeader>
            <Logo>almă</Logo>
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
    );
  }

  // Main Render
  return (
    <AdminContainer>
      <Sidebar>
        <SidebarHeader>
          <Logo>almă</Logo>
        </SidebarHeader>
        <Navigation>
          <NavLink active={true}>Leads</NavLink>
          <NavLink>Settings</NavLink>
        </Navigation>
        <SidebarFooter>
          <AdminAvatar>A</AdminAvatar>
          <span>Admin</span>
          <button
            onClick={handleLogout}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
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
              <SearchIcon style={{ color: searching ? '#007bff' : '#999' }} />
              <SearchInput
                type='text'
                placeholder={searching ? 'Searching...' : 'Search'}
                value={searchTerm}
                onChange={e => handleSearchChange(e.target.value)}
                style={{
                  borderColor: searching ? '#007bff' : undefined,
                  backgroundColor: searching ? '#f8f9fa' : undefined,
                }}
              />
            </SearchContainer>

            <StatusFilter
              value={statusFilter}
              onChange={e => handleStatusFilterChange(e.target.value)}
            >
              <option value='all'>Status</option>
              <option value='PENDING'>Pending</option>
              <option value='REACHED_OUT'>Reached Out</option>
            </StatusFilter>
          </SearchFilterBar>
        </PageHeader>

        {error && <Error>{error}</Error>}

        <TableContainer>
          <Table>
            <colgroup>
              <col style={{ width: '25%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '25%' }} />
            </colgroup>
            <TableHeader>
              <tr>
                <TableHeaderCell onClick={() => handleSort('name')}>
                  <span>Name</span>
                  <SortIcon>
                    <SortIconComponent
                      field="name"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                    />
                  </SortIcon>
                </TableHeaderCell>
                <TableHeaderCell onClick={() => handleSort('submitted')}>
                  <span>Submitted</span>
                  <SortIcon>
                    <SortIconComponent
                      field="submitted"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                    />
                  </SortIcon>
                </TableHeaderCell>
                <TableHeaderCell onClick={() => handleSort('status')}>
                  <span>Status</span>
                  <SortIcon>
                    <SortIconComponent
                      field="status"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                    />
                  </SortIcon>
                </TableHeaderCell>
                <TableHeaderCell onClick={() => handleSort('country')}>
                  <span>Country</span>
                  <SortIcon>
                    <SortIconComponent
                      field="country"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                    />
                  </SortIcon>
                </TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {leads.map(lead => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.submitted}</TableCell>
                  <TableCell>
                    <StatusSelect
                      value={lead.status}
                      onChange={e =>
                        handleStatusUpdate(
                          lead.id,
                          e.target.value as 'PENDING' | 'REACHED_OUT'
                        )
                      }
                    >
                      <option value='PENDING'>Pending</option>
                      <option value='REACHED_OUT'>Reached Out</option>
                    </StatusSelect>
                  </TableCell>
                  <TableCell>{lead.country}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination>
          <PaginationButton
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <KeyboardArrowLeft />
          </PaginationButton>

          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <PaginationButton
                key={pageNum}
                active={pageNum === currentPage}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </PaginationButton>
            );
          })}

          <PaginationButton
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            <KeyboardArrowRight />
          </PaginationButton>
        </Pagination>
      </MainContent>
    </AdminContainer>
  );
};

export default AdminPage;
