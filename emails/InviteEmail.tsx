import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface InviteEmailProps {
  contributorEmail: string;
  boardTitle: string;
  recipientNames: string[];
  boardLink: string;
  customMessage?: string;
  creatorName: string;
}

export default function InviteEmail({
  contributorEmail,
  boardTitle,
  recipientNames,
  boardLink,
  customMessage,
  creatorName,
}: InviteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You've been invited to contribute to a Cardora board!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Heading style={logo}>Cardora</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={heading}>
              You're invited to contribute! 🎉
            </Heading>

            <Text style={paragraph}>
              <strong>{creatorName}</strong> has invited you to contribute to a special board:
            </Text>

            <Section style={boardInfoBox}>
              <Text style={boardTitleStyle}>{boardTitle}</Text>
              <Text style={boardRecipientsStyle}>
                For: {recipientNames.join(', ')}
              </Text>
            </Section>

            {customMessage && (
              <Section style={messageBox}>
                <Text style={messageTitle}>Personal Message:</Text>
                <Text style={messageText}>{customMessage}</Text>
              </Section>
            )}

            <Text style={paragraph}>
              Click the button below to add your message and make this board even more special:
            </Text>

            <Button style={button} href={`https://${boardLink}`}>
              Contribute to Board
            </Button>

            <Text style={footer}>
              Or copy and paste this link into your browser:<br />
              <span style={link}>https://{boardLink}</span>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              © 2024 Cardora. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#F7FAFC',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const logo = {
  color: '#2CB1A6',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
};

const content = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '40px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
};

const heading = {
  color: '#0B1F2A',
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const paragraph = {
  color: '#5B6B75',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '16px',
};

const boardInfoBox = {
  backgroundColor: '#E8F5F4',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
  marginTop: '24px',
};

const boardTitleStyle = {
  color: '#0B1F2A',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const boardRecipientsStyle = {
  color: '#5B6B75',
  fontSize: '14px',
  margin: '0',
};

const messageBox = {
  backgroundColor: '#F7FAFC',
  borderLeft: '4px solid #2CB1A6',
  padding: '16px',
  marginBottom: '24px',
};

const messageTitle = {
  color: '#0B1F2A',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const messageText = {
  color: '#5B6B75',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
  fontStyle: 'italic' as const,
};

const button = {
  backgroundColor: '#2CB1A6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 24px',
  marginTop: '24px',
  marginBottom: '24px',
};

const footer = {
  color: '#5B6B75',
  fontSize: '14px',
  lineHeight: '20px',
  marginTop: '16px',
  textAlign: 'center' as const,
};

const link = {
  color: '#2CB1A6',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

const footerSection = {
  textAlign: 'center' as const,
  marginTop: '32px',
};

const footerText = {
  color: '#5B6B75',
  fontSize: '12px',
};