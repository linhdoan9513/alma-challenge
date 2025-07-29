'use client'

import React from 'react';
import Image from "next/image";
import styled from "styled-components";
import Link from "next/link";
import ClientWrapper from "@/components/ClientWrapper";

const Container = styled.div`
  font-family: sans-serif;
  display: grid;
  grid-template-rows: 20px 1fr 20px;
  align-items: center;
  justify-items: center;
  min-height: 100vh;
  padding: 2rem;
  padding-bottom: 5rem;
  gap: 4rem;

  @media (min-width: 640px) {
    padding: 5rem;
  }
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  grid-row-start: 2;
  align-items: center;

  @media (min-width: 640px) {
    align-items: flex-start;
  }
`;

const Logo = styled(Image)`
  filter: ${(props: { theme?: { mode?: string } }) => props.theme?.mode === 'dark' ? 'invert(1)' : 'none'};
`;

const Instructions = styled.ol`
  font-family: monospace;
  list-style: decimal inside;
  font-size: 0.875rem;
  line-height: 1.5rem;
  text-align: center;

  @media (min-width: 640px) {
    text-align: left;
  }
`;

const InstructionItem = styled.li`
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
`;

const Code = styled.code`
  background-color: rgba(0, 0, 0, 0.05);
  font-family: monospace;
  font-weight: 600;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;

  @media (prefers-color-scheme: dark) {
    background-color: rgba(255, 255, 255, 0.06);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-direction: column;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const PrimaryButton = styled(Link)`
  border-radius: 9999px;
  border: 1px solid transparent;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #007bff;
  color: #fff;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  height: 2.5rem;
  padding: 0 1rem;
  text-decoration: none;

  &:hover {
    background-color: #0056b3;
  }

  @media (min-width: 640px) {
    font-size: 1rem;
    height: 3rem;
    padding: 0 1.25rem;
    width: auto;
  }
`;

const SecondaryButton = styled.a`
  border-radius: 9999px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 0.875rem;
  height: 2.5rem;
  padding: 0 1rem;
  width: 100%;
  text-decoration: none;

  &:hover {
    background-color: #f2f2f2;
    border-color: transparent;
  }

  @media (min-width: 640px) {
    font-size: 1rem;
    height: 3rem;
    padding: 0 1.25rem;
    width: auto;
  }

  @media (min-width: 768px) {
    width: 158px;
  }

  @media (prefers-color-scheme: dark) {
    border-color: rgba(255, 255, 255, 0.145);

    &:hover {
      background-color: #1a1a1a;
    }
  }
`;

const Footer = styled.footer`
  grid-row-start: 3;
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const FooterLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
`;

const Home: React.FC = () => {
  return (
    <ClientWrapper>
      <Container>
        <Main>
          <Logo
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <Instructions>
            <InstructionItem>
              Get started by editing{" "}
              <Code>src/app/page.tsx</Code>.
            </InstructionItem>
            <InstructionItem>
              Save and see your changes instantly.
            </InstructionItem>
          </Instructions>

          <ButtonGroup>
            <PrimaryButton href="/lead-form">
              Lead Application Form
            </PrimaryButton>
            <SecondaryButton
              href="/admin"
            >
              View Submissions
            </SecondaryButton>
          </ButtonGroup>
        </Main>
        <Footer>
          <FooterLink
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Learn
          </FooterLink>
          <FooterLink
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            Examples
          </FooterLink>
          <FooterLink
            href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </FooterLink>
        </Footer>
      </Container>
    </ClientWrapper>
  );
};

export default Home;
