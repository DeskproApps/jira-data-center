import { useEffect, useState } from "react";
import { useDeskproAppClient } from "@deskpro/app-sdk";

const useAssociatedEntityCount = (key: string) => {
    const { client } = useDeskproAppClient();
    const [entityCount, setEntityCount] = useState<number>(0);

    useEffect(() => {
        client?.entityAssociationCountEntities("linkedJiraDataCentreIssue", key).then(setEntityCount);
    }, [client, key]);

    return entityCount;
};

export { useAssociatedEntityCount };
