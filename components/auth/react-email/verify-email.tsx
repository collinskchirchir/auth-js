"use client";

import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

import DashTailLogo from "@/public/images/logo/logo-2.png"

interface VerifyEmailProps {
  href: string;
}

export const VerifyEmail  = ({href}: VerifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Tailwind>
        <Body style={main}>
          <Container style={container}>
            <Section>
              <Column className="flex flex-col items-center pt-10">
                <Img
                  src={DashTailLogo.src}
                  alt="Dropbox"
                  className="w-[160px]"
                />
                <Text className="mt-8 text-xl font-medium text-slate-900 ">
                  Verify your email address
                </Text>
                <Text className="my-0  text-center text-sm text-slate-900">
                  To get started with AuthJS, we simply need <br /> to verify your email address.
                </Text>
                <Button className="mb-10 mt-8 bg-violet-600" style={button} href={href}>
                  Click to Verify
                </Button>
              </Column>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};


export default VerifyEmail;

const main: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "10px 0",
};

const container: React.CSSProperties = {
  backgroundColor: "#fff",
  border: "1px solid #f0f0f0",
};



const button: React.CSSProperties = {
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center",
  display: "block",
  width: "210px",
  padding: "12px 7px",
  marginLeft: "40px"
};

