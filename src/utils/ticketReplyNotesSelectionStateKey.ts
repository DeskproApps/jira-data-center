const ticketReplyNotesSelectionStateKey = (
  ticketId: string,
  issueId: string|number,
): string => {
  return `tickets/${ticketId}/notes/selection/${issueId}`;
};

export { ticketReplyNotesSelectionStateKey };
