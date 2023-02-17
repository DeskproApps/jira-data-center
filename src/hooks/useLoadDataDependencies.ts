import { useEffect } from "react";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { getIssueDependencies } from "../context/StoreProvider/api";
import { useStore } from "../context/StoreProvider/hooks";

const useLoadDataDependencies = () => {
    const { client } = useDeskproAppClient();
    const [ , dispatch ] = useStore();

    useEffect(() => {
        if (!client) {
            return;
        }

        getIssueDependencies(client)
            .then((deps) => dispatch({ type: "loadDataDependencies", deps }))
        ;
    }, [client, dispatch]);
};

export { useLoadDataDependencies };
