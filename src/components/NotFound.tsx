import React from "react";
import PageContainer from "./PageContainer";
import { Button } from "./ui/button";

const NotFound = ({
  title = "404",
  description = "Sorry, the page you are looking for does not exist.",
  pageRedirect = "/",
  pageRedirectText = "Go to Home",
  previousPage,
}: {
  title?: string;
  description?: string;
  pageRedirect?: string;
  pageRedirectText?: string;
  previousPage?: string;
}) => {
  return (
    // <PageContainer>
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-lg">{description}</p>

        <div className="flex gap-4">
          <a href={pageRedirect} className="text-blue-500">
            <Button>{pageRedirectText}</Button>
          </a>
          {previousPage && (
            <a href={previousPage} className="text-blue-500">
              <Button>Go Back</Button>
            </a>
          )}
        </div>
      </div>
    // </PageContainer>
  );
};

export default NotFound;
