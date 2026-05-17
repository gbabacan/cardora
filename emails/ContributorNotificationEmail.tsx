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

interface ContributorNotificationEmailProps {
  contributorEmail: string;
  boardTitle: string;
  recipientNames: string[];
  boardLink: string;
}

export default function ContributorNotificationEmail({
  contributorEmail,
  boardTitle,
  recipientNames,
  boardLink,
}: ContributorNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>The board you contributed to has been delivered!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Heading style={logo}>Cardora</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={heading}>
              Your contribution has been delivered! 🎊
            </Heading>

            <Text style={paragraph}>
              Great news! The board you contributed to has been sent to the recipients.
            </Text>

            {/* Board Info */}
            <Section style={boardInfoBox}>
              <Text style={boardTitleStyle}>{boardTitle}</Text>
              <Text style={boardRecipientsStyle}>
                Delivered to: {recipientNames.filter(r => r.trim()).join(', ')}
              </Text>
            </Section>

            <Text style={paragraph}>
              Thank you for being part of this special moment! Your message has made a difference.
            </Text>

            <Text style={paragraph}>
              You can view the complete board to see all the wonderful contributions:
            </Text>

            {/* CTA Button */}
            <Button style={button} href={`https://${boardLink}`}>
              View the Board
            </Button>

            {/* Link */}
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

// Styles - matching the delivery email design
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
  paddingBottom: '24px',
  borderBottom: '1px solid #E5EAF0',
  backgroundColor: '#ffffff',
  borderRadius: '12px 12px 0 0',
  paddingTop: '24px',
};

const logo = {
  color: '#2CB1A6',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
};

const content = {
  backgroundColor: '#ffffff',
  borderRadius: '0 0 12px 12px',
  padding: '32px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
};

const heading = {
  color: '#0B1F2A',
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '24px',
  textAlign: 'center' as const,
  marginTop: '0',
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
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const boardRecipientsStyle = {
  color: '#5B6B75',
  fontSize: '14px',
  margin: '0',
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
  padding: '16px 32px',
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
  paddingTop: '24px',
  borderTop: '1px solid #E5EAF0',
};

const footerText = {
  color: '#5B6B75',
  fontSize: '12px',
  margin: '0',
};