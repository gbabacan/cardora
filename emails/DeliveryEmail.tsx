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

interface DeliveryEmailProps {
  recipientEmail: string;
  boardTitle: string;
  recipientNames: string[];
  boardLink: string;
  deliveryMessage?: string;
  formatType?: 'board' | 'card';
  senderName?: string;
}

export default function DeliveryEmail({
  recipientEmail,
  boardTitle,
  recipientNames,
  boardLink,
  deliveryMessage,
  formatType = 'board',
  senderName,
}: DeliveryEmailProps) {
  // Ensure the link points to the recipient view page
  // boardLink format: "cardora.cards/boards/[shortId]"
  const recipientViewLink = boardLink.includes('/view') ? boardLink : `${boardLink}/view`;

  return (
    <Html>
      <Head />
      <Preview>You have a special gift waiting for you!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Heading style={logo}>Cardora</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={heading}>
              We have something special for you 💝
            </Heading>

            {/* Board Info */}
            <Section style={boardInfoBox}>
              <Text style={boardTitleStyle}>{boardTitle}</Text>
              {formatType === 'card' && senderName && (
                <Text style={boardRecipientsStyle}>
                  From: {senderName}
                </Text>
              )}
              <Text style={boardRecipientsStyle}>
                For: {recipientNames.filter(r => r.trim()).join(', ')}
              </Text>
            </Section>

            {/* Custom Message */}
            {deliveryMessage && (
              <Section style={messageBox}>
                <Text style={messageTitle}>Personal Message:</Text>
                <Text style={messageText}>{deliveryMessage}</Text>
              </Section>
            )}

            {/* CTA Button */}
            <Button style={button} href={`https://${recipientViewLink}`}>
              View Your Board
            </Button>

            {/* Link */}
            <Text style={footer}>
              Or copy and paste this link into your browser:<br />
              <span style={link}>https://{recipientViewLink}</span>
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

// Styles - matching the preview exactly
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

const boardInfoBox = {
  backgroundColor: '#E8F5F4',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
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
  whiteSpace: 'pre-wrap' as const,
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