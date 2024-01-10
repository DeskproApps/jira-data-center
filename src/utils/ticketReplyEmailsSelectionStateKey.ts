const ticketReplyEmailsSelectionStateKey = (
  ticketId: string,
  issueId: string|number,
): string => {
  return `tickets/${ticketId}/emails/selection/${issueId}`;
};

export { ticketReplyEmailsSelectionStateKey };
