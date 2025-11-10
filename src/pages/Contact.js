import React from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import PageWrapper from "../components/PageWrapper";

function Contact() {
  return (
    <PageWrapper>
      <Card className="p-6 bg-white dark:bg-gray-800 shadow-xl text-center">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          Contact Us
        </h1>
        <Input placeholder="Your Email" className="mb-3" />
        <Input placeholder="Your Message" className="mb-3" />
        <Button>Send Message</Button>
      </Card>
    </PageWrapper>
  );
}

export default Contact;
