'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Submission {
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
  submissions: Submission[];
  total: number;
  limit: number;
  offset: number;
}

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
`;

const StatLabel = styled.div`
  color: #666;
  margin-top: 0.5rem;
`;

const SubmissionsList = styled.div`
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
`;

const SubmissionItem = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;

  &:last-child {
    border-bottom: none;
  }
`;

const SubmissionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SubmissionId = styled.div`
  font-family: monospace;
  color: #666;
  font-size: 0.875rem;
`;

const SubmissionDate = styled.div`
  color: #666;
  font-size: 0.875rem;
`;

const SubmissionName = styled.h3`
  color: #333;
  margin: 0 0 0.5rem 0;
`;

const SubmissionEmail = styled.div`
  color: #666;
  margin-bottom: 0.5rem;
`;

const SubmissionDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const DetailItem = styled.div`
  font-size: 0.875rem;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #333;
`;

const DetailValue = styled.span`
  color: #666;
`;

const VisaCategories = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

const VisaTag = styled.span`
  background: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
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

const AdminPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leads?limit=50');

      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }

      const data: ApiResponse = await response.json();
      setSubmissions(data.submissions);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getVisaCategories = (data: Submission['data']) => {
    const categories = [];
    if (data.o1Visa) categories.push('O-1');
    if (data.eb1aVisa) categories.push('EB-1A');
    if (data.eb2NiwVisa) categories.push('EB-2 NIW');
    if (data.dontKnowVisa) categories.push("I don't know");
    return categories;
  };

  if (loading) {
    return (
      <AdminContainer>
        <Loading>Loading submissions...</Loading>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <Header>Lead Submissions Admin</Header>

      {error && <Error>{error}</Error>}

      <Stats>
        <StatCard>
          <StatNumber>{total}</StatNumber>
          <StatLabel>Total Submissions</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{submissions.length}</StatNumber>
          <StatLabel>Showing</StatLabel>
        </StatCard>
      </Stats>

      <SubmissionsList>
        {submissions.length === 0 ? (
          <SubmissionItem>
            <div>No submissions yet.</div>
          </SubmissionItem>
        ) : (
          submissions.map(submission => (
            <SubmissionItem key={submission.id}>
              <SubmissionHeader>
                <SubmissionId>{submission.id}</SubmissionId>
                <SubmissionDate>
                  {formatDate(submission.timestamp)}
                </SubmissionDate>
              </SubmissionHeader>

              <SubmissionName>
                {submission.data.firstName} {submission.data.lastName}
              </SubmissionName>

              <SubmissionEmail>{submission.data.email}</SubmissionEmail>

              <SubmissionDetails>
                <DetailItem>
                  <DetailLabel>Country:</DetailLabel> {submission.data.country}
                </DetailItem>
                <DetailItem>
                  <DetailLabel>LinkedIn:</DetailLabel>
                  <a
                    href={submission.data.linkedin}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {submission.data.linkedin}
                  </a>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Status:</DetailLabel> {submission.status}
                </DetailItem>
              </SubmissionDetails>

              <VisaCategories>
                {getVisaCategories(submission.data).map(category => (
                  <VisaTag key={category}>{category}</VisaTag>
                ))}
              </VisaCategories>

              {submission.data.openInput && (
                <DetailItem style={{ marginTop: '1rem' }}>
                  <DetailLabel>Additional Information:</DetailLabel>
                  <div style={{ marginTop: '0.5rem', color: '#666' }}>
                    {submission.data.openInput}
                  </div>
                </DetailItem>
              )}
            </SubmissionItem>
          ))
        )}
      </SubmissionsList>
    </AdminContainer>
  );
};

export default AdminPage;
