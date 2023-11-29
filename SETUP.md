JIRA App Setup
===

To install the JIRA Data Center app you must first create an access token. Head over to your JIRA Data Center account.

Once you've logged in, navigate to the "Profile" section.

[![](/docs/assets/setup/jira-setup-01.png)](/docs/assets/setup/jira-setup-01.png)

Next, go to the "Personal Access Tokens" page.

[![](/docs/assets/setup/jira-setup-02.png)](/docs/assets/setup/jira-setup-02.png)

Click on the "Create token" button.

[![](/docs/assets/setup/jira-setup-03.png)](/docs/assets/setup/jira-setup-03.png)

Enter a token name for the new one (this can be anything you like). In the following example we've
labelled it "Deskpro App" (you can also choose to enable automatic expiry if you wish).

After creating the access token copy it for a later step. It's **important that you keep your secret access token safe**.

[![](/docs/assets/setup/jira-setup-04.png)](/docs/assets/setup/jira-setup-04.png)

Ok, now head back to Deskpro and navigate to the "Settings" tab of the JIRA Data Centre app.

[![](/docs/assets/setup/jira-setup-05.png)](/docs/assets/setup/jira-setup-05.png)

From this screen, enter the following details:

* **Instance URL** - this is your JIRA Data Center URL
* **Access token** - this is the token you created in the previous steps

To configure who can see and use the JIRA Data Centre app, head to the "Permissions" tab and select those users and/or groups you'd like to have access.

When you're happy, click "Install".
