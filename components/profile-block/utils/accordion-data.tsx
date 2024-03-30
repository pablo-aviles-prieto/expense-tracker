interface AccordionData {
  key: string;
  title: string;
  data: React.ReactNode;
}

export const accordionData: AccordionData[] = [
  {
    key: "change-password",
    title: "Change Password",
    data: (
      <div>
        Form block to change password or add it if it doesnt exist (Oauth
        account)
      </div>
    ),
  },
  {
    key: "change-email",
    title: "Change Email",
    data: (
      <div>
        Block explaining how to change the email of the account (it should
        change the email in the users collection and remove if it exists, the
        associated document in the accounts collection)
      </div>
    ),
  },
  {
    key: "change-preferences",
    title: "Change Preferences",
    data: (
      <div>
        Block to change the currency, the date format and the theme. Storing it
        on DB
      </div>
    ),
  },
  {
    key: "change-name",
    title: "Change Name",
    data: <div>Block to change the name of the user</div>,
  },
];
