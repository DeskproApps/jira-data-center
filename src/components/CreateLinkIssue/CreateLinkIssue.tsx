import { FC } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateLinkIssue.css";
import { AnyIcon, Button, Stack } from "@deskpro/deskpro-ui";
import { useDeskproAppTheme } from "@deskpro/app-sdk";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";

export interface CreateLinkIssueProps {
  selected: "link"|"create";
}

export const CreateLinkIssue: FC<CreateLinkIssueProps> = ({ selected }: CreateLinkIssueProps) => {
  const navigate = useNavigate();
  const { theme: { colors } } = useDeskproAppTheme();

  return (
    <Stack className="create-link" justify="space-between" align="center" style={{ backgroundColor: colors.grey10 }}>
      <Button
        text="Find Issue"
        intent="secondary"
        icon={faSearch as AnyIcon}
        size="large"
        className={`create-link-link ${selected === "create" && "unselected"}`}
        onClick={() => navigate("/link")}
      />
      <Button
        text="Create Issue"
        intent="secondary"
        icon={faPlus as AnyIcon}
        size="large"
        className={`create-link-create ${selected === "link" && "unselected"}`}
        onClick={() => navigate("/create")}
      />
    </Stack>
  );
};
