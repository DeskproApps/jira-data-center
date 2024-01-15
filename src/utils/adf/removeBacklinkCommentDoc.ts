export const removeBacklinkCommentDoc = (ticketId: string, url: string) => ({
  version: 1,
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: `Deskpro JIRA app unlinked Deskpro ticket #${ticketId} at `
        },
        {
          type: "text",
          text: url,
          marks: [
            {
              type: "link",
              attrs: {
                href: url
              }
            }
          ]
        },
        {
          type: "text",
          text: " from this issue"
        }
      ]
    }
  ]
});
