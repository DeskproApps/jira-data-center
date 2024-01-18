import { useMemo } from "react";
import { get, orderBy } from "lodash";
import { useQueryWithClient } from "@deskpro/app-sdk";
import { getMyPermissions } from "../../services/jira";
import { QueryKey } from "../../query";
import type { Permission } from "../../services/jira/types";

type UsePermissions = () => {
  isLoading: boolean,
  permissions: Permission[],
};

const usePermissions: UsePermissions = () => {
  const { data, isLoading } = useQueryWithClient([QueryKey.PERMISSIONS], getMyPermissions);

  const permissions = useMemo(() => {
    return orderBy(Object.values(get(data, ["permissions"], []) || []), "id", "asc");
  }, [data]);

  return { isLoading, permissions };
};

export { usePermissions };
