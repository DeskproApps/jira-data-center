import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: false,
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
      retry: 1,
      retryDelay: 2000,
    },
  },
});

const QueryKey = {
  LINKED_ISSUES: "linked_issues",
  ISSUES: "issues",
  ISSUE: "issue",
  USERS: "users",
  PERMISSIONS: "permissions",
  ATTACHMENTS: "attachments",
  ISSUE_COMMENTS: "issue_comments",
  ISSUE_DEPENDENCIES: "issue_dependencies",
}

export { queryClient, QueryKey };
